# Plot Perfect Studios SEO implementation report

Implementation date: 13 October 2026

Site: <https://www.plotperfectstudios.co.uk/>

Repository: `PlotPerfect/PlotPerfectStudios.co.uk_backup`

Scope: local source changes only. Nothing was committed, pushed, deployed, submitted to Search Console or changed in DNS/hosting.

## Supplied Search Console baseline

The source audit used the verified Domain property `sc-domain:plotperfectstudios.co.uk`, Web search, with no country or device filter.

| Period | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 14 Sep–11 Oct 2026 | 2 | 1,632 | 0.1225% | 27.7 |
| 17 Aug–13 Sep 2026 | 7 | 9,460 | 0.0740% | 50.3 |
| 12 Jul–11 Oct 2026 | 20 | 23,338 | — | — |

Important page and query observations from that audit:

- The homepage held roughly steady on impressions (about 250 to 249), but clicks fell from 5 to 2. Over three months it produced 13 of the site's 20 clicks from 631 impressions (2.06% CTR, average position 6.48).
- `/web-development.html` impressions rose from 187 to 255.
- `/insights/seo-first-website-structure.html` rose from 16 to 94 impressions and average position improved from 20.12 to 8.82, but it still received no clicks.
- Latest-period Epping queries showed useful visibility but no clicks: “web design company in epping” (47 impressions, position 8.43), “web design epping” (27, position 6), “website design epping” (22, position 12.82) and “seo epping” (43, position 19.44).
- Hertfordshire impressions fell from 5,317 to 665 and Kent from 3,185 to 70; both segments had zero clicks in both compared periods. This made distinct usefulness and truthful service-area language a priority over adding more location pages.
- Search Console reported 35 indexed and 35 excluded URLs. Exclusions comprised 25 redirects, 3 alternate canonicals, 5 crawled-not-indexed URLs and 2 canonical disagreements, with no reported 404s.
- The submitted non-`www` sitemap was successful, contained 26 URLs, was submitted 30 December 2025 and last read 2 January 2026.
- Breadcrumb enhancement reported 9 valid items and no invalid items. There was not enough Core Web Vitals field data for a conclusion.

## Implemented locally

Directly changed public routes include `/`, `/contact.html`, `/free-homepage-design.html`, `/services.html`, `/web-development.html`, `/web-design-epping.html`, `/web-design-essex.html`, `/web-design-hertfordshire.html`, `/web-design-kent.html`, `/web-design-london.html`, `/monthly-web-development.html`, `/ui-ux-design.html`, `/vehicle-wrap-designs.html`, `/host-perfect.html`, `/send-perfect.html`, `/sitemap.html`, `/404.html`, `/insights/seo-first-website-structure.html`, `/insights/how-much-should-a-website-cost-uk.html`, `/insights/seo-isnt-dead-its-changing.html`, and the Bark Lane, Ewing Law, F7 Coaching and Corrigan & Chapman work pages. Shared header/footer changes affect every route that loads those partials. `sitemap.xml` was also updated.

### Conversion and contact reliability

- Rebuilt the quote and free-homepage form handlers around an acknowledged EmailJS REST response, with accessible field errors, first-invalid focus, pending/success/failure states, duplicate-submit protection and a 15-second timeout.
- Form values are cleared only after a confirmed HTTP success. Failure and timeout states preserve the visitor's input and explicitly say delivery was not confirmed.
- Removed console logging of enquiry details and ensured neither form puts personal data in the URL.
- Removed the unneeded EmailJS SDK loads from both form pages; the existing public key, service ID and template IDs remain in local configuration.
- Replaced the contact-page demo/placeholder journey with honest response copy and a real link to the free-homepage offer. Consent text now explains that submitted details are used to respond.
- Made all primary free-homepage CTAs on that offer page jump to `#request` instead of reloading or diverting to a different form.

### Search intent, copy and trust

- Repositioned the homepage metadata around the overall Plot Perfect Studios brand and offer, kept the Epping page focused on “Web Design Epping”, and separated the services overview and web-development intent.
- Shortened and clarified priority titles/descriptions for the homepage, Epping, Hertfordshire, Kent, web development, services and vehicle-wrap portfolio.
- Replaced the repetitive Hertfordshire and Kent expansion blocks with distinct explanations of remote delivery from Epping, scope, pricing, deliverables and carefully labelled portfolio evidence. The copy does not invent local offices or local clients.
- Removed public editorial residue from the vehicle-wrap gallery, web-development page and SEO-structure article. Replaced the unsupported “users leave, rankings suffer” shortcut with a qualified performance explanation.
- Corrected the F7 logo alternative text and retained the earlier cleanup of unfinished case-study/media placeholders.
- Retained the locally restored `/ui-ux-design.html` page rather than creating another new URL.

### Technical SEO and internal consistency

- Synchronised every existing FAQPage JSON-LD object from the full visible FAQ content. The Epping, Hertfordshire, Kent and web-development schemas now contain every visible question and exactly matching answer text.
- Extended `tools/validate_seo.py` so future changes fail validation when FAQ schema and visible FAQ content drift.
- Standardised primary internal destinations to `/`, `/work/index.html` and `/insights/index.html`, preserving homepage anchors such as `/#process` and `/#contact`.
- Updated the HTML and XML sitemaps to use the chosen Work and Insights canonical URLs. Existing alias/redirect handling was not changed locally because this static repository does not define the hosting redirects.
- Constrained decorative background glows, added reduced-motion handling and made the two promotional footer widgets flow in normal document layout at 760px and below so they cannot cover form controls or mobile content.
- Fixed the vehicle-wrap Instagram gallery's min-content grid overflow at 1366px and retained the general mobile grid/embed protections.

### Repeatable implementation tools

- `tools/validate_seo.py`: titles, descriptions, H1s, canonicals, robots, JSON-LD, FAQ parity and local links/assets.
- `tools/sync_faq_schema.py`: regenerates FAQPage entities from visible FAQ items.
- `tools/normalize_internal_links.py`: applies the selected canonical internal destinations.
- `tools/update_location_pages.py`: reproducibly applies the distinct Hertfordshire/Kent content blocks.
- `tools/form_qa.cjs`: mock-only browser tests for validation, success acknowledgement, duplicate prevention, failure, timeout, field preservation and URL privacy.
- `tools/browser_qa.cjs`: responsive rendering, overflow, image and browser-error checks, with optional route/width targeting.

## Validation completed

- Static SEO/link validation: 40 HTML pages checked, **0 errors**. The 39 remaining warnings are advisory length checks on lower-priority legacy titles/descriptions, not broken links, invalid schema or crawl blockers.
- `git diff --check`: passed; the output only noted expected LF/CRLF working-copy conversions.
- Mock form QA: **14/14 checks passed**. No real EmailJS request was made.
- Responsive headless-browser QA: representative routes passed at 360, 390, 412, 768 and 1366 pixels with 200 responses, one H1, no broken loaded images, no browser/page errors and no detected horizontal overflow.
- A focused 1366px retest of the vehicle-wrap page passed after its Instagram grid fix.
- The contact form was detected with seven required controls and its “Send Request” submit control; the submit focus indicator was visible in computed browser styles.
- The homepage mobile-menu control passed its 390px interaction check (`aria-expanded=true`, menu exposed).

## Owner actions still required

1. Review the diff, then commit, push and deploy through the normal GitHub Pages workflow when approved.
2. Send controlled test enquiries after deployment and confirm both EmailJS templates deliver to the intended mailbox, reply-to values are correct, spam handling is acceptable and duplicate delivery does not occur. Local tests prove UI behaviour with mocked acknowledgements, not live mail delivery.
3. Publish or link an approved privacy notice before collecting production enquiries. The forms now use honest consent wording, but the repository still has no privacy-policy page.
4. Confirm the portfolio descriptions, starting-price statement, typical 2–3 week timeline and remote/on-site wording remain commercially accurate.
5. Confirm the host's permanent apex/non-`www` to preferred `https://www` redirects preserve paths and query strings. Keep only the canonical Work and Insights URLs in navigation and sitemaps.
6. After deployment and recrawl, compare complete Search Console periods against the baseline above. Prioritise homepage and Epping CTR, the SEO-structure article's zero-click first-page visibility, web-development growth, and whether Hertfordshire/Kent impressions recover without renewed thin-content patterns.
7. Review the five crawled-not-indexed URLs and two canonical disagreements individually in Search Console. Do not request indexing repeatedly or change canonical targets without confirming the affected URLs.

## Measurement note

Use the deployment date as the annotation point and compare complete periods only. Search Console changes will lag deployment and recrawl. The implementation should be judged first on successful delivery paths, clean indexing/canonical signals and improved CTR on already-visible queries—not on an immediate ranking claim.
