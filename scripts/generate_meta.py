"""
Generate meta descriptions for every HTML file in the repo.
- Backups originals to backups/<filename>.metabak-<timestamp>.html
- Generates a 140-160 char description from the page body (first meaningful text block)
- Replaces existing <meta name="description"> content or inserts one before </head>
- Keeps og:description and twitter:description in sync (replace or insert if present/absent)

This is aggressive (it overwrites existing meta descriptions). Backups are created for safety.
"""

import os
import re
import time
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKUP_DIR = os.path.join(ROOT, 'backups')
os.makedirs(BACKUP_DIR, exist_ok=True)

HTML_FILES = [f for f in os.listdir(ROOT) if f.lower().endswith('.html')]

TIMESTAMP = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')

summary = {'checked': 0, 'updated': 0, 'files': []}


def text_from_body(html):
    m = re.search(r'(?is)<body.*?>(.*)</body>', html)
    if not m:
        return ''
    body = m.group(1)
    # remove scripts/styles
    body = re.sub(r'(?is)<script.*?>.*?</script>', ' ', body)
    body = re.sub(r'(?is)<style.*?>.*?</style>', ' ', body)
    # replace tags with spaces
    body = re.sub(r'(?s)<[^>]+>', ' ', body)
    # collapse whitespace
    body = re.sub(r'\s+', ' ', body).strip()
    return body


def make_description(text, max_len=156):
    if not text:
        return ''
    # take first 2-3 sentences if possible
    # naive sentence split
    sentences = re.split(r'(?<=[.!?])\s+', text)
    desc = ''
    for s in sentences:
        if len(desc) + len(s) + 1 <= max_len:
            desc = (desc + ' ' + s).strip()
        else:
            # if empty, take truncated sentence
            if not desc:
                desc = s.strip()[:max_len].rsplit(' ',1)[0]
            break
    if not desc:
        desc = text[:max_len].rsplit(' ',1)[0]
    return desc


def insert_before_head_close(text, snippet):
    return re.sub(r'(?i)</head\s*>', snippet + '\n</head>', text, count=1)


for fname in HTML_FILES:
    summary['checked'] += 1
    path = os.path.join(ROOT, fname)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    body_text = text_from_body(html)
    generated = make_description(body_text, 156)
    if not generated:
        # skip files with no body text
        continue

    # backup original
    bak_name = f"{fname}.metabak-{TIMESTAMP}.html"
    bak_path = os.path.join(BACKUP_DIR, bak_name)
    with open(bak_path, 'w', encoding='utf-8') as bf:
        bf.write(html)

    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', html)
    if not head_match:
        continue
    head_open, head_inner, head_close = head_match.group(1), head_match.group(2), head_match.group(3)
    head = head_inner

    changed = False
    # replace or insert meta description
    if re.search(r'(?i)<meta\s+name=["\']description["\']', head):
        # replace content attribute
        new_head = re.sub(r'(?i)(<meta\s+name=["\']description["\']\s+content=")[^"]*("\s*/?>)', r'\1' + generated.replace('"','&quot;') + r'\2', head, count=1)
        if new_head != head:
            html = html.replace(head, new_head, 1)
            changed = True
    else:
        tag = f'<meta name="description" content="{generated.replace("\"","&quot;")}">'
        html = insert_before_head_close(html, tag)
        changed = True

    # refresh head
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', html)
    head = head_match.group(2)

    # og:description
    if re.search(r'(?i)<meta\s+property=["\']og:description["\']', head):
        new_head = re.sub(r'(?i)(<meta\s+property=["\']og:description["\']\s+content=")[^"]*("\s*/?>)', r'\1' + generated.replace('"','&quot;') + r'\2', head, count=1)
        html = html.replace(head, new_head, 1)
        changed = True
    else:
        tag = f'<meta property="og:description" content="{generated.replace("\"","&quot;")}">'
        html = insert_before_head_close(html, tag)
        changed = True

    # twitter:description
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', html)
    head = head_match.group(2)
    if re.search(r'(?i)<meta\s+name=["\']twitter:description["\']', head):
        new_head = re.sub(r'(?i)(<meta\s+name=["\']twitter:description["\']\s+content=")[^"]*("\s*/?>)', r'\1' + generated.replace('"','&quot;') + r'\2', head, count=1)
        html = html.replace(head, new_head, 1)
        changed = True
    else:
        tag = f'<meta name="twitter:description" content="{generated.replace("\"","&quot;")}">'
        html = insert_before_head_close(html, tag)
        changed = True

    if changed:
        with open(path, 'w', encoding='utf-8') as outf:
            outf.write(html)
        summary['updated'] += 1
        summary['files'].append(fname)
        print(f'[META UPDATED] {fname}')

print('\nDone')
print(f"Files scanned: {summary['checked']}")
print(f"Files updated: {summary['updated']}")
if summary['files']:
    for f in summary['files']:
        print(' -', f)
else:
    print('No files updated.')
