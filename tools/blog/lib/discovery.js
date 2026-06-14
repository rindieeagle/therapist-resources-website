// Discovery layer for SEO/GEO/AEO: the static-page manifest, a stable
// (git-based) lastmod helper, and the full-content dump for AI answer engines.
// Lives below feeds.js in the import graph: imports only content.js + entities.js.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './entities.js';
import { stripHtml, decodeEntities } from './content.js';

// One-line site summary, reused verbatim by llms.txt and llms-full.txt.
export const SITE_SUMMARY =
  'Clinical documentation training and practice tools for therapists, by Rindie Eagle, MA, LPCC. Notes that hold up to audits, courses, and web apps.';

// Live SPA routes only. `source` (repo-root-relative) backs the lastmod date;
// `description` feeds llms.txt. ResourcesPage is intentionally absent — its route
// is commented out in src/App.jsx. Re-enable by adding one row here.
export const PAGE_MANIFEST = [
  {
    route: '/',
    source: 'src/components/HomePage.jsx',
    title: 'Home',
    description:
      'Therapist Resources: clinical documentation training, courses, and practice tools for therapists.',
  },
  {
    route: '/courses',
    source: 'src/pages/CoursesPage.jsx',
    title: 'Courses',
    description:
      'Courses for therapists on audit-ready clinical documentation, including the Write it Right series.',
  },
  {
    route: '/web-apps',
    source: 'src/pages/WebAppsPage.jsx',
    title: 'Web Apps',
    description:
      'Web apps and interactive tools that help therapists document faster and stay audit-ready.',
  },
];

// Last resort when git history and the file itself are both unavailable.
const FALLBACK_DATE = '2026-01-01T00:00:00.000Z';

// ISO date of the last commit that touched `filePath`. Falls back to the file's
// mtime, then a constant — never throws, so a shallow CI clone can't fail the build.
export function gitLastModified(filePath, { root = process.cwd() } = {}) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return new Date(out).toISOString();
  } catch {
    // git missing, not a repo, or file untracked — fall through to mtime.
  }
  try {
    return fs.statSync(path.join(root, filePath)).mtime.toISOString();
  } catch {
    return FALLBACK_DATE;
  }
}

// Full plaintext of every post for deep AI ingestion. Newest-first (callers pass
// posts already sorted that way). Body HTML is flattened via the shared stripHtml.
export function buildLlmsFull(posts, { site = SITE, summary = SITE_SUMMARY } = {}) {
  const sections = posts.map((post) => {
    const title = decodeEntities(post.title);
    const url = `${site}/blog/${post.slug}/`;
    const modified = post.modified_gmt || post.date_gmt;
    const body = stripHtml(post.content || '');
    return `# ${title}\nURL: ${url}\nPublished: ${post.date_gmt}  Modified: ${modified}\n\n${body}`;
  });
  return `# Therapist Resources — Full Content\n\n> ${summary}\n\n${sections.join('\n\n---\n\n')}\n`;
}
