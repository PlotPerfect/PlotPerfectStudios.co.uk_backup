"""Dependency-free crawl/indexing audit of the complete static release."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter, defaultdict, deque
import json, re, sys
import xml.etree.ElementTree as ET

WORKSPACE=Path(__file__).resolve().parents[1]
ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else WORKSPACE
ORIGIN='https://www.plotperfectstudios.co.uk'
class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.source=source; self.links=[]; self.images=[]; self.ids=[]; self.meta={}; self.canon=[]; self.h1=0; self.main=0; self.lang=''; self.title=''; self.in_title=False; self.scripts=[]; self.schemas=[]; self.in_schema=False; self.schema=''; self.styles=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='html':self.lang=a.get('lang','')
        if tag=='main':self.main+=1
        if tag=='h1':self.h1+=1
        if tag=='title':self.in_title=True
        if tag=='meta':self.meta.setdefault(a.get('name',a.get('property','')).lower(),[]).append(a.get('content',''))
        if tag=='link' and a.get('rel')=='canonical':self.canon.append(a.get('href',''))
        if tag=='link' and a.get('rel')=='stylesheet':self.styles.append(a.get('href',''))
        if tag=='img':self.images.append(a)
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag=='script':
            if a.get('src'):self.scripts.append(a['src'])
            if a.get('type')=='application/ld+json':self.in_schema=True;self.schema=''
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
        if tag=='script' and self.in_schema:self.schemas.append(json.loads(self.schema));self.in_schema=False
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.in_schema:self.schema+=data

def target(source,url):
    u=urlsplit(url)
    if u.scheme and u.scheme not in ['http','https']:return None
    if u.netloc and u.netloc!='www.plotperfectstudios.co.uk':return None
    if not u.path:return source
    p=(ROOT/u.path.lstrip('/')) if u.path.startswith('/') else source.parent/u.path
    p=Path(unquote(str(p))).resolve()
    if u.path.endswith('/') or p.is_dir():p=p/'index.html'
    return p

def main():
    errors=[];warnings=[];docs={}; graph=defaultdict(set)
    files=sorted(p for p in ROOT.rglob('*.html') if not any(s in p.relative_to(ROOT).parts for s in ['.git','partials','review','dist','node_modules']))
    for p in files:
        d=Document(p);d.feed(p.read_text(encoding='utf-8'));docs[p]=d
    indexable={p for p,d in docs.items() if not any('noindex' in r for r in d.meta.get('robots',[]))}
    for p,d in docs.items():
        rel=p.relative_to(ROOT).as_posix()
        expected=ORIGIN+('/' if rel=='index.html' else '/'+rel.removesuffix('index.html'))
        for valid,msg in [(d.lang=='en-GB','expected en-GB language'),(d.main==1,'expected one semantic main'),(d.h1==1,'expected one H1'),(d.canon==[expected],'canonical must match the preferred URL'),(len(d.meta.get('description',[]))==1,'expected one description'),(len(d.meta.get('robots',[]))==1,'expected an explicit robots directive'),(len(d.ids)==len(set(d.ids)),'duplicate HTML ids'),(bool(d.schemas),'missing structured data')]:
            if not valid:errors.append(f'{rel}: {msg}')
        if '/assets/css/studio.css' not in d.styles:errors.append(f'{rel}: missing current design stylesheet')
        for field in ['og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:description','twitter:image']:
            if len(d.meta.get(field,[]))!=1:errors.append(f'{rel}: missing or duplicate {field}')
        if d.meta.get('og:url')!=[expected]:errors.append(f'{rel}: OG URL differs from canonical')
        for field in ['og:image','twitter:image']:
            for value in d.meta.get(field,[]):
                image=target(p,value)
                if image is not None and not image.is_file():errors.append(f'{rel}: missing social-preview asset {value}')
        if len(d.title)>65:warnings.append(f'{rel}: title is longer than 65 characters')
        if len(d.meta.get('description',[''])[0])>160:warnings.append(f'{rel}: description is longer than 160 characters')
        for im in d.images:
            if 'alt' not in im:errors.append(f'{rel}: missing image alt text: {im.get("src")}')
            if not im.get('width') or not im.get('height'):errors.append(f'{rel}: missing image dimensions: {im.get("src")}')
        html=p.read_text(encoding='utf-8')
        if re.search(r'Host Perfect|host-perfect\.html|localhost|127\.0\.0\.1',html,re.I):errors.append(f'{rel}: retired brand or development URL is exposed')
        for href in d.links:
            t=target(p,href)
            if t is None:continue
            if not t.is_file():errors.append(f'{rel}: broken link {href}');continue
            if t in docs:
                graph[p].add(t)
                fragment=unquote(urlsplit(href).fragment)
                if fragment and fragment not in docs[t].ids:errors.append(f'{rel}: broken fragment {href}')
        for src in d.scripts+d.styles+[im.get('src','') for im in d.images]:
            t=target(p,src)
            if t is not None and not t.is_file():errors.append(f'{rel}: missing asset {src}')
    for field,getter in [('title',lambda d:d.title),('description',lambda d:d.meta.get('description',[''])[0])]:
        groups=defaultdict(list)
        for p in indexable:groups[getter(docs[p])].append(p.relative_to(ROOT).as_posix())
        for key,values in groups.items():
            if len(values)>1:errors.append(f'duplicate {field}: {values}')
    sitemap=ET.parse(ROOT/'sitemap.xml'); urls=[n.text for n in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    if len(urls)!=len(set(urls)):errors.append('sitemap contains duplicate URLs')
    sitemap_files=set()
    for url in urls:
        if not url.startswith(ORIGIN+'/'):errors.append(f'noncanonical sitemap URL: {url}');continue
        p=target(ROOT/'index.html',url);sitemap_files.add(p)
        if p not in indexable:errors.append(f'sitemap URL is missing or noindex: {url}')
        elif docs[p].canon!=[url]:errors.append(f'sitemap URL differs from canonical: {url}')
    for p in indexable-sitemap_files:errors.append(f'indexable page missing from sitemap: {p.relative_to(ROOT)}')
    seen=set();queue=deque([ROOT/'index.html'])
    while queue:
        p=queue.popleft()
        if p in seen:continue
        seen.add(p);queue.extend(graph[p]-seen)
    for p in indexable-seen:errors.append(f'unreachable from homepage: {p.relative_to(ROOT)}')
    robots=(ROOT/'robots.txt').read_text()
    if f'Sitemap: {ORIGIN}/sitemap.xml' not in robots:errors.append('robots.txt missing canonical sitemap')
    if re.search(r'Disallow:\s*/\s*(?:\n|$)',robots):errors.append('robots.txt blocks the whole site')
    if (ROOT/'host-perfect.html').exists():errors.append('retired Host Perfect page is still served')
    # Asset dependencies in CSS, including imported stylesheets and backgrounds.
    for css in (ROOT/'assets/css').glob('*.css'):
        if css.name not in {'studio.css','area-pages.css','hero-cinematic.css','project-showcase.css'}:continue
        for value in re.findall(r'url\([\'"]?([^\)\'\"]+)',css.read_text(encoding='utf-8')):
            t=target(css,value)
            if t is not None and not t.is_file():errors.append(f'{css.name}: missing CSS asset {value}')
    report={'pages':len(docs),'indexable_pages':len(indexable),'sitemap_urls':len(urls),'reachable_pages':len(seen),'errors':errors,'warnings':warnings,'routes':[{'path':p.relative_to(ROOT).as_posix(),'canonical':d.canon[0] if d.canon else '', 'indexable':p in indexable,'title':d.title} for p,d in docs.items()]}
    (WORKSPACE/'review').mkdir(exist_ok=True)
    (WORKSPACE/'review'/('release-seo-audit.json' if ROOT!=WORKSPACE else 'seo-audit.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(f'{len(docs)} pages / {len(indexable)} indexable / {len(urls)} sitemap URLs / {len(errors)} errors / {len(warnings)} warnings')
    for error in errors:print('ERROR:',error)
    for warning in warnings:print('WARN:',warning)
    return bool(errors)
if __name__=='__main__':sys.exit(main())
