// Generates the static blog pages, public/sitemap.xml and public/robots.txt before every build.
// Blog HTML is written to blog/ so Vite bundles it like any other page and search engines get full text.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts } from '../src/content/blog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.ajwahmalik.site';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmtDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

// Shared <head>, matching the other pages.
const head = ({ title, description, url, type = 'website', extra = '' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23ff4f9a'/%3E%3C/svg%3E" />
${extra}</head>`;

const postCard = (p) => `<a class="post-card" href="/blog/${p.slug}" data-cursor="Read" data-reveal>
        <span class="mono post-meta">${fmtDate(p.date)} · ${esc(p.readTime)}</span>
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.description)}</p>
        <span class="post-tags mono">${p.tags.map(esc).join(' · ')}</span>
      </a>`;

fs.mkdirSync(path.join(root, 'blog'), { recursive: true });

// Blog index.
fs.writeFileSync(
  path.join(root, 'blog/index.html'),
  `${head({ title: 'Blog — Ajwa Malik', description: 'Writing on AI agents, AI search and SEO, WordPress security, local AI models and web performance, from real projects.', url: `${SITE}/blog/` })}
<body data-page="blog">
  <main id="page">
    <section class="page-head wrap">
      <p class="mono label" data-reveal>Writing</p>
      <h1 class="page-title" data-split>Blog</h1>
      <p class="lead case-sum" data-reveal>Notes from building real systems: AI agents, search, security and speed.</p>
    </section>
    <section class="wrap post-list">
      ${sorted.map(postCard).join('\n      ')}
    </section>
  </main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`
);

// One page per post, with BlogPosting structured data.
for (const [i, p] of sorted.entries()) {
  const url = `${SITE}/blog/${p.slug}`;
  const next = sorted[(i + 1) % sorted.length];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    author: { '@type': 'Person', name: 'Ajwa Malik', url: SITE },
    mainEntityOfPage: url,
    keywords: p.tags.join(', '),
  };
  fs.writeFileSync(
    path.join(root, `blog/${p.slug}.html`),
    `${head({ title: `${p.title} — Ajwa Malik`, description: p.description, url, type: 'article', extra: `  <meta property="article:published_time" content="${p.date}" />\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n` })}
<body data-page="post">
  <main id="page">
    <article>
      <header class="page-head wrap post-head">
        <a class="mono label post-back" href="/blog/">&larr; All posts</a>
        <p class="mono post-meta" data-reveal>${fmtDate(p.date)} · ${esc(p.readTime)} · ${p.tags.map(esc).join(' · ')}</p>
        <h1 class="post-title" data-split>${esc(p.title)}</h1>
        <p class="lead case-sum" data-reveal>${esc(p.description)}</p>
      </header>
      <div class="wrap post-layout">
        <aside class="post-takeaways" data-reveal>
          <p class="mono label">Key takeaways</p>
          <ul>${p.takeaways.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <p class="post-author mono">By Ajwa Malik</p>
        </aside>
        <div class="prose">${p.body}</div>
      </div>
    </article>
    <a class="next-project next-post wrap" href="/blog/${next.slug}" data-cursor="Next">
      <span class="mono label">Next post</span>
      <span class="next-title">${esc(next.title)}</span>
    </a>
  </main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`
  );
}

// Sitemap: static pages, blog, and every project case study (served at /projects/<slug>).
// data.js relies on Vite's import.meta.glob, so rebuild the project list from its sources here.
const { builtProjects } = await import('../src/content/projects.js');
const seoDir = path.join(root, 'src/content/seo');
const projects = [
  ...fs.readdirSync(seoDir).filter((f) => f.endsWith('.json')).map((f) => ({ slug: JSON.parse(fs.readFileSync(path.join(seoDir, f))).slug, category: 'SEO' })),
  ...builtProjects,
];
const today = new Date().toISOString().slice(0, 10);
const pages = [
  ['/', '1.0', 'weekly'],
  ['/projects', '0.9', 'weekly'],
  ['/seo', '0.9', 'monthly'],
  ['/experience', '0.8', 'monthly'],
  ['/about', '0.7', 'monthly'],
  ['/contact', '0.7', 'yearly'],
  ['/blog/', '0.8', 'weekly'],
];
const urls = [
  ...pages.map(([loc, priority, changefreq]) => ({ loc: SITE + loc, lastmod: today, priority, changefreq })),
  ...sorted.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: p.date, priority: '0.7', changefreq: 'yearly' })),
  ...projects.map((p) => ({ loc: `${SITE}/projects/${p.slug}`, lastmod: today, priority: p.category === 'SEO' ? '0.7' : '0.6', changefreq: 'monthly' })),
];
fs.writeFileSync(
  path.join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`
);
fs.writeFileSync(path.join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`blog: ${sorted.length} posts · sitemap: ${urls.length} URLs`);
