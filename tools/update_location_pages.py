from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]

PAGES = {
    "web-design-hertfordshire.html": {
        "county": "Hertfordshire",
        "coverage": """          <p class="eyebrow">HOW WE WORK</p>
          <h2 class="h2">Remote web design for Hertfordshire businesses</h2>
          <p class="sub" style="max-width:92ch;">
            Projects are planned and delivered remotely from our Epping studio using scheduled video calls, email and shared feedback. If an in-person requirement matters to the project, it is agreed during scoping rather than assumed.
          </p>
          <ul class="ticks" style="margin-top:14px;">
            <li>A named scope, fixed price and agreed milestones before the build starts</li>
            <li>Service-led page planning for the customers and locations you genuinely serve</li>
            <li>Responsive development, enquiry forms, metadata, schema and sitemap setup</li>
            <li>A handover path for future services, locations and content</li>
          </ul>""",
        "expansion": """    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px;">
        <p class="eyebrow">SCOPE &amp; DELIVERY</p>
        <h2 class="h2">A practical route from brief to launch</h2>
        <p class="sub" style="max-width:95ch;">We start with the commercial goal, the services to prioritise and the evidence available. From there we map the pages, write or shape the key messages, build the responsive interface and complete the technical launch checks. Simple sites typically take 2–3 weeks; larger scopes are phased.</p>
        <p class="sub" style="max-width:95ch;">Website projects typically start from <strong>£895</strong>. The final quote depends on page count, content support and integrations, and is fixed before work begins.</p>
      </div></div>
    </section>
    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px;">
        <p class="eyebrow">RELEVANT PROOF</p>
        <h2 class="h2">Review the work, not a made-up local claim</h2>
        <p class="sub" style="max-width:95ch;">Our portfolio shows the kind of structure, visual systems and build work we deliver. It does not imply that every featured client is based in Hertfordshire.</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;"><a class="btn ghost" href="/work/index.html">View all work</a><a class="btn ghost" href="/work/bark-lane-daycare.html">Bark Lane case study</a><a class="btn ghost" href="/work/ewing-law.html">Ewing Law case study</a></div>
      </div></div>
    </section>
    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
        <div><p class="eyebrow" style="margin-bottom:6px;">NEXT STEP</p><h2 class="h2" style="margin:0;">See a homepage direction before committing</h2><p class="sub" style="margin:10px 0 0; max-width:80ch;">Tell us what the site needs to achieve. We can prepare a free homepage design so you can assess the direction before choosing a full build.</p></div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;"><a class="btn primary" href="/free-homepage-design.html">Request a Free Homepage Design</a><a class="btn ghost" href="/contact.html">Discuss Your Project</a></div>
      </div></div>
    </section>
""",
    },
    "web-design-kent.html": {
        "county": "Kent",
        "coverage": """          <p class="eyebrow">HOW WE WORK</p>
          <h2 class="h2">Remote website delivery for Kent businesses</h2>
          <p class="sub" style="max-width:92ch;">
            We run Kent projects remotely from Epping, with scheduled calls, written decisions and shared feedback keeping the work moving without unnecessary travel. Any on-site requirement is discussed and priced during scoping.
          </p>
          <ul class="ticks" style="margin-top:14px;">
            <li>Page and navigation planning around the services customers are choosing</li>
            <li>Mobile-first interfaces with clear calls to action and enquiry routes</li>
            <li>Hand-coded development with metadata, structured data and sitemap checks</li>
            <li>Fixed scope and milestones, with room to add genuine service areas later</li>
          </ul>""",
        "expansion": """    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px;">
        <p class="eyebrow">FOR KENT SERVICE BUSINESSES</p>
        <h2 class="h2">Build around the enquiry, not a list of town names</h2>
        <p class="sub" style="max-width:95ch;">For businesses covering several Kent areas, we first establish which services, customer questions and proof deserve their own pages. Location content is added only where the business genuinely operates and can offer useful, distinct information.</p>
        <p class="sub" style="max-width:95ch;">The build can include service pages, project examples, enquiry forms and a content structure that remains manageable as the business grows.</p>
      </div></div>
    </section>
    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px;">
        <p class="eyebrow">COST &amp; EVIDENCE</p>
        <h2 class="h2">Clear scope before development starts</h2>
        <p class="sub" style="max-width:95ch;">Projects typically start from <strong>£895</strong>, with the price shaped by page count, content support and functionality. You receive a fixed quote before committing. Our portfolio is the best place to assess the work; featured projects are examples of capability and are not presented as Kent clients unless stated.</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:14px;"><a class="btn ghost" href="/work/index.html">View all work</a><a class="btn ghost" href="/work/f7-coaching.html">F7 Coaching case study</a><a class="btn ghost" href="/work/cre8-london.html">Cre8 London case study</a></div>
      </div></div>
    </section>
    <section class="section" style="padding-top:0;">
      <div class="container"><div class="card reveal" style="padding:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
        <div><p class="eyebrow" style="margin-bottom:6px;">START WITH THE BRIEF</p><h2 class="h2" style="margin:0;">Test the homepage direction first</h2><p class="sub" style="margin:10px 0 0; max-width:80ch;">Share the offer, audience and current bottleneck. We can create a free homepage design before you decide whether to proceed with the full website.</p></div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;"><a class="btn primary" href="/free-homepage-design.html">Request a Free Homepage Design</a><a class="btn ghost" href="/contact.html">Discuss Your Project</a></div>
      </div></div>
    </section>
""",
    },
}


for filename, data in PAGES.items():
    path = ROOT / filename
    html = path.read_text(encoding="utf-8")
    coverage_pattern = re.compile(
        r'          <p class="eyebrow">(?:COVERAGE|AROUND KENT)</p>.*?</ul>', re.DOTALL
    )
    html, coverage_count = coverage_pattern.subn(data["coverage"], html, count=1)
    start = "<!-- PPS:SEO-EXPANSION:START -->"
    end = "<!-- PPS:SEO-EXPANSION:END -->"
    before, remainder = html.split(start, 1)
    _, after = remainder.split(end, 1)
    html = before + start + "\n" + data["expansion"] + end + after
    if coverage_count == 0 and data["coverage"].strip() not in html:
        raise RuntimeError(f"Coverage block not found in {filename}")
    path.write_text(html, encoding="utf-8", newline="")
    print(filename)
