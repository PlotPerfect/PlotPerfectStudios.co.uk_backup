/* Read-only deployment checks. Run again after publishing the static release. */
const fs=require('node:fs');
const path=require('node:path');
const origin='https://www.plotperfectstudios.co.uk';
const targets=['http://plotperfectstudios.co.uk/','https://plotperfectstudios.co.uk/',origin+'/',origin+'/robots.txt',origin+'/sitemap.xml',origin+'/web-design-epping.html',origin+'/web-design-essex.html',origin+'/web-design-london.html',origin+'/fyndii.html',origin+'/host-perfect.html',origin+'/pps-seo-audit-missing-page-2026'];
(async()=>{
 const results=await Promise.all(targets.map(async url=>{
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'PlotPerfectSEOReadinessCheck/1.0'},redirect:'follow'});
   const text=await response.text();
   return {url,status:response.status,finalUrl:response.url,redirected:response.redirected,contentType:response.headers.get('content-type'),xRobotsTag:response.headers.get('x-robots-tag'),canonical:text.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1]||null,title:text.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||null,newDesign:text.includes('/assets/css/studio.css'),hasFyndii:text.includes('/fyndii.html'),sitemapCount:url.endsWith('sitemap.xml')?(text.match(/<loc>/g)||[]).length:null,robots:url.endsWith('robots.txt')?text.trim():null};
  }catch(error){return{url,error:error.message,cause:error.cause?.code||null};}
 }));
 const file=path.resolve(__dirname,'../review/live-seo-check.json');fs.writeFileSync(file,JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
 for(const r of results)console.log(JSON.stringify(r));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
