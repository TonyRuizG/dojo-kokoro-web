# Datos y fotografías pendientes de confirmar

Todo lo marcado como **Pendiente** en el sitio aparece aquí. Mientras no se complete, el sitio solo muestra información confirmada.
Los avisos se ven al trabajar en tu computadora y **se ocultan solos en la publicación de GitHub Pages** (ver `SHOW_PENDING` en el README).

## Antes de publicar

| # | Qué | Dónde se cambia |
|---|---|---|
| 1 | **Dominio propio** (opcional). En GitHub Pages el sitio funciona con la dirección que asigna GitHub; si compras un dominio, configúralo en Settings → Pages. | Ver README, sección «Dominio propio» |
| 2 | Revisar y aprobar **misión y visión** (son textos propuestos), o reemplazarlas por las oficiales. | `src/pages/nuestro-dojo.html` (`#valores`) |
| 3 | **Permiso de uso** de los logos de ISKF Costa Rica y del CCDR de Santa Bárbara. | — |
| 4 | Cambiar el enlace de Facebook por la **dirección permanente de la página** (el actual es un enlace para compartir, `facebook.com/share/...`). | `src/site.json` → `social.facebook` |

## Datos de texto

| # | Qué falta | Sección |
|---|---|---|
| 5 | **Historia del dojo:** año de fundación, cómo y por qué nació, primeros pasos. | Nuestro dojo → Historia e identidad |
| 6 | **Biografías de los senseis:** grado (Dan), títulos, trayectoria y logros individuales de Anthony y Camila. Hoy solo se muestran años de práctica y condición de seleccionados nacionales. | Nuestro dojo → Senseis |
| 7 | **Logros:** año de los Juegos Nacionales, categorías, tipo de medalla, torneos y resultados de cada sensei, y nombres de atletas que se quieran hacer públicos. Hoy solo se publica: cuatro atletas clasificados y tres con medalla. | Nuestro dojo → Logros (`src/data/logros.json`) |
| 8 | **Calendario de torneos** y categorías competitivas. | Nuestro dojo → Desarrollo deportivo |
| 9 | **Escala de cinturones** del dojo y requisitos de cada examen. | Nuestro dojo → Progresión por cinturones |
| 10 | **Asociación Kokoro Santa Bárbara:** logo oficial y, si existen, cartas o enlaces que verifiquen su apoyo (hoy se usa el kanji 心 como marca provisional). Lo mismo para verificar el respaldo de ISKF Costa Rica y del CCDR. | Respaldo institucional (Nuestro dojo y Programa educativo) |
| 11 | **Programa educativo:** confirmar los datos de la propuesta (2–3 sesiones semanales, ~60 minutos, ~70 m², sin inversión inicial en infraestructura). Las condiciones económicas no se publican. | `src/pages/programa-educativo.html` |

## Fotografías

| # | Qué | Para qué |
|---|---|---|
| 12 | **Fotos reales del dojo en acción** (entrenamientos, torneos, graduaciones). Con autorización de padres o encargados si aparecen menores. | Galería deportiva (hoy vacía) |
| 13 | **Fotos del nuevo lugar de entrenamiento** (Salón Comunal de ADI Birrí). | Sección de ubicación |
| 14 | Una **foto de portada auténtica** del dojo, si quieren una portada con fotografía en lugar del logo difuminado. | Inicio, Nuestro dojo y Programa educativo |
| 15 | Confirmar que las **fotos de los senseis** son las definitivas. | Nuestro dojo |
| 16 | Imagen para compartir en redes (hoy se genera con el logo; se puede reemplazar por una foto real de 1200×630). | `src/assets/img/og-kokoro.jpg` |

## Material que se dejó fuera a propósito

- **Foto del afiche (zip de referencia):** es una imagen de judo, no de karate ni del dojo.
- **Fotos de la presentación del programa:** parecen imágenes de banco de imágenes o generadas; no se presentan como del dojo.
- **Condiciones económicas de la propuesta institucional:** se acuerdan con cada institución y no se publican.
- **Estadística «20+ alumnos»** y recuadro de números: se retiró a pedido tuyo; los logros se muestran solo como lista de hechos confirmados.
- **Logo internacional de ISKF:** no corresponde; se usa solo el de ISKF Costa Rica.

Todo está guardado en `respaldo-original/` por si quieres recuperarlo.
