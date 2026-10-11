// Builds device mockups for every project into public/work/<slug>/ and writes src/content/media.json.
// Uses ./shots/<slug>-d.png (desktop) and -m.png (phone); projects without shots get a typographic cover.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('/Users/ajwamalik/inovista/node_modules/');
const { chromium } = require('playwright');
const sharp = require('sharp');
const root = path.resolve(new URL('.', import.meta.url).pathname, '../..');
const shots = path.join(root, 'scripts/mockups/shots');
const { builtProjects } = await import(path.join(root, 'src/content/projects.js'));
const seo = fs.readdirSync(path.join(root, 'src/content/seo')).map((f) => JSON.parse(fs.readFileSync(path.join(root, 'src/content/seo', f))));
const seoColors = { 'blanks-boutique': ['#c2185b', '#f8bbd0', '#1a0610'], 'kincer-chassis': ['#ff6a00', '#ffd5b3', '#121212'], 'catalina-spas': ['#0277bd', '#b3e5fc', '#031a29'], 'bfp-law-firm': ['#f2c200', '#fff0a6', '#0d0d0d'], 'aqua-gym-swim-spas': ['#00acc1', '#b2ebf2', '#02191c'], 'chriss-pressure-washing': ['#e65100', '#ffccbc', '#1a0a02'] };
const all = [
  ...builtProjects,
  ...seo.map((c) => ({ slug: c.slug, title: c.clientName, category: 'SEO', stack: c.services.slice(0, 4), colors: seoColors[c.slug], summary: c.headline.value + ' ' + c.headline.label, url: c.websiteUrl })),
];
const only = process.argv.slice(2);
const home = process.env.HOME;
const extras = {
  'inovista-shield': [`${home}/inovista-store/assets/inovista-shield-hero.png`, `${home}/inovista-store/assets/clickfix-remover-hero.png`],
  'review-engine': [`${home}/inovista-store/assets/review-engine-hero.png`],
  'blue-clover': [`${home}/blue-clover-build/test/shots-img/about-1440-elementor.png`, `${home}/blue-clover-build/test/shots-img/journal-1440-elementor.png`],
  'custom-product-filter': [],
};
const uri = async (file, width) => 'data:image/jpeg;base64,' + (await sharp(file).resize({ width, withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer()).toString('base64');
const exists = (f) => fs.existsSync(f) && f;
const host = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const css = `*{box-sizing:border-box;margin:0}body{width:1600px;height:1100px;overflow:hidden;font-family:'Inter Tight',Inter,system-ui,sans-serif;background:var(--c3)}
.scene{position:absolute;inset:0;background:radial-gradient(70% 80% at 18% 12%,color-mix(in srgb,var(--c1) 70%,transparent),transparent 70%),radial-gradient(60% 70% at 92% 96%,color-mix(in srgb,var(--c1) 45%,transparent),transparent 70%),var(--c3)}
.scene:after{content:'';position:absolute;inset:0;background:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px) 0 0/22px 22px;mix-blend-mode:overlay}
.win{position:absolute;left:120px;top:120px;width:1200px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 60px 120px -30px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.08)}
.bar{height:44px;background:#f3f3f1;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid #e3e3e0}
.bar i{width:12px;height:12px;border-radius:50%;background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}
.url{margin-left:22px;flex:1;max-width:520px;height:26px;border-radius:8px;background:#fff;color:#666;font:500 14px/26px ui-monospace,Menlo,monospace;padding:0 14px;border:1px solid #e6e6e3}
.screen{display:block;width:1200px;height:750px;object-fit:cover;object-position:top}
.phone{position:absolute;right:120px;bottom:70px;width:300px;height:620px;border-radius:48px;background:#0b0b0b;padding:12px;box-shadow:0 50px 100px -20px rgba(0,0,0,.7),0 0 0 2px rgba(255,255,255,.12)}
.phone img{width:100%;height:100%;border-radius:37px;object-fit:cover;object-position:top;display:block}
.phone:before{content:'';position:absolute;top:22px;left:50%;width:90px;height:26px;margin-left:-45px;border-radius:20px;background:#0b0b0b;z-index:2}
.card{width:1200px;height:750px;background:linear-gradient(140deg,var(--c3),color-mix(in srgb,var(--c1) 55%,var(--c3)));color:#fff;padding:90px 90px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.card .mk{position:absolute;right:-40px;bottom:-140px;font-size:640px;font-weight:600;letter-spacing:-.08em;line-height:1;color:var(--c1);opacity:.35}
.card .cat{font:500 18px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--c2)}
.card h1{font-size:120px;font-weight:600;letter-spacing:-.055em;line-height:.92;max-width:9.5em;margin-top:24px}
.card p{font-size:28px;line-height:1.3;max-width:24em;color:rgba(255,255,255,.82);margin-top:28px}
.chips{display:flex;gap:12px;flex-wrap:wrap;position:relative}.chips span{font:500 17px ui-monospace,Menlo,monospace;padding:10px 16px;border-radius:99px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.06)}`;

const browser = await chromium.launch({ headless: true, executablePath: '/Users/ajwamalik/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const mediaFile = path.join(root, 'src/content/media.json');
const media = fs.existsSync(mediaFile) ? JSON.parse(fs.readFileSync(mediaFile)) : {};

async function render(html, vars, out) {
  await page.setContent(`<!doctype html><html><head><style>:root{${vars}}${css}</style></head><body><div class="scene"></div>${html}</body></html>`);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).resize(1600).webp({ quality: 80 }).toFile(out);
}

for (const p of all.filter((p) => !only.length || only.includes(p.slug))) {
  const [c1, c2, c3] = p.colors;
  const vars = `--c1:${c1};--c2:${c2};--c3:${c3}`;
  const dir = path.join(root, 'public/work', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  const desk = exists(`${shots}/${p.slug}-d.png`) || exists(`${shots}/${p.slug}-site.jpg`);
  const mob = exists(`${shots}/${p.slug}-m.png`);
  const gsc = exists(`${shots}/${p.slug}-gsc.jpg`);
  const bar = (u) => `<div class="bar"><i></i><i></i><i></i><div class="url">${esc(u)}</div></div>`;
  const entry = { cover: `/work/${p.slug}/cover.webp`, gallery: [] };
  if (desk) {
    const body = `<div class="win">${bar(host(p.url) || p.slug + '.app')}<img class="screen" src="${await uri(desk, 1440)}"></div>` + (mob ? `<div class="phone"><img src="${await uri(mob, 600)}"></div>` : '');
    await render(body, vars, `${dir}/cover.webp`);
    // A plain full-width screen for the case-study gallery.
    await sharp(desk).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${dir}/screen.webp`);
    entry.gallery.push(`/work/${p.slug}/screen.webp`);
    if (mob) {
      await sharp(mob).resize({ width: 780 }).webp({ quality: 80 }).toFile(`${dir}/mobile.webp`);
      entry.mobile = `/work/${p.slug}/mobile.webp`;
    }
  } else {
    const body = `<div class="win">${bar(p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + (p.category === 'WordPress' ? '.wp' : '.app'))}<div class="card"><div class="mk">${esc(p.mark || p.title[0])}</div><div><div class="cat">${esc(p.category)}</div><h1>${esc(p.title)}</h1><p>${esc(p.summary)}</p></div><div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div></div></div>` + (mob ? `<div class="phone"><img src="${await uri(mob, 600)}"></div>` : '');
    await render(body, vars, `${dir}/cover.webp`);
    entry.typographic = true;
    if (mob) { await sharp(mob).resize({ width: 780 }).webp({ quality: 80 }).toFile(`${dir}/mobile.webp`); entry.mobile = `/work/${p.slug}/mobile.webp`; }
  }
  if (gsc) {
    await render(`<div class="win">${bar('search.google.com/search-console')}<img class="screen" style="height:auto" src="${await uri(gsc, 1600)}"></div>`, vars, `${dir}/gsc.webp`);
    entry.gallery.unshift(`/work/${p.slug}/gsc.webp`);
  }
  // Extra real images that exist for some projects (product art, build test captures).
  for (const [i, src] of (extras[p.slug] || []).entries()) {
    const name = `extra-${i + 1}.webp`;
    await sharp(src).resize(1600, 1100, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(`${dir}/${name}`);
    entry.gallery.push(`/work/${p.slug}/${name}`);
  }
  media[p.slug] = entry;
  console.log(p.slug, desk ? 'device' : 'typographic', mob ? '+phone' : '', gsc ? '+gsc' : '');
}
fs.writeFileSync(mediaFile, JSON.stringify(media, null, 1));
await browser.close();
