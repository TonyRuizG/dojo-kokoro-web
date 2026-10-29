#!/usr/bin/env node
/**
 * Generador estático de Dojo Kokoro (sin dependencias, requiere Node 18 o superior).
 *
 *   node build.mjs            -> dist/        sitio de producción (URLs limpias: /nuestro-dojo/)
 *   node build.mjs --local    -> dist-local/  mismo sitio con enlaces a .../index.html,
 *                                             para abrirlo con doble clic sin servidor
 *
 * Variables de entorno opcionales:
 *   SITE_URL=https://tudominio.com   dirección pública (canonical, Open Graph, sitemap). Anula "url" de src/site.json.
 *                                    Puede incluir una carpeta si el sitio no vive en la raíz del dominio.
 *   SHOW_PENDING=true|false          muestra u oculta los avisos internos «Pendiente» (anula "showPending" de src/site.json).
 *
 * Qué hace:
 *  - Une cada página de src/pages con src/layout.html y los parciales de src/partials.
 *  - Calcula rutas relativas, así el sitio funciona en cualquier carpeta o dominio.
 *  - Genera SEO por página (title, description, canonical, Open Graph, Twitter, JSON-LD).
 *  - Arma los enlaces de WhatsApp desde src/site.json (un solo lugar para editar mensajes).
 *  - Genera los ocho valores (src/data/valores.json), los logros (src/data/logros.json) y la galería (src/data/galeria.json);
 *    la sección de logros se oculta sola mientras no haya logros (y muestra «Construye una historia con nosotros»); la galería muestra «Próximamente» hasta que haya fotos reales.
 *  - Une los CSS (src/css/*.css) y JS (src/js/*.js) en un archivo cada uno.
 *  - Copia imágenes y archivos estáticos, y crea sitemap.xml y robots.txt.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const LOCAL = process.argv.includes('--local');
const DIST = join(ROOT, LOCAL ? 'dist-local' : 'dist');

const site = JSON.parse(readFileSync(join(SRC, 'site.json'), 'utf8'));
if (process.env.SITE_URL) site.url = process.env.SITE_URL;
else if (/example|REEMPLAZAR/i.test(site.url)) {
  // Si el hosting expone su dirección pública (Netlify: URL, Vercel: VERCEL_PROJECT_PRODUCTION_URL), se usa sola.
  const auto = process.env.URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  if (auto) site.url = auto;
}
site.url = site.url.replace(/\/+$/, '');
if (process.env.SHOW_PENDING) site.showPending = !/^(0|false|no|off)$/i.test(process.env.SHOW_PENDING.trim());
/* Carpeta donde vive el sitio (p. ej. "/dojo-kokoro-web/" en GitHub Pages; "/" en un dominio propio). */
let BASE = '/';
try { BASE = new URL(site.url).pathname.replace(/\/+$/, '') + '/'; } catch { /* URL provisional */ }

/* ---------- utilidades ---------- */
const read = (p) => readFileSync(join(SRC, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const waHref = (msg) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
const wa = Object.fromEntries(Object.entries(site.wa).map(([k, v]) => [k, waHref(v)]));
const attr = esc;
const jsonFile = (p, fallback) => (existsSync(join(SRC, p)) ? JSON.parse(read(p)) : fallback);

/* ---------- páginas ---------- */
const PAGES = [
  { file: 'index.html', slug: 'inicio', dir: '' },
  { file: 'nuestro-dojo.html', slug: 'nuestro-dojo', dir: 'nuestro-dojo/' },
  { file: 'programa-educativo.html', slug: 'programa-educativo', dir: 'programa-educativo/' },
  { file: '404.html', slug: '404', dir: '', out: '404.html', absoluteRoot: true },
];

/* ---------- piezas generadas desde datos ---------- */
function galeria(ctx) {
  const items = jsonFile('data/galeria.json', { fotos: [] }).fotos || [];
  if (!items.length) {
    // Sin fotos reales se muestra el aviso «Próximamente»; en cuanto haya fotos en src/data/galeria.json, la galería se llena sola.
    return `<div class="gal gal--empty">
<div class="gal__soon"><p class="gal__badge hd">Próximamente</p><p>Aquí compartiremos fotos de nuestros entrenamientos, torneos y graduaciones.</p></div>
<!--PENDIENTE--><p class="todo"><b>Pendiente</b><span>Agrega fotos reales del dojo en <code>src/assets/img/galeria/</code> y regístralas en <code>src/data/galeria.json</code>. La galería se llena sola al reconstruir el sitio.</span></p><!--/PENDIENTE-->
</div>`;
  }
  const fig = (f) =>
    `<figure class="gal__item"><img src="${ctx.root}assets/img/galeria/${f.src}" alt="${esc(f.alt || '')}" width="${f.w || 1200}" height="${f.h || 800}" loading="lazy" decoding="async">${f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : ''}</figure>`;
  const first = items.slice(0, 6).map(fig).join('\n');
  const rest = items.slice(6);
  const more = rest.length
    ? `<details class="gal__more"><summary><span>Ver más fotos</span><span aria-hidden="true">+</span></summary><div class="gal">${rest.map(fig).join('\n')}</div></details>`
    : '';
  return `<div class="gal">${first}</div>${more}`;
}

function logros(ctx) {
  const items = jsonFile('data/logros.json', { logros: [] }).logros || [];
  return items
    .map((l, i) => {
      const meta = [['Competencia', l.competencia], ['Año', l.anio], ['Categoría', l.categoria], ['Atleta', l.atleta], ['Resultado', l.resultado]].filter(([, v]) => v);
      const dl = meta.length ? `<dl class="ledger__meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '';
      const foto = l.foto && l.foto.src ? `<img class="ledger__ph" src="${ctx.root}assets/img/logros/${l.foto.src}" alt="${esc(l.foto.alt || '')}" width="${l.foto.w || 640}" height="${l.foto.h || 427}" loading="lazy" decoding="async">` : '';
      return `<li class="ledger__row">
<span class="ledger__n hd">${String(i + 1).padStart(2, '0')}</span>
<div class="ledger__main"><h3 class="hd">${esc(l.titulo)}</h3>${l.detalle ? `<p>${esc(l.detalle)}</p>` : ''}${dl}${foto}${l.falta ? `<!--PENDIENTE--><p class="todo todo--inline"><b>Pendiente</b><span>${esc(l.falta)}</span></p><!--/PENDIENTE-->` : ''}</div>
${l.etiqueta ? `<span class="ledger__tag">${esc(l.etiqueta)}</span>` : '<span></span>'}
</li>`;
    })
    .join('\n');
}

/* Los ocho valores: tarjetas con ícono SVG en línea (toma el color del texto), nombre y descripción. */
function valores() {
  const items = jsonFile('data/valores.json', { valores: [] }).valores || [];
  const icon = (file) =>
    read(`assets/icons/valores/${file}`)
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/\swidth="\d+"/, '')
      .replace(/\sheight="\d+"/, '')
      .replace(/stroke="#[0-9A-Fa-f]{3,8}"/, 'stroke="currentColor"')
      .replace(/\srole="img"/, ' aria-hidden="true" focusable="false"');
  const li = items
    .map((v, i) => {
      const n = i + 1;
      const id = `valor-${n}`;
      return `<li class="valor" data-valor>
<button type="button" class="valor__btn" id="${id}" aria-expanded="false" aria-controls="${id}-pop">
<span class="valor__ico">${icon(v.icono)}</span>
<span class="valor__num hd" aria-hidden="true">${String(n).padStart(2, '0')}</span>
<span class="valor__name hd">${esc(v.nombre)}</span>
<span class="valor__more" aria-hidden="true"></span>
<span class="sr-only">. Ver descripción</span>
</button>
<div class="valor__pop" id="${id}-pop"><div class="valor__pop-in"><p class="valor__pop-t hd">${esc(v.nombre)}</p><p>${esc(v.texto)}</p></div></div>
</li>`;
    })
    .join('\n');
  return `<ul class="vals8" aria-label="Los ocho valores de Kokoro" data-valores>\n${li}\n</ul>`;
}

function snavHtml(items) {
  if (!items || !items.length) return '';
  const links = items
    .map((n) => `<a href="#${n.id}" data-id="${n.id}" title="${esc(n.title || n.label)}" aria-current="false"><span class="lb">${esc(n.label)}</span></a>`)
    .join('\n');
  return `<aside class="snav" aria-label="Acceso rápido a las secciones de la página" data-snav>
<nav id="snav-list" class="snav-list" aria-label="Secciones de la página">
<span class="snav-ind" aria-hidden="true"></span>
${links}
</nav>
<button class="snav-tog" type="button" aria-expanded="false" aria-controls="snav-list" aria-label="Mostrar u ocultar las secciones"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line class="tl1" x1="5" y1="7" x2="19" y2="7"/><line class="tl2" x1="5" y1="12" x2="19" y2="12"/><line class="tl3" x1="5" y1="17" x2="19" y2="17"/></svg></button>
<a class="snav-top" href="#top" aria-label="Volver arriba"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></a>
</aside>`;
}

/* ---------- secciones opcionales ----------
   <!--GALERIA-->…<!--/GALERIA--> y <!--LOGROS-->…<!--/LOGROS--> en las páginas solo se publican si hay contenido real.
   <!--SINLOGROS-->…<!--/SINLOGROS--> es lo contrario: se muestra solo mientras no haya logros publicados («Construye una historia con nosotros»).
   En el bloque "snav" de cada página, {"if": "galeria"} oculta ese acceso cuando la sección no se publica. */
const flags = {
  galeria: true, // sin fotos reales muestra «Próximamente»
  logros: (jsonFile('data/logros.json', { logros: [] }).logros || []).length > 0,
};
flags.sinlogros = !flags.logros;
const applyFlags = (html) => html.replace(/<!--(GALERIA|LOGROS|SINLOGROS)-->([\s\S]*?)<!--\/\1-->/g, (_, k, inner) => (flags[k.toLowerCase()] ? inner : ''));

/* ---------- motor de plantillas ---------- */
function include(html, ctx, depth = 0) {
  if (depth > 6) throw new Error('Parciales anidados en exceso');
  return html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
    if (name === 'galeria') return galeria(ctx);
    if (name === 'logros') return logros(ctx);
    if (name === 'valores') return valores();
    if (name === 'snav') return snavHtml(ctx.page.snav);
    return include(read(`partials/${name}.html`), ctx, depth + 1);
  });
}

function vars(html, ctx) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    const v = get(ctx, key);
    if (v === undefined) throw new Error(`Variable sin definir: {{${key}}} en la página "${ctx.page.slug}"`);
    return v;
  });
}

const stripPending = (html) => (site.showPending ? html.replace(/<!--\/?PENDIENTE-->/g, '') : html.replace(/<!--PENDIENTE-->[\s\S]*?<!--\/PENDIENTE-->/g, ''));

/* ---------- CSS y JS ---------- */
const bundle = (dir, ext) =>
  readdirSync(join(SRC, dir))
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => `/* ${f} */\n` + read(`${dir}/${f}`))
    .join('\n');

const minCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/\s{2,}/g, ' ')
    .replace(/;}/g, '}')
    .trim();

const cssOut = minCss(bundle('css', '.css'));
const jsOut = bundle('js', '.js');
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 8);
const ver = { css: hash(cssOut), js: hash(jsOut) };

/* ---------- datos estructurados ---------- */
function jsonld(p) {
  const org = {
    '@type': 'SportsActivityLocation',
    '@id': `${site.url}/#dojo`,
    name: site.legalName,
    alternateName: 'Kokoro Karate-Do',
    description: site.description,
    url: `${site.url}/`,
    image: `${site.url}/${site.ogImage}`,
    logo: `${site.url}/assets/img/kokoro-logo.png`,
    telephone: site.phoneIntl,
    sameAs: [site.social.instagram, site.social.facebook],
    address: { '@type': 'PostalAddress', addressLocality: 'Santa Bárbara', addressRegion: 'Heredia', addressCountry: 'CR' },
    ...(site.geo ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon } } : {}),
    ...(site.maps ? { hasMap: site.maps } : {}),
    ...(site.fundado ? { foundingDate: String(site.fundado) } : {}),
    areaServed: 'Santa Bárbara de Heredia, Costa Rica',
    sport: 'Karate-Do Shotokan',
  };
  const page = { '@type': 'WebPage', '@id': `${p.canonical}#page`, url: p.canonical, name: p.title, description: p.description, inLanguage: 'es-CR', isPartOf: { '@id': `${site.url}/#dojo` } };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': p.slug === 'inicio' ? [org, page] : [org, page] });
}

/* ---------- build ---------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const layout = read('layout.html');
const built = [];
const allKanji = new Set();

for (const p of PAGES) {
  let html = read(`pages/${p.file}`);
  const m = html.match(/^\s*<!--page\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`Falta el bloque <!--page {...}--> al inicio de ${p.file}`);
  const meta = JSON.parse(m[1]);
  html = html.slice(m[0].length);

  const depth = p.dir ? p.dir.split('/').filter(Boolean).length : 0;
  // La página 404 se sirve desde cualquier ruta inexistente, así que usa rutas absolutas desde la carpeta del sitio.
  const abs = p.absoluteRoot && !LOCAL;
  const root = abs ? BASE : p.absoluteRoot ? './' : depth ? '../'.repeat(depth) : './';
  const suffix = LOCAL ? 'index.html' : '';
  const url = {
    home: abs ? BASE : `${root}${suffix}`,
    dojo: `${root}nuestro-dojo/${suffix}`,
    programa: `${root}programa-educativo/${suffix}`,
  };
  const canonical = `${site.url}/${p.dir}`;
  const isPrograma = meta.cta === 'programa';
  const ctx = {
    site, wa, url, root, ver,
    link: { maps: attr(site.maps || ''), waze: attr(site.waze || ''), wazeEmbed: attr(site.wazeEmbed || '') },
    form: { template: attr((site.formulario && site.formulario.mensaje) || '') },
    year: String(new Date().getFullYear()),
    page: {
      slug: p.slug,
      title: meta.title,
      description: meta.description,
      canonical,
      ogImage: `${site.url}/${site.ogImage}`,
      ogImageAlt: site.ogImageAlt,
      robots: meta.robots || 'index,follow',
      cta: isPrograma ? wa.instituciones : wa.gratis,
      ctaLabel: isPrograma ? 'Solicitar propuesta' : 'Primera clase gratis',
      ctaShort: isPrograma ? 'Propuesta' : 'Clase gratis',
      snav: (meta.snav || []).filter((n) => !n.if || flags[n.if]),
      bodyClass: meta.bodyClass || '',
    },
    nav: {
      inicio: p.slug === 'inicio' ? 'aria-current="page"' : '',
      dojo: p.slug === 'nuestro-dojo' ? 'aria-current="page"' : '',
      programa: p.slug === 'programa-educativo' ? 'aria-current="page"' : '',
    },
  };
  ctx.page.jsonld = jsonld({ ...ctx.page, slug: p.slug });
  ctx.page.title = esc(meta.title).replace(/&amp;/g, '&amp;');
  ctx.page.description = esc(meta.description);

  const content = include(applyFlags(html), ctx);
  let full = include(layout.replace('{{content}}', content), ctx);
  full = vars(stripPending(full), ctx);
  for (const ch of full) if (/[぀-ヿ㐀-鿿]/.test(ch)) allKanji.add(ch);

  const outPath = p.out ? join(DIST, p.out) : join(DIST, p.dir, 'index.html');
  built.push({ ...p, canonical, outPath, full });
}

/* Segunda pasada: la fuente japonesa (Google Fonts) se pide solo con los kanji usados */
const kanjiParam = encodeURIComponent([...allKanji].sort().join(''));
for (const b of built) {
  mkdirSync(dirname(b.outPath), { recursive: true });
  writeFileSync(b.outPath, b.full.replace('%%KANJI%%', kanjiParam));
  delete b.full;
}

/* ---------- recursos ---------- */
mkdirSync(join(DIST, 'css'), { recursive: true });
mkdirSync(join(DIST, 'js'), { recursive: true });
writeFileSync(join(DIST, 'css', 'styles.css'), cssOut);
writeFileSync(join(DIST, 'js', 'site.js'), jsOut);
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });
if (existsSync(join(SRC, 'static'))) cpSync(join(SRC, 'static'), DIST, { recursive: true });

/* ---------- sitemap + robots ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = built.filter((b) => b.slug !== '404');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.canonical}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`✔ ${built.length} páginas generadas en ${LOCAL ? 'dist-local/ (enlaces a index.html)' : 'dist/'}`);
console.log(`  Kanji usados (${allKanji.size}): ${[...allKanji].sort().join('')}`);
if (/example|REEMPLAZAR/i.test(site.url)) console.log(`  ⚠ site.url es provisional (${site.url}). Cámbialo en src/site.json o con SITE_URL=https://tudominio.com`);
if (site.showPending) console.log('  ⓘ showPending = true: se muestran los avisos "Pendiente". Ponlo en false en src/site.json antes de publicar.');
