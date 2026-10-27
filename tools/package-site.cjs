/* Prepare a clean static release without development tools, source caches or reviews. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'dist');
const report=JSON.parse(fs.readFileSync(path.join(root,'review/seo-audit.json'),'utf8'));
if(report.errors.length)throw Error('Run a passing SEO audit before packaging.');
if(fs.existsSync(out)){
 // Only remove this known generated workspace folder, never a computed parent.
 if(path.resolve(out)!==path.resolve(root,'dist')||fs.existsSync(path.join(out,'.git')))throw Error('Unexpected release directory.');
 fs.rmSync(out,{recursive:true,force:true});
}
fs.mkdirSync(out,{recursive:true});
const copied=new Set();
function copy(relative){
 relative=decodeURIComponent(relative.split(/[?#]/)[0]).replace(/^\//,'');
 if(!relative||copied.has(relative))return;
 const source=path.resolve(root,relative);
 if(!source.startsWith(root+path.sep)||!fs.existsSync(source)||!fs.statSync(source).isFile())throw Error('Missing release asset: '+relative);
 copied.add(relative);const dest=path.join(out,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);
 if(/\.(html|css|js|svg)$/.test(relative)){
  const text=fs.readFileSync(source,'utf8');
  for(const match of text.matchAll(/(?:["'(]|url\()\s*((?:https:\/\/www\.plotperfectstudios\.co\.uk)?\/assets\/[^"'`\s)<>]+)/g)){
   const value=match[1].replace('https://www.plotperfectstudios.co.uk','');if(value.includes('${'))continue;copy(value);
  }
 }
}
for(const r of report.routes)copy(r.path);
for(const file of ['CNAME','robots.txt','sitemap.xml'])copy(file);
for(const file of fs.readdirSync(path.join(root,'assets/images/projects')).filter(f=>f.endsWith('.webp')))copy('assets/images/projects/'+file);
// Preserve existing ownership verification files if any are added later.
for(const file of fs.readdirSync(root).filter(f=>/^google[^/]+\.html$/.test(f)||/^BingSiteAuth\.xml$/i.test(f)))copy(file);
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const bytes=[...copied].reduce((sum,f)=>sum+fs.statSync(path.join(root,f)).size,0);
console.log(`Packaged ${copied.size} files, ${(bytes/1024/1024).toFixed(2)} MB, into ${out}`);
