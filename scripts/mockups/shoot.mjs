// Screenshots each project's live site at desktop and phone sizes into ./shots/<slug>-{d,m}.png.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/ajwamalik/inovista/node_modules/');
const { chromium } = require('playwright');
const targets = JSON.parse(fs.readFileSync(new URL('./targets.json', import.meta.url)));
const only = process.argv.slice(2);
// This Mac's resolver caches failed lookups, so resolve every host through 1.1.1.1 and pin it in Chromium.
import { execSync } from 'node:child_process';
const rules = [];
for (const [s, u] of Object.entries(targets)) {
  if (only.length && !only.includes(s)) continue;
  const h = new URL(u).hostname;
  if (h === 'localhost') continue;
  for (const host of new Set([h, h.startsWith('www.') ? h.slice(4) : 'www.' + h])) {
    const ip = execSync(`dig @1.1.1.1 +short ${host} | grep -E '^[0-9.]+$' | tail -1`).toString().trim();
    if (ip) rules.push(`MAP ${host} ${ip}`);
  }
}
process.env.RULES = [process.env.RULES, ...rules].filter(Boolean).join(',');
fs.mkdirSync(new URL('./shots/', import.meta.url), { recursive: true });
const browser = await chromium.launch({ headless: true, args: process.env.RULES ? ['--host-resolver-rules=' + process.env.RULES] : [], executablePath: '/Users/ajwamalik/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' });
const sizes = { d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
async function shoot([slug, url]) {
  for (const [k, opts] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ ...opts, userAgent: k === 'm' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(3500);
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      // Finish entrance animations instantly (Elementor, AOS, WOW) so nothing is caught mid-fade.
      await page.addStyleTag({ content: `*,*::before,*::after{animation-delay:0s!important;animation-duration:.001s!important;transition-duration:.001s!important;transition-delay:0s!important}
        .elementor-invisible,[data-aos],.wow,.animated{visibility:visible!important;opacity:1!important}
        [data-aos]{transform:none!important}` }).catch(() => {});
      // Scroll the whole page so lazy images load and scroll-triggered effects fire, then go back up.
      await page.evaluate(async () => {
        const h = Math.min(document.body.scrollHeight, 12000);
        for (let y = 0; y <= h; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
        scrollTo(0, 0);
      }).catch(() => page.waitForTimeout(3000));
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      // Wait until every image in the first screen has actually decoded.
      await page.evaluate(async () => {
        const imgs = [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight * 1.5);
        imgs.forEach((i) => { i.loading = 'eager'; });
        await Promise.race([Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; })))), new Promise((r) => setTimeout(r, 15000))]);
        // Hero videos: wait for a frame.
        await Promise.race([Promise.all([...document.querySelectorAll('video')].map((v) => (v.readyState >= 2 ? 0 : new Promise((r) => v.addEventListener('loadeddata', r, { once: true }))))), new Promise((r) => setTimeout(r, 8000))]);
      }).catch(() => {});
      await page.waitForTimeout(Number(process.env.WAIT || 3000));
      // Pass age gates on my own concept builds so the design shows.
      for (const t of ['Yes', 'I am 21', "I'm 21", 'Enter', 'Yes, I am']) {
        const b = page.locator(`button:has-text("${t}"), a:has-text("${t}")`).first();
        if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(800); break; }
      }
      // Close newsletter or rebate popups.
      await page.keyboard.press('Escape').catch(() => {});
      for (const sel of ['.pum-close', '.popmake-close', '[aria-label="Close"]', '.modal .close', '.mfp-close', 'button.close']) {
        const c = page.locator(sel).first();
        if (await c.isVisible().catch(() => false)) await c.click().catch(() => {});
      }
      await page.waitForTimeout(600);
      // Drop consent banners and chat bubbles so the mockup shows the design itself.
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
          const t = (el.innerText || '').toLowerCase();
          if (/cookie|consent|privacy|we value your/.test(t) && el.offsetHeight < innerHeight * 0.9) el.remove();
        }
        document.querySelectorAll('#onetrust-consent-sdk,#CybotCookiebotDialog,.cky-consent-container,#cookie-law-info-bar,.cookie-notice-container,[id*=cookie-banner],[class*=cookie-banner]').forEach((e) => e.remove());
      }).catch(() => {});
      // Embedded players that refuse headless browsers leave an error box; drop their whole section.
      if (process.env.HIDE_EMBEDS) await page.evaluate(() => document.querySelectorAll('iframe, video').forEach((f) => (f.closest('.shopify-section, section') || f).remove())).catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ timeout: 90000, animations: 'disabled', path: new URL(`./shots/${slug}-${k}.png`, import.meta.url).pathname });
      console.log('ok', slug, k, page.url());
    } catch (e) {
      console.log('FAIL', slug, k, e.message.split('\n')[0]);
    }
    await ctx.close();
  }
}
const list = Object.entries(targets).filter(([s]) => !only.length || only.includes(s));
for (let i = 0; i < list.length; i += 4) await Promise.all(list.slice(i, i + 4).map(shoot));
await browser.close();
