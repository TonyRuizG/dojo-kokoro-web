#!/usr/bin/env node
/**
 * Revisión automática del sitio generado (sin dependencias).
 *
 *   node tools/revisar-sitio.mjs            -> revisa dist/
 *   node tools/revisar-sitio.mjs dist-local -> revisa otra carpeta
 *
 * Comprueba:
 *  - que cada enlace interno, imagen, CSS y JS apunte a un archivo que existe;
 *  - que cada ancla (#seccion) exista en la página de destino;
 *  - que los enlaces de WhatsApp usen el número correcto y mensajes legibles;
 *  - que no queden fechas de lanzamiento ("28 de octubre", "inicio de clases", etc.);
 *  - que cada página tenga <title>, description, canonical, Open Graph y un único <h1>;
 *  - que toda imagen tenga atributo alt y que los textos pendientes se vean u oculten según site.json;
 *  - que Inicio tenga los enlaces de Google Maps y Waze, el mapa incrustado y el formulario de WhatsApp completo.
 *
 * Termina con código 1 si encuentra errores (útil en CI).
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, process.argv[2] || 'dist');
const site = JSON.parse(readFileSync(join(ROOT, 'src/site.json'), 'utf8'));

// Carpeta donde vive el sitio publicado (p. ej. /dojo-kokoro-web/ en GitHub Pages), deducida de robots.txt.
let BASE = '/';
try {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  const m = robots.match(/^Sitemap:\s*(\S+)/im);
  if (m) BASE = new URL(m[1]).pathname.replace(/sitemap\.xml$/, '') || '/';
} catch { /* sin robots.txt: se avisa más abajo */ }

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const rel = (f) => f.replace(DIST, '').replace(/\\/g, '/') || '/';
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const cache = new Map();
const htmlOf = (f) => (cache.has(f) ? cache.get(f) : (cache.set(f, readFileSync(f, 'utf8')), cache.get(f)));

function resolveLocal(fromFile, href) {
  let clean = href.split('#')[0].split('?')[0];
  if (!clean) return fromFile;
  if (BASE !== '/' && clean.startsWith(BASE)) clean = '/' + clean.slice(BASE.length);
  let target = clean.startsWith('/') ? join(DIST, clean) : resolve(dirname(fromFile), clean);
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  return target;
}

const waLinks = new Set();
let checked = 0;

for (const file of htmlFiles) {
  const html = htmlOf(file);
  const page = rel(file);

  // metadatos
  if (!/<title>[^<]{10,}<\/title>/.test(html)) err(`${page}: falta <title>`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) err(`${page}: falta description (o es muy corta)`);
  if (page !== '/404.html') {
    if (!/<link rel="canonical" href="[^"]+"/.test(html)) err(`${page}: falta canonical`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${p}"`)) err(`${page}: falta ${p}`);
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`${page}: debe tener exactamente un <h1> (tiene ${h1})`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) err(`${page}: imagen sin alt → ${m[0].slice(0, 80)}`);

  // ubicación y formulario (solo Inicio)
  if (page === '/index.html') {
    const A = (u) => String(u).replace(/&/g, '&amp;');
    if (!html.includes(`href="${A(site.maps)}"`)) err(`${page}: falta el enlace a Google Maps de site.json`);
    if (!html.includes(`href="${A(site.waze)}"`)) err(`${page}: falta el enlace a Waze de site.json`);
    const ifr = html.match(/<iframe\b[^>]*>/);
    if (!ifr || !ifr[0].includes(`src="${A(site.wazeEmbed)}"`)) err(`${page}: falta el mapa incrustado de Waze`);
    else if (!/\stitle="[^"]{10,}"/.test(ifr[0])) err(`${page}: el iframe del mapa no tiene title`);
    const form = html.match(/<form\b[^>]*data-wa-form[^>]*>/);
    if (!form) err(`${page}: falta el formulario de WhatsApp (data-wa-form)`);
    else {
      if (!form[0].includes(`action="https://wa.me/${site.whatsapp}"`)) err(`${page}: el formulario apunta a un número de WhatsApp distinto`);
      const tpl = (form[0].match(/data-template="([^"]*)"/) || [])[1] || '';
      if (!tpl.includes('{nombre}') || !tpl.includes('{edad}')) err(`${page}: el mensaje del formulario debe incluir {nombre} y {edad}`);
    }
    for (const id of ['ask-nombre', 'ask-edad']) {
      if (!new RegExp(`<label for="${id}"`).test(html) || !new RegExp(`<input id="${id}"`).test(html)) err(`${page}: el campo ${id} necesita su <label for>`);
    }
  }

  // fechas de lanzamiento
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  for (const re of [/28 de octubre/i, /inicio de clases/i, /desde el 28/i, /octubre/i]) {
    if (re.test(decodeURIComponent(visible.replace(/%(?![0-9A-F]{2})/gi, '%25')))) err(`${page}: aparece una referencia a fecha de lanzamiento (${re})`);
  }

  // enlaces y recursos
  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) refs.push(...m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));
  for (const ref of refs) {
    if (/^(mailto:|tel:|javascript:|data:)/.test(ref)) continue;
    if (/^https?:\/\//.test(ref)) {
      if (ref.startsWith('https://wa.me/')) waLinks.add(ref);
      continue;
    }
    if (ref.startsWith('//')) continue;
    checked++;
    const target = resolveLocal(file, ref);
    if (!existsSync(target)) {
      err(`${page}: enlace roto → ${ref}`);
      continue;
    }
    const hash = ref.includes('#') ? ref.split('#')[1] : '';
    if (hash && extname(target) === '.html' && !idsOf(htmlOf(target)).has(hash)) err(`${page}: el ancla #${hash} no existe en ${rel(target)}`);
  }
  if (/%%KANJI%%/.test(html)) err(`${page}: quedó el marcador %%KANJI%% sin reemplazar`);
  if (/\{\{|\}\}/.test(visible)) err(`${page}: quedó una variable {{ }} sin reemplazar`);
  if (!site.showPending && /class="todo/.test(html)) warn(`${page}: hay avisos "Pendiente" aunque showPending es false`);
}

// WhatsApp
for (const link of waLinks) {
  const u = new URL(link);
  const num = u.pathname.replace('/', '');
  if (num !== site.whatsapp) err(`WhatsApp con número incorrecto: ${link}`);
  const text = u.searchParams.get('text');
  if (text !== null && !/[A-Za-zÁÉÍÓÚáéíóúñ]{6,}/.test(text)) err(`WhatsApp con mensaje vacío o ilegible: ${link}`);
}

// archivos obligatorios
for (const f of ['sitemap.xml', 'robots.txt', '404.html', 'css/styles.css', 'js/site.js']) if (!existsSync(join(DIST, f))) err(`falta ${f} en ${rel(DIST + '/x')}`);

if (BASE !== '/') console.log(`Carpeta del sitio: ${BASE}`);
console.log(`Páginas revisadas: ${htmlFiles.length} · enlaces/recursos locales comprobados: ${checked} · enlaces de WhatsApp distintos: ${waLinks.size}`);
for (const w of warns) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.log(`\n✖ ${errors.length} problema(s):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log('✔ Sin enlaces rotos, sin fechas de lanzamiento y con metadatos completos.');
