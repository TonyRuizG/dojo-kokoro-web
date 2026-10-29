# Dojo Kokoro Karate-Do Shotokan: sitio web (instrucciones para Claude)

Sitio estático del dojo (Santa Bárbara de Heredia, Costa Rica). Dueño: Anthony Ruiz («Tony» o «Keko»), sensei y organizador del dojo.
Publicado en Cloudflare Workers: https://dojo-kokoro-web.anthony-ruiz-g22.workers.dev
El dominio propio previsto (dojokokorocr.com) todavía NO está comprado ni configurado: no lo toques hasta que Tony lo pida.

## Cómo trabajar con Tony
- Responde en español, con tono cálido, claro y breve. Explica sin jerga qué cambiaste y cómo verlo.
- Tony se impacienta con el silencio: en tareas largas da avisos cortos de avance.
- No inventes datos (logros, grados, títulos, fotos, fechas, datos institucionales). Si falta algo, pídelo y anótalo en `docs/PENDIENTES.md`.
- No afirmes lo que no verificaste (sitio en vivo, celulares reales, tipografías reales).

## Arquitectura (no reconstruir ni agregar frameworks)
- Generador sin dependencias: `build.mjs` (Node 18 o superior). Sin React, Vite ni Next.js.
- `src/pages` (index, nuestro-dojo, programa-educativo, 404), `src/partials`, `src/data` (valores, logros, galería), `src/site.json` (URL, contacto, redes, mensajes de WhatsApp), `src/css`, `src/js`, `src/assets`.
- Comandos: `node build.mjs` (genera `dist/`), `node tools/revisar-sitio.mjs` (revisor de contenido y enlaces), `node tools/servir.mjs dist 8080` (servidor local).
- Pruebas en navegador (Playwright): `tools/pruebas/` (final, valores, layout, contraste). Requieren `npm i --no-save playwright` y `npx playwright install chromium`; no se agrega Playwright a `package.json`.
- Marcadores opcionales en las páginas: `<!--LOGROS-->` (solo si hay logros), `<!--SINLOGROS-->` (solo si no hay), `<!--GALERIA-->`. Los bloques `<!--PENDIENTE-->` solo se ven con `SHOW_PENDING=true`.

## Publicación
- Cloudflare Workers Builds publica la rama `main` del repositorio TonyRuizG/dojo-kokoro-web: lo que llega a `main` se publica solo.
- Prefiere trabajar en una rama y que Tony la fusione (pull request). Empuja directo a `main` solo si Tony lo pide.
- Para comprobar la compilación: `gh api repos/TonyRuizG/dojo-kokoro-web/commits/<sha>/check-runs` (si hay `gh`). Al leer el sitio publicado con herramientas web, pide `/index.html` o una ruta distinta: algunas herramientas guardan la página en caché unos 15 minutos.

## Versiones y entregas
- La versión vigente está al inicio de `docs/CAMBIOS.md` («Versión actual: 3.x»). La tercera interfaz es la 3.0; cada tanda de cambios sube el número (3.1, 3.2…).
- Al terminar una tanda: sube «Versión actual», agrega una sección al final de `docs/CAMBIOS.md`, y ajusta `docs/PENDIENTES.md` y `README.md` si cambió algo.
- Si Tony pide un zip, nómbralo `dojo-kokoro-web-v3.X.zip`, sin `dist/`, `dist-local/`, `respaldo-original/`, `node_modules/` ni `.git/`, y comprueba que no lleve datos privados.
- Antes de publicar: `node build.mjs` y `node tools/revisar-sitio.mjs` sin errores. Si tocaste maquetación, formulario o valores, corre también `tools/pruebas/`.

## Reglas de contenido (decisiones de Tony)
Privacidad (el repositorio es PÚBLICO):
- No publicar precios, tarifas, inversiones ni condiciones económicas, ni teléfonos o correos personales, ni el nombre legal completo (usar «Sensei Anthony Ruiz»). El único contacto público es el WhatsApp oficial +506 8514-5922 (`src/site.json`).
- `respaldo-original/` es PRIVADO (versión original, presentación comercial, lista de datos prohibidos). Está en `.gitignore`, vive solo en la computadora de Tony y no se sube nunca. Si existe, `tools/revisar-sitio.mjs` la usa para buscar fugas.
- No usar contenido del sitio de ISKF Costa Rica. Solo logos entregados por Tony (ISKF Costa Rica en rojo y CCDR; ya tiene aprobación de ambos).
- Sin estadísticas tipo «20+ alumnos».

Contenido aprobado:
- Misión y visión oficiales, textuales, en Nuestro dojo (no van en Inicio). No cambiarlas.
- Ocho valores (`src/data/valores.json`): textos aprobados y SIN japonés (no se puede verificar). No cambiarlos sin autorización. El Dojo Kun va aparte de los valores.
- Senseis Anthony y Camila Ruiz como iguales (tarjetas del mismo tamaño), con recuadros «Seleccionado/a Nacional» y «1er Dan». Sin «Rol» ni «Enseñanza».
- Historia: dojo fundado en 2023 por dos hermanos; se presentó la oportunidad de unirse al CCDR de Santa Bárbara.
- Logros: por ahora ninguno publicado; la sección dice «Construye una historia con nosotros».
- Galería: «PRÓXIMAMENTE» hasta tener fotos reales (con permiso de los padres si salen menores).
- Camino deportivo: Iniciación → Formación → Competencia → Alto rendimiento, sin prometer selección ni clasificación.
- Programa educativo: sin precios; las condiciones se acuerdan con cada institución.
- Ubicación: «Sede Birrí» (Salón Comunal de ADI Birrí) y «Sede Sta. Bárbara Centro: PRÓXIMAMENTE». Botones de Google Maps y Waze, sin mapa incrustado, justo después de los horarios.
- Formulario de WhatsApp: el mensaje está en `src/site.json`. No muevas el diseño al salir de un campo: se pierde el clic en el botón de enviar.
- Identidad visual a conservar: rojo #cc171b, azul marino #1b1f55, tinta #0f1019, crema #F3F0E8, papel #ECE8DF; Oswald (títulos), DM Sans (texto), Noto Serif JP (kanji decorativos).

## Pendientes
Están en `docs/PENDIENTES.md` (cinturones, calendario de torneos, fotos reales, cartas de respaldo, revisión de kanji decorativos, dominio propio).
