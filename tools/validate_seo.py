from __future__ import annotations

import json
import re
import sys
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(
    path for path in ROOT.rglob("*.html") if not any(part in path.relative_to(ROOT).parts for part in {"partials", "dist", "review", "node_modules"})
)
PUBLIC_ORIGIN = "https://www.plotperfectstudios.co.uk"


def clean_html_text(value: str) -> str:
    return " ".join(unescape(re.sub(r"<[^>]+>", " ", value)).split())


def faq_nodes(node):
    if isinstance(node, dict):
        if node.get("@type") == "FAQPage":
            yield node
        for value in node.values():
            yield from faq_nodes(value)
    elif isinstance(node, list):
        for value in node:
            yield from faq_nodes(value)


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def local_target(source: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.netloc or parsed.scheme in {
        "http",
        "https",
        "mailto",
        "tel",
        "javascript",
        "data",
    }:
        return None
    clean = unquote(parsed.path)
    if not clean or clean == "/":
        return ROOT / "index.html"
    target = ROOT / clean.lstrip("/") if clean.startswith("/") else source.parent / clean
    if clean.endswith("/"):
        target /= "index.html"
    return target.resolve()


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    exact_files = {
        path.relative_to(ROOT).as_posix(): path
        for path in ROOT.rglob("*")
        if path.is_file()
    }
    lower_files = {name.lower(): name for name in exact_files}

    for path in HTML_FILES:
        html = path.read_text(encoding="utf-8", errors="ignore")
        rel = relative(path)

        titles = re.findall(r"<title>(.*?)</title>", html, re.I | re.S)
        descriptions = re.findall(
            r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>',
            html,
            re.I | re.S,
        )
        canonicals = re.findall(
            r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']\s*/?>',
            html,
            re.I | re.S,
        )
        robots = re.findall(
            r'<meta\s+name=["\']robots["\']\s+content=["\'](.*?)["\']\s*/?>',
            html,
            re.I | re.S,
        )

        if len(titles) != 1:
            errors.append(f"{rel}: expected one title, found {len(titles)}")
        elif len(re.sub(r"\s+", " ", titles[0]).strip()) > 65:
            warnings.append(f"{rel}: title exceeds 65 characters")
        if len(descriptions) != 1:
            errors.append(f"{rel}: expected one meta description, found {len(descriptions)}")
        elif len(re.sub(r"\s+", " ", descriptions[0]).strip()) > 160:
            warnings.append(f"{rel}: meta description exceeds 160 characters")
        if len(canonicals) != 1:
            errors.append(f"{rel}: expected one canonical, found {len(canonicals)}")
        elif not canonicals[0].startswith(PUBLIC_ORIGIN):
            errors.append(f"{rel}: canonical is outside the preferred origin")
        if len(re.findall(r"<h1\b", html, re.I)) != 1:
            errors.append(f"{rel}: expected exactly one h1")
        if rel in {"404.html", "insights/post-template.html"} and not any(
            "noindex" in value.lower() for value in robots
        ):
            errors.append(f"{rel}: utility/template page must be noindex")

        structured_data = []
        for block in re.findall(
            r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>',
            html,
            re.I | re.S,
        ):
            try:
                structured_data.append(json.loads(block))
            except json.JSONDecodeError as exc:
                errors.append(f"{rel}: invalid JSON-LD ({exc.msg})")

        visible_faq = [
            (clean_html_text(question), clean_html_text(answer))
            for question, answer in re.findall(
                r'<details\b[^>]*class="[^"]*\bfaq-item\b[^"]*"[^>]*>\s*'
                r'<summary[^>]*>(.*?)</summary>\s*<p[^>]*>(.*?)</p>.*?</details>',
                html,
                re.I | re.S,
            )
        ]
        schema_faq = []
        for data in structured_data:
            for faq in faq_nodes(data):
                schema_faq.extend(
                    (
                        clean_html_text(item.get("name", "")),
                        clean_html_text(item.get("acceptedAnswer", {}).get("text", "")),
                    )
                    for item in faq.get("mainEntity", [])
                )
        if schema_faq and schema_faq != visible_faq:
            errors.append(
                f"{rel}: FAQ schema must exactly match all visible FAQ questions and answers"
            )

        for attr, value in re.findall(
            r'\b(href|src|poster)=["\']([^"\']+)["\']', html, re.I
        ):
            target = local_target(path, value)
            if target is None:
                continue
            try:
                target_rel = target.relative_to(ROOT).as_posix()
            except ValueError:
                errors.append(f"{rel}: {attr} escapes the repository: {value}")
                continue
            if target_rel in exact_files:
                continue
            case_match = lower_files.get(target_rel.lower())
            if case_match:
                errors.append(
                    f"{rel}: case-sensitive path mismatch: {value} (actual: /{case_match})"
                )
            else:
                errors.append(f"{rel}: missing local {attr}: {value}")

    print(f"Checked {len(HTML_FILES)} HTML pages")
    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings:
        print(f"WARN: {item}")
    print(f"Errors: {len(errors)}; warnings: {len(warnings)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
