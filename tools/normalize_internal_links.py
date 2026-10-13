from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPLACEMENTS = {
    'href="/index.html"': 'href="/"',
    'href="/index.html#': 'href="/#',
    'href="/work/"': 'href="/work/index.html"',
    'href="/insights/"': 'href="/insights/index.html"',
}


for path in ROOT.rglob("*.html"):
    if ".git" in path.parts:
        continue
    original = path.read_text(encoding="utf-8")
    updated = original
    for source, target in REPLACEMENTS.items():
        updated = updated.replace(source, target)
    if updated != original:
        path.write_text(updated, encoding="utf-8", newline="")
        print(path.relative_to(ROOT))
