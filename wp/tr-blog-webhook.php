<?php
/**
 * Plugin Name: TR Blog Webhook
 * Description: Notifies n8n when a brand-category post is published, updated,
 *              or unpublished, and exposes SEO/byline meta over the REST API
 *              for the static-site pipelines. Deploy to wp-content/mu-plugins/.
 *              Source of truth: the therapist-resources-website repo (wp/).
 * Version:     1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Shared secret sent as X-TR-Webhook-Secret. The real value is defined in
 * wp-config.php (this repo is public — never commit the real secret):
 *   define('TR_BLOG_WEBHOOK_SECRET', '...');
 */
if (!defined('TR_BLOG_WEBHOOK_SECRET')) {
    define('TR_BLOG_WEBHOOK_SECRET', 'UNSET-DEFINE-IN-WP-CONFIG');
}

/**
 * Map of category ID => n8n webhook URL. Add other planets here when their
 * sites adopt the same static-blog pipeline.
 */
function tr_blog_webhook_targets() {
    return array(
        5 => 'https://n8n.reagle.cloud/webhook/tr-blog-sync', // Therapist Resources
    );
}

/**
 * Fires on publish / update / unpublish transitions for posts.
 */
add_action('transition_post_status', 'tr_blog_webhook_on_transition', 10, 3);
function tr_blog_webhook_on_transition($new_status, $old_status, $post) {
    if ($post->post_type !== 'post') {
        return;
    }
    if (wp_is_post_autosave($post->ID) || wp_is_post_revision($post->ID)) {
        return;
    }

    $action = null;
    if ($new_status === 'publish' && $old_status !== 'publish') {
        $action = 'published';
    } elseif ($new_status === 'publish' && $old_status === 'publish') {
        $action = 'updated';
    } elseif ($old_status === 'publish' && $new_status !== 'publish') {
        $action = 'unpublished';
    }
    if ($action === null) {
        return;
    }

    $category_ids = wp_get_post_categories($post->ID, array('fields' => 'ids'));
    foreach (tr_blog_webhook_targets() as $category_id => $url) {
        if (!in_array($category_id, $category_ids, true)) {
            continue;
        }
        wp_remote_post($url, array(
            'timeout'  => 5,
            'blocking' => false,
            'headers'  => array(
                'Content-Type'        => 'application/json',
                'X-TR-Webhook-Secret' => TR_BLOG_WEBHOOK_SECRET,
            ),
            'body' => wp_json_encode(array(
                'action'      => $action,
                'post_id'     => $post->ID,
                'slug'        => $post->post_name,
                'category_id' => $category_id,
            )),
        ));
    }
}

/**
 * Edits to an already-published post fire 'updated' via post_updated as well,
 * because transition_post_status sees publish->publish only on status-touching
 * saves in some editors. Deduplication is unnecessary: the n8n flow is
 * idempotent (same content -> same commit -> no-op).
 */
add_action('post_updated', 'tr_blog_webhook_on_update', 10, 3);
function tr_blog_webhook_on_update($post_id, $post_after, $post_before) {
    if ($post_after->post_type !== 'post' || $post_after->post_status !== 'publish' || $post_before->post_status !== 'publish') {
        return;
    }
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }
    tr_blog_webhook_on_transition('publish', 'publish', $post_after);
}

/**
 * Expose SmartCrawl SEO meta + the custom byline to authenticated REST
 * requests as a single `tr_seo` field. Protected meta (_wds_*) is invisible
 * to REST by default.
 */
add_action('rest_api_init', function () {
    register_rest_field('post', 'tr_seo', array(
        'get_callback' => function ($post_arr) {
            if (!current_user_can('edit_post', $post_arr['id'])) {
                return null;
            }
            return array(
                'title'      => get_post_meta($post_arr['id'], '_wds_title', true) ?: null,
                'metadesc'   => get_post_meta($post_arr['id'], '_wds_metadesc', true) ?: null,
                'keyphrases' => get_post_meta($post_arr['id'], '_wds_focus-keywords', true) ?: null,
                'byline'     => get_post_meta($post_arr['id'], 'tr_byline', true) ?: null,
            );
        },
        'schema' => array(
            'description' => 'SmartCrawl SEO meta + byline for the static-site pipeline',
            'type'        => 'object',
        ),
    ));
});

/**
 * Let the Auto-Publish workflow set the byline + SmartCrawl SEO meta via the
 * REST `meta` object. The _wds_* keys are protected meta and are NOT
 * REST-writable unless registered here — without this, the meta payload the
 * Auto-Publish webhook sends is silently dropped by WordPress.
 */
add_action('init', function () {
    $writable = array('tr_byline', '_wds_title', '_wds_metadesc', '_wds_focus-keywords');
    foreach ($writable as $key) {
        register_post_meta('post', $key, array(
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));
    }
});
