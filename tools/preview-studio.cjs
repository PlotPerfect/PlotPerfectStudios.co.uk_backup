const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const release = process.argv.includes('--release');
const root = path.resolve(__dirname,release?'../dist':'..');
const port = release?4174:4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.mp4':'video/mp4'};
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');let status=200;if(!fs.existsSync(file)){file=path.join(root,'404.html');status=404;}res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
