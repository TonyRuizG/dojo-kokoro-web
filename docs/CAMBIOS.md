# Resumen de cambios

**Versión actual: 3.1** (sobre la 3.0, el tercer rediseño de interfaz). Los paquetes siguientes se numeran 3.1, 3.2, 3.3… y cada uno se entrega como `dojo-kokoro-web-v3.X.zip`.

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

- No se inventaron biografías, grados, títulos, logros, resultados, fotos ni alianzas. Lo que falta se documenta en `docs/PENDIENTES.md` y no se muestra en el sitio público (`showPending: false`).
- Misión y visión: en la primera versión eran textos propuestos; desde la tercera ronda (sección 9) son los **textos oficiales** entregados por el dojo.
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
- **Publicación:** rutas compatibles con una carpeta (incluida la página 404), `.gitignore` actualizado y README renovado. El material de respaldo queda fuera del repositorio público. (La preparación para GitHub Pages de esta ronda se retiró en la tercera: el sitio se publica con Cloudflare.)

## 9. Tercera ronda: actualización y optimización (prompt maestro)

Respaldo previo: `respaldo-original/respaldo-antes-del-prompt-maestro-*.tgz`. Se conservaron la identidad visual, la arquitectura del generador y la configuración de GitHub y Cloudflare; no se agregó ningún framework.

**P0 — correcciones críticas**
- **«EMPIEZA / HOY.»:** cada palabra va en su línea y el tamaño se ajusta al ancho de su columna (con respaldo para navegadores antiguos), así que no se corta. Probado en 1920, 1440, 1366, 1024, 768, 390 y 375 px, también con una tipografía más ancha que Oswald.
- **Avisos internos ocultos:** `showPending: false`; no queda texto de desarrollo visible («Texto propuesto», «Pendiente», etc.). Lo pendiente está en `docs/PENDIENTES.md`.
- **Logo oficial de Kokoro** en Respaldo institucional (Nuestro dojo y Programa educativo), en lugar del kanji 心.
- **URL pública:** `https://dojo-kokoro-web.anthony-ruiz-g22.workers.dev` en canonical, sitemap, Open Graph y datos estructurados. No se configuró dominio propio.

**P1 — identidad**
- **Misión y visión oficiales**, textos tal como se entregaron, en dos bloques en Nuestro dojo; resumen en Inicio con enlace a la sección.
- **Ocho valores. Una misma filosofía.:** tarjetas con ícono SVG, nombre, expresión japonesa e indicador de más información; descripción en ventana flotante (cursor en escritorio, toque en pantallas táctiles, Enter/Espacio con teclado, Escape y clic fuera para cerrar), siempre dentro de la pantalla y sin animación con `prefers-reduced-motion`. Datos en `src/data/valores.json`.
- **Dojo Kun** se mantiene aparte de los ocho valores, con su propia identidad.
- **Historia** conservadora: solo lo que consta en el Plan de trabajo 2022 y en lo ya confirmado; sin fechas ni fundadores inventados.
- **Senseis:** se conservaron las fotos y los datos confirmados; se agregaron rol y enseñanza, y la filosofía de enseñanza tomada de la misión oficial. Grado, certificaciones y trayectoria quedan pendientes de confirmación.
- **Logros** con datos estructurados (competencia, año, categoría, atleta, resultado, foto) y aclaración de que son resultados históricos. **Galería:** se oculta sola hasta que haya fotos reales; el sistema existente no cambió.

**P2 — contenido y calidad**
- **Bunkai** agregado en Nuestro dojo y Programa educativo, junto a los tres pilares.
- **Programa educativo** reorganizado en los 12 puntos pedidos, más «Cómo llevar Kokoro a tu institución» en cinco etapas. Sin precios, estimaciones ni acuerdos económicos; horarios, costos e infraestructura se acuerdan con cada institución. Se quitó la frase «sin inversión inicial en infraestructura» porque contradecía el Plan de trabajo.
- **Preguntas frecuentes** en Inicio (acordeón nativo `<details>`, funciona con teclado y sin JavaScript), con respuestas basadas solo en datos confirmados.
- **Formulario de WhatsApp:** mensaje nuevo con «Nombre del estudiante» y «Edad». Se corrigió un error: con edades menores de 8 años, la nota que aparecía al salir del campo movía el botón y el primer toque se perdía; ahora la nota de grupos es fija.
- **Progresión Iniciación → Formación → Competencia → Alto rendimiento** con la aclaración de que Kokoro acompaña según preparación, interés y elegibilidad, y que no garantiza selección ni clasificación. El recuadro «12+» ahora habla de elegibilidad.
- **Responsive** sin scroll horizontal en 9 anchos (1920 a 360 px) y regla de seguridad tipográfica para que ninguna palabra larga se salga de su caja.
- **Accesibilidad:** contraste revisado automáticamente (se corrigió un texto pequeño sobre rojo), foco visible en todos los controles, enlaces y botones con nombre, sin ids duplicados.
- **SEO:** título y descripción propios por página, canonical, Open Graph, sitemap y robots con la URL de Cloudflare.
- **README** y documentación actualizados para GitHub y Cloudflare.

**Cómo se verificó:** compilación, `tools/revisar-sitio.mjs`, y pruebas en Chromium (escritorio, iPhone, Pixel, iPad): formulario completo, valores con cursor/toque/teclado, preguntas frecuentes, menú móvil, consola sin errores, capturas de las tres páginas. **No verificado desde aquí:** la publicación en Cloudflare, Oswald/DM Sans reales, el mapa de Waze en vivo, dispositivos físicos y usuarios reales.

## 10. Versión 3.1 (ajustes con los datos confirmados por el dojo)

- **Ocho valores sin japonés:** se quitó por completo el texto japonés de las tarjetas (no hay forma de verificarlo). Los nombres y descripciones no cambiaron. Con menos kanji, la fuente de kanji que se descarga pesa menos (de 64 a 25 caracteres).
- **Senseis:** se eliminaron los campos «Rol» y «Enseñanza». Cada tarjeta muestra ahora dos recuadros: «Seleccionado/a Nacional» y «1er Dan» (ambos senseis).
- **Historia:** el dojo se fundó en 2023, de la mano de dos hermanos dedicados al karate-do que querían compartir su conocimiento; se presentó la oportunidad de unirse al Comité Cantonal de Deportes y Recreación (CCDR) de Santa Bárbara y se planteó llevar la enseñanza a todas las personas del cantón: niños, jóvenes y adultos. «Fundado: 2023» aparece en los datos del dojo y en los datos estructurados. Se retiró de la historia la mención a atletas en los Juegos Nacionales.
- **Logros:** por ahora no se publican logros. En su lugar se muestra «Construye una historia con nosotros» con el botón de primera clase gratis. Cuando haya logros en `src/data/logros.json`, esa sección se reemplaza sola por la de logros.
- **Galería:** muestra el aviso «PRÓXIMAMENTE» hasta que haya fotos reales; con fotos en `src/data/galeria.json` se llena sola. Su título pasó a «El dojo en acción».
- **Preguntas frecuentes:** «¿Qué debo llevar a mi primera clase?» ahora responde: ropa deportiva o cómoda, una botella para tomar agua y muchas ganas de entrenar.
- **Programa educativo:** el dojo confirmó como correctos los datos de referencia (2–3 sesiones semanales, unos 60 minutos, espacio de unos 70 m²).
- **Metadatos:** título y descripción de Nuestro Dojo actualizados («historia, senseis y valores»).
- **Verificación:** compilación, revisor del sitio, 91 pruebas del navegador, pruebas de los ocho valores, layout en 9 anchos y contraste; consola sin errores.
