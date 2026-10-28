/* ==========================================================
   Dojo Kokoro · JavaScript del sitio (sin dependencias)
   1. Encabezado: fondo sólido, ocultar al bajar / mostrar al subir, menú móvil
   2. Barra lateral flotante: sección actual, indicador deslizante, volver arriba
   3. Selector de «¿para quién es la clase?» → enlace de WhatsApp
   4. Transición suave al cambiar de página (se omite con movimiento reducido)
   Todo es mejora progresiva: sin JavaScript las páginas y enlaces siguen funcionando.
   ========================================================== */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  /* ---------- 1. Encabezado ---------- */
  (function header() {
    var hdr = doc.querySelector('.site-header');
    if (!hdr) return;
    var btn = hdr.querySelector('.menu-btn');
    var panel = hdr.querySelector('.mnav');
    var lastY = window.pageYOffset || 0;
    var raf = 0;

    function setMenu(open) {
      hdr.classList.toggle('menu-open', open);
      if (btn) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      }
    }

    function tick() {
      raf = 0;
      var y = window.pageYOffset || 0;
      hdr.classList.toggle('is-solid', y > 30);
      var menuOpen = hdr.classList.contains('menu-open');
      if (y > 380 && y > lastY + 6 && !menuOpen) hdr.classList.add('is-hidden');
      else if (y < lastY - 6 || y <= 380) hdr.classList.remove('is-hidden');
      lastY = y;
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }

    window.addEventListener('scroll', onScroll, { passive: true });
    tick();

    if (btn && panel) {
      btn.addEventListener('click', function () { setMenu(!hdr.classList.contains('menu-open')); });
      panel.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a')) setMenu(false);
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && hdr.classList.contains('menu-open')) { setMenu(false); btn.focus(); }
      });
      window.addEventListener('resize', function () { if (window.innerWidth > 1020) setMenu(false); });
    }
  })();

  /* ---------- 2. Barra lateral flotante ---------- */
  (function snav() {
    var root = doc.querySelector('[data-snav]');
    if (!root) return;
    var hero = doc.querySelector('[data-hero]');
    var ind = root.querySelector('.snav-ind');
    var tog = root.querySelector('.snav-tog');
    var top = root.querySelector('.snav-top');
    var links = [].slice.call(root.querySelectorAll('.snav-list a'));
    var ids = links.map(function (a) { return a.getAttribute('data-id'); });
    var st = { show: false, active: '', narrow: false, open: false };
    var lockId = '';
    var lockUntil = 0;
    var raf = 0;

    function render() {
      var ai = ids.indexOf(st.active);
      root.classList.toggle('on', st.show);
      root.classList.toggle('open', st.show && st.open);
      if (tog) tog.setAttribute('aria-expanded', st.show && st.open ? 'true' : 'false');
      links.forEach(function (a, i) {
        a.setAttribute('aria-current', i === ai ? 'true' : 'false');
        a.style.height = !st.narrow && i === ai ? '96px' : '';
      });
      if (ind) {
        ind.style.top = (ai < 0 ? 0 : st.narrow ? 6 + ai * 46 : ai * 28) + 'px';
        ind.style.height = (st.narrow ? 44 : ai < 0 ? 26 : 96) + 'px';
        ind.style.opacity = ai < 0 ? '0' : '1';
      }
    }

    function patch(p) {
      var changed = false;
      for (var k in p) if (st[k] !== p[k]) { st[k] = p[k]; changed = true; }
      if (changed) render();
    }

    function tick() {
      raf = 0;
      try {
        var vh = window.innerHeight || 800;
        var past = hero ? hero.getBoundingClientRect().top < -160 : false;
        var active = '';
        for (var i = 0; i < ids.length; i++) {
          var el = doc.getElementById(ids[i]);
          if (el && el.getBoundingClientRect().top <= vh * 0.5) active = ids[i];
        }
        var narrow = (window.innerWidth || 1200) <= 700;
        if (lockId) {
          if (Date.now() > lockUntil) lockId = '';
          else if (lockId === '__top') { if (!past) lockId = ''; else active = st.active || active; }
          else if (active === lockId) lockId = '';
          else active = lockId;
        }
        patch({ show: past, active: active, narrow: narrow, open: past ? st.open : false });
      } catch (e) { /* sin acción */ }
    }

    function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }
    doc.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);

    links.forEach(function (a) {
      a.addEventListener('click', function () {
        lockId = a.getAttribute('data-id');
        lockUntil = Date.now() + 2500;
        patch({ active: lockId });
      });
    });
    if (top) top.addEventListener('click', function () { lockId = '__top'; lockUntil = Date.now() + 2000; patch({ open: false }); });
    if (tog) tog.addEventListener('click', function () { patch({ open: !st.open }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.open) patch({ open: false }); });
    tick();
  })();

  /* ---------- 3. Formulario de WhatsApp (Inicio) ---------- */
  (function waForm() {
    var form = doc.querySelector('[data-wa-form]');
    if (!form) return;
    var nameIn = form.elements.nombre;
    var ageIn = form.elements.edad;
    var status = form.querySelector('[data-ask-status]');
    var template = form.getAttribute('data-template') || '';
    var base = form.getAttribute('action');

    function msg(input, kind) { return doc.getElementById(input.id + '-' + kind); }
    function show(input, kind, on) {
      var el = msg(input, kind);
      if (!el) return;
      el.hidden = !on;
      // Solo se asocia al campo mientras es visible, para que el lector de pantalla no lo lea de más.
      var ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== el.id; });
      if (on) ids.push(el.id);
      if (ids.length) input.setAttribute('aria-describedby', ids.join(' ')); else input.removeAttribute('aria-describedby');
    }
    function cleanName() { return nameIn.value.replace(/\s+/g, ' ').trim(); }
    function ageValue() {
      var raw = String(ageIn.value).trim();
      if (!/^\d{1,2}$/.test(raw)) return null;
      var n = parseInt(raw, 10);
      return n >= 1 && n <= 99 ? n : null;
    }
    function checkName(report) {
      var ok = cleanName().length >= 2;
      if (report || ok) {
        nameIn.setAttribute('aria-invalid', ok ? 'false' : 'true');
        show(nameIn, 'err', !ok);
      }
      return ok;
    }
    function checkAge(report) {
      var n = ageValue();
      var ok = n !== null;
      if (report || ok) {
        ageIn.setAttribute('aria-invalid', ok ? 'false' : 'true');
        show(ageIn, 'err', !ok);
      }
      show(ageIn, 'note', ok && n < 8);
      return ok;
    }
    function buildUrl() {
      var n = ageValue();
      var values = { nombre: cleanName(), edad: n + (n === 1 ? ' año' : ' años') };
      // Una sola pasada y con función: lo que escriba la persona nunca se interpreta como plantilla.
      var text = template.replace(/\{(nombre|edad)\}/g, function (m, key) { return values[key]; });
      return base + '?text=' + encodeURIComponent(text);
    }
    function openWhatsApp(url) {
      var a = doc.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      doc.body.appendChild(a); a.click(); a.remove();
    }

    nameIn.addEventListener('input', function () { if (nameIn.getAttribute('aria-invalid') === 'true') checkName(true); });
    ageIn.addEventListener('input', function () { if (ageIn.getAttribute('aria-invalid') === 'true') checkAge(true); });
    ageIn.addEventListener('change', function () { checkAge(false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var okName = checkName(true);
      var okAge = checkAge(true);
      if (!okName || !okAge) {
        if (status) status.textContent = '';
        (okName ? ageIn : nameIn).focus();
        return;
      }
      var url = buildUrl();
      openWhatsApp(url);
      if (status) {
        status.textContent = 'Abriendo WhatsApp en otra pestaña. Si no se abre, ';
        var link = doc.createElement('a');
        link.href = url; link.target = '_blank'; link.rel = 'noopener';
        link.textContent = 'toca aquí para continuar';
        status.appendChild(link);
        status.appendChild(doc.createTextNode('.'));
      }
    });
  })();

  /* ---------- 4. Transición entre páginas ---------- */
  (function pageFade() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    var root = doc.documentElement;
    window.addEventListener('pageshow', function (e) { if (e.persisted) root.classList.remove('leaving'); });
    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reduce && reduce.matches) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin || url.protocol.indexOf('http') !== 0 && url.protocol !== 'file:') return;
      if (url.pathname === location.pathname && url.search === location.search) return; // ancla en la misma página
      e.preventDefault();
      root.classList.add('leaving');
      setTimeout(function () { location.href = url.href; }, 190);
    });
  })();
})();
