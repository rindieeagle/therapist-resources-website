<?php
/**
 * Plugin Name: TR SEO — Authored AEO fields
 * Description: Adds authored AEO fields (answer_block, faq, sources, date_modified)
 *   to the existing `tr_seo` REST field that the TR Blog Sync pipeline reads.
 *   Self-contained: it does NOT modify the original tr_seo registration — it
 *   registers four post-meta keys and injects them into tr_seo via a response
 *   filter. To revert, delete this file (it is a must-use plugin, auto-loaded).
 *
 * Install: upload to wp-content/mu-plugins/tr-seo-aeo.php on blog.reagleeagle.com.
 * After install, push_blog_to_wp.py (see tools/blog/LAYER2-authored-aeo.md) writes
 * the matching meta from frontmatter; wp-normalize.js / the n8n cc1 node already
 * prefer tr_seo.answer_block / .faq / .sources / .date_modified when present.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    $keys = [
        'tr_answer_block'  => 'string', // plain text
        'tr_faq'           => 'string', // JSON-encoded [{q,a}]
        'tr_sources'       => 'string', // JSON-encoded [{title,url,publisher?,type?}]
        'tr_date_modified' => 'string', // UTC ISO 8601, last substantive edit
    ];
    foreach ($keys as $key => $type) {
        register_post_meta('post', $key, [
            'type'          => $type,
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

// Inject the authored fields into the existing tr_seo REST field. Runs after the
// original tr_seo get_callback, so it only augments — never replaces — that field.
add_filter('rest_prepare_post', function ($response, $post) {
    $data = $response->get_data();
    if (!isset($data['tr_seo']) || !is_array($data['tr_seo'])) {
        return $response;
    }
    $faq = get_post_meta($post->ID, 'tr_faq', true);
    $src = get_post_meta($post->ID, 'tr_sources', true);
    $data['tr_seo']['answer_block']  = get_post_meta($post->ID, 'tr_answer_block', true) ?: null;
    $data['tr_seo']['faq']           = $faq ? json_decode($faq, true) : null;
    $data['tr_seo']['sources']       = $src ? json_decode($src, true) : null;
    $data['tr_seo']['date_modified'] = get_post_meta($post->ID, 'tr_date_modified', true) ?: null;
    $response->set_data($data);
    return $response;
}, 20, 2);
