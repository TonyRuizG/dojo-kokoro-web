# Datos y fotografías por confirmar (documento interno)

El sitio público **no muestra avisos de «pendiente»**: solo publica información confirmada. Esta lista es la referencia interna de lo que falta para completar secciones. (Para ver los avisos mientras trabajas: `SHOW_PENDING=true node build.mjs`).

## Antes de publicar el dominio propio

| # | Qué | Dónde se cambia |
|---|---|---|
| 1 | **Dominio propio** (previsto `dojokokorocr.com`, aún no comprado ni configurado). Hoy el sitio usa la dirección de `workers.dev`. | `src/site.json` → `url` (o `SITE_URL` en Cloudflare). Ver README. |

## Datos de texto

| # | Qué falta | Sección |
|---|---|---|
| 2 | **Escala de cinturones** del dojo y requisitos de cada examen. | Progresión por cinturones |
| 3 | **Calendario de torneos** y categorías competitivas. | Nuestro dojo → Desarrollo deportivo |
| 4 | **Logros** (cuando el dojo decida compartirlos): año, torneo, categoría y resultado. Hoy se muestra «Construye una historia con nosotros». Nombres de atletas solo con autorización. | `src/data/logros.json` |
| 5 | **Trayectoria de los senseis** (opcional): especialidades, certificaciones adicionales o datos verificables que quieran sumar. Hoy se muestran años de práctica, «Seleccionado/a Nacional» y «1er Dan». | Nuestro dojo → Senseis |
| 6 | **Asociación Kokoro Santa Bárbara:** cartas o enlaces que verifiquen el apoyo de cada organización de respaldo, si existen. | Respaldo institucional |
| 7 | **Kanji decorativos** (道場, 先生, 心, los del Dojo Kun, etc.): vienen del diseño original y de la tradición del Dojo Kun; conviene que los revise alguien que hable japonés, como se hizo con los valores. | Varias secciones |

## Fotografías

| # | Qué | Para qué |
|---|---|---|
| 8 | **Fotos reales** de entrenamientos, katas, kumite, graduaciones, torneos, comunidad e instructores con alumnos. Con autorización de padres o encargados si aparecen menores. | Galería deportiva (hoy muestra «Próximamente»; se llena sola al agregar fotos) |
| 9 | **Fotos del lugar de entrenamiento** (Salón Comunal de ADI Birrí). | Sección de ubicación |
| 10 | Una **foto de portada auténtica**, si quieren portada con fotografía en lugar del logo difuminado. | Las tres páginas |
| 11 | Confirmar que las **fotos de los senseis** son las definitivas y sumar fotos de trayectoria si las hay. | Nuestro dojo → Senseis |
| 12 | Imagen para compartir en redes (hoy se genera con el logo; puede reemplazarse por una foto real de 1200×630). | `src/assets/img/og-kokoro.jpg` |

## Ya confirmado por el dojo (versión 3.1)

- Ambos senseis son 1er Dan de ISKF (se publica «1er Dan»).
- Fundación en 2023 y la historia del dojo (dos hermanos, oportunidad con el comité cantonal).
- Qué llevar a la primera clase: ropa deportiva o cómoda, botella de agua y ganas de entrenar.
- Datos de referencia del Programa educativo: 2–3 sesiones semanales, unos 60 minutos, espacio de unos 70 m².
- Japonés de los valores: se quitó del sitio.
- Facebook definitivo: `facebook.com/profile.php?id=61595614032952`.
- Aprobación de ISKF y del CCDR para usar sus logos (los correos son confidenciales y no se guardan en el proyecto).
- Segunda sede: «Sede Sta. Bárbara Centro: PRÓXIMAMENTE» en la sección de ubicación. Cuando haya dirección, se agrega su mapa y sus botones.

## Material que se dejó fuera a propósito

- **Precios y condiciones económicas del Plan de trabajo 2022** (tarifa por persona y sesión, tablas de inversión, precios de tatami y equipo) y la **cuota federativa**: no se publican; se acuerdan con cada institución.
- **Teléfono y correo personales del Plan 2022:** el único contacto público es el WhatsApp oficial +506 8514-5922.
- **Nombre legal completo:** se usa «Sensei Anthony Ruiz».
- **Presentación comercial del programa** y fotos que parecen de banco de imágenes: no se usan; quedan en `respaldo-original/` (carpeta privada).
- **Foto del afiche (zip de referencia):** es una imagen de judo, no de karate ni del dojo.
- **Estadísticas tipo «20+ alumnos»:** se retiraron a pedido del dojo.
- **Logros y medallas de los Juegos Nacionales:** el dojo decidió no compartirlos todavía.
- **Contenido del sitio de ISKF Costa Rica:** no se usa.
- **Logo internacional de ISKF:** no corresponde; se usa solo el de ISKF Costa Rica.

## Qué no se puede verificar desde el entorno de desarrollo

- La **publicación real en Cloudflare** (hay que abrir el sitio tras cada commit).
- La apariencia exacta con **Oswald y DM Sans** (el entorno de pruebas no puede descargar Google Fonts; se usó una tipografía de reemplazo más ancha).
- El **mapa de Waze incrustado** en vivo (se probó con un sustituto) y el comportamiento de WhatsApp en dispositivos reales.
- **Pruebas con usuarios reales.**
