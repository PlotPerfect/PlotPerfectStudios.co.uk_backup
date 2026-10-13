from html import unescape
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    path
    for path in ROOT.rglob("*.html")
    if "partials" not in path.parts
    and '"FAQPage"' in path.read_text(encoding="utf-8", errors="ignore")
    and "faq-item" in path.read_text(encoding="utf-8", errors="ignore")
]

SCRIPT_RE = re.compile(
    r'(<script\s+type="application/ld\+json"[^>]*>)(.*?)(</script>)',
    re.IGNORECASE | re.DOTALL,
)
DETAIL_RE = re.compile(
    r'<details\b[^>]*class="[^"]*\bfaq-item\b[^"]*"[^>]*>\s*'
    r'<summary[^>]*>(.*?)</summary>\s*<p[^>]*>(.*?)</p>.*?</details>',
    re.IGNORECASE | re.DOTALL,
)
TAG_RE = re.compile(r"<[^>]+>")


def clean(value: str) -> str:
    return " ".join(unescape(TAG_RE.sub(" ", value)).split())


def find_faq(node):
    if isinstance(node, dict):
        if node.get("@type") == "FAQPage":
            return node
        for value in node.values():
            found = find_faq(value)
            if found is not None:
                return found
    elif isinstance(node, list):
        for value in node:
            found = find_faq(value)
            if found is not None:
                return found
    return None


for path in TARGETS:
    source = path.read_text(encoding="utf-8")
    pairs = [(clean(question), clean(answer)) for question, answer in DETAIL_RE.findall(source)]
    if not pairs:
        raise RuntimeError(f"No visible FAQ items found in {path.name}")

    updated = False

    def replace_script(match):
        nonlocal_marker = None
        del nonlocal_marker
        global updated
        try:
            data = json.loads(match.group(2))
        except json.JSONDecodeError:
            return match.group(0)
        faq = find_faq(data)
        if faq is None:
            return match.group(0)
        faq["mainEntity"] = [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in pairs
        ]
        updated = True
        return f'{match.group(1)}\n{json.dumps(data, ensure_ascii=False, indent=2)}\n  {match.group(3)}'

    output = SCRIPT_RE.sub(replace_script, source)
    if not updated:
        raise RuntimeError(f"FAQPage schema not found in {path.name}")
    path.write_text(output, encoding="utf-8", newline="")
    print(f"{path.name}: {len(pairs)} FAQ items")
