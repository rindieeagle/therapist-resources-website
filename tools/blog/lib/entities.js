// Shared, dependency-free constants for the static blog pipeline.
// Lives at the bottom of the import graph (imports nothing) so wp-normalize.js,
// content.js, and seo.js can all share these without a circular dependency.
//
// Author/organization values are the canonical Happy Brain Universe entities
// (see .claude/skills/aeo-content/references/planets.md). They mirror the
// site-wide JSON-LD @graph in index.html, which remains the single source of
// truth for emitted schema; the AUTHOR/ORGANIZATION objects below are the
// data-record copies carried in content/blog/<id>.json for portability.

export const SITE = 'https://therapistresources.com';
export const WP_HOST = 'blog.reagleeagle.com';

// Stable @ids defined in index.html's site-wide JSON-LD @graph.
export const ORG_ID = `${SITE}/#organization`;
export const PERSON_ID = `${SITE}/#rindie-eagle`;
export const WEBSITE_ID = `${SITE}/#website`;
export const DEFAULT_BYLINE = 'Rindie Eagle, MA, LPCC';

// Data-record author entity for Rindie (matches the Person node in index.html).
export const AUTHOR = {
  id: PERSON_ID,
  name: 'Rindie Eagle',
  credentials: 'MA, LPCC',
  url: SITE,
};

// Data-record organization entity (matches the Organization node in index.html).
// areaServed uses the split AdministrativeArea + Country form (region + country
// only — TR is a national digital-product brand, no business city/street).
export const ORGANIZATION = {
  id: ORG_ID,
  name: 'Therapist Resources',
  url: SITE,
  logo: `${SITE}/logo.png`,
  parentOrganization: 'Encouragement Ink LLC',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Minnesota' },
    { '@type': 'Country', name: 'United States' },
  ],
};
