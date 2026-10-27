/* Exercise the packaged release over a temporary loopback HTTP server. */
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const report=JSON.parse(fs.readFileSync(path.join(root,'review/release-seo-audit.json'),'utf8'));
if(report.errors.length)throw Error('The release audit must pass first.');
const child=spawn(process.execPath,[path.join(__dirname,'preview-studio.cjs'),'--release'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
(async()=>{
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Preview startup timed out')),10000);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('error',reject);child.stderr.once('data',d=>reject(Error(d.toString())));});
  const results=[];
  for(const route of report.routes){const pathname=route.path==='index.html'?'/':'/'+route.path;const response=await fetch('http://127.0.0.1:4174'+pathname);const text=await response.text();results.push({path:pathname,status:response.status,expected:200,design:text.includes('/assets/css/studio.css')});}
  for(const pathname of ['/host-perfect.html','/pps-release-missing-page']){const response=await fetch('http://127.0.0.1:4174'+pathname);const text=await response.text();results.push({path:pathname,status:response.status,expected:404,design:text.includes('/assets/css/studio.css'),noindex:text.includes('noindex,follow')});}
  const failures=results.filter(r=>r.status!==r.expected||!r.design||(r.expected===404&&!r.noindex));
  fs.writeFileSync(path.join(root,'review/release-http-check.json'),JSON.stringify({checks:results.length,failures,results},null,2));
  console.log(`${results.length} HTTP checks / ${failures.length} failures; retired and missing URLs return real 404 responses.`);
  if(failures.length)process.exitCode=1;
 }finally{child.kill();}
})().catch(error=>{console.error(error.message);process.exitCode=1;child.kill();});
