import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const escapeHtml=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const legacyRedirectsPlugin = ({hostname}) => ({
  name:'tio-boot-legacy-redirects',
  async onGenerated(app) {
    const mapping=JSON.parse(await readFile(app.dir.source('.vuepress/config/legacy-paths.json'),'utf8'));
    const pages=new Map(app.pages.filter(p=>p.filePathRelative).map(p=>[p.filePathRelative,p.path]));
    const occupied=new Set(app.pages.map(p=>decodeURI(p.path).replace(/\/$/,'/index.html').toLowerCase()));
    const redirects=[];
    for(const [oldSource,newSource] of Object.entries(mapping)) {
      const target=pages.get(newSource);if(!target)throw new Error('Missing redirect target: '+newSource);
      const oldPath='/'+oldSource.replace(/readme\.md$/i,'index.html').replace(/\.md$/,'.html');
      const encoded=encodeURI(oldPath);
      const targetUrl=new URL(target,hostname).href;
      redirects.push(`${encoded} ${target} 301`);
      if(oldPath.endsWith('/index.html'))redirects.push(`${encoded.slice(0,-10)} ${target} 301`);
      // Windows cannot hold both 22_MQ and 22_mq; never overwrite a canonical page.
      if(process.platform==='win32' && occupied.has(oldPath.toLowerCase()))continue;
      const output=join(app.dir.dest(),oldPath.slice(1));await mkdir(dirname(output),{recursive:true});
      const safeTarget=JSON.stringify(target).replaceAll('<','\\u003c');
      await writeFile(output,`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escapeHtml(targetUrl)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"><title>章节已迁移</title></head><body><a href="${escapeHtml(target)}">前往新章节</a><script>location.replace(${safeTarget}+location.search+location.hash)</script></body></html>`);
    }
    await writeFile(join(app.dir.dest(),'_redirects'),redirects.join('\n')+'\n');
    await mkdir(join(app.dir.dest(),'ai'),{recursive:true});
    await writeFile(join(app.dir.dest(),'ai/redirects.json'),JSON.stringify(mapping,null,2)+'\n');
  }
});
