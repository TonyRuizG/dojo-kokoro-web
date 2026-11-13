# Resumen de cambios

**Versión actual: 4.4.1** (la 4.0 fue la identidad visual oficial, cuarta gran actualización visual). Los paquetes siguientes se numeran 4.1, 4.2… y cada uno se entrega como `dojo-kokoro-web-v4.X.zip`. Las secciones 1 a 14 cuentan la historia hasta la 3.5 (la paleta roja que se menciona ahí ya no está vigente).

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

## 11. Versión 3.2

- **Inicio → «¿Qué es Kokoro?»:** se quitó el resumen de misión y visión. La misión y la visión oficiales siguen completas en Nuestro dojo. Quedó un solo enlace, con el texto «Conoce más de nuestro dojo», que lleva a esa página.

## 12. Versión 3.3

- **Facebook:** enlace definitivo de la página (`facebook.com/profile.php?id=61595614032952`) en el encabezado, el menú móvil, el pie y los datos estructurados.
- **Dos sedes:** en la sección de ubicación de Inicio, el texto actual pasa a «Sede Birrí:» (con sus botones de Google Maps y Waze) y más abajo aparece «Sede Sta. Bárbara Centro: **PRÓXIMAMENTE**».
- **Logos de ISKF y CCDR:** el dojo confirmó que tiene aprobación para usarlos (se quitó de los pendientes).

## 13. Versión 3.4

- **Ubicación sin mapa incrustado:** se quitó el mapa de Waze (en escritorio y en celular). Quedan los botones «Abrir en Google Maps» y «Abrir en Waze».
- **Ubicación más arriba:** la sección pasó a ir justo después de los horarios, antes de las preguntas frecuentes, para que se encuentre sin bajar tanto. Se agregó «Ubicación» a la barra lateral. Se alternaron los fondos de las secciones vecinas para que se sigan distinguiendo.
- **Nuevo título:** «Dónde nos encontramos.» en lugar de «Un lugar para crecer.». El resto se mantiene: «Sede Birrí:», el texto, los dos botones y «Sede Sta. Bárbara Centro: PRÓXIMAMENTE».
- Se retiró `wazeEmbed` de `src/site.json` y del generador, y la regla del revisor ahora exige que no haya mapa incrustado y que la ubicación esté bien colocada.

## 14. Versión 3.5 (preparación para Claude Code)

El sitio no cambió: esta versión solo deja el repositorio listo para seguir trabajando en Claude Code.
- **`CLAUDE.md`:** reglas del proyecto (cómo trabajar con Tony, arquitectura, publicación, versiones, privacidad y contenido aprobado).
- **`tools/pruebas/`:** las cuatro pruebas de navegador (`final`, `valores`, `layout`, `contraste`) ahora viven en el repositorio y usan rutas relativas. Se probaron desde una copia limpia del proyecto. Script `npm run pruebas`.
- **README:** secciones sobre las pruebas y sobre Claude Code.

## 15. Versión 4.0 — Identidad Visual Oficial

Actualización integral de la identidad visual de Dojo Kokoro utilizando los colores oficiales del logotipo. Rediseño cromático de las tres páginas, optimización de la navegación, nuevo CTA animado de primera clase gratuita y mejoras en la jerarquía visual de la portada. La estructura, los textos aprobados, las tipografías y las funciones no cambiaron.

- **Paleta oficial** (la entregó el diseñador del logo): azul Kokoro `#272F6A`, verde Kokoro `#79C8A2` y negro `#000000`, con complementarios azul noche `#12182D`, marfil `#F6F3EA` y azul grisáceo `#AAB6CC`. Viven como variables al inicio de `src/css/00-base.css`; se revisó color por color qué función cumplía cada rojo en lugar de reemplazarlos en bloque.
- **Cómo se usa:** fondos oscuros, portadas y pie en azul noche; bandas de marca (cinta de lemas, frase, contacto, Dojo Kun, deporte, colaboración) en azul Kokoro; títulos de las secciones claras en azul Kokoro; el verde para botones de acción, palabras destacadas sobre fondo oscuro, estado activo, hover y foco. Sobre verde el texto va siempre en azul noche.
- **Contraste (WCAG AA):** el verde Kokoro no alcanza a leerse como texto sobre fondo claro (1,8:1), así que ahí las palabras destacadas usan un verde más hondo de la misma familia, `#2A7352` (4,6:1 o más). El foco del teclado es verde sobre fondos oscuros y azul sobre fondos claros.
- **Encabezado:** el enlace de la página activa va en verde. El botón superior dice **«¡Primera Clase Gratis!»** con flecha, fondo verde, texto azul noche y bordes redondeados, y se lee completo en todos los tamaños (en celulares el encabezado muestra solo el logo para darle espacio; por debajo de 350 px dice «¡Clase Gratis!»). En Programa educativo el botón conserva su destino institucional («Solicitar propuesta»), con el mismo estilo y sin pulso.
- **Pulso suave:** cada 3,6 s el botón crece un 4 % y vuelve a su tamaño (solo `transform: scale`, sin mover el encabezado). Se detiene con el cursor o el foco del teclado y se desactiva con «reducir movimiento».
- **Portada de Inicio:** se quitó el botón «Agenda tu primera clase gratis» del hero (los enlaces de inscripción después de los horarios, en las preguntas y en el formulario siguen igual). **«VER HORARIOS»** pasó a ser la acción principal: botón grande azul Kokoro con borde verde y flecha, que baja suavemente a los horarios sin que el encabezado tape el título (con movimiento reducido salta de inmediato). El título de la portada usa verde sólido en la segunda línea y el círculo enso pasó a azul Kokoro.
- **Portada de Nuestro dojo:** igual que en Inicio, se quitó el botón «Primera clase gratis» del hero (el de la sección «Construye una historia con nosotros» y el del encabezado siguen igual). **«CONOCE A LOS SENSEIS»** pasó de enlace subrayado al mismo botón grande de «Ver horarios» y baja a la sección de los senseis.
- **Sistema de botones:** principal verde (`btn-main--verde`), secundario azul noche (`btn-main--ink`) y azul con borde verde (`btn-main--azul`). «Solicitar propuesta institucional» y «Forma parte de nuestro dojo» quedaron en verde sobre las bandas azules.
- **Nuestro dojo y Programa educativo:** misión y visión, senseis, Dojo Kun, ocho valores (íconos azules; al abrirse, ícono y borde verdes), Kata en verde entre Kihon y Kumite, beneficios, proceso con números en círculos verdes, desarrollo deportivo, respaldo y galería adaptados a la nueva paleta. Los logos de terceros y la bandera de Costa Rica conservan sus colores.
- **Imagen para compartir** (`og-kokoro.jpg`): rehecha con la nueva paleta, el mismo logo y los mismos textos. WhatsApp y Facebook pueden seguir mostrando la vista previa anterior unos días por su caché.
- **Lo único rojo que queda:** los mensajes de error del formulario (`--error`), a propósito, porque así se reconocen como error.
- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final`, `valores`, `layout` y `contraste`; además, una revisión de las tres páginas en 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844 y 375×812 (187 comprobaciones: sin desplazamiento horizontal, botón sin cortes, sin rojo en la interfaz, textos dentro de su caja, consola limpia, pulso, movimiento reducido, teclado, menú móvil, «Ver horarios», «Conoce a los senseis» y destinos de los enlaces), con capturas de antes y después. Los dos avisos que dan `layout` (una tarjeta de Inicio en 1440 y 1920) y `contraste` (textos del encabezado transparente sobre la portada) ya aparecían igual en la 3.5.

## 16. Versión 4.1 — Nuevos días de entrenamiento, edad mínima de 6 años y botón sin flecha

- **Días:** las clases pasan de miércoles y viernes a **lunes y miércoles**, con los mismos horarios (niños de 6:40 a 7:40 p. m.; jóvenes y adultos de 7:40 a 8:40 p. m.). Se cambió en la portada y la cinta de lemas de Inicio, en la tabla de horarios, en las preguntas frecuentes y en «Entrenamientos» de Nuestro dojo.
- **Edad mínima de 6 años:** el grupo de niños pasa de 8–11 a **6–11 años**, también para la primera clase gratis. Se cambió en la tabla de horarios, las preguntas frecuentes, la nota del formulario y el mensaje de WhatsApp del grupo de niños (`src/site.json` → `wa.ninos`). En Programa educativo, «desde los 8 años» pasó a «desde los 6 años» (presentación, objetivo general y ficha de edades). El grupo de jóvenes y adultos sigue desde los 12 años, igual que la elegibilidad deportiva.
- **Botón del encabezado:** se quitó la flecha (→) de «¡Primera Clase Gratis!» porque no aportaba nada; el botón queda solo con el texto y sigue con su pulso. También se quitó del «Solicitar propuesta» de Programa educativo, que usa el mismo botón.
- **README:** la tabla de «Cómo actualizar el contenido» ahora lista todos los lugares donde aparecen días y edades.
- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final` y `valores` sin fallas; `layout` y `contraste` solo con los avisos que ya existían.

## 17. Versión 4.2 — Criterios de evaluación en Nuestro dojo

- **Nueva sección «Criterios de evaluación»** (`#criterios`), justo después de «Progresión por niveles y cinturones» y antes de «Desarrollo deportivo»: etiqueta «Evaluaciones», título, la pregunta «¿Qué se valora durante un examen de Karate-Do?» y el texto introductorio aprobado.
- **Cuatro tarjetas informativas** (Kihon, Kata, Kumite, Espíritu y actitud) con número, ícono propio en verde Kokoro y los textos aprobados, sin cambios. En 2×2 en todos los tamaños; en celulares (560 px o menos) las tarjetas se compactan, con letra e íconos más pequeños. No son botones: sin enlaces, ventanas ni animaciones. Sin kanji ni emojis.
- **Cierre** en azul noche con una línea verde, a todo el ancho debajo de las tarjetas y con letra moderada (hasta 40 px): «Los exámenes reflejan el progreso, no la perfección.» y «La mejora continua es nuestro verdadero objetivo.»
- **Sin cambios** en la progresión por cinturones, la metodología, los valores, el encabezado, el pie, la navegación ni las otras páginas. Los estilos nuevos van en `src/css/06-dojo.css` y solo afectan a esta sección.
- **README y CLAUDE.md:** la sección y sus textos aprobados quedan anotados.
- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final` y `valores` sin fallas; `layout` y `contraste` solo con los avisos que ya existían. Además, 91 comprobaciones de la sección en siete tamaños (1920 a 375 px): orden de las secciones, cuadrícula 2×2 en todos, tarjetas del mismo ancho y alto, textos completos y exactos, sin desbordes, colores de fondo, sin kanji ni enlaces y consola limpia.

## 18. Versión 4.3 — Optimización editorial y experiencia de lectura

Objetivo: menos desplazamiento para recorrer las tres páginas, sin quitar contenido ni cambiar la identidad. El texto de las páginas es idéntico al de la 4.2 (solo se agregó «Beneficios» al menú por secciones de Programa educativo).

- **Sistema global:** el espacio arriba y abajo de cada sección pasa de `clamp(80px, 10vw, 130px)` a `clamp(56px, 7vw, 96px)` (`--sec-y`); los títulos de sección quedan al 84 % de su tamaño con una sola variable (`--h2-k`); menos espacio bajo las cabeceras y etiquetas; la palabra «KOKORO» del pie es más contenida.
- **Inicio:** portada con menos aire (mismo título, «Ver horarios», «¡Primera Clase Gratis!» y pulso). En «Cuerpo, mente y espíritu», «Tres pilares» y «Conoce más» el kanji pasa a marca de agua en la esquina y las tarjetas ya no imponen alturas grandes. Frase azul, horarios, ubicación, preguntas y contacto más contenidos. En celular, el kanji de Filosofía va en línea con sus etiquetas y el botón de cada horario va junto al nombre del grupo.
- **Nuestro dojo:** en computadora cada sensei va en horizontal (foto a la izquierda, datos a la derecha), los dos lado a lado; mismas fotos y datos. Dojo Kun con placas más bajas y, en celular, en dos columnas. Desarrollo deportivo en 2×2 en celular. Kihon, Kata y Kumite en tres columnas también en tableta. Identidad, historia, misión y visión, cinturones y galería («Próximamente») más compactos. Los ocho valores no cambian.
- **Programa educativo:** beneficios, «Por qué este programa» y el bloque de 70 m² con alturas menores; ficha del programa, seguimiento, objetivos y necesidades con filas más contenidas; la cita final baja de 62 a 42 px como máximo. El menú por secciones suma «Beneficios».
- **Prueba de valores:** el paso «tocar otra cambia» fija primero la posición de la lista en pantalla, porque con la página más corta la ventana de un valor podía abrirse hacia abajo y tapar el siguiente. Los valores se comportan igual que en la 4.2 (comprobado en las dos versiones).
- **Altura de las páginas (px, antes → después):**

| Página | 1920 | 1440 | 1366 | 1024 | 768 | 390 | 375 | 360 |
|---|---|---|---|---|---|---|---|---|
| Inicio | 9710 → 7836 | 9369 → 7707 | 9171 → 7617 | 8645 → 7149 | 11820 → 9362 | 12816 → 10264 | 12999 → 10525 | 13118 → 10641 |
| Nuestro dojo | 16397 → 13395 | 16110 → 13162 | 15743 → 13015 | 15097 → 12982 | 17424 → 14842 | 19832 → 16862 | 19964 → 16969 | 20207 → 17272 |
| Programa educativo | 15565 → 12831 | 15257 → 12527 | 15011 → 12316 | 14291 → 12258 | 16206 → 13448 | 21026 → 18037 | 21310 → 18313 | 21682 → 18708 |

  En computadora, entre 17 y 19 % menos; en tableta y celular, entre 14 y 21 % menos.
- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final` y `valores` sin fallas; `layout` sin avisos (antes daba dos); `contraste` solo con los avisos de siempre del encabezado transparente; la revisión de 187 comprobaciones de la 4.0 sin fallas; 99 comprobaciones de anclas (cada acceso del menú por secciones y de las portadas deja su sección a la vista, sin quedar bajo el encabezado) y de desplazamiento horizontal en 8 tamaños (1920 a 360 px); 91 comprobaciones de «Criterios de evaluación»; texto de las tres páginas comparado con la 4.2.

## 19. Versión 4.4 — Inicio esencial

Reorganización estratégica de la página Inicio para mejorar la experiencia de nuevos visitantes, reducir contenido redundante, destacar a los instructores, simplificar el acceso a horarios y contacto, y mantener la información institucional y técnica en las subpáginas correspondientes.

- **Estructura nueva de Inicio (de 10 a 8 secciones):** portada · filosofía y beneficios · frase azul · senseis · horarios y ubicación · preguntas · accesos a las otras páginas · «Empieza hoy». La portada no cambia.
- **Filosofía y beneficios, juntos:** «El verdadero combate es interior», la introducción y las tres tarjetas (cuerpo, mente, espíritu) en una sola sección, con los enlaces «Conoce nuestra filosofía» (a `#kokoro` de Nuestro dojo) y «Descubre cómo entrenamos» (a `#metodologia`). Salen el segundo título («Formar el cuerpo. Fortalecer el espíritu.») y la fila de palabras sueltas, que repetían lo mismo.
- **Senseis en resumen (`#senseis`):** foto, años de experiencia, grado y selección nacional de Anthony y Camila, con los mismos datos de Nuestro dojo, y el enlace «Conoce a nuestros instructores». Los perfiles completos siguen solo en Nuestro dojo.
- **Sale de Inicio «Tres pilares»** (Kihon, Kata, Kumite): ya está completo en Nuestro dojo. El texto «空手道 significa "el camino de la mano vacía"…», que solo estaba en Inicio, pasó a la cabecera de «Cómo entrenamos».
- **Horarios y ubicación en un mismo bloque:** en computadora (desde 1200 px) la tabla va a la izquierda y, a la derecha, la tarjeta de la sede con Google Maps y Waze, que ocupa todo el alto del bloque. La invitación «Primera clase gratis» va debajo de la tabla, en una sola fila con su botón a la derecha. En tableta y celular el orden es grupos, horarios, sede, mapas e invitación. Los datos no cambian. `#ubicacion` sigue existiendo, ahora dentro de `#horarios`.
- **Secciones de Inicio más juntas:** Inicio usa un espacio vertical propio y menor (`--sec-y` de `clamp(44px, 5vw, 68px)` mediante la clase `pg-inicio`, que `src/layout.html` pone en `<body>` con el nombre de cada página). La banda de la frase azul es más baja. Las otras dos páginas conservan su espaciado.
- **Portada en pantallas bajas (las tres páginas):** el título y el aire superior también se limitan por la altura de la pantalla (`vh`). En un portátil de 14" (unos 1280 × 600 px útiles) el título de Inicio pasa de 121/179 a 90/133 px y caben el título, el texto y «Ver horarios» sin bajar. En pantallas altas, tabletas y celulares en vertical el título mide lo mismo que antes.
- **Preguntas frecuentes:** quedan cinco. La de cinturones sale de Inicio (sigue en Nuestro dojo) y «¿La primera clase tiene algún costo?» pasa a «¿La primera clase es gratuita?».
- **Accesos a las otras páginas:** dos tarjetas compactas, «Conoce Kokoro por dentro» y «Kokoro en instituciones educativas», sin título grande de sección.
- **Contacto:** la etiqueta pasa a «El primer paso es conocernos» y el párrafo a un mensaje de bienvenida. El formulario, sus validaciones y WhatsApp no cambian.
- **Navegación lateral de Inicio:** Filosofía, Senseis, Horarios, Preguntas y Contacto. Las de Nuestro dojo y Programa educativo no cambian.
- **Política de contenido:** no se publica información económica (solo que la primera clase es gratis) ni fechas de apertura sin confirmar. Queda anotado en `CLAUDE.md`.
- **Pruebas actualizadas:** `tools/revisar-sitio.mjs` y `tools/pruebas/final.mjs` esperan el nuevo número de preguntas.
- **Recorrido de Inicio (px, antes → después):**

| Tamaño | Alto total | Hasta los horarios | Hasta el formulario |
|---|---|---|---|
| 1920 × 1080 | 7836 → 6073 | 3764 → 2966 | 6772 → 5037 |
| 1440 × 900 | 7707 → 5943 | 3696 → 2890 | 6647 → 4911 |
| 1366 × 768 | 7617 → 5832 | 3641 → 2812 | 6570 → 4812 |
| 1024 × 768 | 7149 → 5881 | 3513 → 2820 | 6166 → 4918 |
| 768 × 1024 | 9362 → 7638 | 4391 → 3485 | 8403 → 6691 |
| 390 × 844 | 10264 → 8514 | 4914 → 3781 | 9216 → 7478 |
| 375 × 812 | 10525 → 8708 | 5083 → 3915 | 9477 → 7672 |

- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final` y `valores` sin fallas; `layout` sin avisos; `contraste` solo con los avisos de siempre del encabezado transparente; la revisión de 187 comprobaciones sin fallas; 93 comprobaciones de anclas y desplazamiento horizontal; 91 de «Criterios de evaluación»; 114 propias de la 4.4 en siete tamaños (estructura, navegación lateral, fotos, enlaces hacia las otras páginas, «Ver horarios», pulso, datos vigentes, sin información económica ni fechas, y Nuestro dojo y Programa educativo con todo su texto de la 4.3); y 135 de las tres portadas en nueve tamaños, incluido 1277 × 603 (título completo, botón a la vista, título igual que antes en pantallas altas).

## 20. Versión 4.4.1 — Cinturones y su significado, y acomodo suave en Inicio

- **Cinturones como divisores: descartado.** No se agregó ningún cinturón decorativo entre secciones; queda anotado en `CLAUDE.md`.
- **Nueva sección «Cinturones y su significado»** en Nuestro dojo (`#significado-cinturones`), entre Criterios de evaluación y Desarrollo deportivo. Fondo azul noche y ocho tarjetas marfil (Blanco, Amarillo, Naranja, Verde, Azul, Morado, Café y Negro), cada una con una ilustración simple del cinturón en su color, el nombre, el nombre japonés y una frase breve.
- **La tarjeta se amplía por dentro** (no es ventana flotante ni modal):
  - en computadora, al dejar el cursor un instante sobre ella (la espera evita que se abran las que solo pasan bajo el cursor al desplazar la página);
  - en celular y tableta, al tocarla; se cierra al tocar de nuevo o fuera;
  - con el teclado, con Enter o Espacio; Escape la cierra.
  Solo queda una abierta a la vez. El despliegue es suave y se apaga con movimiento reducido; sin JavaScript los textos ampliados quedan visibles. El texto ampliado de Morado aclara que tiene 2 niveles, el de Café 3, y el de Negro menciona los grados dan sin afirmar cuántos hay.
- **Distribución:** en computadora, tres filas (3, 3 y 2, con Café y Negro centrados); en tableta, dos columnas; en celular, una fila compacta por cinturón con la ilustración a la izquierda.
- **Colores de los cinturones** como variables `--obi-*` en `src/css/00-base.css`, solo para sus ilustraciones. La interacción es un bloque propio en `src/js/site.js`; los ocho valores no se tocaron.
- **Acomodo suave en Inicio:** `scroll-snap-type: y proximity` solo en Inicio, con `scroll-snap-align: start` en sus secciones y respetando los 84 px del encabezado. Cuando el desplazamiento se detiene justo antes de una sección, o apenas pasada una sección corta, la vista se acomoda a su comienzo. Dentro de una sección más alta que la pantalla se lee libre. No se usa `mandatory` ni se intercepta la rueda o el toque. Se apaga con movimiento reducido y mientras se escribe en el formulario (para que el teclado del celular no mueva la vista).
- **«Empieza hoy» más compacto (Inicio):** menos espacio entre la etiqueta, el título, el párrafo y la lista; el título un poco más pequeño (máximo 120 px, para que no crezca de más en tableta); y en la tarjeta del formulario menos relleno, título en una línea en computadora, campos de 50 px de alto (antes 56) y separaciones más cortas. «Karate-Do» ya no se parte al final de la línea, y en celular la etiqueta «El primer paso es conocernos» cabe en una línea desde 360 px. El formulario, sus validaciones y WhatsApp no cambian. La sección pasa de 890 a 701 px en computadora (1440), de 1393 a 1115 en tableta y de 1443 a 1170 en celular.
- **Saltos a secciones corregidos (las tres páginas):** al usar la barra lateral, los botones de las portadas o los enlaces hacia otra sección, la sección quedaba «a medio camino». Había dos causas: al bajar, el encabezado se escondía pero seguía reservando sus 84 px arriba, y asomaba una franja de la sección anterior; y al subir, el encabezado compacto mide 71 px, no 84, y asomaban 13 px. Ahora `scroll-padding-top` es 71 px (`src/css/00-base.css`) y el encabezado se queda visible mientras dura el salto (`src/js/site.js`), también al llegar desde otra página. Después del salto se sigue escondiendo al bajar, como siempre.
- **Enlaces para verificar el respaldo:** en «Respaldo nacional e internacional» (Nuestro dojo) y «Un programa con respaldo» (Programa educativo), que comparten la misma pieza (`src/partials/backers.html`), ISKF Costa Rica tiene los botones «Sitio web» y «Facebook», y el CCDR de Santa Bárbara su correo institucional y «Facebook», para que cualquier persona pueda verificar ese respaldo. Los enlaces viven en `src/site.json` → `respaldo`. Los dos íconos nuevos que entregó Tony (correo y sitio web) se pasaron a blanco sobre fondo transparente, de 48 × 48 px, como los de Facebook, Instagram y WhatsApp (`src/assets/icons/correo.png` y `web.png`). `tools/revisar-sitio.mjs` sigue rechazando cualquier correo visible salvo los de `respaldo`. Se comprobó que los tres enlaces responden.
- **Altura de Nuestro dojo:** la sección suma 958 px en computadora (13206 → 14164), 1240 en tableta (14967 → 16207) y 1518 en celular (16979 → 18497).
- **Verificación:** compilación y revisor del sitio sin errores; pruebas `final` y `valores` sin fallas; `layout` sin avisos; `contraste` solo con los avisos de siempre del encabezado transparente; la revisión de 187 comprobaciones sin fallas; 93 de anclas y desplazamiento horizontal; 91 de «Criterios de evaluación» (ya con el nuevo orden); 114 de la 4.4; 102 de los cinturones (orden, colores, cuadrícula en 7 tamaños, cursor, toque en iPhone, Android y iPad, teclado, una abierta a la vez, movimiento reducido y sin JavaScript); y 76 del acomodo suave (solo en Inicio, cerca de cada sección, secciones largas libres, rueda y toque sin retrocesos ni saltos bruscos, menú lateral y formulario). Tras compactar «Empieza hoy» se repitieron todas, con la prueba `final` cubriendo el formulario (errores, edades no válidas, mensaje exacto de WhatsApp y que el primer toque en el botón lo abra) y 135 de las tres portadas en nueve tamaños.
