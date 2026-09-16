import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import navbar from '../docs/.vuepress/config/nav-en.js'

// Read-only inventory. Markdown code blocks and external URLs are not links to local pages.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docs = path.join(root, 'docs')
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  if (e.name.startsWith('.') || e.name === 'node_modules') return []
  const p = path.join(dir, e.name)
  return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : []
})
const relative = p => path.relative(root, p).replaceAll('\\', '/')
const files = walk(docs)
const placeholders = [], missingLinks = [], missingNavigation = []
for (const file of files) {
  const body = fs.readFileSync(file, 'utf8')
  const prose = body.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '')
  const lines = prose.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (body.trim().length < 100 || /^#{1,6}[^\n]*$/.test(body.trim()))
    placeholders.push({ file: relative(file), title: lines[0] || '(empty)' })
  for (const m of prose.matchAll(/!?\[[^\]\n]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
    const href = m[1] || m[2]
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue
    let clean
    try { clean = decodeURIComponent(href.split(/[?#]/)[0]) } catch { continue }
    if (!clean) continue
    const target = clean.startsWith('/') ? path.join(docs, clean) : path.resolve(path.dirname(file), clean)
    const candidates = [target, target + '.md', path.join(target, 'README.md'), path.join(target, 'readme.md')]
    if (target.endsWith('.html')) candidates.push(target.slice(0, -5) + '.md')
    if (clean.startsWith('/')) candidates.push(path.join(docs, '.vuepress/public', clean))
    if (!candidates.some(p => fs.existsSync(p))) missingLinks.push({ file: relative(file), href })
  }
}
const sidebar = JSON.parse(fs.readFileSync(path.join(docs, '.vuepress/config/sidebar-zh.json'), 'utf8'))
function visit(value) {
  if (typeof value === 'string' && value.startsWith('/zh/') && value.endsWith('.md')) {
    if (!fs.existsSync(path.join(docs, value))) missingNavigation.push(value)
  } else if (Array.isArray(value)) value.forEach(visit)
  else if (value && typeof value === 'object') Object.values(value).forEach(visit)
}
visit(sidebar)
const navigated = new Set(sidebar.flatMap(section => section.children || []).filter(p => typeof p === 'string'))
const unlistedPages = files.map(p => '/' + path.relative(docs, p).replaceAll('\\', '/'))
  .filter(p => /^\/zh\/\d+_[^/]+\/[^/]+\.md$/.test(p) && !navigated.has(p))
function checkNavbar(value) {
  if (typeof value === 'string' && value.startsWith('/') && value !== '/') {
    const target = path.join(docs, value)
    if (![target, target+'.md', path.join(target,'README.md'), path.join(target,'readme.md')].some(p=>fs.existsSync(p))) missingNavigation.push(value)
  } else if (Array.isArray(value)) value.forEach(checkNavbar)
  else if (value && typeof value === 'object') {
    if (value.link) checkNavbar(value.link)
    if (value.children) checkNavbar(value.children)
  }
}
checkNavbar(navbar)
const chapters = fs.readdirSync(path.join(docs,'zh')).filter(n=>/^\d+_/.test(n)).sort()
const chapterErrors = chapters.flatMap((chapter,index)=> Number(chapter.split('_')[0]) === index+1 ? [] : [chapter])
if (sidebar.map(s=>s.children?.find(p=>typeof p==='string' && p.startsWith('/zh/'))?.split('/')[2]).join('|') !== chapters.join('|')) chapterErrors.push('Sidebar order differs from directory order')
console.log(JSON.stringify({ markdownFiles: files.length, placeholders, missingLinks, missingNavigation, unlistedPages, chapterErrors }, null, 2))
if (missingLinks.length || missingNavigation.length || unlistedPages.length || chapterErrors.length) process.exitCode = 1
