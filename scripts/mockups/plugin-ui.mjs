// Renders interface illustrations for plugins and tools that have no public page, into ./shots/<slug>-d.png.
// Sample data is made up (example.com sites, generic names); no client data appears in these images.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/ajwamalik/inovista/node_modules/');
const { chromium } = require('playwright');
const out = (s) => new URL(`./shots/${s}-d.png`, import.meta.url).pathname;
const img = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64');

const base = `*{box-sizing:border-box;margin:0}body{width:1440px;height:900px;overflow:hidden;font:14px/1.45 -apple-system,'Inter',system-ui,sans-serif;color:#1d2327;background:#f0f0f1}
.mono{font-family:ui-monospace,Menlo,monospace}.row{display:flex;gap:16px}.col{display:flex;flex-direction:column;gap:16px}
.pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600}
.card{background:#fff;border:1px solid #e2e4e7;border-radius:12px;padding:20px}
h1{font-size:24px;font-weight:650;letter-spacing:-.02em}h2{font-size:15px;font-weight:650}
.muted{color:#646970}.btn{display:inline-flex;align-items:center;padding:9px 16px;border-radius:8px;font-weight:600;font-size:13px}
table{width:100%;border-collapse:collapse}td,th{padding:11px 12px;border-bottom:1px solid #eef0f2;text-align:left;font-size:13px}th{color:#646970;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em}`;

// WordPress admin frame around a plugin screen.
const wp = (active, body, accent = '#2271b1') => `<div style="display:flex;height:900px">
<aside style="width:180px;background:#1d2327;color:#c3c4c7;padding-top:8px;font-size:13px">
${['Dashboard', 'Posts', 'Media', 'Pages', 'Comments', 'Appearance', 'Plugins', 'Users', 'Tools', 'Settings', active].map((m) => `<div style="padding:9px 14px;${m === active ? `background:${accent};color:#fff;font-weight:600` : ''}">${m}</div>`).join('')}</aside>
<div style="flex:1;display:flex;flex-direction:column"><div style="height:32px;background:#1d2327;color:#c3c4c7;font-size:13px;display:flex;align-items:center;padding:0 14px;gap:18px"><b style="color:#fff">example-site.com</b><span>+ New</span><span style="margin-left:auto">Howdy, admin</span></div>
<main style="padding:28px 32px;flex:1">${body}</main></div></div>`;

const stat = (label, value, color = '#1d2327', note = '') => `<div class="card" style="flex:1"><div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;font-weight:600">${label}</div><div style="font-size:34px;font-weight:700;letter-spacing:-.03em;color:${color};margin-top:6px">${value}</div><div class="muted" style="font-size:12px">${note}</div></div>`;

const pages = {
  'inovista-shield': wp('Inovista Shield', `
    <div class="row" style="align-items:center;margin-bottom:22px"><div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#2a6bff,#7b3cff);display:grid;place-items:center;color:#fff;font-size:22px">✓</div>
    <div><h1>Inovista Shield</h1><div class="muted">Last full scan 4 minutes ago · 18,240 files · 312 database rows checked</div></div>
    <span class="btn" style="margin-left:auto;background:#6b3cff;color:#fff">Run full scan</span></div>
    <div class="row" style="margin-bottom:18px">${stat('Threats found', '3', '#d63638', 'quarantined automatically')}${stat('Hardening', '11/12', '#00a32a', 'rules active')}${stat('Login guard', '214', '#1d2327', 'blocked attempts this week')}${stat('File integrity', 'OK', '#00a32a', 'core matches wordpress.org')}</div>
    <div class="card" style="padding:0"><div style="padding:16px 20px"><h2>Scan results</h2></div><table>
    <tr><th>Severity</th><th>File / location</th><th>Signature</th><th>Action</th></tr>
    ${[['Critical', '#d63638', 'wp-content/db.php', 'Database drop-in loader', 'Quarantined'], ['Critical', '#d63638', 'wp-content/plugins/wp-cache-helper/', 'Fake plugin with remote eval', 'Quarantined'], ['High', '#dba617', 'wp_options › siteurl_backup', 'ClickFix fake-captcha injection', 'Cleaned'], ['Info', '#2271b1', 'xmlrpc.php', 'Endpoint exposed', 'Disabled'], ['Info', '#2271b1', '?author=1', 'Username enumeration', 'Blocked']].map(([s, c, f, g, a]) => `<tr><td><span class="pill" style="background:${c}1a;color:${c}">● ${s}</span></td><td class="mono">${f}</td><td>${g}</td><td><span class="pill" style="background:#00a32a1a;color:#00a32a">${a}</span></td></tr>`).join('')}
    </table></div>`, '#6b3cff'),

  'review-engine': wp('Review Engine', `
    <div class="row" style="align-items:center;margin-bottom:22px"><div><h1>Review Engine</h1><div class="muted">2 Google profiles connected · merged and de-duplicated</div></div>
    <span class="btn mono" style="margin-left:auto;background:#fff;border:1px solid #dcdcde">[five_star_reviews]</span><span class="btn" style="background:#f5b400;color:#1d2327">Sync now</span></div>
    <div class="row" style="margin-bottom:18px">${stat('Reviews stored', '486')}${stat('Average rating', '4.9 ★', '#f5b400')}${stat('Shown on site', '5★ only', '#1d2327', 'filter in Settings')}${stat('Last sync', '2h ago', '#00a32a', 'Places API + SerpApi')}</div>
    <div class="row">${[['Jordan P.', 'Fast, friendly and fixed it the same day. Would book again.'], ['Maria L.', 'Clear pricing up front and the tech explained everything.'], ['Sam R.', 'Showed up on time and left the place spotless. Five stars.']].map(([n, t], i) => `<div class="card" style="flex:1"><div class="row" style="align-items:center;gap:10px"><div style="width:38px;height:38px;border-radius:50%;background:${['#4285f4', '#34a853', '#ea4335'][i]};color:#fff;display:grid;place-items:center;font-weight:700">${n[0]}</div><div><b>${n}</b><div style="color:#f5b400;letter-spacing:2px">★★★★★</div></div><span class="muted" style="margin-left:auto;font-size:12px">Google</span></div><p style="margin-top:12px;font-size:15px">${t}</p></div>`).join('')}</div>
    <div class="card" style="margin-top:16px"><h2>Sources</h2><table><tr><th>Profile</th><th>Source</th><th>Reviews</th><th>Status</th></tr>
    <tr><td>Main office</td><td>Google Places</td><td>312</td><td><span class="pill" style="background:#00a32a1a;color:#00a32a">Connected</span></td></tr>
    <tr><td>Second location</td><td>SerpApi</td><td>174</td><td><span class="pill" style="background:#00a32a1a;color:#00a32a">Connected</span></td></tr></table></div>`, '#b78900'),

  'safe-remove': wp('Safe Remove', `
    <h1>Safe Remove</h1><div class="muted" style="margin-bottom:22px">What breaks if you delete it? Checked before anything is touched.</div>
    <div class="card" style="padding:0"><table><tr><th>Flagged file</th><th>Threat</th><th>Impact if removed</th><th>Verdict</th><th></th></tr>
    ${[['wp-content/uploads/2024/x.php', 'High', '#d63638', 'None: not referenced', '#00a32a', 'Safe to remove', 'Quarantine'], ['wp-content/themes/child/functions.php', 'Medium', '#dba617', 'Site-wide: loaded on every page', '#d63638', 'Clean, do not delete', 'Clean'], ['wp-content/plugins/old-slider/', 'Low', '#2271b1', '2 pages use its shortcode', '#dba617', 'Replace first', 'Review'], ['wp-content/mu-plugins/loader.php', 'High', '#d63638', 'None: no hooks registered elsewhere', '#00a32a', 'Safe to remove', 'Quarantine']].map(([f, t, tc, i, ic, v, a]) => `<tr><td class="mono">${f}</td><td><span class="pill" style="background:${tc}1a;color:${tc}">${t}</span></td><td>${i}</td><td><b style="color:${ic}">${v}</b></td><td><span class="btn" style="background:#2271b1;color:#fff;padding:6px 12px">${a}</span></td></tr>`).join('')}</table></div>
    <div class="row" style="margin-top:16px"><div class="card" style="flex:1"><h2>Quarantine</h2><p class="muted" style="margin-top:6px">Files are moved, never deleted. Restore any of them with one click.</p><div class="mono" style="margin-top:10px">3 files · 41 KB</div></div>
    <div class="card" style="flex:1"><h2>Auto-rollback</h2><p class="muted" style="margin-top:6px">After each removal the homepage and key pages are re-checked. A 500 error restores the file automatically.</p><span class="pill" style="margin-top:10px;background:#00a32a1a;color:#00a32a">● Health check passing</span></div></div>`, '#00a86b'),

  'custom-product-filter': () => {
    const ps = [1, 2, 3, 4, 5, 6].map((i) => img(`/Users/ajwamalik/custom-product-filter/dev/img/p${i}.jpg`));
    return `<div style="background:#fff;height:900px;padding:28px 48px"><div class="row" style="align-items:center;margin-bottom:24px"><b style="font-size:20px">PlaySpace Supply</b><span class="muted" style="margin-left:40px">Shop</span><span class="muted">Commercial</span><span class="muted">Residential</span><span class="muted">Contact</span></div>
    <div class="row" style="gap:32px"><aside style="width:260px" class="col">${[['Age group', ['2–5 years', '5–12 years', '13+ years']], ['Material', ['Steel', 'Wood', 'Recycled plastic']], ['Capacity', ['Up to 10', '10–25', '25+']], ['Certified', ['ASTM F1487', 'IPEMA']]].map(([h, o], k) => `<div><h2 style="margin-bottom:8px">${h}</h2>${o.map((x, j) => `<label style="display:flex;gap:8px;align-items:center;padding:4px 0"><span style="width:16px;height:16px;border-radius:4px;border:1.5px solid ${(j + k) % 2 ? '#c3c4c7' : '#2e7d32'};background:${(j + k) % 2 ? '#fff' : '#2e7d32'}"></span>${x}</label>`).join('')}</div>`).join('')}
    <div><h2 style="margin-bottom:10px">Price</h2><div style="height:4px;background:#e2e4e7;border-radius:4px;position:relative"><div style="position:absolute;left:15%;right:30%;height:4px;background:#2e7d32"></div></div><div class="row muted" style="justify-content:space-between;margin-top:8px"><span>$2,400</span><span>$18,000</span></div></div></aside>
    <div style="flex:1"><div class="row" style="align-items:center;margin-bottom:16px"><b>24 products</b><span class="pill" style="background:#2e7d321a;color:#2e7d32">5–12 years ✕</span><span class="pill" style="background:#2e7d321a;color:#2e7d32">Steel ✕</span><span class="muted" style="margin-left:auto">Sort: Popular ▾</span></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${ps.map((src, i) => `<div><div style="aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:#f6f7f7"><img src="${src}" style="width:100%;height:100%;object-fit:cover"></div><b style="display:block;margin-top:8px">${['Summit Climber', 'Harbor Tower', 'Twin Slide Deck', 'Ridge Explorer', 'Canopy Fort', 'Orbit Spinner'][i]}</b><span class="muted">$${[6900, 11200, 8450, 14300, 9600, 3800][i].toLocaleString()}</span></div>`).join('')}</div></div></div></div>`;
  },

  'survey-intelligence': `<div style="background:#0b1020;height:900px;color:#fff;font-family:Inter,system-ui">
    <div class="row" style="align-items:center;padding:26px 64px"><b style="font-size:20px">Consult<span style="color:#7c8cff">.</span></b><span style="margin-left:60px;opacity:.7">Services</span><span style="opacity:.7">Survey Intelligence</span><span style="opacity:.7">Insights</span><span class="btn" style="margin-left:auto;background:#5a6bff;color:#fff">Book a call</span></div>
    <div style="padding:70px 64px 0;display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center"><div><span class="pill" style="background:#5a6bff33;color:#aab4ff">SURVEY INTELLIGENCE</span><h1 style="font-size:64px;line-height:1.02;margin-top:18px;letter-spacing:-.04em">Turn every survey into a decision.</h1><p style="opacity:.7;font-size:18px;margin-top:18px;max-width:30em">Research design, fieldwork and analysis that tells leadership what to do next.</p><div class="row" style="margin-top:28px"><span class="btn" style="background:#5a6bff">Explore services</span><span class="btn" style="border:1px solid #ffffff40">Case studies</span></div></div>
    <div class="card" style="background:#141b33;border-color:#ffffff1a;color:#fff"><h2>Response insight</h2>${[['Very satisfied', 62], ['Satisfied', 24], ['Neutral', 9], ['Unsatisfied', 5]].map(([l, v]) => `<div style="margin-top:16px"><div class="row" style="justify-content:space-between"><span style="opacity:.8">${l}</span><b>${v}%</b></div><div style="height:8px;border-radius:8px;background:#ffffff14;margin-top:6px"><div style="width:${v}%;height:8px;border-radius:8px;background:linear-gradient(90deg,#5a6bff,#9f7bff)"></div></div></div>`).join('')}</div></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:56px 64px 0">${['Market research', 'Customer experience', 'Employee surveys', 'Data analysis'].map((s, i) => `<div class="card" style="background:#141b33;border-color:#ffffff1a;color:#fff"><div style="width:36px;height:36px;border-radius:10px;background:#5a6bff33;display:grid;place-items:center;color:#aab4ff">0${i + 1}</div><h2 style="margin-top:14px">${s}</h2><p style="opacity:.6;font-size:13px;margin-top:6px">Service widget · edited in Elementor</p></div>`).join('')}</div></div>`,

  'client-finder': `<div style="background:#f6f5f2;height:900px;padding:28px 40px;font-family:Inter,system-ui">
    <div class="row" style="align-items:center;margin-bottom:22px"><b style="font-size:20px">Client Finder</b><span class="muted" style="margin-left:24px">Discover</span><span><b>Leads</b></span><span class="muted">Outreach</span><span class="btn" style="margin-left:auto;background:#111;color:#fff">New search</span></div>
    <div class="row" style="margin-bottom:18px">${stat('Firms found', '148', '#111', 'Personal injury · Phoenix, AZ')}${stat('Audited', '148', '#111', 'speed, SEO, mobile')}${stat('Weak SEO', '37', '#ff4d1f', 'qualified leads')}${stat('Drafts ready', '12', '#00a32a', 'awaiting review')}</div>
    <div class="card" style="padding:0"><table><tr><th>Firm</th><th>Website</th><th>SEO score</th><th>Mobile</th><th>Speed</th><th>Status</th></tr>
    ${[['Example Injury Law', 'exampleinjury.com', 38, 'Fails', '6.8s', 'Draft ready'], ['Sample & Partners', 'samplepartners.com', 44, 'Passes', '4.1s', 'Draft ready'], ['Demo Legal Group', 'demolegal.com', 51, 'Fails', '5.2s', 'Audited'], ['Placeholder Law', 'placeholderlaw.com', 29, 'Fails', '9.4s', 'Draft ready'], ['Test Trial Attorneys', 'testtrial.com', 57, 'Passes', '3.6s', 'Audited'], ['Mock Accident Lawyers', 'mockaccident.com', 33, 'Fails', '7.1s', 'Sent']].map(([n, w, s, m, sp, st]) => `<tr><td><b>${n}</b></td><td class="mono muted">${w}</td><td><div class="row" style="align-items:center;gap:8px"><div style="width:90px;height:6px;border-radius:6px;background:#eee"><div style="width:${s}%;height:6px;border-radius:6px;background:${s < 45 ? '#ff4d1f' : '#dba617'}"></div></div>${s}</div></td><td>${m}</td><td class="mono">${sp}</td><td><span class="pill" style="background:${st === 'Sent' ? '#00a32a1a' : '#1111110f'};color:${st === 'Sent' ? '#00a32a' : '#111'}">${st}</span></td></tr>`).join('')}</table></div></div>`,

  jarvis: `<div style="background:radial-gradient(60% 60% at 50% 45%,#08343a,#030b0d 70%);height:900px;color:#d9fbff;font-family:Inter,system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px">
    <div style="position:relative;width:300px;height:300px">${[300, 240, 180].map((d, i) => `<div style="position:absolute;left:${(300 - d) / 2}px;top:${(300 - d) / 2}px;width:${d}px;height:${d}px;border-radius:50%;border:1px solid #00c2d1${['44', '77', 'cc'][i]};box-shadow:0 0 ${40 + i * 30}px #00c2d1${['22', '33', '55'][i]}"></div>`).join('')}<div style="position:absolute;left:105px;top:105px;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#7ff6ff,#00c2d1 60%,#00626b)"></div></div>
    <div style="font-size:13px;letter-spacing:.3em;color:#00c2d1">LISTENING</div>
    <div style="font-size:30px;font-weight:500;letter-spacing:-.02em">“What’s on my calendar tomorrow?”</div>
    <div class="row" style="gap:12px">${['Wake word · on device', 'Whisper STT · local', 'Llama · Ollama', 'Kokoro TTS · local'].map((t) => `<span class="pill" style="background:#00c2d11a;color:#7ff6ff;border:1px solid #00c2d144;padding:8px 14px">${t}</span>`).join('')}</div>
    <div class="mono" style="opacity:.5;font-size:12px">0 network calls this session</div></div>`,

  'sturgill-ortho': `<div style="background:#fff;height:900px;font-family:Inter,system-ui">
    <div style="background:#0c2340;color:#fff;font-size:12px;padding:8px 48px" class="row"><span>Mon–Thu 8:00–5:00</span><span style="margin-left:auto">Trusted by local families</span></div>
    <div class="row" style="align-items:center;padding:18px 48px"><b style="font-size:20px;color:#0c2340">Sturgill Orthodontics</b><span style="margin-left:60px">Treatments ▾</span><span>Our Team</span><span>Affordability</span><span>Contact</span><span class="btn" style="margin-left:auto;background:#0097a7;color:#fff;border-radius:99px">Book Free Consultation</span></div>
    <div style="margin:0 48px;border-radius:24px;height:600px;background:linear-gradient(120deg,#0c2340,#0097a7);position:relative;overflow:hidden;color:#fff;padding:70px 64px">
    <div style="position:absolute;right:-80px;top:-80px;width:520px;height:520px;border-radius:50%;background:#ffffff14"></div><div style="position:absolute;right:120px;bottom:-140px;width:380px;height:380px;border-radius:50%;background:#ffffff10"></div>
    <div style="max-width:560px"><span class="pill" style="background:#ffffff26">★★★★★ 5-star rated</span><h1 style="font-size:58px;line-height:1.04;margin-top:18px;letter-spacing:-.03em">Your trusted local orthodontist</h1><p style="font-size:18px;opacity:.85;margin-top:16px">Braces and Invisalign for kids, teens and adults across three offices.</p><span class="btn" style="margin-top:26px;background:#fff;color:#0c2340;border-radius:99px;padding:13px 22px">Book Free Consultation</span></div>
    <div class="card" style="position:absolute;right:64px;top:60px;width:380px;color:#1d2327"><h2 style="font-size:20px">Book your consultation</h2><p class="muted" style="font-size:13px">Takes less than 60 seconds</p>${['Name', 'Phone', 'Preferred date'].map((l) => `<div style="margin-top:12px"><div style="font-size:12px;font-weight:600">${l} *</div><div style="height:38px;border:1px solid #dcdcde;border-radius:8px;margin-top:4px"></div></div>`).join('')}<div class="row" style="gap:8px;margin-top:14px">${['Routine checkup', 'New patient', 'Other'].map((t, i) => `<div style="flex:1;border:1.5px solid ${i === 1 ? '#0097a7' : '#dcdcde'};border-radius:10px;padding:10px;font-size:12px;text-align:center">${t}</div>`).join('')}</div><div class="btn" style="margin-top:16px;width:100%;justify-content:center;background:#0097a7;color:#fff">Request appointment</div></div></div></div>`,
};

const b = await chromium.launch({ headless: true, executablePath: '/Users/ajwamalik/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const [slug, html] of Object.entries(pages)) {
  if (process.argv[2] && !process.argv.slice(2).includes(slug)) continue;
  await p.setContent(`<!doctype html><html><head><style>${base}</style></head><body>${typeof html === 'function' ? html() : html}</body></html>`);
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await p.screenshot({ path: out(slug) });
  console.log('ok', slug);
}
await b.close();
