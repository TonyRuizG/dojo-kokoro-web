# Resumen de cambios

Punto de partida: la página única de Dojo Kokoro (versión 15, un solo archivo HTML empaquetado).
Resultado: un sitio de tres páginas, organizado y listo para publicar. La versión original está intacta en `respaldo-original/`.

## 1. Se conservó (identidad visual)

- Paleta (rojo, azul marino, tinta, crema y papel), tipografías (Oswald, DM Sans, Noto Serif JP) y jerarquías.
- Logo original de Kokoro, fotos de los senseis y logos de ISKF Costa Rica y CCDR.
- Kanjis (空手道, 心, 力, 静, 礼, 基本, 型, 組手, 人格, 誠, 努力, 戒, 道, 先生, 場所, 始), la cinta de palabras, el círculo enso y el logo difuminado de la portada.
- Barra lateral flotante con «volver arriba» y el menú de celular que se expande y se mantiene abierto.
- Los textos existentes: filosofía, Cuerpo/Mente/Espíritu, Kihon/Kata/Kumite, Dojo Kun, tarjetas de los senseis, respaldo institucional, horarios y contacto.

## 2. Objetivo 1 — Referencias al lanzamiento eliminadas

- Se quitó «Inicio de clases · 28 de octubre» de la portada, de los horarios y de los puntos de contacto.
- Ahora se lee **INSCRIPCIONES ABIERTAS**, **TU CAMINO COMIENZA AQUÍ.** y **COMIENZA TU CAMINO EN EL KARATE-DO.**
- Los mensajes de WhatsApp piden «las próximas fechas disponibles» (todos se editan en `src/site.json`).
- Se mantiene: Karate-Do Shotokan, niños/jóvenes/adultos, miércoles y viernes, 6:40–7:40 p. m. (8 a 11 años), 7:40–8:40 p. m. (12 años en adelante), Salón Comunal de ADI Birrí, primera clase gratis y WhatsApp +506 8514-5922.
- `tools/revisar-sitio.mjs` comprueba automáticamente que no queden fechas de lanzamiento.

## 3. Objetivo 2 — Tres páginas independientes

**Inicio (`/`)** — Portada con el botón *Agenda tu primera clase gratis*; filosofía («¿Qué es Kokoro?»); beneficios («¿Por qué entrenar aquí?»); presentación del Karate-Do Shotokan con Kihon, Kata y Kumite; horarios y primera clase gratis («¿Cómo comenzar?»); enlaces a Nuestro dojo y Programa educativo; ubicación y contacto.

**Nuestro dojo (`/nuestro-dojo/`)** — Identidad; significado de Kokoro; misión, visión y valores (misión y visión marcadas como *texto propuesto*); Dojo Kun; senseis Anthony y Camila Ruiz con foto; metodología; progresión por cinturones; desarrollo deportivo y Juegos Nacionales; logros reales; respaldo institucional; galería deportiva ampliable; botón *Forma parte de nuestro dojo* hacia WhatsApp.

**Programa educativo (`/programa-educativo/`)** — Basado en la presentación «Programa de Karate-Do para Formación Integral»: *Formación más allá del aula*; propuesta; beneficios (sin resultados garantizados); Kihon/Kata/Kumite; estructura (2–3 sesiones semanales sujetas a acuerdo, ~60 minutos, por edad y nivel, cinturones, evaluaciones y seguimiento); implementación (~70 m², sin inversión inicial en infraestructura); desarrollo deportivo; respaldo; propuesta de colaboración y botón *Solicitar propuesta institucional* con el mensaje exacto indicado.

El enlace «Programa para centros educativos» de la antigua sección «El dojo» ahora lleva a la página del Programa educativo.

## 4. Objetivo 3 — Reorganización técnica

- Sitio estático multipágina, sin dependencias, con un generador de un archivo (`build.mjs`).
- Encabezado, pie y componentes compartidos en `src/partials/`; estilos separados en ocho archivos CSS; un único `site.js`.
- URLs limpias (`/nuestro-dojo/`, `/programa-educativo/`), rutas relativas (funciona en cualquier carpeta o dominio) y página 404.
- SEO: título, descripción, canonical, Open Graph y Twitter Card por página; datos estructurados; `sitemap.xml`; `robots.txt`; imagen para compartir y favicons.
- Imágenes convertidas a WebP (logo 123 KB → 51 KB; fotos de senseis 125 KB y 176 KB → 25 KB y 52 KB en tamaño de tarjeta), con `srcset`, tamaños declarados y carga diferida.
- Configuración lista para Vercel (`vercel.json`) y Netlify (`netlify.toml`).
- Sin base de datos, sin autenticación, sin pagos.

## 5. Objetivo 4 — Navegación y experiencia

- Menú principal **INICIO | NUESTRO DOJO | PROGRAMA EDUCATIVO** con la página actual marcada.
- Botón de contacto siempre visible en el encabezado: *Primera clase gratis* (Inicio y Nuestro dojo) o *Solicitar propuesta* (Programa educativo).
- El encabezado se fija arriba, se oculta al bajar y reaparece al subir, para tener siempre a mano el menú y el contacto.
- En celular, el menú se despliega con los tres enlaces, el botón de contacto y las redes.
- Barra lateral flotante adaptada a cada página (secciones propias).
- Transición suave entre páginas (fundido) y soporte de `prefers-reduced-motion`.

## 6. Decisiones de contenido (por honestidad de la información)

- No se inventaron biografías, grados, títulos, logros, resultados, fotos ni alianzas. Lo que falta aparece como **Pendiente** (se oculta con `showPending: false`).
- Misión y visión son textos **propuestos**, escritos solo con lo que ya decía el sitio, y están identificados como tales.
- De los logros solo se publican los confirmados por el dojo: senseis seleccionados nacionales; cuatro atletas clasificados a los Juegos Nacionales y tres con medalla. No se volvió a mostrar el recuadro de estadísticas que se había quitado.
- Las **condiciones económicas** de la propuesta institucional no se publican: se acuerdan con cada institución, y la página lo dice expresamente.
- La foto del afiche es de **judo** y las fotos de la presentación parecen de banco de imágenes; no se usaron para no presentar como del dojo imágenes que no lo son. Quedaron guardadas en `respaldo-original/`.
- Solo se usa el logo de ISKF Costa Rica; el logo internacional de ISKF (el que no corresponde) no se usa en ninguna parte.

## 7. Cómo se verificó

- Servidor local + navegador real (Chromium), en escritorio (1440 px) y celular (390 px), y al abrir `dist-local` con doble clic.
- Se probaron: navegación entre las tres páginas, menú de celular, barra lateral, botones de WhatsApp y su mensaje, selector «¿para quién es la clase?», movimiento reducido, teclado.
- Sin errores de consola, sin desbordes horizontales (360, 390 y 768 px) y sin imágenes rotas.
- `tools/revisar-sitio.mjs`: 155 enlaces y recursos locales sin roturas, metadatos completos, un `<h1>` por página, textos alternativos presentes.

**Límite de la verificación:** el entorno de pruebas no puede descargar Google Fonts, así que las capturas de revisión usaron una letra de reemplazo más ancha que Oswald. La composición se revisó con ella (y se reforzó para que no se desborde), pero el aspecto exacto de las tipografías debe confirmarse en tu navegador.

## 8. Segunda ronda de cambios

- **Ubicación:** la sección «Un lugar para crecer» ahora tiene los botones *Abrir en Google Maps* y *Abrir en Waze* y el mapa de Waze incrustado (con el fondo de marca como respaldo mientras carga). Las coordenadas también se agregaron a los datos estructurados para buscadores. Los enlaces están en `src/site.json` (`maps`, `waze`, `wazeEmbed`, `geo`).
- **Formulario de contacto:** en «¿Listo para entrar al dojo?» se reemplazó el selector de tres opciones por un formulario con *Nombre de la persona que va a entrenar* y *Edad*. Al pulsar *Continuar por WhatsApp* se abre una conversación con el mensaje ya escrito con esos datos. Se valida antes de enviar (sin datos guardados en la página). El texto del mensaje se edita en `src/site.json` → `formulario.mensaje`.
- **GitHub Pages:** flujo de publicación automática (`.github/workflows/deploy.yml`), rutas compatibles con la carpeta del repositorio (`/dojo-kokoro-web/`, incluida la página 404), `.gitignore` actualizado y README renovado. El material de respaldo queda fuera del repositorio público.
