# Plot Perfect Studios — SEO and re-indexing readiness

Audit date: 27 October 2026. Preferred origin: https://www.plotperfectstudios.co.uk/

## Status

The local source and packaged static release pass the checks below. The redesign has not been deployed, and no Search Console indexing request has been submitted. The existing Search Console connection and domain configuration have not been changed.

A read-only live-domain check found the old design still being served. Its sitemap contains 38 URLs. The new release contains 44 canonical, indexable sitemap URLs. Re-indexing the new content must follow deployment and a successful live URL test.

## Verified results

| Check | Result |
| --- | --- |
| Whole source audit | 48 HTML pages; 0 errors; 0 warnings |
| Packaged release audit | 48 HTML pages; 0 errors; 0 warnings |
| Indexable pages and sitemap | 44 indexable pages; 44 canonical sitemap URLs |
| Packaged HTTP checks | 50 checks; 0 failures |
| Browser layout checks | 109 route/viewport combinations; 0 failures |
| Updated project assets | 5 project pages with loaded desktop and mobile previews |
| Device controls | 5 projects; both device modes passed on every page |

All 48 routes were checked at desktop and phone widths. Thirteen priority routes were also checked at tablet width. The five changed project layouts were additionally checked at desktop width. Checks cover H1 count, current design styles, loaded-image failures and horizontal overflow. The homepage project selector and desktop/mobile mode were exercised separately after the rocky hero update.

This is a technical release audit. It is not a production Core Web Vitals measurement or a guarantee of rankings, rich results, crawl timing or inclusion in Google's index.

## Area pages

The existing Epping, Essex, London, Hertfordshire and Kent URLs are retained. Every page uses the new design, static navigation, a descriptive H1, a distinct title and description, a self-referencing canonical, OG/social metadata and useful service links.

Each has a separate local brief, audience scenarios, coverage explanation, related reading and visible FAQs. Service schema identifies the specific service area, and FAQ schema matches the displayed answers. Breadcrumbs connect each page to Services. Copy identifies Epping, Essex as the studio base and describes wider locations as service areas, without invented offices, addresses, testimonials or local results.

The location pages link to detailed services, relevant insights, current project examples, contact and the free concept offer. They are substantial service destinations with their own useful content rather than lists of interchangeable place names. [Google's doorway-abuse guidance](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse) informed this approach.

## Other changes

- Host Perfect is removed from public pages, navigation, sitemaps and the packaged release. The retired URL returns an actual 404 in release HTTP checks. It remains crawlable so Google can observe the removal after deployment.
- Fyndii has a new branded reference page, linked throughout the footer. Its description is grounded in the live [Fyndii platform](https://fyndii.com/): customer requirements connect with professionals by service and chosen working area.
- Send Perfect and retained specialist pages now use the same design and server-readable content. Full navigation and footer content are present in HTML and do not depend on fetched partials.
- F7 Coaching is restored to the selected-work grid and its original /work/f7-coaching.html URL. The five featured website projects have custom laptop/mobile presentations with actual device captures and accessible view controls.
- Historical Ewing Law and Cre8 pages are labelled historical and noindex,follow. They are excluded from current work and the XML sitemap. The 404 page and unpublished article template are also noindex,follow.
- The homepage keeps functional project switching and device controls, with a custom basalt/copper background optimised to about 105 KB in WebP. The image is decorative; copy and preview controls remain HTML.
- Both branded QR contact flows remain static, direct email journeys. The real-logo QR assets previously passed decoding from desktop and phone screenshots.

## Technical checks

The audit checks unique titles/descriptions, one H1 and main element, UK language, self-canonicals, OG URL agreement, social metadata, valid JSON-LD, FAQ parity, local links/assets, fragment targets, image alternative text and dimensions, duplicate IDs, sitemap coverage, noindex exclusions and reachability from the homepage.

robots.txt permits public pages, references the preferred HTTPS/www sitemap and excludes development tools, review captures, partials and source data. The XML sitemap lists only canonical indexable URLs. Content-hash revision records keep lastmod stable when unchanged pages are rebuilt; dates represent actual content changes, not crawl requests. [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explains these signals.

The clean dist/ release excludes development files, reports, source-content caches, original screenshot PNGs and unused legacy assets. It includes the existing CNAME and a .nojekyll marker. The source project remains available separately.

## Existing live-site observations

- HTTP/apex and HTTPS/apex homepage requests resolve to the preferred HTTPS/www homepage.
- The live robots.txt and sitemap.xml return 200 and the sitemap is advertised.
- The live homepage and checked area pages still serve the previous design.
- The new Fyndii reference page currently returns 404 publicly; Host Perfect still returns 200 publicly. Both will change only after the release is deployed.
- A deliberately missing public URL returns a real 404. No live response checked contained an X-Robots-Tag indexing block.

These are public HTTP observations, not a fresh authenticated Search Console report. The older performance/indexing figures previously documented in this repository were not treated as current account state.

## Re-indexing handoff for the connected Search Console property

1. Publish the contents of dist/ using the site's existing hosting workflow, preserving the www custom domain and ownership verification. No new property or verification setup is needed for this work.
2. Run the live check again after publication. Confirm the new HTML is visible, priority pages return 200, canonical URLs use the preferred origin, the 44-URL sitemap is served, and Host Perfect returns 404.
3. In the existing Search Console property, inspect the homepage, the five area URLs, /fyndii.html and /work/f7-coaching.html. Use Test live URL and verify indexing is allowed and the rendered page contains the new content.
4. Submit or resubmit https://www.plotperfectstudios.co.uk/sitemap.xml in the property's Sitemaps report. Request indexing for those priority changed pages once their live tests pass. Other pages can be discovered through the refreshed sitemap and internal links.
5. Review the sitemap's last-read status, Page indexing report and Google's selected canonicals after recrawling. Keep the historical/template noindex pages out of indexing requests. Existing canonical exclusions should be reviewed against their exact URLs rather than removed indiscriminately.

Google controls crawl/indexing decisions and applies indexing-request quotas; repeated requests do not make crawling faster. See [Google's recrawl documentation](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Repeatable commands

```powershell
node tools/build-studio.cjs
python tools/validate_seo.py
python tools/audit_site.py
node tools/package-site.cjs
python tools/audit_site.py dist
node tools/check-release-http.cjs
node tools/check-live-seo.cjs
node tools/write-seo-report.cjs
```

For a later substantive edit, set PPS_CONTENT_DATE to the actual change date before building. Local preview: node tools/preview-studio.cjs. Release preview: node tools/preview-studio.cjs --release, on port 4174. Read-only live checks require outbound network access; release HTTP checks use a temporary loopback server that shuts down after testing.

Detailed machine-readable evidence is saved under review/: seo-audit.json, release-seo-audit.json, release-http-check.json, full-browser-audit.json, device-toggle-audit.json and live-seo-check.json.
