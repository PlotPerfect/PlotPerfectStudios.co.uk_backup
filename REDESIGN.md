# Plot Perfect Studios redesign

Implemented locally, 27 October 2026. No production deployment was performed.

## Audit and direction

The previous homepage foregrounded the free-design offer, mixed studio services with ecosystem products and promoted an outdated portfolio selection. The useful foundations were its static architecture, local landing pages, working enquiry integrations and 15 existing insight articles. Some shared navigation referenced a missing logo asset. One retained UI/UX page had a mismatch between visible FAQs and structured data.

The new homepage progresses through the interactive client showcase, current selected work, four service areas, studio principles, process, performance foundations, insights and a final concept enquiry. The dark identity and copper-orange accent remain, with the original Plot Perfect logo, custom line icons, CSS devices and live-client screenshots.

## Portfolio research and scope

Live websites were reviewed in the browser; CDM, Novara, Clear Path and Knight & Day displayed Plot Perfect design/development credits. Screenshots are captured representations of those sites, rather than invented redesigns. Their own illustrative imagery remains within those website captures.

- [Novara Property Care](https://www.novarapropertycare.co.uk/): website design and development; featured on the homepage.
- [CDM Capital](https://cdmcapital.co.uk/): website and digital presence; featured on the homepage.
- [Clear Path Waste](https://clearpathwaste.co.uk/): website, local SEO foundations and setup; featured on the homepage.
- [Knight & Day](https://knightanddaydrainageandplumbinglimited.co.uk/): service-business website; included in selected work.
- [F7 Coaching](https://f7coaching.com/): website, session booking and admin tools; restored to selected work at its original project URL.
- [Arrow Security Shutters](https://arrowsecurityshutters.co.uk/products/) and [Zenith Doors](https://www.zenithdoors.co.uk/): scoped as SEO/social/digital support in accordance with the brief. Both sites credit a different web designer; the redesign explicitly does not attribute their website builds to Plot Perfect.
- The Whisky Highball Company: landing-page, investor-acquisition and marketing support, as supplied in the brief. No full website build or measured outcome is claimed.

Ewing Law and Cre8 London have been removed from featured work, location-page recommendations and the public sitemaps. Their historical URLs remain available to avoid breaking existing inbound links.

## Implementation

- Static HTML, CSS and vanilla JavaScript; no production packages or build framework.
- `tools/build-studio.cjs` generates the main pages, four service destinations, five featured project pages, studio page, insights library and both enquiry pages. `tools/build-area-pages.cjs` creates the five location pages and Fyndii/Send Perfect pages. `tools/build-supporting-pages.cjs` migrates retained specialist and archive URLs.
- `assets/data/projects.json` contains portfolio records. Project source records live in the generator.
- `assets/data/articles.json` preserves the existing article bodies and holds category and read-time metadata. Edit this file to maintain article content, then run the generator.
- The hero changes between Novara, CDM and Clear Path as the visitor scrolls, and has explicit project buttons plus desktop/mobile presentation controls. A manual project selection takes precedence over scrolling. Reduced-motion preferences disable the load/scroll animation.
- The portfolio supports website, digital-support and campaign filters. Insights has category filters, search and an empty-result state. Filter states support direct query-string links.
- Related articles and enquiry links connect the existing content library with services.
- The main contact form has been replaced with a bespoke QR terminal panel, using the email destination decoded from the original studio QR: `mailto:info@plotperfectstudios.co.uk`. It includes direct email and copy-email controls. The QR uses custom rounded modules and copper finder marks, with a four-module quiet zone and high error correction. Decoder checks pass on both desktop and mobile browser screenshots. `tools/create-contact-qr.py` regenerates the SVG using the build-only `qrcode` package; no third-party QR service or runtime library is involved.
- The free-homepage concept page uses a matching bespoke QR panel. Its QR and request button open an email to the same studio address with the subject `Free homepage concept` and a short Business / Website / Goals starter brief. No form or EmailJS script loads on either enquiry page. Generate the concept asset with `python tools/create-contact-qr.py --concept`. No live enquiry was sent during QA.
- Both QR SVGs embed the original Plot Perfect PNG logo in a small central dark badge. The quiet zone and high error correction remain intact. Decode checks pass for both assets at 200, 240, 270, 320 and 640 px, and for both live pages captured at desktop and phone widths.
- All public HTML pages now use the new design and static navigation. Area pages have distinct content, truthful coverage context, visible FAQs and matching area-specific structured data. Host Perfect has been removed from the release and replaced in navigation by Fyndii.
- The five featured project pages share an interactive laptop/mobile component with real website captures, view toggles and subtle pointer response. The homepage keeps its own project-switching device showcase on a custom generated basalt/copper stage.
- Project screenshots use WebP. Below-fold project cards are lazy loaded; the decorative rocky hero background is approximately 105 KB. A clean production package excludes original PNG captures and unused legacy assets.

## SEO and accessibility

New pages contain server-readable content and navigation, one H1, canonical URLs, distinct metadata, social metadata and JSON-LD for the organisation, website, pages, services, articles and breadcrumbs. Local relevance is expressed through Epping/Essex copy, service context and internal links; no fabricated street address, reviews or performance statistics have been added. The existing robots file points to the refreshed XML sitemap. The SVG social artwork also has a 1200 × 630 PNG export.

Keyboard focus, skip links, descriptive image alternatives, live status feedback, accessible device controls, menu Escape handling and reduced-motion styles are included. Client-site screenshots are visual previews, not embedded remote sites.

## Content development

Existing categories: Web design, SEO, Local business and Systems. Add future articles to `assets/data/articles.json`, then regenerate. Use a specific category, descriptive filename, concise summary, article body and relevant service links. Read-time metadata should reflect the final body.

Useful next topics:

1. Google Business Profile essentials for Epping service businesses — connect to SEO and the Epping landing page.
2. What belongs on a local service page — connect to bespoke websites and the Essex landing page.
3. Turning repeated admin into a simple business workflow — connect to web apps and automation.
4. A post-launch website review checklist — connect to website care.
5. Project stories based on client-approved scope and verified results; publish measured outcomes only when evidence is available.

## Local commands

```powershell
node tools/build-studio.cjs
node tools/preview-studio.cjs
# Open http://127.0.0.1:4173/
python tools/validate_seo.py
```

The preview server is a local development helper. Run the audit and `node tools/package-site.cjs` to prepare `dist/`, then publish its contents using the existing hosting workflow. The package includes CNAME and excludes review captures, source caches and development tools. See `SEO_REPORT.md` for the re-indexing handoff.

## Verification

Browser checks cover all 48 HTML routes at phone and desktop widths, plus 13 priority routes at tablet width. The updated project layouts and both device toggles were additionally checked on all five featured projects. Search, filters, hero controls, mobile navigation and both branded QR flows were exercised. Captures and machine-readable evidence are in `review/`.

The source and packaged release each pass the whole-site audit with 48 pages, 44 indexable sitemap URLs, zero errors and zero warnings. The release passes 50 local HTTP checks, including real 404 responses for retired/missing URLs. The live domain still serves the old design: publication and live URL testing must precede Search Console re-indexing. This is not a production Core Web Vitals measurement or a guarantee of indexing or rankings.
