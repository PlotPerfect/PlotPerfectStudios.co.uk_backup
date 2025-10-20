"""
Safe, low-risk SEO standardiser for static HTML files.
- Backups originals to ./backups/
- Adds a rel=canonical if missing (points to https://plotperfectstudios.co.uk/<filename>)
- Adds a meta description generated from page body if missing
- Adds basic og:title/og:description/twitter:title/twitter:description if missing (uses title/meta description)
- Inserts Organization JSON-LD if missing
- For blog pages (files starting with 'blog-'), inserts a minimal BlogPosting JSON-LD if missing

This script intentionally only *adds* missing items and doesn't overwrite existing tags.
"""

import os
import re
import json
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKUP_DIR = os.path.join(ROOT, 'backups')
BASE_URL = 'https://plotperfectstudios.co.uk/'

os.makedirs(BACKUP_DIR, exist_ok=True)

HTML_FILES = [f for f in os.listdir(ROOT) if f.lower().endswith('.html')]

summary = {
    'checked': 0,
    'modified': 0,
    'modified_files': []
}


def insert_before_head_close(text, snippet):
    # insert snippet immediately before </head>
    return re.sub(r'(?i)</head\s*>', snippet + '\n</head>', text, count=1)


def generate_description_from_body(text, max_len=160):
    # remove scripts/styles
    body = re.search(r'(?is)<body.*?>(.*)</body>', text)
    if not body:
        return ''
    b = body.group(1)
    b = re.sub(r'(?is)<script.*?>.*?</script>', ' ', b)
    b = re.sub(r'(?is)<style.*?>.*?</style>', ' ', b)
    # remove tags
    b = re.sub(r'(?s)<[^>]+>', ' ', b)
    # collapse whitespace
    b = re.sub(r'\s+', ' ', b).strip()
    if not b:
        return ''
    desc = b[:max_len].rsplit(' ', 1)[0]
    return desc


def has_pattern(head_text, pattern):
    return re.search(pattern, head_text, re.I) is not None


def safe_attr(text):
    return text.replace('\n', ' ').replace('"', '&quot;')


ORG_JSONLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Plot Perfect Studios",
    "url": BASE_URL,
    "logo": BASE_URL + "assets/images/LogoV2.svg",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44 7401 154 663",
        "contactType": "customer service",
        "email": "info@plotperfectstudios.co.uk",
        "areaServed": "GB"
    },
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Parklands, Coopersale",
        "addressLocality": "Epping",
        "postalCode": "CM16 7RQ",
        "addressCountry": "GB"
    },
    "sameAs": [
        "https://www.instagram.com/plotperfectstudios/",
        "https://www.linkedin.com/in/adam-chapman-935b27322/"
    ]
}


for fname in HTML_FILES:
    summary['checked'] += 1
    path = os.path.join(ROOT, fname)
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', text)
    if not head_match:
        # nothing to do
        continue

    head_open, head_inner, head_close = head_match.group(1), head_match.group(2), head_match.group(3)
    head = head_inner
    changed = False

    # 1) canonical
    if not re.search(r'rel=["\']canonical["\']', head, re.I):
        if fname.lower() in ('index.html', 'index.htm'):
            url = BASE_URL
        else:
            url = BASE_URL.rstrip('/') + '/' + fname
        tag = f'<link rel="canonical" href="{url}">'
        text = insert_before_head_close(text, tag)
        changed = True

    # refresh head after possible change
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', text)
    head = head_match.group(2)

    # 2) meta description
    if not re.search(r'<meta\s+name=["\']description["\']', head, re.I):
        desc = generate_description_from_body(text, 160)
        if desc:
            desc_safe = safe_attr(desc)
            tag = f'<meta name="description" content="{desc_safe}">'
            text = insert_before_head_close(text, tag)
            changed = True

    # refresh head
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', text)
    head = head_match.group(2)

    # get title and meta description values for og/twitter defaults
    title_m = re.search(r'(?i)<title>(.*?)</title>', text)
    title_text = title_m.group(1).strip() if title_m else os.path.splitext(fname)[0]
    desc_m = re.search(r'(?i)<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', head)
    desc_text = desc_m.group(1).strip() if desc_m else ''

    # fallback og:image
    og_image_m = re.search(r'(?i)<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', head)
    og_image = og_image_m.group(1).strip() if og_image_m else (BASE_URL + 'assets/images/LogoV2.svg')

    # 3) og:title/description
    if not re.search(r'<meta\s+property=["\']og:title["\']', head, re.I):
        tag = f'<meta property="og:title" content="{safe_attr(title_text)}">'
        text = insert_before_head_close(text, tag)
        changed = True
    if not re.search(r'<meta\s+property=["\']og:description["\']', head, re.I):
        if desc_text:
            tag = f'<meta property="og:description" content="{safe_attr(desc_text)}">'
            text = insert_before_head_close(text, tag)
            changed = True
    if not re.search(r'<meta\s+property=["\']og:image["\']', head, re.I):
        tag = f'<meta property="og:image" content="{og_image}">'
        text = insert_before_head_close(text, tag)
        changed = True

    # 4) twitter tags
    if not re.search(r'<meta\s+name=["\']twitter:title["\']', head, re.I):
        tag = f'<meta name="twitter:title" content="{safe_attr(title_text)}">'
        text = insert_before_head_close(text, tag)
        changed = True
    if not re.search(r'<meta\s+name=["\']twitter:description["\']', head, re.I):
        if desc_text:
            tag = f'<meta name="twitter:description" content="{safe_attr(desc_text)}">'
            text = insert_before_head_close(text, tag)
            changed = True
    if not re.search(r'<meta\s+name=["\']twitter:image["\']', head, re.I):
        tag = f'<meta name="twitter:image" content="{og_image}">'
        text = insert_before_head_close(text, tag)
        changed = True

    # refresh head
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', text)
    head = head_match.group(2)

    # 5) Organization JSON-LD
    if '"@type": "Organization"' not in text:
        jsonld = json.dumps(ORG_JSONLD, indent=2)
        tag = '<script type="application/ld+json">\n' + jsonld + '\n</script>'
        text = insert_before_head_close(text, tag)
        changed = True

    # refresh head
    head_match = re.search(r'(?is)(<head.*?>)(.*?)(</head>)', text)
    head = head_match.group(2)

    # 6) blog pages: add BlogPosting JSON-LD if missing
    if fname.lower().startswith('blog-') and '"@type": "BlogPosting"' not in text:
        # try find published date in page
        date_m = re.search(r'(?i)<time[^>]*datetime=["\'](.*?)["\']', text)
        date_p = date_m.group(1) if date_m else None
        blog_json = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title_text,
            "description": desc_text or title_text,
            "image": og_image,
            "author": {"@type": "Organization", "name": "Plot Perfect Studios"},
            "publisher": {"@type": "Organization", "name": "Plot Perfect Studios", "logo": {"@type": "ImageObject", "url": BASE_URL + "assets/images/LogoV2.svg"}},
            "mainEntityOfPage": BASE_URL.rstrip('/') + '/' + fname
        }
        if date_p:
            blog_json['datePublished'] = date_p
        tag = '<script type="application/ld+json">\n' + json.dumps(blog_json, indent=2) + '\n</script>'
        text = insert_before_head_close(text, tag)
        changed = True

    if changed:
        # backup original
        bak_path = os.path.join(BACKUP_DIR, fname + '.bak')
        with open(bak_path, 'w', encoding='utf-8') as bf:
            bf.write(open(path, 'r', encoding='utf-8').read())
        with open(path, 'w', encoding='utf-8') as outf:
            outf.write(text)
        summary['modified'] += 1
        summary['modified_files'].append(fname)
        print(f'[UPDATED] {fname}')

print('\nSummary:')
print(f"Checked: {summary['checked']}")
print(f"Modified: {summary['modified']}")
if summary['modified_files']:
    for f in summary['modified_files']:
        print(' -', f)
else:
    print('No files needed changes.')

# exit status
if summary['modified'] > 0:
    print('\nFinished with modifications.')
else:
    print('\nNo modifications performed.')
