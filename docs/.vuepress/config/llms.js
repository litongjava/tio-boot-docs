import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { createHash } from 'node:crypto';

const stripFrontmatter = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '').trim();
const hash = text => createHash('sha256').update(text).digest('hex');
const sectionOf = source => {
  const parts = source.split('/');
  return /^(zh|en)$/.test(parts[0]) ? `${parts[0]}/${parts[1]?.includes('_') ? parts[1] : 'overview'}` : 'overview';
};
const plain = text => text.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
  .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1').replace(/<[^>]+>/g,' ')
  .replace(/[#>*_\[\]`]/g, ' ').replace(/\s+/g,' ').trim();

// Rewrite prose links without changing Markdown examples inside fenced code.
function mapProse(markdown, transform) {
  let fence=null;
  return markdown.split('\n').map(line=>{
    const marker=line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if(marker) {
      if(!fence)fence=marker[1];
      else if(marker[1][0]===fence[0] && marker[1].length>=fence.length)fence=null;
      return line;
    }
    return fence ? line : transform(line);
  }).join('\n');
}

// Heading boundaries outside fenced code retain complete examples in a chunk.
export function splitSections(markdown) {
  markdown=markdown.replaceAll('\r\n','\n');
  const sections = []; let lines = [], heading = '', fence = null;
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence=marker[1];
      else if(marker[1][0]===fence[0] && marker[1].length>=fence.length) fence=null;
    }
    const h = !fence && !marker && line.match(/^#{1,6}\s+(.+)$/);
    if (h) {
      if(lines.join('\n').trim()) sections.push({heading,content:lines.join('\n').trim()});
      heading=h[1]; lines=[];
    }
    lines.push(line);
  }
  if(lines.join('\n').trim()) sections.push({heading,content:lines.join('\n').trim()});
  return sections;
}

export const llmsPlugin = ({hostname, siteName, siteDescription}) => ({
  name: 'tio-boot-llms',
  async onGenerated(app) {
    const origin=hostname.replace(/\/$/,'');
    const url=p=>new URL(p,origin+'/').href;
    const pages=app.pages.filter(p=>p.filePathRelative && p.path!=='/404.html' && p.frontmatter?.search!==false)
      .sort((a,b)=>a.filePathRelative.localeCompare(b.filePathRelative,'en'));
    const routes=new Map(pages.map(p=>[p.filePathRelative,p.path]));
    const records=[]; const chunks=[]; const groups=new Map();
    for(const page of pages) {
      const source=page.filePathRelative.replaceAll('\\','/');
      let markdown=stripFrontmatter(await readFile(app.dir.source(source),'utf8')).replaceAll('\r\n','\n');
      // Raw files live under /ai/pages; links must still resolve to canonical site pages.
      markdown=mapProse(markdown,prose=>prose.replace(/(!?\[[^\]\n]*\]\()(<[^>]+>|[^\s)]+)([^)]*\))/g,(all,start,raw,end)=>{
        const href=raw.startsWith('<')?raw.slice(1,-1):raw;
        if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href))return all;
        if(href.startsWith('#'))return `${start}<${url(page.path)+href}>${end}`;
        const [pathname,...suffix]=href.split(/(?=[?#])/);
        let decoded;try{decoded=decodeURIComponent(pathname);}catch{return all;}
        const target=decoded.startsWith('/')?decoded.slice(1):posix.normalize(posix.join(posix.dirname(source),decoded));
        const route=routes.get(target)||routes.get(target+'.md')||routes.get(target.replace(/\.html$/,'.md'))||routes.get(posix.join(target,'readme.md'))||routes.get(posix.join(target,'README.md'));
        return `${start}<${url(route||'/'+target)+suffix.join('')}>${end}`;
      }));
      const chapter=sectionOf(source);
      const markdownPath='/ai/pages/'+source;
      const description=page.frontmatter?.description || plain(markdown).slice(0,160);
      const status=markdown.length<100 || /^(?:#{1,6}[^\n]+)$/.test(markdown) ? 'placeholder' : 'document';
      const record={id:source,title:page.title||source,language:source.startsWith('zh/')?'zh-CN':source.startsWith('en/')?'en':'und',chapter,url:url(page.path),markdownUrl:url(markdownPath),source,description,keywords:page.frontmatter?.keywords||[],status,sha256:hash(markdown)};
      records.push(record);
      const members=groups.get(chapter)||[];members.push({...record,markdown});groups.set(chapter,members);
      const output=join(app.dir.dest(),markdownPath.slice(1));
      await mkdir(posix.dirname(output.replaceAll('\\','/')),{recursive:true});
      await writeFile(output,`<!-- Source: ${record.url} -->\n\n${markdown}\n`);
      splitSections(markdown).forEach((section,index)=>chunks.push({id:`${source}#chunk-${index}`,pageId:source,title:record.title,chapter,url:record.url,markdownUrl:record.markdownUrl,heading:section.heading,status,sha256:hash(section.content),content:section.content}));
    }
    const index=[`# ${siteName}`,'',`> ${siteDescription}`,'','## 检索入口','',
      `- [机器可读目录](${url('/ai/index.json')}): 页面标题、章节、摘要、原文地址、内容哈希和占位状态。`,
      `- [分段语料](${url('/ai/chunks.jsonl')}): 每行一个 JSON 对象，按正文标题分段，保留代码块。`,
      `- [完整正文](${url('/llms-full.txt')}): 所有页面原文。优先按章节或单页获取。`,
      `- [站点地图](${url('/sitemap.xml')}): HTML 页面入口。`,'',
      '回答时引用 url 字段；结合版本与验证范围，placeholder 表示短内容候选，不应当作完整实现。',''];
    for(const [chapter,members] of groups) {
      const chapterPath='/ai/chapters/'+chapter+'.txt';
      index.push(`## ${chapter}`,'',`- [本章完整正文](${url(chapterPath)})`);
      for(const r of members)index.push(`- [${r.title.replaceAll('[','').replaceAll(']','')}](${r.markdownUrl}): ${r.description}`);
      index.push('');
      const output=join(app.dir.dest(),chapterPath.slice(1));await mkdir(join(output,'..'),{recursive:true});
      await writeFile(output,members.map(r=>`# ${r.title}\n\nURL: ${r.url}\nSource: ${r.source}\n\n${r.markdown}`).join('\n\n---\n\n')+'\n');
    }
    await writeFile(join(app.dir.dest(),'llms.txt'),index.join('\n'));
    await writeFile(join(app.dir.dest(),'llms-full.txt'),[...groups.values()].flat().map(r=>`# ${r.title}\n\nURL: ${r.url}\nSource: ${r.source}\n\n${r.markdown}`).join('\n\n---\n\n')+'\n');
    await mkdir(join(app.dir.dest(),'ai'),{recursive:true});
    await writeFile(join(app.dir.dest(),'ai/index.json'),JSON.stringify({schemaVersion:1,site:origin,pages:records},null,2)+'\n');
    await writeFile(join(app.dir.dest(),'ai/chunks.jsonl'),chunks.map(r=>JSON.stringify(r)).join('\n')+'\n');
  }
});
