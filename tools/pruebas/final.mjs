import { chromium, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Prueba completa en navegador: rutas, enlaces, WhatsApp, formulario, menú móvil, preguntas frecuentes, consola sin errores.
// Uso: node build.mjs && node tools/pruebas/final.mjs   (requiere: npm i --no-save playwright && npx playwright install chromium)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SP = process.env.CAPTURAS || `${tmpdir()}/kokoro-capturas`;
mkdirSync(`${SP}/shots`, { recursive: true });
import { spawn } from 'node:child_process';
const PORT = 8101;
const srv = spawn('node', ['tools/servir.mjs', 'dist', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const B = `http://localhost:${PORT}`;
const b = await chromium.launch();
let fails = 0;
const errs = [];
const ck = (name, ok, extra = '') => { console.log((ok ? 'OK   ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!ok) fails++; };
const noise = /fonts\.(googleapis|gstatic)|ERR_TUNNEL|ERR_|Failed to load resource|waze/i;
const watch = (pg, tag) => {
  pg.on('pageerror', (e) => errs.push(`${tag} pageerror: ${e.message}`));
  pg.on('console', (m) => { if (m.type() === 'error' && !noise.test(m.text())) errs.push(`${tag}: ${m.text()}`); });
};
const EXPECT = (n, e) => `Hola, me gustaría recibir información sobre las clases de Karate-Do Shotokan en Dojo Kokoro.\n\nNombre del estudiante: ${n}\nEdad: ${e}\n\nQuisiera consultar las próximas fechas disponibles para asistir a la primera clase gratuita.`;

// ---------------- FORMULARIO (escritorio y móvil) ----------------
for (const [label, opts] of [['escritorio', { viewport: { width: 1440, height: 900 } }], ['iPhone 13', { ...devices['iPhone 13'] }]]) {
  const ctx = await b.newContext(opts);
  await ctx.route('https://wa.me/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>wa</title>' }));
  const pg = await ctx.newPage();
  watch(pg, 'form-' + label);
  const reqs = [];
  pg.on('request', (r) => { if (!r.url().startsWith(B)) reqs.push(r.url()); });
  await pg.goto(B + '/', { waitUntil: 'load' });
  await pg.addStyleTag({ content: 'html{scroll-behavior:auto!important} html.js body{animation:none!important}' });
  await pg.evaluate(() => document.querySelector('#clase-gratis').scrollIntoView({ block: 'center' }));
  const name = pg.locator('#ask-nombre');
  const age = pg.locator('#ask-edad');
  const submit = pg.locator('#clase-gratis button[type=submit]');
  // vacío
  await submit.click();
  ck(`[${label}] vacío: error de nombre visible`, await pg.locator('#ask-nombre-err').isVisible());
  ck(`[${label}] vacío: error de edad visible`, await pg.locator('#ask-edad-err').isVisible());
  ck(`[${label}] vacío: foco en el nombre`, await pg.evaluate(() => document.activeElement.id) === 'ask-nombre');
  ck(`[${label}] vacío: aria-invalid + describedby`, (await name.getAttribute('aria-invalid')) === 'true' && (await name.getAttribute('aria-describedby')) === 'ask-nombre-err');
  // nombre ok, edad inválida
  await name.fill('Valeria');
  for (const bad of ['0', '100', '-3', '12.5', '1e1']) {
    await pg.evaluate((v) => { const i = document.querySelector('#ask-edad'); i.value = v; }, bad);
    await submit.click();
    const vis = await pg.locator('#ask-edad-err').isVisible();
    ck(`[${label}] edad inválida «${bad}» rechazada`, vis);
  }
  // letras en input number
  await pg.evaluate(() => { document.querySelector('#ask-edad').value = 'abc'; });
  await submit.click();
  ck(`[${label}] edad «abc» rechazada`, await pg.locator('#ask-edad-err').isVisible());
  // nombre de 1 letra
  await name.fill('A'); await age.fill('9'); await submit.click();
  ck(`[${label}] nombre de 1 letra rechazado`, await pg.locator('#ask-nombre-err').isVisible());
  // válido con nombre normal
  await name.fill('  Valeria   Gómez '); await age.fill('9');
  const [pop] = await Promise.all([pg.waitForEvent('popup', { timeout: 5000 }).catch(() => null), submit.click()]);
  ck(`[${label}] válido: se abre WhatsApp en pestaña nueva`, !!pop);
  if (pop) {
    await pop.waitForLoadState('load').catch(() => {}); const u = new URL(pop.url());
    ck(`[${label}] destino wa.me/50685145922`, u.hostname === 'wa.me' && u.pathname === '/50685145922', u.origin + u.pathname);
    ck(`[${label}] mensaje exacto con nombre y edad`, u.searchParams.get('text') === EXPECT('Valeria Gómez', '9 años'), JSON.stringify(u.searchParams.get('text')));
    await pop.close();
  }
  ck(`[${label}] errores se ocultan al corregir`, !(await pg.locator('#ask-nombre-err').isVisible()) && !(await pg.locator('#ask-edad-err').isVisible()));
  ck(`[${label}] estado visible con enlace de respaldo`, (await pg.locator('[data-ask-status] a').count()) === 1);
  // nombre con llaves y símbolos: no se interpreta como plantilla
  await name.fill('{edad} & Ana=1'); await age.fill('1');
  const [pop2] = await Promise.all([pg.waitForEvent('popup', { timeout: 5000 }).catch(() => null), submit.click()]);
  if (pop2) {
    await pop2.waitForLoadState('load').catch(() => {});
    const t = new URL(pop2.url()).searchParams.get('text');
    ck(`[${label}] texto del usuario no se interpreta (llaves, &, =)`, t === EXPECT('{edad} & Ana=1', '1 año'), JSON.stringify(t));
    await pop2.close();
  } else ck(`[${label}] segundo envío abre WhatsApp`, false);
  // regresión: el botón no se mueve al salir del campo de edad (el primer toque siempre cuenta)
  for (const a of ['6', '12', '5', '30', '7']) {
    await name.fill('Mateo'); await age.fill(a);
    const [p3] = await Promise.all([pg.waitForEvent('popup', { timeout: 4000 }).catch(() => null), submit.click()]);
    ck(`[${label}] edad ${a}: el primer toque en el botón abre WhatsApp`, !!p3);
    if (p3) await p3.close();
  }
  ck(`[${label}] la nota de grupos siempre visible y asociada al campo`, (await pg.locator('#ask-edad-note').isVisible()) && /ask-edad-note/.test((await age.getAttribute('aria-describedby')) || ''));
  // sin almacenamiento
  const stor = await pg.evaluate(() => ({ ls: localStorage.length, ss: sessionStorage.length, ck: document.cookie.length }));
  ck(`[${label}] no guarda datos (localStorage/sessionStorage/cookies vacíos)`, stor.ls === 0 && stor.ss === 0 && stor.ck === 0, JSON.stringify(stor));
  ck(`[${label}] sin peticiones a terceros al enviar`, reqs.filter((u) => !/fonts\.(googleapis|gstatic)|waze|wa\.me/.test(u)).length === 0, JSON.stringify(reqs.slice(0, 3)));
  // tamaño táctil
  const sizes = await pg.evaluate(() => ['#ask-nombre', '#ask-edad', '#clase-gratis button[type=submit]'].map((s) => Math.round(document.querySelector(s).getBoundingClientRect().height)));
  ck(`[${label}] campos y botón ≥ 44 px de alto`, sizes.every((h) => h >= 44), sizes.join(','));
  const hs = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ck(`[${label}] sin scroll horizontal`, hs <= 0, String(hs));
  await ctx.close();
}

// ---------------- FAQ con teclado ----------------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage(); watch(pg, 'faq');
  await pg.goto(B + '/', { waitUntil: 'load' });
  await pg.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await pg.evaluate(() => document.querySelector('#preguntas').scrollIntoView());
  const sums = pg.locator('.faq summary');
  ck('FAQ: 6 preguntas', (await sums.count()) === 6);
  await sums.nth(0).focus();
  await pg.keyboard.press('Enter');
  ck('FAQ: Enter abre la 1', await pg.evaluate(() => document.querySelectorAll('.faq details')[0].open));
  await pg.keyboard.press('Tab'); await pg.keyboard.press('Space');
  const st = await pg.evaluate(() => [...document.querySelectorAll('.faq details')].map((d) => d.open));
  ck('FAQ: Espacio abre la 2 y cierra la 1 (una a la vez)', st[1] && !st[0], JSON.stringify(st));
  const fo = await pg.evaluate(() => { const s = document.querySelectorAll('.faq summary')[1]; const cs = getComputedStyle(s); return cs.outlineStyle + ' ' + cs.outlineWidth; });
  ck('FAQ: foco visible', !/none/.test(fo) && !/^0px/.test(fo.split(' ')[1] || ''), fo);
  await pg.keyboard.press('Enter');
  ck('FAQ: Enter cierra', await pg.evaluate(() => !document.querySelectorAll('.faq details')[1].open));
  // las respuestas no inventan precios
  const txt = await pg.evaluate(() => document.querySelector('.faq').textContent);
  ck('FAQ: sin precios ni montos inventados', !/[₡$]\s?\d|\d+\s?(colones|dólares|usd)/i.test(txt));
  await ctx.close();
}

// ---------------- Todas las páginas: consola, h1, lang, enlaces externos seguros, imágenes ----------------
for (const path of ['/', '/nuestro-dojo/', '/programa-educativo/', '/ruta-que-no-existe/']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const pg = await ctx.newPage(); watch(pg, path);
  const r = await pg.goto(B + path, { waitUntil: 'load' });
  await pg.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
  await pg.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }); await Promise.all([...document.images].map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))); });
  await pg.waitForTimeout(300);
  const info = await pg.evaluate(() => ({
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    broken: [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute('src')),
    ext: [...document.querySelectorAll('a[target=_blank]')].filter((a) => !/noopener/.test(a.rel)).length,
    emptyLinks: [...document.querySelectorAll('a')].filter((a) => !(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]'))).length,
    emptyBtns: [...document.querySelectorAll('button')].filter((a) => !(a.textContent.trim() || a.getAttribute('aria-label'))).length,
    dupIds: (() => { const m = {}; document.querySelectorAll('[id]').forEach((e) => (m[e.id] = (m[e.id] || 0) + 1)); return Object.entries(m).filter(([, n]) => n > 1).map(([k]) => k); })(),
    heads: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]),
  }));
  const jumps = []; for (let i = 1; i < info.heads.length; i++) if (info.heads[i] - info.heads[i - 1] > 1) jumps.push(`${info.heads[i - 1]}→${info.heads[i]}`);
  const is404 = path.includes('ruta-que');
  ck(`${path}: lang=es`, info.lang === 'es');
  if (!is404) ck(`${path}: HTTP 200`, r.status() === 200, String(r.status()));
  ck(`${path}: un solo h1`, info.h1 === 1, String(info.h1));
  ck(`${path}: sin imágenes rotas`, info.broken.length === 0, JSON.stringify(info.broken));
  ck(`${path}: enlaces _blank con noopener`, info.ext === 0);
  ck(`${path}: sin enlaces/botones sin nombre accesible`, info.emptyLinks === 0 && info.emptyBtns === 0, `${info.emptyLinks}/${info.emptyBtns}`);
  ck(`${path}: sin ids duplicados`, info.dupIds.length === 0, JSON.stringify(info.dupIds));
  if (jumps.length) console.log(`  (aviso) saltos de nivel de encabezado en ${path}: ${[...new Set(jumps)].join(', ')}`);
  await ctx.close();
}

// ---------------- Menú móvil + navegación ----------------
{
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const pg = await ctx.newPage(); watch(pg, 'menu');
  await pg.goto(B + '/', { waitUntil: 'load' });
  const btn = pg.locator('.menu-btn');
  ck('menú móvil: botón visible', await btn.isVisible());
  await btn.click();
  ck('menú móvil: aria-expanded=true', (await btn.getAttribute('aria-expanded')) === 'true');
  await pg.keyboard.press('Escape');
  ck('menú móvil: Escape cierra', (await btn.getAttribute('aria-expanded')) === 'false');
  await btn.click();
  await Promise.all([pg.waitForURL('**/nuestro-dojo/', { timeout: 5000 }).catch(() => {}), pg.locator('.mnav a', { hasText: /nuestro dojo/i }).first().click()]);
  ck('menú móvil: navega a Nuestro dojo', pg.url().endsWith('/nuestro-dojo/'), pg.url());
  await ctx.close();
}

console.log('errores de consola/JS:', JSON.stringify(errs));
console.log('FALLOS:', fails + errs.length);
await b.close(); srv.kill();
process.exit(fails + errs.length ? 1 : 0);
