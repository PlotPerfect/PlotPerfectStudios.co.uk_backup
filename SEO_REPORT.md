# Plot Perfect Studios - SEO Implementation Report
Generated: 2026-04-17 16:25

## Canonical + Domain Standardisation
- Canonical base is standardised to `https://www.plotperfectstudios.co.uk/` across all pages (canonical, OG/Twitter, schema URLs, sitemap, robots).
- Recommended: enforce a single live hostname via redirects (non-www -> www).

## Redirect Rules (Non-www -> www)
### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} !^www\.plotperfectstudios\.co\.uk$ [NC]
RewriteRule ^ https://www.plotperfectstudios.co.uk%{REQUEST_URI} [R=301,L]
```

### Nginx
```nginx
server {
  listen 80;
  server_name plotperfectstudios.co.uk;
  return 301 https://www.plotperfectstudios.co.uk$request_uri;
}

server {
  listen 443 ssl;
  server_name plotperfectstudios.co.uk;
  return 301 https://www.plotperfectstudios.co.uk$request_uri;
}
```

### Cloudflare (Recommended for GitHub Pages)
GitHub Pages doesn’t support server-side 301 redirects, so do the hostname redirect at the edge.

1) GitHub Pages (so your site lives on `www`)
- In your repo settings: set **Custom domain** to `www.plotperfectstudios.co.uk`
- Ensure **Enforce HTTPS** is enabled
- Repo `CNAME` should be `www.plotperfectstudios.co.uk` (this is committed)

2) Cloudflare (301 `plotperfectstudios.co.uk` -> `www.plotperfectstudios.co.uk`)

Option A — **Rules → Redirect Rules** (recommended)
- Expression: `http.host eq "plotperfectstudios.co.uk"`
- Action: **Dynamic redirect**
- Target URL: `concat("https://www.plotperfectstudios.co.uk", http.request.uri.path)`
- Status code: **301**
- Toggle **Preserve query string**: ON

Option B — **Bulk Redirects** (also fine)
- Source: `https://plotperfectstudios.co.uk/*`
- Target: `https://www.plotperfectstudios.co.uk/$1`
- Status: **301**
- Preserve query string: ON

This is the cleanest approach for GitHub Pages because it enforces a single live hostname that matches the canonical URLs.

## Structured Data (Schema)
- JSON-LD is present site-wide.
- Coverage includes: `WebSite`, `LocalBusiness`, `WebPage`, `BreadcrumbList` (and `Service` where relevant).

## Performance Optimisations
- Images updated with `loading="lazy"` and `decoding="async"` (non-critical).
- Key logo uses higher priority where appropriate.
- Next optional win: convert large images to modern formats (WebP/AVIF) and ensure responsive `srcset` where helpful.

## Internal Linking Map (Recommended Crawl + Conversion Flow)
- Primary flow: `index.html` -> `services.html` -> (`web-development.html`, `host-perfect.html`, `monthly-web-development.html`) -> `contact.html`
- Offer-led flow: `index.html`/`services.html` -> `free-homepage-design.html` -> `contact.html`
- Local flow: `services.html` + location pages (Epping/Essex/London + nearby areas) -> `contact.html`
- Proof flow: any service/offer page -> `work/index.html` -> `contact.html`
- Insight flow: `insights/index.html` -> individual posts -> contextual links back to `services.html`/`web-development.html` -> `contact.html`

## CRO / Messaging Notes
- Key hooks used consistently: local coverage (Epping/Essex/London) + pricing anchor (from GBP 895 where relevant) + clear CTA.
- Best practice: keep 1 primary CTA per page above-the-fold ("Request a Quote" / "Get a Free Homepage Design"), with supporting secondary CTAs (Services / Work).

## Key Page Word Counts (plain-text estimate)
- `services.html`: **836** words
- `web-development.html`: **909** words
- `contact.html`: **813** words
- `free-homepage-design.html`: **835** words
- `monthly-web-development.html`: **849** words
- `host-perfect.html`: **806** words
- `vehicle-wrap-designs.html`: **862** words

## Meta Inventory (Title / Description / Canonical)
Total HTML pages scanned (excluding partials): **38**
- Validation flags (missing/incorrect): **0**

| Page | Title | Meta description (preview) | Canonical |
|---|---|---|---|
| 404.html | 404 Page Not Found \| Plot Perfect Studios (Epping, Essex & London) | That page doesn't exist. Head back to Plot Perfect Studios (Epping/Essex/London), explore services and work, or request ... | https://www.plotperfectstudios.co.uk/404.html |
| contact.html | Request a Quote \| Web Design Epping, Essex & London \| From £895 | Tell us what you need and get a quote for a bespoke, SEO-first website. Serving Epping, Essex & London - builds from £89... | https://www.plotperfectstudios.co.uk/contact.html |
| free-homepage-design.html | Free Homepage Design (Epping/Essex/London) \| See It Before You Buy | Get a FREE custom homepage design before you commit. Based in Epping, serving Essex & London. See messaging + layout fir... | https://www.plotperfectstudios.co.uk/free-homepage-design.html |
| host-perfect.html | Website Hosting & Care \| Epping, Essex & London \| Fast + Secure | Performance-first website hosting and care: fast, secure and monitored. Based in Epping, serving Essex & London. Improve... | https://www.plotperfectstudios.co.uk/host-perfect.html |
| index.html | Web Design Epping, Essex & London \| SEO-First Sites from £895 \| Plot Perfect Stu... | Bespoke web design in Epping for Essex & London businesses. SEO-first, fast, conversion-led websites from £895. Get a FR... | https://www.plotperfectstudios.co.uk/ |
| insights/bespoke-vs-template-websites.html | Bespoke vs Template Websites \| Real Cost Analysis \| Plot Perfect Studios | Templates look fine initially, but long-term costs add up. Discover the real differences between bespoke and template we... | https://www.plotperfectstudios.co.uk/insights/bespoke-vs-template-websites.html |
| insights/choosing-the-right-web-developer.html | Choosing the Right Web Developer \| Questions to Ask \| Plot Perfect Studios | Not all web developers build for SEO, performance, and conversion. Get the essential questions to ask, red flags to avoi... | https://www.plotperfectstudios.co.uk/insights/choosing-the-right-web-developer.html |
| insights/core-web-vitals-without-sacrificing-design.html | Core Web Vitals Without Sacrificing Design \| Speed + Beauty \| Plot Perfect Studi... | You don't have to choose between premium design and speed. Learn how to optimize Core Web Vitals while keeping modern UI... | https://www.plotperfectstudios.co.uk/insights/core-web-vitals-without-sacrificing-design.html |
| insights/hand-coded-vs-wordpress-seo.html | Hand-Coded vs WordPress for SEO \| Performance Comparison \| Plot Perfect Studios | WordPress can work, but for maximum SEO performance, hand-coded sites often win. Discover the real differences and when ... | https://www.plotperfectstudios.co.uk/insights/hand-coded-vs-wordpress-seo.html |
| insights/homepage-sections-that-convert.html | Homepage Sections That Actually Convert \| Design Guide \| Plot Perfect Studios | A homepage shouldn't just look good. Discover the key sections that turn visitors into enquiries without feeling salesy ... | https://www.plotperfectstudios.co.uk/insights/homepage-sections-that-convert.html |
| insights/how-long-does-a-website-take-to-build.html | How Long Does a Website Take to Build? \| Realistic Timelines \| Plot Perfect Stud... | Website timelines vary by complexity and goals. Get a realistic breakdown of how long a professional, SEO-optimized webs... | https://www.plotperfectstudios.co.uk/insights/how-long-does-a-website-take-to-build.html |
| insights/how-much-should-a-website-cost-uk.html | How Much Should a Website Cost in the UK? \| 2025 Pricing Guide \| Plot Perfect St... | Website pricing in the UK varies massively. Get the real costs, what you actually get at different price points, and red... | https://www.plotperfectstudios.co.uk/insights/how-much-should-a-website-cost-uk.html |
| insights/index.html | Web Design Insights \| SEO, Speed & Conversion \| Plot Perfect Studios (Epping/Ess... | Actionable insights on SEO, performance and conversion for UK businesses - from Plot Perfect Studios in Epping (Essex), ... | https://www.plotperfectstudios.co.uk/insights/index.html |
| insights/post-template.html | Insights Post \| Plot Perfect Studios | Plot Perfect Studios insights post. Based in Epping, Essex - serving London too. | https://www.plotperfectstudios.co.uk/insights/post-template.html |
| insights/seo-first-website-structure.html | How We Structure Websites for SEO From Day One \| Plot Perfect Studios | SEO isn't something you bolt on later. Here's how Plot Perfect Studios structures websites from day one for crawlability... | https://www.plotperfectstudios.co.uk/insights/seo-first-website-structure.html |
| insights/seo-isnt-dead-its-changing.html | SEO Isn't Dead - It's Just Changing \| 2025 SEO Guide \| Plot Perfect Studios | SEO hasn't disappeared. It's evolving. Discover what's actually changing, what still matters, and how businesses should ... | https://www.plotperfectstudios.co.uk/insights/seo-isnt-dead-its-changing.html |
| insights/web-design-essex-what-to-look-for.html | Web Design in Essex \| What to Look For \| Local Guide \| Plot Perfect Studios | Choosing a web designer in Essex isn't about price alone. Discover what local businesses should look for to avoid costly... | https://www.plotperfectstudios.co.uk/insights/web-design-essex-what-to-look-for.html |
| insights/what-happens-after-your-website-launches.html | What Happens After Your Website Launches \| Post-Launch Guide \| Plot Perfect Stud... | Launching a website isn't the finish line. Discover what actually happens after launch, and how to turn a new site into ... | https://www.plotperfectstudios.co.uk/insights/what-happens-after-your-website-launches.html |
| insights/when-you-need-more-than-a-website.html | When You Need More Than a Website \| Web Systems Guide \| Plot Perfect Studios | Sometimes a website isn't enough. Discover the signs your business needs a web system - bookings, portals, dashboards, a... | https://www.plotperfectstudios.co.uk/insights/when-you-need-more-than-a-website.html |
| insights/why-custom-websites-win-long-term.html | Why Custom Websites Win Long-Term \| ROI Analysis \| Plot Perfect Studios | Custom websites cost more upfront, but they outperform templates long-term. Discover why structure, control, and scalabi... | https://www.plotperfectstudios.co.uk/insights/why-custom-websites-win-long-term.html |
| insights/why-pretty-websites-dont-rank.html | Why "Pretty" Websites Don't Rank \| SEO Truths \| Plot Perfect Studios | Many visually impressive websites fail to rank. Learn why structure, intent, and performance matter more than appearance... | https://www.plotperfectstudios.co.uk/insights/why-pretty-websites-dont-rank.html |
| monthly-web-development.html | Monthly Web Development \| £550/mo \| Epping, Essex & London Support | Unlimited web development on a monthly plan: £550/mo including 2 SEO blog posts. Based in Epping, serving Essex & London... | https://www.plotperfectstudios.co.uk/monthly-web-development.html |
| send-perfect.html | Send Perfect \| AI Outreach Tool \| Plot Perfect Studios (Epping/Essex/London) | AI-assisted outreach and email sequences to generate leads consistently. Built by Plot Perfect Studios in Epping (Essex)... | https://www.plotperfectstudios.co.uk/send-perfect.html |
| services.html | Web Design & Development Services \| Epping, Essex & London \| From £895 | SEO-first web design, custom development and conversion-led builds for Epping, Essex & London. Premium, fast websites fr... | https://www.plotperfectstudios.co.uk/services.html |
| sitemap.html | Sitemap \| Plot Perfect Studios (Epping, Essex & London) | Browse every page on Plot Perfect Studios. Based in Epping (Essex) and serving London - find services, work, insights an... | https://www.plotperfectstudios.co.uk/sitemap.html |
| vehicle-wrap-designs.html | Vehicle Wrap Design Portfolio \| Epping, Essex & London \| Plot Perfect Studios | Vehicle wrap design concepts and real-world examples. Branding-led layouts designed to stand out - created in Epping (Es... | https://www.plotperfectstudios.co.uk/vehicle-wrap-designs.html |
| web-design-epping.html | Web Design Epping, Essex & London \| SEO-First Websites from £895 | Bespoke web design in Epping for Essex & London businesses. SEO-first structure, fast load times and conversion-led page... | https://www.plotperfectstudios.co.uk/web-design-epping.html |
| web-design-essex.html | Web Design Essex (Near Epping) \| SEO-First Websites from £895 | Bespoke web design in Essex for businesses across Epping and London. Fast, SEO-first, conversion-led websites from £895.... | https://www.plotperfectstudios.co.uk/web-design-essex.html |
| web-design-hertfordshire.html | Web Design Hertfordshire \| SEO-First Websites from £895 \| Plot Perfect Studios | Bespoke web design for Hertfordshire businesses - built by an Epping, Essex studio serving London too. Fast, SEO-first, ... | https://www.plotperfectstudios.co.uk/web-design-hertfordshire.html |
| web-design-kent.html | Web Design Kent \| SEO-First Websites from £895 \| Plot Perfect Studios | Bespoke web design for Kent businesses - delivered by an Epping, Essex studio serving London too. SEO-first structure, p... | https://www.plotperfectstudios.co.uk/web-design-kent.html |
| web-design-london.html | Web Design London \| SEO-First Websites from £895 \| Plot Perfect Studios | Bespoke web design for London businesses, delivered by an Epping (Essex) studio. SEO-first structure, premium UI and con... | https://www.plotperfectstudios.co.uk/web-design-london.html |
| web-development.html | Web Development Epping, Essex & London \| SEO-First Builds from £895 | Custom web development for Epping, Essex & London: fast, SEO-first websites and scalable systems built to convert. Launc... | https://www.plotperfectstudios.co.uk/web-development.html |
| work/bark-lane-daycare.html | Bark Lane Daycare \| Website Case Study \| Plot Perfect Studios | How we built Bark Lane Daycare's premium website with luxury dark aesthetic, school bus pickup section, and SEO-led stru... | https://www.plotperfectstudios.co.uk/work/bark-lane-daycare.html |
| work/corrigan-and-chapman.html | Corrigan & Chapman \| Website Case Study \| Plot Perfect Studios | How we built Corrigan & Chapman Construction's high-trust website with authority-led structure, project case studies, an... | https://www.plotperfectstudios.co.uk/work/corrigan-and-chapman.html |
| work/cre8-london.html | CRE8 London \| Website Case Study \| Plot Perfect Studios | How we built CRE8 London's product-led website with interactive panels, structured navigation, QR contact touchpoints, a... | https://www.plotperfectstudios.co.uk/work/cre8-london.html |
| work/ewing-law.html | Ewing Law \| Website Case Study \| Plot Perfect Studios | How we redesigned Ewing Law's premium legal website focused on authority, clarity, conversion, and SEO-ready structure f... | https://www.plotperfectstudios.co.uk/work/ewing-law.html |
| work/f7-coaching.html | F7 Coaching \| Website Case Study \| Plot Perfect Studios | How we built F7 Coaching's futuristic youth football website with video intro, booking flow foundations, and clean conve... | https://www.plotperfectstudios.co.uk/work/f7-coaching.html |
| work/index.html | Web Design Portfolio \| Case Studies & Results \| Epping, Essex & London | Explore website case studies from Plot Perfect Studios in Epping (Essex), serving London too. SEO-first, fast, conversio... | https://www.plotperfectstudios.co.uk/work/index.html |
