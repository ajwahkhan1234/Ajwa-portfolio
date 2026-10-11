import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/* Words light up one by one as the statement scrolls through the viewport. */
export function initScrubText() {
  document.querySelectorAll('[data-scrub]').forEach((el) => {
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="sw" aria-hidden="true">${esc(w)}</span>`)
      .join(' ');
    if (reduced) return;
    gsap.fromTo(
      el.querySelectorAll('.sw'),
      { opacity: 0.12 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } }
    );
  });
}

/* A rounded card that grows to fill the screen while pinned, showing a live shader. */
export function initExpand() {
  const section = document.querySelector('.expand');
  if (!section) return;
  const frame = section.querySelector('.expand-frame');
  const shader = startShader(section.querySelector('.shader-canvas'));
  if (reduced) return;
  gsap
    .timeline({
      scrollTrigger: {
        trigger: section, start: 'top top', end: '+=120%', scrub: true, pin: '.expand-pin',
        // Once the panel is full screen and scrolling away, hold the last frame instead of redrawing it.
        onLeave: () => shader?.pause(),
        onEnterBack: () => shader?.play(),
      },
    })
    .fromTo(frame, { clipPath: 'inset(22% 30% 22% 30% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' })
    // A clip-path at zero inset still costs a mask layer, so drop it once the frame is full.
    .set(frame, { clipPath: 'none' })
    .fromTo('.expand-copy', { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.45);
}

function startShader(canvas) {
  // preserveDrawingBuffer keeps the last frame on screen while the loop is paused.
  const gl = canvas?.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  if (!gl) return;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  // Layered value noise flowing through the brand palette.
  const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
  void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*2.2;
    vec2 q=vec2(fbm(p+t*.05),fbm(p+vec2(5.2,1.3)-t*.04));
    float f=fbm(p+3.*q+m*1.5);
    vec3 ink=vec3(.067),acc=vec3(1.,.31,.6),sand=vec3(.97,.94,.95);
    vec3 c=mix(ink,acc,smoothstep(.35,.75,f));c=mix(c,sand,smoothstep(.72,.95,f));
    c+=(h(gl_FragCoord.xy+t)-.5)*.04;gl_FragColor=vec4(c,1.);}`;
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, 'r');
  const uT = gl.getUniformLocation(prog, 't');
  const uM = gl.getUniformLocation(prog, 'm');
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / innerWidth - 0.5;
    mouse.ty = e.clientY / innerHeight - 0.5;
  });
  let visible = false;
  let paused = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const resize = () => {
    // A soft gradient upscales invisibly, so render it at half resolution.
    const dpr = 0.5;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Resizing clears the canvas, so repaint straight away even while the loop is paused.
    draw(last);
  };
  new ResizeObserver(resize).observe(canvas);
  let last = 0;
  const draw = (time) => {
    last = time;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 10 : time / 1000);
    gl.uniform2f(uM, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  // Draw once up front so the shader compiles before the section scrolls into view.
  resize();
  draw(0);
  const loop = (time) => {
    requestAnimationFrame(loop);
    if (!visible || paused) return;
    draw(time);
  };
  requestAnimationFrame(loop);
  return { pause: () => (paused = true), play: () => (paused = false) };
}

/* Endless marquees; scroll speed and direction push them faster or reverse them. */
export function initMarquees() {
  const rows = [...document.querySelectorAll('.marquee')];
  if (!rows.length) return;
  const anims = rows.map((row) => {
    const track = row.querySelector('.marquee-track');
    const items = track.dataset.items.split(',');
    const chunk = `<div class="marquee-chunk">${items.map((i) => `<span>${esc(i)}</span><i>✳</i>`).join('')}</div>`;
    track.innerHTML = chunk + chunk.replace('class="marquee-chunk"', 'class="marquee-chunk" aria-hidden="true"');
    const dir = Number(row.dataset.dir);
    return gsap.fromTo(track, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 28, ease: 'none', repeat: -1 });
  });
  if (reduced) return anims.forEach((a) => a.pause());
  let boost = 1;
  ScrollTrigger.create({
    onUpdate: (st) => {
      boost = gsap.utils.clamp(-6, 6, st.getVelocity() / 300) || 1;
    },
  });
  gsap.ticker.add(() => {
    boost += (Math.sign(boost) - boost) * 0.06;
    anims.forEach((a) => a.timeScale(boost));
  });
}

/* Pinned section whose cards slide sideways as you scroll down. */
export function initHorizontal(cardHtml) {
  const section = document.querySelector('.hscroll');
  if (!section) return;
  const track = section.querySelector('#hscroll-track');
  track.innerHTML = cardHtml;
  const cards = track.querySelectorAll('.hcard:not(.hcard-all)');
  section.querySelector('[data-htotal]').textContent = String(cards.length).padStart(2, '0');
  const count = section.querySelector('[data-hcount]');
  const bar = section.querySelector('.hscroll-bar i');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: '.hscroll-pin',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          bar.style.transform = `scaleX(${st.progress})`;
          count.textContent = String(Math.min(cards.length, Math.floor(st.progress * cards.length) + 1)).padStart(2, '0');
        },
      },
    });
    // Each cover drifts inside its frame while the row moves.
    cards.forEach((c) => {
      gsap.fromTo(
        c.querySelector('.cover'),
        { xPercent: -8 },
        { xPercent: 8, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }
      );
      gsap.from(c.querySelector('.hcard-meta'), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 80%' },
      });
    });
  });
}

/* Pinned steps driven straight by scroll position: no toggles, no delayed tweens. */
export function initProcess() {
  const section = document.querySelector('.process');
  if (!section) return;
  const steps = [...section.querySelectorAll('.process-steps li')];
  const digits = section.querySelector('.process-digits');
  const bar = section.querySelector('.process-progress i');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-pinned');
    gsap.set(steps, { autoAlpha: 0, y: 60 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', duration: 1 },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${innerHeight * (steps.length - 1) * 0.9}`,
        pin: '.process-pin',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl.to({}, { duration: 0.4 });
    for (let i = 1; i < steps.length; i++) {
      // Outgoing step clears before the next arrives, so the two never overlap.
      tl.to(steps[i - 1], { autoAlpha: 0, y: -60, duration: 0.45, ease: 'power2.in' }, `s${i}`)
        .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, `s${i}+=0.45`)
        .to(digits, { yPercent: (-100 / steps.length) * i }, `s${i}`)
        // A short hold so each step rests before the next one arrives.
        .to({}, { duration: 0.4 });
    }
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
    return () => section.classList.remove('is-pinned');
  });
}

/* Toolbox chips drop in with a staggered, springy wave. */
export function initToolGrid(tools) {
  const grid = document.getElementById('tool-grid');
  if (!grid) return;
  grid.innerHTML = tools.map((t) => `<li><span>${esc(t)}</span></li>`).join('');
  if (reduced) return;
  gsap.from(grid.children, {
    y: 60,
    opacity: 0,
    rotate: () => gsap.utils.random(-12, 12),
    duration: 1,
    ease: 'elastic.out(1, 0.6)',
    stagger: { each: 0.04, from: 'random' },
    scrollTrigger: { trigger: grid, start: 'top 85%' },
  });
}

/* Huge closing words scale down into place as the section scrolls in. */
export function initZoomText() {
  document.querySelectorAll('[data-zoom]').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(
      el,
      { scale: 2.4, opacity: 0.2, letterSpacing: '0.1em' },
      { scale: 1, opacity: 1, letterSpacing: '-0.06em', ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'center center', scrub: true } }
    );
  });
}

/* ---------- Site-wide extras ---------- */

export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.append(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

export function initHeaderHide() {
  const header = document.querySelector('.header');
  ScrollTrigger.create({
    start: 120,
    end: 'max',
    onUpdate: (st) => {
      header.classList.add('is-scrolled');
      header.classList.toggle('is-hidden-up', st.direction === 1 && !document.body.classList.contains('menu-open'));
    },
    onLeaveBack: () => header.classList.remove('is-hidden-up', 'is-scrolled'),
  });
}

/* Mono labels briefly scramble through glyphs on hover. */
export function initScramble() {
  if (reduced) return;
  const glyphs = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  document.querySelectorAll('.label, .link-arrow, .header-nav a, .mono.c').forEach((el) => {
    if (el.children.length) return;
    const original = el.textContent;
    let frame = 0;
    let raf;
    el.addEventListener('pointerenter', () => {
      cancelAnimationFrame(raf);
      frame = 0;
      const run = () => {
        el.textContent = original
          .split('')
          .map((ch, i) => (ch === ' ' || i < frame / 2 ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
          .join('');
        frame++;
        if (frame / 2 <= original.length) raf = requestAnimationFrame(run);
        else el.textContent = original;
      };
      run();
    });
  });
}

/* Cards lean into fast scrolling and settle when it stops. */
export function initVelocitySkew() {
  if (reduced) return;
  const targets = document.querySelectorAll('.card-media');
  if (!targets.length) return;
  const setSkew = gsap.quickTo(targets, 'skewY', { duration: 0.6, ease: 'power3' });
  ScrollTrigger.create({
    onUpdate: (st) => setSkew(gsap.utils.clamp(-6, 6, st.getVelocity() / -400)),
  });
}

/* Cover images open up with a clip-path wipe as they enter. */
export function initImageReveals() {
  if (reduced) return;
  document.querySelectorAll('.card-media, .case-hero .cover, .about-portrait').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });
}

/* Letters that react to the cursor: each one is pushed by distance from the pointer. */
export function initLetterField(el, { lift = 60, spread = 260, rotate = 18 } = {}) {
  if (!el) return;
  const text = el.textContent;
  el.setAttribute('aria-label', el.getAttribute('aria-label') || text.trim());
  el.innerHTML = [...text]
    .map((ch) => (ch === ' ' ? '<span class="lf-space"> </span>' : `<span class="lf" aria-hidden="true">${esc(ch)}</span>`))
    .join('');
  const letters = [...el.querySelectorAll('.lf')];
  if (reduced) return letters;
  const setters = letters.map((l) => ({
    l,
    y: gsap.quickTo(l, 'y', { duration: 0.6, ease: 'power3' }),
    x: gsap.quickTo(l, 'x', { duration: 0.6, ease: 'power3' }),
    r: gsap.quickTo(l, 'rotate', { duration: 0.6, ease: 'power3' }),
  }));
  let rects = [];
  const measure = () => (rects = letters.map((l) => l.getBoundingClientRect()).map((r) => ({ cx: r.left + r.width / 2 + scrollX, cy: r.top + r.height / 2 + scrollY })));
  let raf = 0;
  let active = false;
  const move = (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!rects.length) measure();
      const px = e.clientX + scrollX, py = e.clientY + scrollY;
      setters.forEach((s, i) => {
        const dx = rects[i].cx - px, dy = rects[i].cy - py;
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / spread);
        const k = f * f;
        s.y(-lift * k);
        s.x(Math.sign(dx) * lift * 0.35 * k);
        s.r(Math.sign(dx) * rotate * k);
        s.l.classList.toggle('is-hot', k > 0.25);
      });
    });
  };
  const reset = () => setters.forEach((s) => (s.y(0), s.x(0), s.r(0), s.l.classList.remove('is-hot')));
  const zone = el.closest('[data-letter-zone]') || el;
  zone.addEventListener('pointerenter', () => ((active = true), measure()));
  zone.addEventListener('pointermove', (e) => active && move(e));
  zone.addEventListener('pointerleave', () => ((active = false), reset()));
  addEventListener('resize', () => (rects = []));
  return letters;
}
