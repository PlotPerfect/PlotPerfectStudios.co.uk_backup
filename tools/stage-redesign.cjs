/* Stage the audited website and its source tooling without unrelated deletions. */
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const release=path.join(root,'dist');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else{const relative=path.relative(release,file).split(path.sep).join('/');if(relative!=='.nojekyll')files.push(relative);}}}
walk(release);
const source=['.gitignore','_config.yml','SEO_REPORT.md','REDESIGN.md','partials/header.html','partials/footer.html','assets/images/studio-social.svg','host-perfect.html'];
for(const dir of ['tools','assets/data'])for(const file of fs.readdirSync(path.join(root,dir))){if(fs.statSync(path.join(root,dir,file)).isFile())source.push(dir+'/'+file);}
const staged=[...new Set([...files,...source])].filter(file=>fs.existsSync(path.join(root,file))||spawnSync('git',['ls-files','--error-unmatch','--',file],{cwd:root,windowsHide:true,stdio:'ignore'}).status===0).sort();
fs.writeFileSync(path.join(root,'review/publish-plan.json'),JSON.stringify({baseCommit:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true}).stdout.trim(),files:staged},null,2));
const result=spawnSync('git',['add','--',...staged],{cwd:root,encoding:'utf8',windowsHide:true});
if(result.status!==0){console.error(result.stderr);process.exit(result.status||1);}
console.log(`Staged ${staged.length} explicit release/source paths; unrelated pre-existing asset deletions remain unstaged.`);
