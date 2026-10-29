import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Contraste de color del texto (WCAG AA). Los casos de la portada con imagen o degradado salen como falsos positivos.
// Uso: node build.mjs && node tools/pruebas/contraste.mjs   (requiere: npm i --no-save playwright && npx playwright install chromium)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SP = process.env.CAPTURAS || `${tmpdir()}/kokoro-capturas`;
mkdirSync(`${SP}/shots`, { recursive: true });
import { spawn } from 'node:child_process';
const srv = spawn('node', ['tools/servir.mjs', 'dist', '8103'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch();
const out = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const path of ['/', '/nuestro-dojo/', '/programa-educativo/']) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await pg.goto('http://localhost:8103' + path, { waitUntil: 'load' });
    await pg.addStyleTag({ content: 'html.js body{animation:none!important} .rise{animation:none!important;opacity:1!important}' });
    // abrir los 8 valores no es necesario: los popovers se prueban aparte
    const res = await pg.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
      const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
      const bgOf = (el) => {
        const stack = [];
        for (let e = el; e; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient|url/.test(cs.backgroundImage)) { stack.push({ img: true }); }
          const c = parse(cs.backgroundColor);
          if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
        }
        let base = { r: 255, g: 255, b: 255, a: 1 };
        let img = false;
        for (let i = stack.length - 1; i >= 0; i--) { if (stack[i].img) { img = true; continue; } base = over(stack[i], base); }
        return { c: base, img };
      };
      const items = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const n = walker.currentNode; const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
        if (el.closest('[aria-hidden="true"], .sr-only, script, style, noscript, [hidden]')) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        // ocultos por popover cerrado
        if (el.closest('.valor__pop') && getComputedStyle(el.closest('.valor__pop')).visibility === 'hidden') continue;
        // texto dentro de <details> cerrado
        const det = el.closest('details'); if (det && !det.open && !el.closest('summary')) continue;
        let op = 1; for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
        const fg = parse(cs.color); if (!fg) continue;
        const { c: bg, img } = bgOf(el);
        const fgc = over({ ...fg, a: fg.a * op }, bg);
        const L1 = lum(fgc), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
        const large = px >= 24 || (px >= 18.66 && bold);
        items.push({ t: t.slice(0, 40), ratio: +ratio.toFixed(2), need: large ? 3 : 4.5, px, img, sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') });
      }
      return items;
    });
    const bad = res.filter((x) => x.ratio < x.need);
    out.push({ w, path, total: res.length, bad });
    await pg.context().close();
  }
}
for (const o of out) {
  console.log(`${o.path} @${o.w}: ${o.total} textos, ${o.bad.length} bajo el mínimo`);
  const uniq = new Map(); for (const x of o.bad) uniq.set(x.sel + '|' + x.ratio, x);
  for (const x of uniq.values()) console.log(`   ${x.ratio} (<${x.need}) ${x.sel} «${x.t}» ${x.px}px${x.img ? ' [fondo con imagen/gradiente]' : ''}`);
}
await b.close(); srv.kill();
