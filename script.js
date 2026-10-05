/* ===== CONFIG: edit freely ===== */
const SKILLS = [
  ['HTML', 90], ['CSS', 85], ['JAVASCRIPT', 70], ['PYTHON', 50], ['JAVA', 75], ['C#', 70],
  ['SQL', 70], ['NETWORKING', 65], ['GODOT', 95], ['SAP', 50]
];
const BOOT_STEPS = ['Loading Interface...', 'Scanning Projects...', 'Building Skill Database...', 'Loading User Profile...', 'Preparing Dashboard...'];
const TYPED_WORDS = ['video games', 'websites', 'applications'];
const LAST_UPDATE = '2026-10-05';   // YYYY-MM-DD, change this every release
const JOURNEY = [
  { year: '2022', cat: 'MILESTONE',   title: 'First Programming Experience', sub: 'First error', desc: 'I only knew basic HTML, CSS, and basic JavaScript at that time.', tags: ['HTML', 'CSS', 'JAVASCRIPT'], imgs: ['images/placeholder_2021.jpg'] },
  { year: '[YEAR_2]', cat: 'COMPETITION', title: '[EVENT_2_TITLE]', sub: '[EVENT_2_SUBTITLE]', desc: '[EVENT_2_DESCRIPTION]', tags: ['[TAG_1]', '[TAG_2]'], imgs: [''] },
  { year: '[YEAR_3]', cat: 'ACADEMICS',   title: '[EVENT_3_TITLE]', sub: '[EVENT_3_SUBTITLE]', desc: '[EVENT_3_DESCRIPTION]', tags: ['[TAG_1]', '[TAG_2]'], imgs: ['', ''] },
  { year: '[YEAR_4]', cat: 'PROJECT',     title: '[EVENT_4_TITLE]', sub: '[EVENT_4_SUBTITLE]', desc: '[EVENT_4_DESCRIPTION]', tags: ['[TAG_1]', '[TAG_2]'], imgs: ['', '', ''], current: true }
];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ===== SKILLS ===== */
const Skills = {
  init() {
    $('#skillGrid').innerHTML = SKILLS.map(([n, l]) =>
      `<article class="glass card skill reveal" data-tag="ANALYZE" style="--lv:${l}%">
        <p class="label">MODULE</p><h3>${n}</h3><div class="lvl"><i></i></div></article>`).join('');
  }
};

/* ===== BOOT SEQUENCE ===== */
const Boot = {
  run() {
    const log = $('#bootStatus'), fill = $('#bootFill'), txt = $('#bootText'), pct = $('#bootPct');
    const total = REDUCED ? 300 : 3200, start = performance.now();
    let shown = 0;
    const tick = now => {
      const p = Math.max(0, Math.min((now - start) / total, 1)), eased = 1 - Math.pow(1 - p, 2);
      const n = Math.max(0, Math.min(100, Math.round(eased * 100))), blocks = Math.max(0, Math.min(10, Math.round(n / 10)));
      fill.style.width = n + '%'; pct.textContent = n + '%';
      txt.textContent = '[' + '\u2588'.repeat(blocks) + '\u2591'.repeat(10 - blocks) + ']';
      const want = Math.floor(p * BOOT_STEPS.length * 1.0001);
      while (shown < Math.min(want + 1, BOOT_STEPS.length) && p > shown / BOOT_STEPS.length - .01) {
        log.textContent = BOOT_STEPS[shown++].replace('...','');
      }
      p < 1 ? requestAnimationFrame(tick) : this.finish();
    };
    requestAnimationFrame(tick);
  },
  finish() {
    $('#bootDone').classList.add('show');
    setTimeout(() => {
      $('#boot').classList.add('is-done');
      document.body.classList.remove('is-loading');
      document.body.classList.add('ready');
      Reveal.init();
    }, REDUCED ? 100 : 1500);
  }
};

/* ===== SCROLL REVEAL ===== */
const Reveal = {
  init() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    }), { threshold: .15 });
    $$('.reveal').forEach(el => io.observe(el));
  }
};

/* ===== SCANNER: grain / grid / glass, driven by CSS vars ===== */
const Scanner = {
  x: innerWidth / 2, y: innerHeight / 2, cards: [], rects: null,
  init() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;   // mobile: no scanner, grain only
    this.cards = $$('.glass');
    const grain = $('.fx-grain--scan'), grid = $('.fx-grid--scan'), aura = $('.fx-aura');
    const SR = 105, SG = 125, SA = 260;                     // half-sizes, must match the CSS widths (210 / 250 / 520px)
    let tx = this.x, ty = this.y, last = performance.now();
    const place = () => {
      grain.style.transform = `translate3d(${this.x - SR}px,${this.y - SR}px,0)`;
      grid.style.transform = `translate3d(${this.x - SG}px,${this.y - SG}px,0)`;
      grid.style.backgroundPosition = `${SG - this.x}px ${SG - this.y}px`;
      aura.style.transform = `translate3d(${this.x - SA}px,${this.y - SA}px,0)`;
    };
    place();                                                // starts centred, like before
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const dirty = () => { this.rects = null; };
    addEventListener('scroll', dirty, { passive: true }); addEventListener('resize', dirty);
    const loop = now => {
      const dt = Math.min(now - last, 50); last = now;
      const k = 1 - Math.exp(-dt / 150);
      const ox = this.x, oy = this.y;
      this.x += (tx - this.x) * k; this.y += (ty - this.y) * k;
      if (Math.abs(this.x - ox) + Math.abs(this.y - oy) > .02) { place(); this.glass(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },
  glass() {
    if (!this.rects) this.rects = this.cards.map(c => c.getBoundingClientRect());
    this.cards.forEach((c, i) => {
      const r = this.rects[i];
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = Math.max(r.left - this.x, 0, this.x - r.right), dy = Math.max(r.top - this.y, 0, this.y - r.bottom);
      const prox = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
      c.classList.toggle('near', prox > 0);
      if (prox > 0) { c.style.setProperty('--cx', this.x - r.left + 'px'); c.style.setProperty('--cy', this.y - r.top + 'px'); c.style.setProperty('--prox', prox.toFixed(2)); }
    });
  }
};

/* ===== CURSOR: fast dot + lagging reticle ===== */
const Cursor = {
  init() {
    if (!matchMedia('(pointer:fine)').matches) return;
    const ret = $('.reticle'), dot = $('.signal'), tag = $('.reticle-tag');
    let tx = -100, ty = -100, rx = tx, ry = ty, dx = tx, dy = ty;
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY; document.body.classList.add('cursor-on');
    }, { passive: true });
    document.addEventListener('pointerleave', () => document.body.classList.remove('cursor-on'));
    let last = performance.now();
    const loop = now => {
      const dt = Math.min(now - last, 50); last = now;        // frame-rate independent easing
      const kDot = 1 - Math.exp(-dt / 90);                    // signal dot: still the fastest layer, but softer
      const kRet = 1 - Math.exp(-dt / 280);                   // reticle: slower, smoother (raise 180 for more lag)
      dx += (tx - dx) * kDot; dy += (ty - dy) * kDot;
      rx += (tx - rx) * kRet; ry += (ty - ry) * kRet;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      ret.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    // interaction states
    const setState = t => {
      const btn = t.closest('a,button,.btn'), card = t.closest('.glass'), t8 = t.closest('[data-tag]');
      ret.classList.toggle('is-btn', !!btn);
      ret.classList.toggle('is-card', !!card && !btn);
      ret.classList.toggle('is-tag', !!t8);
      if (t8) tag.textContent = t8.dataset.tag;
    };
    document.addEventListener('pointerover', e => setState(e.target));
  }
};

/* ===== PARTICLES ===== */
const Particles = {
  init() {
    const cv = $('#particles'), ctx = cv.getContext('2d');
    let w, h, ps = [];
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * d; h = cv.height = innerHeight * d; this.d = d;
      ps = Array.from({ length: innerWidth < 700 ? 28 : 55 }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.3 + .3) * d,
        vy: -(Math.random() * .25 + .05) * d, vx: (Math.random() - .5) * .1 * d, a: Math.random() * .5 + .1,
        red: Math.random() < .05
      }));
    };
    size(); addEventListener('resize', size);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.fillStyle = p.red ? `rgba(255,59,78,${p.a})` : `rgba(160,205,255,${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      if (!REDUCED) requestAnimationFrame(draw);
    };
    draw();
  }
};

/* ===== SYSTEM DETAILS ===== */
const System = {
  init() {
    // last update: your release date, not the visitor's
    const [y, m, d] = LAST_UPDATE.split('-').map(Number);
    $('#lastUpdate').textContent = new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    // live clock, fixed to Philippine time
    const clock = $('#clock');
    if (!clock) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => { clock.textContent = fmt.format(new Date()) + ' PHT'; };
    tick(); setInterval(tick, 1000);
  }
};

   /* ===== HERO TYPING LINE ===== */
const Typer = {
  init() {
    const el = $('#typed');
      if (!el) return;
      if (REDUCED) { el.textContent = TYPED_WORDS[0]; return; }
      let w = 0, i = 0, deleting = false;
      const step = () => {
        const word = TYPED_WORDS[w];
        i += deleting ? -1 : 1;
        el.textContent = word.slice(0, i);
        let wait = deleting ? 45 : 95;
        if (!deleting && i === word.length) { deleting = true; wait = 1500; }
        else if (deleting && i === 0) { deleting = false; w = (w + 1) % TYPED_WORDS.length; wait = 400; }
        setTimeout(step, wait);
      };
    const begin = () => document.body.classList.contains('ready') ? setTimeout(step, 1200) : setTimeout(begin, 100);
begin();
  }
};

/* ===== JOURNEY LOG ===== */
const Timeline = {
  init() {
    const list = $('#journeyList'), chips = $('#chips');
    const cats = ['ALL', ...new Set(JOURNEY.map(e => e.cat))];
    chips.innerHTML = cats.map((c, i) => `<button class="chip${i ? '' : ' on'}" data-f="${c}" data-tag="OPEN">${c}</button>`).join('');
    list.innerHTML = JOURNEY.map((e, i) => `
      <li class="log reveal${e.current ? ' current' : ''}" data-cat="${e.cat}">
        <span class="node"></span>
        <div class="log-year"><b>${e.year}</b><span class="pill${e.current ? ' pill-sq' : ''}">${e.current ? 'CURRENT' : e.cat}</span><span class="label">LOG ${String(i + 1).padStart(3, '0')}</span></div>
        <article class="glass card log-card" data-tag="ANALYZE">
          <h3>${e.title}<small>${e.sub}</small></h3>
          <p>${e.desc}</p>
          <div class="tags">${e.tags.map(t => `<span class="pill">${t}</span>`).join('')}</div>
          ${e.imgs.length ? `<div class="shots">${e.imgs.map((s, n) => `<figure class="shot" data-tag="ACCESS">${s ? `<img src="${s}" alt="${e.title} image ${n + 1}" loading="lazy">` : `<span>[IMAGE_${n + 1}]</span>`}</figure>`).join('')}</div>` : ''}
        </article>
      </li>`).join('');
    // filter: unmatched entries blur out, matched stay in focus
    chips.addEventListener('click', ev => {
      const b = ev.target.closest('.chip'); if (!b) return;
      $$('.chip', chips).forEach(c => c.classList.toggle('on', c === b));
      $$('.log', list).forEach(l => l.classList.toggle('dim', b.dataset.f !== 'ALL' && l.dataset.cat !== b.dataset.f));
    });
    // spine fills like a scanner travelling down the page
    const fill = () => {
      const r = list.getBoundingClientRect();
      list.style.setProperty('--fill', Math.max(0, Math.min(r.height, innerHeight * .55 - r.top)) + 'px');
    };
    let q = false;
    addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(() => { fill(); q = false; }); } }, { passive: true });
    fill();
  }
};

/* ===== DEV NOTICE ===== */
const Notice = {
  init() {
    const el = $('#notice');
    if (!el) return;
    const show = () => document.body.classList.contains('ready')
      ? setTimeout(() => el.classList.add('show'), 2000)                // 2000 = seconds delay x 1000
      : setTimeout(show, 100);
    show();
    const close = () => el.classList.remove('show');
    $('#noticeClose').addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
};

/* ===== MOBILE MENU ===== */
const Menu = {
  init() {
    const btn = $('#menuBtn'), panel = $('#menuPanel');
    if (!btn || !panel) return;
    const set = open => {
      panel.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open);
      panel.setAttribute('aria-hidden', !open);
      if (open) $('#menuClose').focus();
    };
    btn.addEventListener('click', () => set(true));
    $('#menuClose').addEventListener('click', () => set(false));
    panel.addEventListener('click', e => { if (e.target === panel || e.target.closest('a')) set(false); });   // tapping a link or the dim area closes it
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) set(false); });   // widening the window closes it
  }
};

/* ===== COPY BUTTONS FOR CONTACT CHANNELS ===== */
const Copy = {
  init() {
    $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'COPIED'; }
      catch { b.textContent = 'FAILED'; }
      b.classList.add('done');
      setTimeout(() => { b.textContent = 'COPY'; b.classList.remove('done'); }, 1600);
    }));
  }
};

/* ===== START ===== */
Skills.init(); Timeline.init(); System.init(); Scanner.init(); Cursor.init(); Particles.init(); Typer.init(); Notice.init(); Menu.init(); Copy.init(); Boot.run();