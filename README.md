# Dojo Kokoro · Karate-Do Shotokan

Sitio web de **Dojo Kokoro Karate-Do Shotokan**, Santa Bárbara de Heredia, Costa Rica. Clases para niños, jóvenes y adultos; **primera clase gratis**; programa extracurricular para escuelas, colegios e instituciones.

Es un sitio estático de tres páginas, sin dependencias, sin base de datos y sin cuentas de usuario. El contacto se hace por **WhatsApp** (+506 8514-5922).

> **Sitio publicado:** <https://dojo-kokoro-web.anthony-ruiz-g22.workers.dev> (Cloudflare Workers) · **Repositorio:** <https://github.com/TonyRuizG/dojo-kokoro-web>

| Página | Ruta | Para qué sirve |
|---|---|---|
| Inicio | `/` | Filosofía, resumen de misión y visión, método, horarios, preguntas frecuentes, ubicación y formulario que continúa por WhatsApp. |
| Nuestro dojo | `/nuestro-dojo/` | Historia, misión y visión, ocho valores, Dojo Kun, senseis, metodología (Kihon, Kata, Bunkai, Kumite), desarrollo deportivo, logros (o «Construye una historia con nosotros»), respaldo institucional y galería (o «Próximamente»). |
| Programa educativo | `/programa-educativo/` | Propuesta de karate-do extracurricular para instituciones: objetivos, valores, metodología, niveles, condiciones, seguimiento y proceso de colaboración. |

## Contenido

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos e instalación](#requisitos-e-instalación)
- [Comandos](#comandos)
- [Publicación: GitHub y Cloudflare](#publicación-github-y-cloudflare)
- [Cómo actualizar el contenido](#cómo-actualizar-el-contenido)
- [Qué no se publica](#qué-no-se-publica)
- [Calidad, accesibilidad y SEO](#calidad-accesibilidad-y-seo)
- [Derechos](#derechos)

## Tecnologías

- **HTML, CSS y JavaScript simples.** Sin React, Vite, Next.js ni `npm install`.
- **Generador propio de un archivo** (`build.mjs`, Node 18 o superior, sin dependencias): une plantillas, parciales, datos JSON, CSS y JS y escribe el sitio en `dist/`.
- **Tipografías** Oswald, DM Sans y Noto Serif JP (esta última solo con los kanji usados), desde Google Fonts.
- **Imágenes** WebP con tamaños declarados, carga diferida y `srcset`; íconos de los valores en SVG.
- **Hosting:** Cloudflare Workers (archivos estáticos) conectado al repositorio de GitHub. También hay `netlify.toml` y `vercel.json` opcionales.

## Estructura del proyecto

```
dojo-kokoro-web/
├── build.mjs                      Generador del sitio
├── package.json                   Atajos: npm run build / start / revisar
├── netlify.toml · vercel.json     Configuración opcional para Netlify o Vercel
├── src/                           ← AQUÍ SE EDITA TODO
│   ├── site.json                  URL, teléfono, redes, mapas, mensajes de WhatsApp, avisos internos
│   ├── layout.html                Estructura común (<head>, SEO, Open Graph)
│   ├── pages/                     Una plantilla por página (index, nuestro-dojo, programa-educativo, 404)
│   ├── partials/                  Piezas reutilizables (encabezado, pie, respaldo institucional, etapas…)
│   ├── css/                       Estilos por tema; se unen en un solo archivo
│   ├── js/site.js                 Menú, barra lateral, formulario de WhatsApp y transición entre páginas
│   ├── data/
│   │   ├── valores.json           Los ocho valores (textos aprobados; sin japonés)
│   │   ├── logros.json            Logros confirmados
│   │   └── galeria.json           Fotos de la galería
│   ├── assets/
│   │   ├── img/                   Logos, fotos de los senseis, imagen para compartir
│   │   └── icons/                 Redes sociales y íconos SVG de los valores
│   └── static/                    Favicons y archivos que se copian a la raíz
├── tools/
│   ├── revisar-sitio.mjs          Revisión automática del sitio generado
│   ├── servir.mjs                 Servidor local con URLs limpias
│   └── optimizar-imagenes.py      (opcional) Prepara fotos para la galería
└── docs/
    ├── CAMBIOS.md                 Qué cambió y por qué
    └── PENDIENTES.md              Datos y fotos por confirmar (documento interno)
```

`dist/` y `dist-local/` se generan con `node build.mjs`; no se editan a mano ni se suben al repositorio. La carpeta `respaldo-original/` (copias de seguridad y material fuente, incluida la presentación comercial) es **privada**: está en `.gitignore` y no debe subirse.

## Requisitos e instalación

Solo necesitas [Node.js](https://nodejs.org) 18 o superior. No hay dependencias que instalar.

```bash
git clone https://github.com/TonyRuizG/dojo-kokoro-web.git
cd dojo-kokoro-web
```

## Comandos

```bash
node build.mjs                           # genera dist/
node tools/servir.mjs dist               # abre http://localhost:8080
node build.mjs && node tools/revisar-sitio.mjs dist    # genera y revisa
node build.mjs --local                   # genera dist-local/ (se abre con doble clic, sin servidor)
```

Los mismos atajos con npm: `npm run build`, `npm start`, `npm run revisar`.

**Revisión automática.** `tools/revisar-sitio.mjs` comprueba enlaces, imágenes, CSS y JS locales; que cada ancla (`#seccion`) exista; los enlaces de WhatsApp (número y mensaje legible); Maps, Waze y el mapa incrustado; el formulario (campos, etiquetas, plantilla con `{nombre}` y `{edad}`); título, descripción, canonical y Open Graph por página; un único `<h1>`; textos alternativos; que no queden variables sin reemplazar ni fechas de lanzamiento, y avisa si quedan avisos internos visibles. Termina con error si algo falla.

Variables de entorno opcionales del generador:

| Variable | Efecto |
|---|---|
| `SITE_URL=https://midominio.com` | Anula la dirección de `src/site.json` (canonical, Open Graph, sitemap, robots). |
| `SHOW_PENDING=true` | Muestra los avisos internos «Pendiente» (solo para trabajar; por defecto están apagados). |

## Publicación: GitHub y Cloudflare

El flujo es: **cambias archivos en `src/` → los subes a GitHub (`main`) → Cloudflare genera y publica el sitio**.

1. **Subir los cambios.** Con Git: `git add . && git commit -m "Describe el cambio" && git push`. Desde la web de GitHub: *Add file → Upload files* y confirma el commit en `main`. (La web **no sube archivos ni carpetas ocultas** como `.gitignore`, y **no borra** archivos que ya no existan: si eliminaste algo, bórralo también en GitHub.)
2. **Cloudflare publica solo.** El proyecto de Cloudflare Workers está conectado al repositorio y se actualiza con cada commit en `main`.
3. **Configuración que debe tener el proyecto en el panel de Cloudflare** (compárala con la tuya; este repositorio no incluye `wrangler.toml` a propósito, para no pisar la configuración del panel):
   - Comando de compilación: `node build.mjs`
   - Carpeta de archivos estáticos: `dist`
   - Versión de Node: 18 o superior (por ejemplo variable `NODE_VERSION=20`).
   - Si tu panel usa un archivo de Wrangler, un ejemplo mínimo sería `{ "name": "dojo-kokoro-web", "compatibility_date": "2025-01-01", "assets": { "directory": "./dist" } }`.
4. **Comprobar.** Abre el sitio, recarga con `Ctrl+Shift+R` y revisa las tres rutas (`/`, `/nuestro-dojo/`, `/programa-educativo/`), el formulario y los botones de WhatsApp.

### Dirección del sitio y dominio propio

La dirección pública está en `src/site.json` → `url` (hoy la de `workers.dev`) y de ella salen las URL canónicas, Open Graph, `sitemap.xml` y `robots.txt`. Los enlaces internos son relativos, así que el sitio funciona igual en cualquier dominio.

Cuando compres el dominio (previsto: `dojokokorocr.com`, **aún no configurado**):

1. Agrégalo al proyecto en Cloudflare (*Settings → Domains & Routes*).
2. Cambia `url` en `src/site.json` (o define `SITE_URL` en las variables de compilación de Cloudflare) y vuelve a publicar: las URL canónicas y el sitemap se actualizan solos.

## Cómo actualizar el contenido

| Quiero cambiar… | Dónde |
|---|---|
| Teléfono, Instagram, Facebook, dirección del sitio | `src/site.json` |
| Enlaces de Google Maps y Waze, y el mapa incrustado | `src/site.json` → `maps`, `waze`, `wazeEmbed`, `geo` |
| Mensajes de WhatsApp de los botones | `src/site.json` → `wa` |
| Mensaje del formulario (usa `{nombre}` y `{edad}`) | `src/site.json` → `formulario.mensaje` |
| Horarios y grupos | `src/pages/index.html` (sección `#horarios`) |
| Preguntas frecuentes | `src/pages/index.html` (sección `#preguntas`, un `<details>` por pregunta) |
| Misión y visión | `src/pages/nuestro-dojo.html` (`#mision`) y el resumen en `src/pages/index.html` (`.mvt`) |
| Los ocho valores | `src/data/valores.json` (**no cambiar los textos sin autorización**; los valores no llevan japonés a propósito) |
| Historia del dojo | `src/pages/nuestro-dojo.html` (`#historia`) |
| Datos de los senseis (grado, trayectoria, especialidades) | `src/pages/nuestro-dojo.html` (`#senseis`, lista `sensei__dl` de cada tarjeta) |
| Programa educativo | `src/pages/programa-educativo.html` |
| Logros | `src/data/logros.json` |
| Fotos de la galería | `src/data/galeria.json` y `src/assets/img/galeria/` |
| Título y descripción para buscadores | comentario `<!--page {...}-->` al inicio de cada archivo de `src/pages/` |
| Colores y tipografías | `src/css/00-base.css` (variables al inicio) |

Después de cualquier cambio: `node build.mjs && node tools/revisar-sitio.mjs dist`.

### Agregar un logro

Edita `src/data/logros.json` y agrega un objeto a la lista. Solo `titulo` es obligatorio; el resto se muestra únicamente si lo llenas:

```json
{
  "titulo": "Campeonato Nacional",
  "competencia": "Nombre oficial del torneo",
  "anio": "2025",
  "categoria": "Kata individual, 12–13 años",
  "atleta": "Nombre y apellido (solo con autorización)",
  "resultado": "Medalla de oro",
  "etiqueta": "Atleta del dojo",
  "foto": { "src": "nombre.webp", "alt": "Descripción de la foto", "w": 960, "h": 640 }
}
```

- Publica **solo resultados confirmados** e indica siempre el año: así los resultados históricos no se leen como actuales.
- La foto va en `src/assets/img/logros/` y solo se publica con autorización de la persona (o de sus padres si es menor).
- Si la lista queda vacía, la sección **Logros** y su acceso en la barra lateral se ocultan solos y se muestra «Construye una historia con nosotros».

### Agregar fotos a la galería

1. Copia las fotos reales del dojo a una carpeta y ejecuta `python3 tools/optimizar-imagenes.py CARPETA` (requiere Pillow). Las deja en `src/assets/img/galeria/` e imprime las entradas para el JSON.
2. Pega esas entradas en `src/data/galeria.json` (`src`, `alt`, `caption` opcional, `w`, `h`) y escribe un `alt` que describa cada foto.
3. Ejecuta `node build.mjs`. Se muestran 6 fotos y el resto queda en «Ver más fotos».

Mientras `galeria.json` no tenga fotos, la sección **Galería** muestra el aviso «Próximamente». Antes de publicar fotos de menores, confirma la autorización de sus padres o encargados.

### Avisos internos

Los datos que faltan por confirmar están en [`docs/PENDIENTES.md`](docs/PENDIENTES.md). En el sitio público **no se muestra ningún aviso de «pendiente»** (`"showPending": false` en `src/site.json`). Para verlos mientras trabajas en tu computadora: `SHOW_PENDING=true node build.mjs`.

## Qué no se publica

Por decisión del dojo, el sitio **no** muestra precios, tarifas, inversiones, cuotas federativas ni condiciones económicas de ninguna propuesta (horarios, costos e infraestructura se acuerdan con cada institución). Tampoco se publican teléfonos o correos personales: el único contacto es el WhatsApp oficial. Los documentos de trabajo con esos datos viven en `respaldo-original/`, fuera del repositorio.

## Calidad, accesibilidad y SEO

- HTML semántico, enlace «Saltar al contenido», navegación completa por teclado con foco visible, formulario con etiquetas y errores asociados al campo, kanji decorativos ocultos a lectores de pantalla y marcados con `lang="ja"`.
- **Los ocho valores** son botones con `aria-expanded` y `aria-controls`: se abren al pasar el cursor, al tocar, con Enter o Espacio, y se cierran al tocar otra vez, al tocar fuera o con Escape; la ventana se mantiene dentro de la pantalla. Sin JavaScript, las descripciones quedan visibles.
- **Preguntas frecuentes** con `<details>` nativo: funcionan con teclado y sin JavaScript.
- Respeta `prefers-reduced-motion`.
- Un título, descripción, URL canónica, Open Graph y Twitter Card distintos por página; datos estructurados (schema.org) sin reseñas ni calificaciones; `sitemap.xml` y `robots.txt`.
- Imágenes WebP con tamaños declarados y carga diferida; CSS y JS en un archivo cada uno, con versión en la URL.

## Derechos

© Dojo Kokoro Karate-Do Shotokan. Todos los derechos reservados.

El logo de Kokoro, las fotografías y los logos de ISKF Costa Rica y del CCDR de Santa Bárbara pertenecen a sus titulares. No se concede licencia para reutilizarlos. Si quieres que otras personas puedan reutilizar el **código**, agrega un archivo `LICENSE` (por ejemplo MIT) que cubra solo el código.
