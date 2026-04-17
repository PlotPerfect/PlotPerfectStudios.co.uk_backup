from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WWW_BASE = "https://www.plotperfectstudios.co.uk"

MARKER_START = "<!-- PPS:SEO-EXPANSION:START -->"
MARKER_END = "<!-- PPS:SEO-EXPANSION:END -->"


@dataclass(frozen=True)
class Target:
    rel: str
    kind: str
    area_label: str | None = None


TARGETS: list[Target] = [
    Target("services.html", "services"),
    Target("web-development.html", "webdev"),
    Target("web-design-epping.html", "location", "Epping"),
    Target("web-design-essex.html", "location", "Essex"),
    Target("web-design-london.html", "location", "London"),
    Target("web-design-hertfordshire.html", "location", "Hertfordshire"),
    Target("web-design-kent.html", "location", "Kent"),
    Target("contact.html", "contact"),
    Target("free-homepage-design.html", "free-homepage"),
    Target("monthly-web-development.html", "monthly"),
    Target("host-perfect.html", "hosting"),
    Target("vehicle-wrap-designs.html", "wraps"),
]


def _insert_before_closing_main(html: str, block: str) -> str:
  if MARKER_START in html and MARKER_END in html:
    pattern = re.compile(re.escape(MARKER_START) + r".*?" + re.escape(MARKER_END), flags=re.S)
    return pattern.sub(block.strip(), html, count=1)
  return re.sub(r"\s*</main>", f"\n{block}\n</main>", html, flags=re.I)


def _cta_block(primary_href: str = "contact.html") -> str:
    return f"""
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;\">\
          <div>\
            <p class=\"eyebrow\" style=\"margin-bottom:6px;\">READY TO START?</p>\
            <h2 class=\"h2\" style=\"margin:0;\">Start with a free homepage design (no risk)</h2>\
            <p class=\"sub\" style=\"margin:10px 0 0; max-width:90ch;\">\
              See the direction and messaging first, then decide. If you proceed, website projects typically start from <strong>£895</strong> depending on scope.\
            </p>\
          </div>\
          <div style=\"display:flex; gap:12px; flex-wrap:wrap;\">\
            <a class=\"btn primary\" href=\"free-homepage-design.html\">Free Homepage Design</a>\
            <a class=\"btn ghost\" href=\"{primary_href}\">Get a Quote</a>\
            <a class=\"btn ghost\" href=\"services.html\">See Services</a>\
          </div>\
        </div>\
      </div>\
    </section>\
"""


def _location_expansion(area: str) -> str:
    # Natural local mentions required by brief (Epping/Essex/Loughton/Harlow/Chigwell)
    local_line = (
        "We’re based in Epping, Essex and support clients across London too — including nearby areas like Loughton, Harlow and Chigwell."
    )

    extra_guide_cta = (
      '<a class="btn ghost" href="/insights/web-design-epping-complete-guide-2026.html">Read the 2026 guide</a>'
      if area == "Epping"
      else '<a class="btn ghost" href="/insights/">Read Insights</a>'
    )

    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">BENEFITS</p>\
          <h2 class=\"h2\">Why bespoke web design wins in {area}</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            When someone searches for <strong>web design {area}</strong>, they’re usually comparing options quickly: who looks credible, who feels local, and who can actually deliver results.\
            A template site can look fine — but ranking and converting in competitive local search comes down to structure, speed, and how clearly you communicate your offer.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">{local_line}</p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            The goal is simple: build a website that makes it obvious <em>who you help</em>, <em>what you do</em>, and <em>what to do next</em>.\
            That clarity improves conversion rates immediately — and it also helps Google understand relevance for local searches.\
          </p>\

          <div class=\"grid\" style=\"grid-template-columns: repeat(3, 1fr); gap:14px; margin-top:14px;\">\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">More enquiries</h3>\
              <p class=\"muted\" style=\"margin:0;\">Clear messaging + CTA placement means less browsing and more contact-form submissions.</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Cleaner SEO foundations</h3>\
              <p class=\"muted\" style=\"margin:0;\">One H1, supportive H2/H3s, internal linking, schema, and intent-led content.</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Faster load speed</h3>\
              <p class=\"muted\" style=\"margin:0;\">Lightweight code and performance-first assets to support Core Web Vitals.</p>\
            </div>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">LOCAL SEO</p>\
          <h2 class=\"h2\">Local SEO content that reads naturally (and still ranks)</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            We avoid keyword stuffing. Instead, we build content depth around real buying questions: what you offer, how you work, what it costs, and why you’re credible.\
            For local campaigns, the structure matters as much as the words — clean headings, internal links, and supporting pages that cover the wider area.\
          </p>\
          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Service pages:</strong> clear pages for each core service (not everything crammed onto one page).</li>\
            <li><strong>Location relevance:</strong> natural mentions of Epping, Essex, London and nearby areas like Loughton, Harlow and Chigwell.</li>\
            <li><strong>Internal linking:</strong> homepage → services → location page → contact, with keyword-rich anchors.</li>\
            <li><strong>Schema:</strong> LocalBusiness + Service + FAQ (where applicable) so search engines can extract meaning.</li>\
          </ul>\
          <div style=\"display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;\">\
            <a class=\"btn ghost\" href=\"/web-design-epping.html\">Web Design Epping</a>\
            <a class=\"btn ghost\" href=\"/web-design-essex.html\">Web Design Essex</a>\
            <a class=\"btn ghost\" href=\"/web-design-london.html\">Web Design London</a>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">PROCESS</p>\
          <h2 class=\"h2\">Our process (simple, fast, and commercially focused)</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            This is how we take you from “we need a better website” to a site that’s ready to rank and convert.\
            We keep momentum high, decisions clear, and copy structured around what customers in {area} actually search for.\
          </p>\

          <ol class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Discovery:</strong> goals, services, competitors, and what you want the site to achieve.</li>\
            <li><strong>Structure:</strong> pages + headings + internal linking built around search intent.</li>\
            <li><strong>Homepage design:</strong> you can start with a FREE homepage design if you want to see direction first.</li>\
            <li><strong>Build:</strong> clean, fast code with conversion-led sections and clear CTAs.</li>\
            <li><strong>Launch:</strong> metadata, schema, sitemap, and performance checks for a strong baseline.</li>\
          </ol>\

          <div style=\"display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;\">\
            <a class=\"btn primary\" href=\"free-homepage-design.html\">Free Homepage Design</a>\
            <a class=\"btn ghost\" href=\"contact.html\">Get a Quote</a>\
            <a class=\"btn ghost\" href=\"/work/index.html\">View Work</a>\
            {extra_guide_cta}\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">WHY CHOOSE US</p>\
          <h2 class=\"h2\">Why choose Plot Perfect Studios</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            You’re not just buying a website — you’re buying clarity, trust, and a system that turns traffic into leads.\
            Our builds are designed for local visibility (SEO), fast mobile experience (performance), and decision-making (CRO).\
          </p>\

          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Local-first structure:</strong> service pages and location relevance without keyword stuffing.</li>\
            <li><strong>Conversion messaging:</strong> stronger hooks, proof blocks, and CTA flow built in.</li>\
            <li><strong>Transparent pricing anchor:</strong> projects typically start from <strong>£895</strong> depending on scope.</li>\
            <li><strong>Optional monthly support:</strong> keep improving with a monthly development plan.</li>\
          </ul>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Local SEO coverage</h3>\
            <p class=\"muted\" style=\"margin:0;\">{local_line} We build pages that search engines can understand and customers can trust.</p>\
          </div>\
        </div>\
      </div>\
    </section>\

{_cta_block()}
{MARKER_END}
"""


def _services_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">WHAT WE DO</p>\
          <h2 class=\"h2\">SEO-first web design services that drive enquiries</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            If your website looks good but doesn’t generate leads, it’s usually a structure problem — not a “traffic problem”.\
            We build sites that are easy to understand for Google and easy to trust for customers: one clear offer, clean headings, fast load times, and calls-to-action that feel natural.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Our work sits between design, development and marketing. That means we think in terms of outcomes: ranking for the right searches, building trust quickly,\
            and moving visitors towards a single next step (usually a quote request).\
          </p>\

          <div class=\"grid\" style=\"grid-template-columns: repeat(3, 1fr); gap:14px; margin-top:14px;\">\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Local SEO foundations</h3>\
              <p class=\"muted\" style=\"margin:0;\">Metadata, internal links, schema and content structure built for Epping, Essex & London search intent.</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Conversion-led pages</h3>\
              <p class=\"muted\" style=\"margin:0;\">Better hooks, proof placement, and CTA flow — so you get more enquiries from the same traffic.</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Performance</h3>\
              <p class=\"muted\" style=\"margin:0;\">Lightweight code and image strategy that supports Core Web Vitals on mobile.</p>\
            </div>\
          </div>\

          <p class=\"sub\" style=\"max-width:95ch; margin-top:14px;\">\
            Based in <strong>Epping</strong>, we support businesses across <strong>Essex</strong> and <strong>London</strong>, including nearby areas like <strong>Loughton</strong>, <strong>Harlow</strong> and <strong>Chigwell</strong>.\
            If you want to de-risk the project, start with a <a href=\"/free-homepage-design.html\">free homepage design</a> before committing to a full build.\
          </p>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">How we help you outrank competitors</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              Most competitors have thin pages with generic copy. We build depth: service-led structure, local relevance, proof/case studies, and a conversion flow that feels premium.\
              That combination improves both rankings (better topical coverage) and enquiries (better clarity).\
            </p>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">PROCESS</p>\
          <h2 class=\"h2\">From first call to launch (what to expect)</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            We keep the process simple: we clarify the offer, map the pages to search intent, design a homepage that sells the value, then build fast and launch with clean technical SEO.\
            If you’re in Epping, Essex or London (including Loughton, Harlow and Chigwell), we can also tailor content to local intent without making the page read like a robot wrote it.\
          </p>\
          <ol class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Strategy:</strong> goals, audience, what you need to rank for, and what “conversion” means for you.</li>\
            <li><strong>Structure:</strong> homepage + service pages + proof blocks + internal linking plan.</li>\
            <li><strong>Design:</strong> homepage concept (or start with a FREE homepage design to de-risk).</li>\
            <li><strong>Build:</strong> lightweight code, mobile-first UX, performance and accessibility checks.</li>\
            <li><strong>Launch:</strong> metadata, schema, sitemap, and a clean baseline for ongoing SEO growth.</li>\
          </ol>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">FAQ</p>\
          <h2 class=\"h2\">Services: quick answers</h2>\
          <div class=\"faq\" style=\"margin-top:14px;\">\
            <details class=\"faq-item\"><summary>Do you offer fixed pricing?</summary><p>Yes where scope is clear. Most website projects start from <strong>£895</strong> depending on pages and features.</p></details>\
            <details class=\"faq-item\"><summary>Can you work with our existing branding?</summary><p>Yes. We can build within your existing branding, keeping it recognisably yours while upgrading structure and conversion flow.</p></details>\
            <details class=\"faq-item\"><summary>Do you help with SEO?</summary><p>Yes. Every build includes on-page fundamentals: titles/descriptions, heading hierarchy, internal linking, schema, and performance. Ongoing SEO content can be supported via the monthly plan.</p></details>\
            <details class=\"faq-item\"><summary>What areas do you cover?</summary><p>We’re based in Epping (Essex) and support London too — including nearby areas like Loughton, Harlow and Chigwell.</p></details>\
          </div>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="contact.html")}
{MARKER_END}
"""


def _webdev_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">OUTCOMES</p>\
          <h2 class=\"h2\">Web development built for SEO and conversion</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Development is where performance, UX and SEO meet. A technically clean site loads faster, crawls better, and feels more trustworthy — which is exactly what helps you win clicks and enquiries.\
            We build in Epping (Essex) and support clients across London too, including Loughton, Harlow and Chigwell.\
          </p>\

          <p class=\"sub\" style=\"max-width:95ch;\">\
            If you’re rebuilding an existing site, we can preserve what’s working (URL structure, on-page metadata, key pages) while upgrading design system, performance and conversion flow.\
            The aim is to improve quality without risking the rankings you’ve already earned.\
          </p>\

          <p class=\"sub\" style=\"max-width:95ch;\">\
            We also build with future growth in mind: adding a new service or a new location page shouldn’t require a redesign.\
            The system stays consistent so your SEO footprint can expand cleanly over time.\
          </p>\

          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Speed-first:</strong> lightweight HTML/CSS/JS with lazy-loading where appropriate.</li>\
            <li><strong>SEO-first:</strong> clean headings, metadata, internal linking and schema.</li>\
            <li><strong>Conversion-first:</strong> clear next steps, proof blocks, and CTA placement that matches intent.</li>\
            <li><strong>Scalable:</strong> structured components so you can add pages without breaking consistency.</li>\
          </ul>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Pricing anchor</h3>\
            <p class=\"muted\" style=\"margin:0;\">Most website projects start from <strong>£895</strong> depending on scope. If you want to see direction first, request a <strong>FREE homepage design</strong>.</p>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Typical deliverables</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              SEO-ready page structure, metadata, schema, internal linking, mobile UX, and a build that’s easy to extend with new services/locations as you grow.\
              If you want ongoing iteration, the <a href=\"/monthly-web-development.html\">monthly web development plan</a> keeps improvements moving.\
            </p>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">FAQ</p>\
          <h2 class=\"h2\">Web development: common questions</h2>\
          <div class=\"faq\" style=\"margin-top:14px;\">\
            <details class=\"faq-item\"><summary>Can you rebuild my site without losing rankings?</summary><p>Yes. We keep important URLs where possible, preserve/improve metadata and structure, and plan redirects if anything changes.</p></details>\
            <details class=\"faq-item\"><summary>Do you build service pages for SEO?</summary><p>Yes. Service-led structure is one of the strongest long-term SEO assets and it usually converts better than generic pages.</p></details>\
            <details class=\"faq-item\"><summary>Will the site be fast on mobile?</summary><p>Yes. We keep the build lightweight, lazy-load non-critical images, and avoid heavy dependencies.</p></details>\
            <details class=\"faq-item\"><summary>Where are you based?</summary><p>Epping, Essex — serving London too, including Loughton, Harlow and Chigwell.</p></details>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">BEST PRACTICE</p>\
          <h2 class=\"h2\">What “good” looks like (technical + UX)</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            A website that ranks and converts is usually boring under the hood: clean HTML structure, sensible script loading, predictable navigation, and content that matches intent.\
            We focus on that foundation so the design can stay premium while the site stays fast and crawlable.\
          </p>\
          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Mobile-first:</strong> no horizontal overflow, touch-friendly UI, readable typography.</li>\
            <li><strong>Performance-first:</strong> lazy-loading, async decoding, and keeping assets lean.</li>\
            <li><strong>SEO-first:</strong> one H1, supportive H2/H3s, internal linking, schema and canonicals.</li>\
            <li><strong>CRO-first:</strong> clear next steps, strong hooks, proof, and friction-reducing forms.</li>\
          </ul>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="contact.html")}
{MARKER_END}
"""


def _contact_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">BEFORE YOU HIT SEND</p>\
          <h2 class=\"h2\">What to include for a fast, accurate quote</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            The more specific you are, the faster we can give you a clean fixed quote. If you’re not sure, that’s fine — share what you know and we’ll guide the rest.\
            We’re based in <strong>Epping</strong>, serving <strong>Essex</strong> and <strong>London</strong>, including <strong>Loughton</strong>, <strong>Harlow</strong> and <strong>Chigwell</strong>.\
          </p>\

          <p class=\"sub\" style=\"max-width:95ch;\">\
            If you have an existing site, include the URL and tell us what’s not working (low enquiries, poor rankings, slow mobile load, unclear messaging).\
            If you’re starting from scratch, share your services and any competitors you want to beat — we’ll recommend a structure that targets the right keywords.\
          </p>\

          <div class=\"grid\" style=\"grid-template-columns: repeat(3, 1fr); gap:14px; margin-top:14px;\">\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Pages</h3>\
              <p class=\"muted\" style=\"margin:0;\">Homepage + services + about + contact are common. Mention anything special (landing pages, blog, case studies).</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Goals</h3>\
              <p class=\"muted\" style=\"margin:0;\">More calls? More form submissions? Better Google rankings? Tell us the primary outcome.</p>\
            </div>\
            <div class=\"card\" style=\"padding:16px;\">\
              <h3 style=\"margin:0 0 6px;\">Examples</h3>\
              <p class=\"muted\" style=\"margin:0;\">Share 1–3 sites you like (or dislike). It speeds up design alignment massively.</p>\
            </div>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Pricing anchor</h3>\
            <p class=\"muted\" style=\"margin:0;\">Most website builds start from <strong>£895</strong> depending on scope. If you want to reduce risk, request a <a href=\"/free-homepage-design.html\">FREE homepage design</a> first.</p>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Fast response expectations</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              We’ll reply with clear next steps and either: (1) a fixed quote, or (2) a short set of follow-up questions if scope is still unclear.\
              If timing is urgent, mention it — we can prioritise a fast first draft homepage or landing page.\
            </p>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">PROJECT TYPES</p>\
          <h2 class=\"h2\">What we can help you with</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Whether you need a full website, a conversion-first landing page, or ongoing improvements, the goal is the same:\
            clearer messaging, better structure for SEO, and a smoother conversion path.\
          </p>\
          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>New websites:</strong> designed to convert and built to rank.</li>\
            <li><strong>Rebuilds:</strong> modernise design and performance while protecting SEO.</li>\
            <li><strong>SEO landing pages:</strong> service pages + local pages for Epping/Essex/London coverage.</li>\
            <li><strong>Monthly improvements:</strong> iterate content, UX and performance consistently.</li>\
            <li><strong>Hosting & care:</strong> keep everything stable, fast and clean.</li>\
          </ul>\
          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Why choose Plot Perfect Studios?</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              We focus on the fundamentals that move the needle: intent-led structure, performance, trust signals and CTA clarity.\
              That means the site looks premium <em>and</em> does a job — generating enquiries.\
            </p>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">SEND THIS</p>\
          <h2 class=\"h2\">What to include in your message (for a faster quote)</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            If you include the details below, we can usually respond with a clear quote or a short set of clarifying questions.\
            If you’re unsure, send what you have — we can help shape the scope.\
          </p>\
          <ul class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Your services:</strong> what you sell, what you want to be known for, and your best margin offers.</li>\
            <li><strong>Your locations:</strong> where you want enquiries (Epping, Essex, London, plus nearby areas like Loughton, Harlow, Chigwell).</li>\
            <li><strong>Competitors:</strong> 2–3 competitors you want to beat (or websites you like).</li>\
            <li><strong>Pages:</strong> what you think you need (we’ll advise on what will actually rank).</li>\
            <li><strong>Deadline:</strong> if you have a launch date, tell us early.</li>\
          </ul>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">HOW QUOTING WORKS</p>\
          <h2 class=\"h2\">How we scope and quote websites</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            We keep this commercial and simple. We’ll identify the pages required to rank (services + location coverage), the proof needed to build trust (work/case studies),\
            and the conversion path (what the visitor does next). Then we price based on scope and complexity — not vague hourly guessing.\
          </p>\
          <ol class=\"ticks\" style=\"margin-top:14px;\">\
            <li><strong>Baseline:</strong> number of pages + content depth (800–1200 words where it matters).</li>\
            <li><strong>Functionality:</strong> forms, booking, integrations, portals, or automation.</li>\
            <li><strong>SEO structure:</strong> internal linking and schema plan across services and locations.</li>\
            <li><strong>Timeline:</strong> planned launch date and feedback turnaround.</li>\
          </ol>\
          <div style=\"display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;\">\
            <a class=\"btn ghost\" href=\"/services.html\">Services Overview</a>\
            <a class=\"btn ghost\" href=\"/web-development.html\">Web Development</a>\
            <a class=\"btn ghost\" href=\"/work/index.html\">Work Portfolio</a>\
          </div>\
        </div>\
      </div>\
    </section>\

    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">FAQ</p>\
          <h2 class=\"h2\">Quote requests: quick answers</h2>\
          <div class=\"faq\" style=\"margin-top:14px;\">\
            <details class=\"faq-item\"><summary>Do you offer a free homepage design?</summary><p>Yes. It’s a low-risk way to see design direction and messaging before committing to a full build.</p></details>\
            <details class=\"faq-item\"><summary>What does “from £895” include?</summary><p>It’s a pricing anchor for smaller builds. Final cost depends on pages, content depth, features and integrations — we’ll quote clearly.</p></details>\
            <details class=\"faq-item\"><summary>Can you help if we’re not in Epping?</summary><p>Yes. We serve Essex and London remotely and on-site when needed, including Loughton, Harlow and Chigwell.</p></details>\
            <details class=\"faq-item\"><summary>Do you write the website copy?</summary><p>Yes — we help structure and expand content so it matches search intent and supports conversion, without changing your brand tone.</p></details>\
          </div>\
        </div>\
      </div>\
    </section>\
{MARKER_END}
"""


def _free_homepage_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">FREE HOMEPAGE DESIGN</p>\
          <h2 class=\"h2\">See the design direction before you commit</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            This is a risk-free way to validate layout, messaging and style. We’ll create a homepage concept that reflects your offer and audience,\
            then you decide whether to move forward with a full build.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            We’re based in <strong>Epping</strong> (Essex) and support clients across <strong>London</strong> too — including nearby areas like <strong>Loughton</strong>, <strong>Harlow</strong> and <strong>Chigwell</strong>.\
            If local relevance matters for your rankings, we’ll structure the homepage to support it naturally.\
          </p>\

          <div class=\"grid\" style=\"grid-template-columns: repeat(3, 1fr); gap:14px; margin-top:14px;\">\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">Messaging</h3><p class=\"muted\" style=\"margin:0;\">Clear value prop, service positioning and CTA direction.</p></div>\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">Layout</h3><p class=\"muted\" style=\"margin:0;\">Section flow that builds trust and guides decisions.</p></div>\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">Conversion</h3><p class=\"muted\" style=\"margin:0;\">CTA placement and proof blocks that increase enquiries.</p></div>\
          </div>\

          <h3 style=\"margin:18px 0 6px;\">How it works</h3>\
          <ol class=\"ticks\" style=\"margin:0;\">\
            <li>You send a short description of your business and what you want the site to achieve.</li>\
            <li>We create a homepage concept focused on clarity, trust and a clean next step.</li>\
            <li>If you love it, we can build the full site — projects typically start from <strong>£895</strong> depending on scope.</li>\
          </ol>\

          <h3 style=\"margin:18px 0 6px;\">What you get</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>A conversion-led homepage layout with the right section order.</li>\
            <li>Suggested headline and subheadline options that match what people search for.</li>\
            <li>CTA direction (contact, quote request, booking, or enquiry form).</li>\
            <li>Guidance on service page structure if you want to grow SEO in Essex/London.</li>\
          </ul>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Ideal for</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              Startups, local service businesses, and established brands that want a premium homepage that converts — without wasting budget on the wrong direction.\
            </p>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">FAQ</h3>\
            <div class=\"faq\" style=\"margin-top:12px;\">\
              <details class=\"faq-item\"><summary>Is it really free?</summary><p>Yes — it’s designed to let you see direction and messaging before you commit to a full build.</p></details>\
              <details class=\"faq-item\"><summary>What do you need from me?</summary><p>Your services, target customers, location coverage (e.g. Epping/Essex/London), and 1–3 example sites you like.</p></details>\
              <details class=\"faq-item\"><summary>Will it be SEO-friendly?</summary><p>Yes. We structure the homepage with clear headings, intent-led sections and a conversion path that supports SEO and CRO.</p></details>\
              <details class=\"faq-item\"><summary>Can you build the full site after?</summary><p>Absolutely — that’s the point. If it’s a fit, we expand into service pages, local pages and a full conversion-led site.</p></details>\
            </div>\
          </div>\

          <div style=\"display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;\">\
            <a class=\"btn primary\" href=\"/contact.html\">Request Your Free Homepage Design</a>\
            <a class=\"btn ghost\" href=\"/work/index.html\">See Work</a>\
            <a class=\"btn ghost\" href=\"/services.html\">See Services</a>\
          </div>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="/contact.html")}
{MARKER_END}
"""


def _monthly_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">MONTHLY</p>\
          <h2 class=\"h2\">Monthly web development that compounds SEO and conversion</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Monthly development is ideal when you want a site that keeps getting better: more content depth, more landing pages, improved CTAs, and ongoing technical cleanup.\
            It’s also one of the easiest ways to outpace competitors, because most sites stay static after launch.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Based in <strong>Epping</strong> (Essex), serving <strong>London</strong> too — including <strong>Loughton</strong>, <strong>Harlow</strong> and <strong>Chigwell</strong>.\
          </p>\

          <h3 style=\"margin:18px 0 6px;\">What you can request</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>New service pages and location pages (e.g. Epping/Essex/London coverage).</li>\
            <li>Conversion upgrades: stronger hooks, proof blocks, CTA placement and section flow.</li>\
            <li>Performance improvements: image optimisation suggestions, lazy-loading, script trimming.</li>\
            <li>Content expansion: turning thin pages into 800–1200 word assets that rank.</li>\
            <li>Technical fixes and quality-of-life improvements.</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">How monthly work runs</h3>\
          <ol class=\"ticks\" style=\"margin:0;\">\
            <li>We agree a priority list (SEO pages, conversion upgrades, performance fixes).</li>\
            <li>Work is shipped in small batches so you see progress quickly.</li>\
            <li>We measure what changed (more clicks, clearer conversions, better mobile UX).</li>\
          </ol>\

          <h3 style=\"margin:18px 0 6px;\">Examples of monthly sprints</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li><strong>Sprint A:</strong> expand Services to 1,000+ words + add FAQs + add internal links to location pages.</li>\
            <li><strong>Sprint B:</strong> create Epping/Essex/London landing pages + tighten metadata + add schema.</li>\
            <li><strong>Sprint C:</strong> improve mobile UX + reduce script cost + speed up images.</li>\
          </ul>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">FAQ</h3>\
            <div class=\"faq\" style=\"margin-top:12px;\">\
              <details class=\"faq-item\"><summary>Is this only for big sites?</summary><p>No. Monthly is great for smaller sites because it creates momentum: more pages, better structure and better conversion over time.</p></details>\
              <details class=\"faq-item\"><summary>Can we pause?</summary><p>Yes. If you’ve hit a milestone, you can pause and restart later.</p></details>\
              <details class=\"faq-item\"><summary>Will this help SEO?</summary><p>Yes — consistent content depth + internal linking + technical hygiene is one of the most reliable long-term SEO approaches.</p></details>\
            </div>\
          </div>\

          <p class=\"sub\" style=\"max-width:95ch; margin-top:14px;\">\
            If you’re actively targeting local search in Epping/Essex/London, monthly iteration is often the fastest path to outranking competitors\
            because you can keep expanding content and internal linking while keeping quality high.\
          </p>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Why monthly beats “one big redesign”</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              Search and conversion results usually come from consistency, not a single launch day.\
              Monthly lets you keep building topical coverage (services + locations + FAQs), refine messaging based on real enquiries,\
              and steadily improve performance. It’s the simplest way to make your site a long-term asset.
            </p>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Best for</h3>\
            <p class=\"muted\" style=\"margin:0;\">Businesses that want consistent growth improvements without re-scoping a new project every time.</p>\
          </div>\

          <h3 style=\"margin:18px 0 6px;\">What success looks like (first 60–90 days)</h3>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Early wins are usually clarity and momentum: stronger positioning, more pages targeting specific intent, and a site that feels easier to use on mobile.\
            For local businesses competing across Essex and London, that compounded work tends to outperform one-off “launch and hope” projects.\
          </p>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>More rankable pages (services + locations + FAQs) built with consistent quality.</li>\
            <li>Better leads because the homepage and service pages filter the right prospects.</li>\
            <li>Incremental performance and UX improvements that reduce bounce and improve enquiry rate.</li>\
          </ul>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="/contact.html")}
{MARKER_END}
"""


def _hosting_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">HOSTING</p>\
          <h2 class=\"h2\">Hosting and care that keeps your site fast, stable, and secure</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Hosting impacts speed, uptime, and long-term site quality. If you’re targeting local searches around Epping, Essex and London,\
            performance and stability can be the difference between a visitor who stays and a visitor who bounces.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            We’re based in Epping (Essex) and support London too, including Loughton, Harlow and Chigwell.\
          </p>\

          <h3 style=\"margin:18px 0 6px;\">What’s included (typical)</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>Performance monitoring and simple optimisations (asset guidance, caching strategy, Core Web Vitals focus).</li>\
            <li>Security basics and maintenance to reduce risk and downtime.</li>\
            <li>Support for updates and small improvements (or switch to the monthly development plan for larger ongoing work).</li>\
            <li>Technical SEO hygiene: keeping redirects, canonicals and sitemap clean as you grow.</li>\
          </ul>\

          <div class=\"grid\" style=\"grid-template-columns: repeat(3, 1fr); gap:14px; margin-top:14px;\">\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">Speed</h3><p class=\"muted\" style=\"margin:0;\">Delivery that supports Core Web Vitals and fast mobile experiences.</p></div>\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">Stability</h3><p class=\"muted\" style=\"margin:0;\">Reliable uptime and fewer “mystery issues” from neglected setups.</p></div>\
            <div class=\"card\" style=\"padding:16px;\"><h3 style=\"margin:0 0 6px;\">SEO hygiene</h3><p class=\"muted\" style=\"margin:0;\">Clean canonicals, redirects, and a sitemap that stays correct as you grow.</p></div>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">FAQ</h3>\
            <div class=\"faq\" style=\"margin-top:12px;\">\
              <details class=\"faq-item\"><summary>Can you migrate our site?</summary><p>Yes. We can migrate hosting carefully so performance and SEO hygiene remain intact.</p></details>\
              <details class=\"faq-item\"><summary>Do you also do updates?</summary><p>Yes. Light maintenance can be included, or you can use the monthly development plan for ongoing improvements.</p></details>\
              <details class=\"faq-item\"><summary>Will hosting improve rankings?</summary><p>It supports rankings indirectly by improving speed and reducing downtime — both influence user signals and crawl efficiency.</p></details>\
            </div>\
          </div>\

          <h3 style=\"margin:18px 0 6px;\">A simple hosting checklist</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>Fast delivery and sensible caching to support mobile speed.</li>\
            <li>Stable deployments so your pages don’t randomly change or break.</li>\
            <li>Clean redirects and canonicals (especially important when standardising to www).</li>\
            <li>Room to grow: adding pages and assets without turning the site slow.</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Migration process (simple and safe)</h3>\
          <ol class=\"ticks\" style=\"margin:0;\">\
            <li>Review current setup and identify risks (DNS, email, redirects, analytics).</li>\
            <li>Plan the move to minimise downtime and keep URLs consistent.</li>\
            <li>Verify the basics after: canonicals, sitemap, performance and form delivery.</li>\
          </ol>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Best for</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              Businesses that want peace of mind: stable uptime, consistent speed, and clean technical SEO while you focus on running the company.\
            </p>\
          </div>\

          <h3 style=\"margin:18px 0 6px;\">What you’ll notice after a clean hosting setup</h3>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Good hosting is invisible — and that’s the point. Pages load quickly on mobile, forms deliver reliably, and you don’t lose time chasing random technical issues.\
            For SEO, stability matters: search engines can crawl consistently, and users are less likely to bounce from slow pages.\
          </p>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>Faster page loads and a smoother mobile experience.</li>\
            <li>Fewer “site is down” moments and fewer hidden errors.</li>\
            <li>Cleaner technical SEO signals (redirects, canonicals, and sitemap consistency).</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Optional add-ons</h3>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            If you want more than baseline hosting, we can also support content and performance work so the site keeps improving.
          </p>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>New landing pages for services and locations.</li>\
            <li>Conversion improvements (better CTAs, proof blocks, and page flow).</li>\
            <li>Ongoing performance tuning as you add more content and media.</li>\
          </ul>\

          <p class=\"sub\" style=\"max-width:95ch; margin-top:14px;\">\
            If you also want regular improvements (new pages, conversion tweaks, technical upgrades), combine hosting with the\
            <a href=\"/monthly-web-development.html\">monthly web development plan</a>.\
          </p>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="/contact.html")}
{MARKER_END}
"""


def _wraps_expansion() -> str:
    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">VEHICLE WRAPS</p>\
          <h2 class=\"h2\">Vehicle wrap design that communicates in seconds</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            A wrap is a moving landing page. People see it for a moment — so hierarchy, contrast and spacing matter more than “artwork”.\
            We build layouts that make the business name, service and contact details easy to spot at speed.\
          </p>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            Local business? We’re based in Epping (Essex), serving London too — including Loughton, Harlow and Chigwell.\
          </p>\

          <h3 style=\"margin:18px 0 6px;\">Design principles we prioritise</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li><strong>Legibility:</strong> clear type scale and spacing so it reads at a glance.</li>\
            <li><strong>Brand consistency:</strong> colours and layout that match your website and signage.</li>\
            <li><strong>Contact clarity:</strong> URL/phone positioned for fast recall.</li>\
            <li><strong>Balance:</strong> premium negative space rather than clutter.</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Process</h3>\
          <ol class=\"ticks\" style=\"margin:0;\">\
            <li><strong>Brief:</strong> what you do, who you want to attract, and what the wrap must communicate.</li>\
            <li><strong>Layout:</strong> multiple concept directions focused on legibility and hierarchy.</li>\
            <li><strong>Refine:</strong> polish the winning concept so it looks premium and prints cleanly.</li>\
          </ol>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">Deliverables</h3>\
            <p class=\"muted\" style=\"margin:0;\">\
              Final artwork is prepared with print in mind: clean alignment, safe margins, and a layout that stays readable on real vehicles.\
              If you have an installer or print house, we can work to their preferred file specs.\
            </p>\
          </div>\

          <div class=\"card\" style=\"padding:16px; margin-top:14px;\">\
            <h3 style=\"margin:0 0 6px;\">FAQ</h3>\
            <div class=\"faq\" style=\"margin-top:12px;\">\
              <details class=\"faq-item\"><summary>Can you match our website branding?</summary><p>Yes — consistent branding across website, wraps and signage increases trust and recognition.</p></details>\
              <details class=\"faq-item\"><summary>Will it be readable at speed?</summary><p>That’s the priority. We design for legibility first: hierarchy, contrast, spacing and short message length.</p></details>\
              <details class=\"faq-item\"><summary>Do you do logo tweaks?</summary><p>Minor refinements are possible if needed for print clarity and layout balance.</p></details>\
            </div>\
          </div>\

          <h3 style=\"margin:18px 0 6px;\">What to send us</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>Your logo files (if available) and brand colours.</li>\
            <li>Photos or examples of wraps you like (style direction).</li>\
            <li>Exact service list and the single most important message.</li>\
            <li>Website/phone number you want featured (and any must-have legal text).</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Common mistakes we avoid</h3>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li>Too much text and not enough hierarchy.</li>\
            <li>Low contrast colour combos that disappear on the road.</li>\
            <li>Contact details placed where they’re hard to see.</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Wrap copy that converts</h3>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            The best wraps usually say less. A short service phrase + a local cue + a single contact point beats paragraphs of text.\
            If you work locally (Epping/Essex/London), a subtle location cue can improve recall without cluttering the design.\
          </p>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li><strong>Service clarity:</strong> what you do in 3–6 words.</li>\
            <li><strong>Trust cue:</strong> rating, years trading, or a single proof line.</li>\
            <li><strong>Contact:</strong> URL or phone that’s easy to remember.</li>\
          </ul>\

          <h3 style=\"margin:18px 0 6px;\">Layout zones (where things go)</h3>\
          <p class=\"sub\" style=\"max-width:95ch;\">\
            A great wrap uses the vehicle’s shape instead of fighting it. We plan zones so your name and service read cleanly from the sides,\
            while contact details sit where people naturally look.
          </p>\
          <ul class=\"ticks\" style=\"margin:0;\">\
            <li><strong>Sides:</strong> primary message + service + URL (most visibility).</li>\
            <li><strong>Rear:</strong> the clearest contact point for traffic behind you.</li>\
            <li><strong>Front:</strong> light branding only (keep it clean).</li>\
          </ul>\

          <p class=\"sub\" style=\"max-width:95ch; margin-top:14px;\">\
            Want a quote for wrap design? Use the contact form and tell us the vehicle type, the service, and the one key message you want remembered.\
          </p>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="/contact.html")}
{MARKER_END}
"""


def _simple_expansion(kind: str) -> str:
    if kind == "free-homepage":
        title = "Free homepage design: what you get"
        body = (
            "This is a risk-free way to see design direction, messaging and layout before you commit. "
            "We’ll design a homepage concept that reflects your offer and your audience — then you can decide if you want the full build. "
            "We’re based in Epping, Essex and work with London businesses too, including Loughton, Harlow and Chigwell."
        )
    elif kind == "monthly":
        title = "Monthly web development: ideal for growth"
        body = (
        "Monthly development works best when you want consistent improvements: new sections, conversion experiments, landing pages, content updates and technical fixes. "
        "It’s also the fastest way to compound SEO — small upgrades every month add up. Based in Epping (Essex), serving London too. "
        "Typical monthly wins include: improving CTA placement, expanding service pages, adding new location pages, tightening copy for higher conversion, and iterating on performance."
        )
    elif kind == "hosting":
        title = "Hosting that supports Core Web Vitals"
        body = (
            "Hosting isn’t just storage — it impacts speed, stability and uptime. We focus on fast delivery, security basics and monitoring so your site stays reliable. "
        "If you’re targeting Epping/Essex/London searches, performance can be the difference between page 1 and page 2. "
        "We’ll also help you keep assets lean (images, scripts) and keep content structured so new pages don’t degrade site quality over time."
        )
    elif kind == "wraps":
        title = "Vehicle wrap designs that look premium on the road"
        body = (
            "Wrap design is about clarity at speed: hierarchy, contrast, and a layout that communicates what you do in seconds. "
        "If you’re a local business around Epping, Essex or London (including Loughton, Harlow and Chigwell), a strong wrap can drive brand recall and inbound calls. "
        "We focus on legibility, brand consistency, and layouts that make the phone number / URL effortless to spot."
        )
    else:
        title = "More detail"
        body = "More information coming soon."

    return f"""
{MARKER_START}
    <section class=\"section\" style=\"padding-top:0;\">\
      <div class=\"container\">\
        <div class=\"card reveal\" style=\"padding:18px;\">\
          <p class=\"eyebrow\">DETAILS</p>\
          <h2 class=\"h2\">{title}</h2>\
          <p class=\"sub\" style=\"max-width:95ch;\">{body}</p>\

          <div style=\"display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;\">\
            <a class=\"btn primary\" href=\"contact.html\">Request a Quote</a>\
            <a class=\"btn ghost\" href=\"services.html\">See Services</a>\
            <a class=\"btn ghost\" href=\"/work/index.html\">View Work</a>\
          </div>\
        </div>\
      </div>\
    </section>\

{_cta_block(primary_href="contact.html")}
{MARKER_END}
"""


def build_block(target: Target) -> str:
    if target.kind == "location" and target.area_label:
        return _location_expansion(target.area_label)
    if target.kind == "services":
        return _services_expansion()
    if target.kind == "webdev":
        return _webdev_expansion()
    if target.kind == "contact":
        return _contact_expansion()
    if target.kind == "free-homepage":
      return _free_homepage_expansion()
    if target.kind == "monthly":
      return _monthly_expansion()
    if target.kind == "hosting":
      return _hosting_expansion()
    if target.kind == "wraps":
      return _wraps_expansion()
    return _simple_expansion(target.kind)


def main() -> None:
    changed: list[str] = []
    for t in TARGETS:
        path = ROOT / t.rel
        if not path.exists():
            continue
        html = path.read_text(encoding="utf-8", errors="ignore")
        block = build_block(t)
        updated = _insert_before_closing_main(html, block)
        if updated != html:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append(t.rel)

    print(f"Expanded pages: {len(changed)}")
    for rel in changed:
        print(f"- {rel}")


if __name__ == "__main__":
    main()
