import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { site, services, projects, featuredProjects, categories, tools, principles, experience, education } from './data.js';
import * as fx from './sections.js';

gsap.registerPlugin(ScrollTrigger);

const page = document.body.dataset.page;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const projectHref = (p) => `/project.html?p=${p.slug}`;

/* ---------- Shared chrome ---------- */

function cover(p, extra = '', eager = false) {
  const [c1, c2, c3] = p.colors;
  const style = `--c1:${c1};--c2:${c2};--c3:${c3}`;
  if (p.cover) {
    return `<div class="cover has-img ${extra}" style="${style}"><img src="${p.cover}" alt="${esc(p.title)} website mockup" ${eager ? '' : 'loading="lazy"'} decoding="async" width="1600" height="1100"></div>`;
  }
  return `<div class="cover ${extra}" style="${style}"><span>${esc(p.mark)}</span></div>`;
}

function renderChrome() {
  const nav = [
    ['Home', '/'],
    ['Projects', '/projects.html'],
    ['SEO', '/seo.html'],
    ['Experience', '/experience.html'],
    ['About', '/about.html'],
    ['Contact', '/contact.html'],
  ];
  const socials = site.socials.filter((s) => s.url);

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="preloader" aria-hidden="true"><span class="mono preloader-count">0</span><div class="preloader-bar"><i></i></div></div>
     <div class="curtain" aria-hidden="true"></div>
     <header class="header wrap">
       <a class="logo" href="/">${esc(site.name)}<sup>®</sup></a>
       <nav class="header-nav mono">${nav.slice(1).map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</nav>
       <button class="menu-btn mono" aria-expanded="false" aria-controls="menu"><span>Menu</span><i></i><i></i></button>
     </header>
     <div class="menu" id="menu" hidden>
       <nav>${nav.map(([l, h], i) => `<a href="${h}"><span class="mono">0${i + 1}</span>${l}</a>`).join('')}</nav>
       <div class="menu-foot mono"><a data-email></a><span>${socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join(' ')}</span></div>
     </div>`
  );

  document.body.insertAdjacentHTML(
    'beforeend',
    `<footer class="footer" data-letter-zone>
       <div class="footer-inner wrap">
         <div class="footer-top">
           <p class="mono label">Got a project in mind?</p>
           <a class="footer-cta" href="/contact.html" data-cursor="Write"><span data-footer-letters>Let&#8217;s talk</span><span class="footer-cta-arrow" aria-hidden="true">&#8599;</span></a>
         </div>
         <div class="footer-mid">
           <button class="copy-email" type="button" data-copy-email>
             <span class="copy-email-text"></span>
             <span class="copy-email-state mono">Copy</span>
           </button>
           <button class="to-top" type="button" data-to-top data-magnetic aria-label="Back to top">&#8593;</button>
         </div>
         <div class="footer-grid mono">
           <div><p class="label">Pages</p>${nav.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div>
           <div><p class="label">Social</p>${socials.length ? socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label} &#8599;</a>`).join('') : '<span>Links coming soon</span>'}</div>
           <div><p class="label">Local time</p><span data-clock></span></div>
           <div><p class="label">&copy; ${new Date().getFullYear()}</p><span>${esc(site.name)}</span></div>
         </div>
         <div class="footer-name" aria-hidden="true">
           <span class="footer-name-outline">${esc(site.name)}</span>
           <span class="footer-name-fill">${esc(site.name)}</span>
         </div>
       </div>
     </footer>
     ${fine ? '<div class="cursor" aria-hidden="true"><span></span></div>' : ''}`
  );

  document.querySelectorAll('[data-email]').forEach((a) => {
    a.href = `mailto:${site.email}`;
    a.textContent = site.email;
  });

  const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('.header-nav a, .menu nav a').forEach((a) => {
    const href = a.getAttribute('href').replace(/\.html$/, '');
    if (href === path || (path === '/project' && href === '/projects')) a.classList.add('is-current');
  });
}

function initFooter(lenis) {
  const footer = document.querySelector('.footer');
  fx.initLetterField(footer.querySelector('[data-footer-letters]'), { lift: 50, spread: 320, rotate: 14 });

  const copy = footer.querySelector('[data-copy-email]');
  const state = copy.querySelector('.copy-email-state');
  copy.querySelector('.copy-email-text').textContent = site.email;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      state.textContent = 'Copied ✓';
    } catch {
      location.href = `mailto:${site.email}`;
    }
    copy.classList.add('is-copied');
    setTimeout(() => ((state.textContent = 'Copy'), copy.classList.remove('is-copied')), 1800);
  });

  footer.querySelector('[data-to-top]').addEventListener('click', () =>
    lenis ? lenis.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  );

  // Spotlight: the filled copy of the name shows only around the cursor.
  const name = footer.querySelector('.footer-name');
  name.addEventListener('pointermove', (e) => {
    const r = name.getBoundingClientRect();
    name.style.setProperty('--mx', `${e.clientX - r.left}px`);
    name.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

function initHero(lenis) {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const nameEl = hero.querySelector('[data-chars]');
  const text = nameEl.textContent;
  // Each letter sits in its own clipped wrapper so it can rise into view.
  nameEl.innerHTML = [...text]
    .map((c) => (c === ' ' ? '<span class="ch-wrap">&nbsp;</span>' : `<span class="ch-wrap"><span class="ch">${esc(c)}</span></span>`))
    .join('');

  // Size the name so it spans the full content width.
  const fit = () => {
    nameEl.style.fontSize = '100px';
    const avail = nameEl.closest('.hero-inner').clientWidth - parseFloat(getComputedStyle(nameEl.closest('.hero-inner')).paddingLeft) * 2;
    // Glyphs overhang their boxes slightly at large sizes, so leave a little room.
    // Cap by height too, so the name never runs off the bottom on short screens.
    const byWidth = (avail / nameEl.getBoundingClientRect().width) * 100 * 0.97;
    nameEl.style.fontSize = `${Math.floor(Math.min(byWidth, innerHeight * 0.26))}px`;
  };
  fit();
  addEventListener('resize', fit);
  document.fonts?.ready.then(fit);

  // Rotating "new case" card through the featured projects.
  const caseEl = document.getElementById('hero-case');
  const list = featuredProjects.filter((p) => p.cover);
  caseEl.innerHTML = `<a class="hero-case-link" href="${projectHref(list[0])}" data-cursor="View">
      <div class="hero-case-media">${list.map((p, i) => `<img src="${p.cover}" alt="${esc(p.title)} mockup" class="${i ? '' : 'is-on'}" ${i ? 'loading="lazy"' : ''} decoding="async">`).join('')}
        <span class="hero-case-btn">New case <i aria-hidden="true">&rarr;</i></span></div>
      <div class="hero-case-info"><span class="hero-case-name">${esc(list[0].title)}</span><span class="hero-case-tags"></span></div>
    </a>`;
  const link = caseEl.querySelector('a');
  const imgs = caseEl.querySelectorAll('img');
  const nameOut = caseEl.querySelector('.hero-case-name');
  const tags = caseEl.querySelector('.hero-case-tags');
  // Blurred copies of the same covers fill the background and change with the card.
  const bg = document.getElementById('hero-bg');
  bg.innerHTML = list.map((p, i) => `<img src="/hero/${p.slug}.webp" alt="" class="${i ? '' : 'is-on'}" ${i ? 'loading="lazy"' : ''}>`).join('');
  const bgs = bg.querySelectorAll('img');
  const show = (i) => {
    const p = list[i];
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    bgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    link.href = projectHref(p);
    nameOut.textContent = p.title;
    tags.innerHTML = [p.category, p.stack[0]].map((t) => `<span>${esc(t)}</span>`).join('');
  };
  show(0);
  if (!reduced && list.length > 1) {
    let i = 0;
    let paused = false;
    link.addEventListener('pointerenter', () => (paused = true));
    link.addEventListener('pointerleave', () => (paused = false));
    setInterval(() => {
      if (paused || document.hidden || scrollY > innerHeight) return;
      i = (i + 1) % list.length;
      show(i);
    }, 3200);
  }

  if (!reduced) {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from('.hero-name .ch', { yPercent: 110, duration: 1.5, ease: 'expo.out', stagger: 0.05 })
      .from('.hero-info li', { y: 16, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.03 }, 0.5)
      .from('.hero-case', { clipPath: 'inset(100% 0 0 0 round 10px)', duration: 1.3, ease: 'expo.inOut' }, 0.4)
      .from('.hero-descr', { y: 24, opacity: 0, duration: 1, ease: 'expo.out' }, 0.8)
      .from('.hero-bg', { opacity: 0, scale: 1.1, duration: 2, ease: 'expo.out' }, 0)
      .set('.hero-case', { clearProps: 'clipPath' });
  }

  initHeroPointer(hero);
  initHeroPin();
}

/* Cursor light: a pink spotlight follows the pointer, dots light up beneath it, and the background drifts the other way. */
function initHeroPointer(hero) {
  if (reduced || !fine) return;
  const spot = hero.querySelector('.hero-spot');
  const dots = hero.querySelector('.hero-dots');
  const bg = hero.querySelector('.hero-bg');
  const sx = gsap.quickTo(spot, 'x', { duration: 0.8, ease: 'power3' });
  const sy = gsap.quickTo(spot, 'y', { duration: 0.8, ease: 'power3' });
  const bx = gsap.quickTo(bg, 'x', { duration: 1.6, ease: 'power3' });
  const by = gsap.quickTo(bg, 'y', { duration: 1.6, ease: 'power3' });
  const m = { x: innerWidth / 2, y: innerHeight * 0.4 };
  const d = { x: m.x, y: m.y };
  gsap.set(spot, { x: m.x, y: m.y });
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    m.x = e.clientX - r.left;
    m.y = e.clientY - r.top;
    sx(m.x);
    sy(m.y);
    bx((0.5 - m.x / r.width) * 40);
    by((0.5 - m.y / r.height) * 30);
  });
  // Ease the dot mask toward the pointer; skip work once it has settled or the hero is off screen.
  gsap.ticker.add(() => {
    if (scrollY > innerHeight) return;
    const dx = m.x - d.x, dy = m.y - d.y;
    if (Math.abs(dx) + Math.abs(dy) < 0.5) return;
    d.x += dx * 0.12;
    d.y += dy * 0.12;
    dots.style.setProperty('--mx', `${d.x}px`);
    dots.style.setProperty('--my', `${d.y}px`);
  });
}

/* The hero holds still and recedes while the next section slides up over it. */
function initHeroPin() {
  if (reduced) return;
  const hero = document.querySelector('.hero');
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false });
  gsap.to('.hero-inner', {
    scale: 0.92, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

function initClock() {
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone, timeZoneName: 'short' });
  const tick = () => document.querySelectorAll('[data-clock]').forEach((el) => (el.textContent = fmt.format(new Date())));
  tick();
  setInterval(tick, 30_000);
}

function initMenu(lenis) {
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const links = menu.querySelectorAll('nav a');
  let open = false;
  const set = (v) => {
    open = v;
    btn.setAttribute('aria-expanded', v);
    document.body.classList.toggle('menu-open', v);
    if (v) {
      menu.hidden = false;
      lenis?.stop();
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, delay: 0.25, ease: 'expo.out' });
    } else {
      lenis?.start();
      gsap.to(menu, { clipPath: 'inset(100% 0 0% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => (menu.hidden = true) });
    }
  };
  btn.addEventListener('click', () => set(!open));
  addEventListener('keydown', (e) => e.key === 'Escape' && open && set(false));
}

/* ---------- Motion ---------- */

function splitWords(el) {
  if (el.dataset.splitDone) return el.querySelectorAll('.w > span');
  el.dataset.splitDone = '1';
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w" aria-hidden="true"><span>${esc(w)}</span></span>`)
    .join(' ');
  return el.querySelectorAll('.w > span');
}

function initReveals() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = splitWords(el);
    if (reduced) return;
    gsap.from(words, {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.025,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (reduced) return;
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  document.querySelectorAll('.card .cover').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
  });
}

function initCursor() {
  const cur = document.querySelector('.cursor');
  if (!cur) return;
  const x = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const y = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('a, button, [data-cursor]');
    cur.classList.toggle('is-link', !!t);
    cur.querySelector('span').textContent = t?.dataset.cursor || '';
    cur.classList.toggle('is-label', !!t?.dataset.cursor);
  });
}

function initMagnetic() {
  if (!fine) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.35);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}

// Curtain wipe between pages: cover on leave, uncover on load.
function initTransitions(uncover) {
  const curtain = document.querySelector('.curtain');
  if (uncover) gsap.fromTo(curtain, { yPercent: 0 }, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.05 });
  else gsap.set(curtain, { yPercent: -100 });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href === location.href || a.getAttribute('href').startsWith('mailto:')) return;
    e.preventDefault();
    gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => (location.href = url.href) });
  });
  // Restore from bfcache without the curtain stuck down.
  addEventListener('pageshow', (e) => e.persisted && gsap.set(curtain, { yPercent: -100 }));
}

function runPreloader() {
  const el = document.querySelector('.preloader');
  if (sessionStorageGet('seen') || reduced) {
    el.remove();
    return Promise.resolve(false);
  }
  sessionStorageSet('seen', '1');
  gsap.set('.curtain', { yPercent: -100 });
  const count = el.querySelector('.preloader-count');
  const bar = el.querySelector('.preloader-bar i');
  const state = { v: 0 };
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => (el.remove(), resolve(true)) })
      .to(state, {
        v: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = Math.round(state.v);
          bar.style.transform = `scaleX(${state.v / 100})`;
        },
      })
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' });
  });
}

function sessionStorageGet(k) {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
}
function sessionStorageSet(k, v) {
  try {
    sessionStorage.setItem(k, v);
  } catch {}
}

/* ---------- Page renderers ---------- */

function card(p, i) {
  return `<a class="card" href="${projectHref(p)}" data-cursor="View">
    <div class="card-media">${cover(p)}</div>
    <div class="card-meta"><h3>${esc(p.title)}</h3><span class="mono">${esc(p.category)} · ${p.year}</span></div>
    <p class="card-sum">${esc(p.summary)}</p>
  </a>`;
}

function renderServices() {
  const el = document.getElementById('services');
  if (!el) return;
  el.innerHTML = services
    .map(
      (s, i) => `<div class="service" data-reveal>
        <span class="mono">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>
      </div>`
    )
    .join('');
}

function hcard(p, i) {
  return `<a class="hcard" href="${projectHref(p)}" data-cursor="View">
    <div class="hcard-media">${cover(p)}</div>
    <div class="hcard-meta">
      <span class="mono">${String(i + 1).padStart(2, '0')} · ${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
    </div>
  </a>`;
}

function hcardAll() {
  return `<a class="hcard hcard-all" href="/projects.html" data-cursor="Open">
    <div class="hcard-media"><div class="hcard-all-inner"><span class="mono">Archive</span><strong>${projects.length}</strong><span>projects. See them all →</span></div></div>
  </a>`;
}

function renderPrinciples() {
  const el = document.getElementById('principles');
  if (!el) return;
  el.innerHTML = principles
    .map((p, i) => `<div class="principle" data-reveal><span class="mono">0${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></div>`)
    .join('');
}

function home() {
  renderServices();
  renderCareer();
  fx.initToolGrid(tools);
}

function projectsPage() {
  const list = document.getElementById('project-list');
  const grid = document.getElementById('project-grid');
  const filters = document.getElementById('project-filters');
  const counts = Object.fromEntries(categories.map((c) => [c, projects.filter((p) => p.category === c).length]));
  filters.innerHTML = [['All', projects.length], ...categories.map((c) => [c, counts[c]]).filter(([, n]) => n)]
    .map(([c, n], i) => `<button class="${i ? '' : 'is-active'}" data-filter="${c}">${esc(c)}<sup>${n}</sup></button>`)
    .join('');
  list.innerHTML = projects
    .map(
      (p, i) => `<li data-cat="${esc(p.category)}"><a href="${projectHref(p)}" data-slug="${p.slug}" data-cursor="View">
        <span class="mono idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="t">${esc(p.title)}</span>
        <span class="mono c">${esc(p.category)}</span>
        <span class="mono y">${p.year}</span>
      </a></li>`
    )
    .join('');
  grid.innerHTML = projects.map((p, i) => card(p, i).replace('<a class="card"', `<a data-cat="${esc(p.category)}" class="card"`)).join('');

  filters.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    filters.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b));
    const f = b.dataset.filter;
    document.querySelectorAll('#project-list [data-cat], #project-grid [data-cat]').forEach((el) => {
      el.classList.toggle('is-hidden', f !== 'All' && el.dataset.cat !== f);
    });
    ScrollTrigger.refresh();
  });
  // Links like /projects.html#seo open with that filter applied.
  const want = { seo: 'SEO', web: 'Web app', websites: 'Website', wordpress: 'WordPress' }[location.hash.slice(1)];
  if (want) filters.querySelector(`[data-filter="${want}"]`)?.click();

  document.querySelectorAll('.view-toggle button').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach((x) => x.classList.toggle('is-active', x === b));
      const isGrid = b.dataset.view === 'grid';
      list.classList.toggle('is-hidden', isGrid);
      grid.classList.toggle('is-hidden', !isGrid);
      ScrollTrigger.refresh();
    })
  );

  // Floating preview that follows the cursor over list rows.
  const preview = document.querySelector('.hover-preview');
  if (!fine) return;
  const x = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const y = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
  addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
  });
  list.addEventListener('pointerover', (e) => {
    const a = e.target.closest('a[data-slug]');
    if (!a) return;
    preview.innerHTML = cover(projects.find((p) => p.slug === a.dataset.slug));
    preview.classList.add('is-on');
  });
  list.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
}

function projectPage() {
  const slug = new URLSearchParams(location.search).get('p') || location.pathname.split('/').pop();
  const i = projects.findIndex((p) => p.slug === slug);
  const root = document.getElementById('case');
  if (i < 0) {
    root.innerHTML = `<section class="page-head wrap"><h1 class="page-title">Project not found</h1><a class="link-arrow" href="/projects.html">Back to projects</a></section>`;
    return;
  }
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  document.title = `${p.title} — ${site.name}`;
  const list = (items) => `<ul class="case-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const metrics = p.metrics?.length
    ? `<section class="wrap" data-reveal><div class="case-metrics">
        ${p.metrics.map((m) => `<div><span class="mono">${esc(m.label)}</span><strong>${esc(m.value)}</strong><small>${esc(m.note || '')}</small></div>`).join('')}
        ${p.dataWindow ? `<p class="mono case-window">Google Search Console · ${esc(p.dataWindow)}</p>` : ''}
      </div></section>`
    : '';
  const shots = [...(p.gallery || [])];
  const gallery = shots.length || p.mobile
    ? `<section class="wrap case-gallery">
        ${shots.map((src) => `<figure data-reveal><img src="${src}" alt="${esc(p.title)} ${src.includes('gsc') ? 'Search Console performance' : 'homepage'}" loading="lazy" decoding="async"></figure>`).join('')}
        ${p.mobile ? `<figure class="is-phone" data-reveal><img src="${p.mobile}" alt="${esc(p.title)} on mobile" loading="lazy" decoding="async"></figure>` : ''}
      </section>`
    : '';
  root.innerHTML = `
    <section class="page-head wrap">
      <p class="mono label" data-reveal>${esc(p.category)} · ${p.year}</p>
      <h1 class="page-title" data-split>${esc(p.title)}</h1>
      <p class="lead case-sum" data-reveal>${esc(p.summary)}</p>
    </section>
    <section class="wrap case-hero" data-reveal>${cover(p, 'cover-xl', true)}</section>
    ${metrics}
    <section class="wrap case-grid">
      <dl class="case-facts mono" data-reveal>
        ${p.client ? `<div><dt>Client</dt><dd>${esc(p.client)}</dd></div>` : ''}
        ${p.role ? `<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>` : ''}
        <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
        <div><dt>${p.category === 'SEO' ? 'Services' : 'Stack'}</dt><dd>${p.stack.map(esc).join('<br>')}</dd></div>
        ${p.url ? `<div><dt>Live</dt><dd><a href="${p.url}" target="_blank" rel="noopener">Visit site ↗</a></dd></div>` : ''}
      </dl>
      <div class="case-copy">
        <h2 class="mono label" data-reveal>The problem</h2>
        <p data-split>${esc(p.challenge)}</p>
        <h2 class="mono label" data-reveal>${p.category === 'SEO' ? 'The work' : 'What I built'}</h2>
        <p data-split>${esc(p.solution)}</p>
        ${p.features?.length ? `<h2 class="mono label" data-reveal>${p.category === 'SEO' ? 'Approach' : 'Highlights'}</h2>${list(p.features)}` : ''}
        ${p.results?.length ? `<h2 class="mono label" data-reveal>Results</h2>${list(p.results)}` : ''}
      </div>
    </section>
    ${gallery}
    <a class="next-project wrap" href="${projectHref(next)}" data-cursor="Next">
      <span class="mono label">Next project</span>
      <span class="next-title">${esc(next.title)}</span>
    </a>`;
}

function expRow(e, i, full) {
  return `<article class="exp" data-reveal>
    <div class="exp-logo${e.dark ? ' is-dark' : ''}"><img src="${e.logo}" alt="${esc(e.company)} logo" loading="lazy">${e.logo2 ? `<img src="${e.logo2}" alt="Vape Closeouts logo" loading="lazy">` : ''}</div>
    <div class="exp-main">
      <p class="mono exp-dates">${esc(e.dates)}</p>
      <h3>${esc(e.role)}</h3>
      <p class="exp-co">${esc(e.company)} <span>· ${esc(e.place)}</span></p>
      ${full ? `<ul class="case-list">${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>
    <span class="mono exp-idx">${String(i + 1).padStart(2, '0')}</span>
  </article>`;
}

function experiencePage() {
  document.getElementById('experience-list').innerHTML = experience.map((e, i) => expRow(e, i, true)).join('');
  document.getElementById('education-list').innerHTML = `<p class="mono label" data-reveal>Education</p>` +
    education.map((e) => `<div class="edu-row" data-reveal><h3>${esc(e.title)}</h3><p>${esc(e.place)}</p><span class="mono">${esc(e.dates)}</span></div>`).join('');
}

function renderCareer() {
  const el = document.getElementById('career-list');
  if (el) el.innerHTML = experience.map((e, i) => expRow(e, i, false)).join('');
}

function seoPage() {
  const seo = projects.filter((p) => p.category === 'SEO' && p.metrics?.length);
  const num = (v = '0') => parseFloat(v) * (/K/i.test(v) ? 1000 : 1);
  const total = (re) => seo.reduce((t, p) => t + num(p.metrics.find((m) => re.test(m.label))?.value), 0);
  const fmt = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 100) / 10}K` : String(n));
  document.getElementById('seo-totals').innerHTML = `<div class="seo-totals-grid">
    <div><strong>${fmt(total(/^impressions$/i))}</strong><span class="mono">Impressions across these sites</span></div>
    <div><strong>${fmt(total(/^organic clicks$/i))}</strong><span class="mono">Organic clicks across these sites</span></div>
    <div><strong>${seo.length}</strong><span class="mono">Sites with Search Console data</span></div></div>`;
  document.getElementById('seo-list').innerHTML = seo
    .map((p) => `<a class="seo-case" href="${projectHref(p)}" data-cursor="View" data-reveal>
      <div class="seo-case-media">${cover(p)}</div>
      <div class="seo-case-body">
        <p class="mono label">${esc(p.client || '')}</p>
        <h2>${esc(p.title)}</h2>
        <div class="seo-case-metrics">${p.metrics.slice(0, 4).map((m) => `<div><strong>${esc(m.value)}</strong><span class="mono">${esc(m.label)}</span></div>`).join('')}</div>
        <span class="link-arrow">Read the case study</span>
      </div>
    </a>`)
    .join('');
}

function contactPage() {
  const form = document.getElementById('contact-form');
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = 'Please fill in your name, a valid email and a message.';
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${d.get('type')} enquiry`)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Opening your email app…';
  });
}

/* ---------- Boot ---------- */

async function boot() {
  renderChrome();
  initClock();

  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (page === 'home') home();
  if (page === 'projects') projectsPage();
  if (page === 'project') projectPage();
  if (page === 'about') {
    renderServices();
    renderPrinciples();
    fx.initToolGrid(tools);
  }
  if (page === 'contact') contactPage();
  if (page === 'seo') seoPage();
  if (page === 'experience') experiencePage();

  initMenu(lenis);
  initFooter(lenis);
  if (page === 'home') initHero(lenis);
  initCursor();
  initMagnetic();
  const preloaded = await runPreloader();
  initTransitions(!preloaded && !reduced);
  initReveals();
  fx.initScrubText();
  fx.initExpand();
  fx.initMarquees();
  // Pins must be created in page order, so the gallery pin comes after the expanding panel's.
  if (page === 'home') fx.initHorizontal(featuredProjects.map(hcard).join('') + hcardAll());
  fx.initProcess();
  fx.initImageReveals();
  fx.initVelocitySkew();
  fx.initScrollProgress();
  fx.initHeaderHide();
  fx.initScramble();
  // Fonts change line lengths, which moves every pinned section's start point.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

boot();
