from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


WWW_BASE = "https://www.plotperfectstudios.co.uk"
NON_WWW_BASE = "https://plotperfectstudios.co.uk"

BUSINESS_NAME = "Plot Perfect Studios"
BUSINESS_LEGAL_NAME = "Plot Perfect Studios Ltd"


@dataclass(frozen=True)
class Meta:
    title: str
    description: str


META_BY_PATH: dict[str, Meta] = {
    "index.html": Meta(
        title="Web Design Epping | Custom Sites from £895 + FREE Homepage Design",
        description=(
            "Stop losing leads to slow templates. Get a hand-coded website built to rank and convert in Epping, Essex & London. "
            "Projects from £895 — start with a FREE homepage design (no risk)."
        ),
    ),
    "services.html": Meta(
        title="Web Design Services Epping | Hand-Coded Sites from £895 (No Templates)",
        description=(
            "Web design + development built to rank and generate enquiries. Hand-coded (not WordPress), fast on mobile, SEO-first structure. "
            "From £895 + FREE homepage design."
        ),
    ),
    "contact.html": Meta(
        title="Get a Website Quote | Epping, Essex & London | From £895",
        description=(
            "Tell us what you need and get a clear fixed quote. Hand-coded, SEO-first websites built to generate leads — from £895. "
            "Want zero-risk? Ask for a FREE homepage design first."
        ),
    ),
    "web-development.html": Meta(
        title="Web Development (Epping/Essex/London) | Faster Than WordPress from £895",
        description=(
            "Custom web development that loads fast, ranks stronger and converts better than template builds. From £895 + FREE homepage design. "
            "Get a quote and see recent work."
        ),
    ),
    "web-design-epping.html": Meta(
        title="Web Design Epping | Built to Rank + Convert from £895 (+ Free Homepage Design)",
        description=(
            "Local Epping web design without templates or WordPress bloat. Hand-coded for speed, SEO and enquiries. "
            "From £895 — start with a FREE homepage design."
        ),
    ),
    "web-design-essex.html": Meta(
        title="Web Design Essex | Hand-Coded Sites from £895 (+ Free Homepage Design)",
        description=(
            "Bespoke web design across Essex (incl. Epping) built to generate enquiries. Hand-coded (not templates), fast on mobile, SEO-first structure. "
            "From £895 + FREE homepage design."
        ),
    ),
    "web-design-london.html": Meta(
        title="Web Design London | Built to Convert from £895 (+ Free Homepage Design)",
        description=(
            "London web design without WordPress bloat. Hand-coded sites that load fast, rank cleaner and turn traffic into enquiries. "
            "From £895 — start with a FREE homepage design."
        ),
    ),
    "web-design-hertfordshire.html": Meta(
        title="Web Design Hertfordshire | Hand-Coded Sites from £895 (+ Free Homepage Design)",
        description=(
            "Web design for Hertfordshire businesses built to rank and convert — no templates, no bloat. Hand-coded for speed, SEO and enquiries. "
            "From £895 + FREE homepage design."
        ),
    ),
    "web-design-kent.html": Meta(
        title="Web Design Kent | Built to Rank + Convert from £895 (+ Free Homepage Design)",
        description=(
            "Bespoke web design for Kent businesses — hand-coded (not WordPress) for speed, structure and enquiries. "
            "From £895 — start with a FREE homepage design."
        ),
    ),
    "free-homepage-design.html": Meta(
        title="Free Homepage Design | No-Risk First Step (Builds from £895)",
        description=(
            "See the design + messaging before you commit. Get a FREE custom homepage concept, then decide. "
            "If you proceed, builds typically start from £895."
        ),
    ),
    "monthly-web-development.html": Meta(
        title="Monthly Web Development (£550/mo) | Keep Improving SEO + Leads",
        description=(
            "Ongoing development + content to climb rankings and increase enquiries. £550/mo incl. 2 SEO blog posts. "
            "Ideal after launch when you want momentum."
        ),
    ),
    "host-perfect.html": Meta(
        title="Website Hosting & Care | Keep It Fast, Secure & Ranking",
        description=(
            "Performance-first hosting and care to protect speed, uptime and SEO signals. Based in Epping, serving Essex & London. "
            "Get hosting support and ongoing improvements."
        ),
    ),
    "send-perfect.html": Meta(
        title="Send Perfect | AI Outreach Tool | Plot Perfect Studios (Epping/Essex/London)",
        description=(
            "AI-assisted outreach and email sequences to generate leads consistently. Built by Plot Perfect Studios in Epping (Essex), serving London too. "
            "Explore Send Perfect and start booking more calls."
        ),
    ),
    "vehicle-wrap-designs.html": Meta(
        title="Vehicle Wrap Design Portfolio | Epping, Essex & London | Plot Perfect Studios",
        description=(
            "Vehicle wrap design concepts and real-world examples. Branding-led layouts designed to stand out — created in Epping (Essex) for clients across London too. "
            "View the portfolio."
        ),
    ),
    "work/index.html": Meta(
        title="Website Case Studies | Proof Before You Buy (From £895)",
        description=(
            "Real case studies with premium UI, clean structure and SEO-first foundations. See proof, then start with a FREE homepage design. "
            "Website builds from £895."
        ),
    ),
    "insights/index.html": Meta(
        title="Web Design & SEO Insights | Win Rankings + Enquiries (Epping/Essex/London)",
        description=(
            "Short, practical guides on SEO, speed and conversion — written for business owners who want more enquiries. "
            "Based in Epping (Essex), serving London too."
        ),
    ),
    "sitemap.html": Meta(
        title="Sitemap | Plot Perfect Studios (Epping, Essex & London)",
        description=(
            "Browse every page on Plot Perfect Studios. Based in Epping (Essex) and serving London — find services, work, insights and contact details."
        ),
    ),
    "404.html": Meta(
        title="404 Page Not Found | Plot Perfect Studios (Epping, Essex & London)",
        description=(
            "That page doesn’t exist. Head back to Plot Perfect Studios (Epping/Essex/London), explore services and work, or request a quote for a website from £895."
        ),
    ),
}


SERVICE_SCHEMA_BY_PATH: dict[str, tuple[str, str]] = {
    # path -> (service_name, service_type)
    "services.html": ("Web design & development services", "Web design and website development"),
    "web-development.html": ("Web development", "Website development"),
    "web-design-epping.html": ("Web design Epping", "Web design and website development"),
    "web-design-essex.html": ("Web design Essex", "Web design and website development"),
    "web-design-london.html": ("Web design London", "Web design and website development"),
    "web-design-hertfordshire.html": ("Web design Hertfordshire", "Web design and website development"),
    "web-design-kent.html": ("Web design Kent", "Web design and website development"),
    "free-homepage-design.html": ("Free homepage design", "Homepage design"),
    "monthly-web-development.html": ("Monthly web development", "Website maintenance and development"),
    "host-perfect.html": ("Website hosting and care", "Web hosting"),
    "vehicle-wrap-designs.html": ("Vehicle wrap design", "Graphic design"),
}


def _rel_posix(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def _replace_tag_value(html: str, pattern: str, replacement: str) -> str:
    return re.sub(pattern, replacement, html, flags=re.I)


def _json_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace('"', "\\\"")
        .replace("\n", " ")
        .replace("\r", " ")
        .strip()
    )


def _breadcrumb_items(rel: str) -> list[tuple[str, str]]:
    # (name, url)
    items: list[tuple[str, str]] = [("Home", f"{WWW_BASE}/")]

    if rel.startswith("insights/"):
        items.append(("Insights", f"{WWW_BASE}/insights/"))
        if rel != "insights/index.html":
            items.append(("Insights Post", f"{WWW_BASE}/{rel}"))
        return items

    if rel.startswith("work/"):
        items.append(("Work", f"{WWW_BASE}/work/"))
        if rel != "work/index.html":
            items.append(("Case Study", f"{WWW_BASE}/{rel}"))
        return items

    if rel != "index.html":
        label = rel.rsplit("/", 1)[-1].replace(".html", "").replace("-", " ").title()
        items.append((label, f"{WWW_BASE}/{rel}"))
    return items


def _schema_block(*, rel: str, canonical_url: str, title: str) -> str:
    # Static JSON-LD string (no dependency) kept intentionally minimal.
    breadcrumbs = _breadcrumb_items(rel)
    breadcrumb_json = ",\n".join(
        [
            (
                "        {\n"
                f"          \"@type\":\"ListItem\",\n          \"position\":{idx},\n"
                f"          \"name\":\"{_json_escape(name)}\",\n          \"item\":\"{_json_escape(url)}\"\n"
                "        }"
            )
            for idx, (name, url) in enumerate(breadcrumbs, start=1)
        ]
    )

    graph_parts: list[str] = []

    graph_parts.append(
        "    {\n"
        f"      \"@type\":\"Organization\",\n      \"@id\":\"{WWW_BASE}/#org\",\n"
        f"      \"name\":\"{BUSINESS_NAME}\",\n      \"legalName\":\"{BUSINESS_LEGAL_NAME}\",\n"
        f"      \"url\":\"{WWW_BASE}/\",\n      \"logo\":\"{WWW_BASE}/assets/images/PlotPerfectLogoNew.png\"\n"
        "    }"
    )
    graph_parts.append(
        "    {\n"
        f"      \"@type\":\"WebSite\",\n      \"@id\":\"{WWW_BASE}/#website\",\n"
        f"      \"url\":\"{WWW_BASE}/\",\n      \"name\":\"{BUSINESS_NAME}\",\n"
        f"      \"publisher\":{{\"@id\":\"{WWW_BASE}/#org\"}},\n      \"inLanguage\":\"en-GB\"\n"
        "    }"
    )
    graph_parts.append(
        "    {\n"
        f"      \"@type\":\"LocalBusiness\",\n      \"@id\":\"{WWW_BASE}/#local\",\n"
        f"      \"name\":\"{BUSINESS_NAME}\",\n      \"url\":\"{WWW_BASE}/\",\n"
        f"      \"image\":\"{WWW_BASE}/assets/images/PlotPerfectLogoNew.png\",\n"
        "      \"address\":{\n"
        "        \"@type\":\"PostalAddress\",\n        \"addressCountry\":\"GB\",\n"
        "        \"addressRegion\":\"Essex\",\n        \"addressLocality\":\"Epping\"\n      },\n"
        "      \"areaServed\":[\"Epping\",\"Essex\",\"London\",\"United Kingdom\"],\n"
        f"      \"parentOrganization\":{{\"@id\":\"{WWW_BASE}/#org\"}}\n"
        "    }"
    )
    graph_parts.append(
        "    {\n"
        f"      \"@type\":\"WebPage\",\n      \"@id\":\"{canonical_url}#webpage\",\n"
        f"      \"url\":\"{canonical_url}\",\n      \"name\":\"{_json_escape(title)}\",\n"
        f"      \"isPartOf\":{{\"@id\":\"{WWW_BASE}/#website\"}},\n"
        f"      \"about\":{{\"@id\":\"{WWW_BASE}/#org\"}},\n      \"inLanguage\":\"en-GB\"\n"
        "    }"
    )
    graph_parts.append(
        "    {\n"
        f"      \"@type\":\"BreadcrumbList\",\n      \"@id\":\"{canonical_url}#breadcrumbs\",\n"
        f"      \"itemListElement\":[\n{breadcrumb_json}\n      ]\n"
        "    }"
    )

    service = SERVICE_SCHEMA_BY_PATH.get(rel)
    if service:
        service_name, service_type = service
        graph_parts.append(
            "    {\n"
            f"      \"@type\":\"Service\",\n      \"@id\":\"{canonical_url}#service\",\n"
            f"      \"name\":\"{_json_escape(service_name)}\",\n      \"serviceType\":\"{_json_escape(service_type)}\",\n"
            f"      \"url\":\"{canonical_url}\",\n      \"provider\":{{\"@id\":\"{WWW_BASE}/#local\"}},\n"
            "      \"areaServed\":[\"Epping\",\"Essex\",\"London\",\"United Kingdom\"]\n"
            "    }"
        )

    graph_json = ",\n".join(graph_parts)

    return (
        "\n  <script type=\"application/ld+json\">\n"
        "{\n"
        "  \"@context\":\"https://schema.org\",\n"
        "  \"@graph\":[\n"
        f"{graph_json}\n"
        "  ]\n"
        "}\n"
        "  </script>\n"
    )


def update_html_file(path: Path, root: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="ignore")
    updated = original

    # Mandatory canonical + URL base fix (non-www -> www)
    updated = updated.replace(NON_WWW_BASE, WWW_BASE)

    rel = _rel_posix(path, root)
    meta = META_BY_PATH.get(rel)

    # For blog posts and case studies not explicitly mapped, apply light touch:
    # keep topic-focused title, but add locality in description.
    if meta is None and path.suffix.lower() == ".html":
        title_match = re.search(r"<title>(.*?)</title>", updated, flags=re.I | re.S)
        desc_match = re.search(
            r"<meta\s+name=[\"\']description[\"\']\s+content=[\"\'](.*?)[\"\']\s*/?>",
            updated,
            flags=re.I | re.S,
        )
        title = title_match.group(1).strip() if title_match else "Plot Perfect Studios"
        desc = desc_match.group(1).strip() if desc_match else ""
        if "Epping" not in desc and "Essex" not in desc and "London" not in desc:
            suffix = " Based in Epping, Essex — serving London too."
            desc = (desc + suffix).strip() if desc else suffix.strip()
        meta = Meta(title=title, description=desc)

    if meta is not None:
        # Title
        updated = _replace_tag_value(
            updated,
            r"<title>.*?</title>",
            f"<title>{meta.title}</title>",
        )

        # Meta description
        if re.search(r"<meta\s+name=[\"\']description[\"\']", updated, flags=re.I):
            updated = _replace_tag_value(
                updated,
                r"<meta\s+name=[\"\']description[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
                f"<meta name=\"description\" content=\"{meta.description}\" />",
            )

        # OG/Twitter should mirror the meta where present
        updated = _replace_tag_value(
            updated,
            r"<meta\s+property=[\"\']og:title[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta property=\"og:title\" content=\"{meta.title}\" />",
        )
        updated = _replace_tag_value(
            updated,
            r"<meta\s+property=[\"\']og:description[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta property=\"og:description\" content=\"{meta.description}\" />",
        )
        updated = _replace_tag_value(
            updated,
            r"<meta\s+name=[\"\']twitter:title[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta name=\"twitter:title\" content=\"{meta.title}\" />",
        )
        updated = _replace_tag_value(
            updated,
            r"<meta\s+name=[\"\']twitter:description[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta name=\"twitter:description\" content=\"{meta.description}\" />",
        )

        # Canonical should be www and correct for the file
        canonical_url = WWW_BASE + ("/" if rel == "index.html" else f"/{rel}")
        updated = _replace_tag_value(
            updated,
            r"<link\s+rel=[\"\']canonical[\"\']\s+href=[\"\'].*?[\"\']\s*/?>",
            f"<link rel=\"canonical\" href=\"{canonical_url}\" />",
        )

        # OG/Twitter URL
        updated = _replace_tag_value(
            updated,
            r"<meta\s+property=[\"\']og:url[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta property=\"og:url\" content=\"{canonical_url}\" />",
        )
        updated = _replace_tag_value(
            updated,
            r"<meta\s+name=[\"\']twitter:url[\"\']\s+content=[\"\'].*?[\"\']\s*/?>",
            f"<meta name=\"twitter:url\" content=\"{canonical_url}\" />",
        )

        # If the page has no JSON-LD at all, add a lightweight baseline.
        if not re.search(r"<script\s+type=[\"\']application/ld\+json[\"\']", updated, flags=re.I):
            updated = re.sub(
                r"\s*</head>",
                _schema_block(rel=rel, canonical_url=canonical_url, title=meta.title) + "</head>",
                updated,
                flags=re.I,
            )

    if updated != original:
        path.write_text(updated, encoding="utf-8", newline="\n")
        return True
    return False


def update_text_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="ignore")
    updated = original.replace(NON_WWW_BASE, WWW_BASE)
    if updated != original:
        path.write_text(updated, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    root = Path(__file__).resolve().parents[1]

    changed: list[str] = []

    for path in root.rglob("*.html"):
        if "partials" in path.parts or "tools" in path.parts:
            continue
        if update_html_file(path, root):
            changed.append(path.relative_to(root).as_posix())

    for path in [root / "robots.txt", root / "sitemap.xml"]:
        if path.exists() and update_text_file(path):
            changed.append(path.relative_to(root).as_posix())

    print(f"Updated files: {len(changed)}")
    for p in changed:
        print(f"- {p}")


if __name__ == "__main__":
    main()
