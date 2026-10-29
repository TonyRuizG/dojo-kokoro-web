/* ==========================================================
   Dojo Kokoro · JavaScript del sitio (sin dependencias)
   1. Encabezado: fondo sólido, ocultar al bajar / mostrar al subir, menú móvil
   2. Barra lateral flotante: sección actual, indicador deslizante, volver arriba
   3. Selector de «¿para quién es la clase?» → enlace de WhatsApp
   4. Los ocho valores: ventana con la descripción (cursor, toque o teclado)
   5. Ajuste automático del título «EMPIEZA / HOY.» al ancho de su columna
   6. Transición suave al cambiar de página (se omite con movimiento reducido)
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

  /* ---------- 4. Ocho valores ----------
     Escritorio: la ventana se abre al pasar el cursor. Táctil: se abre al tocar y se cierra al tocar de nuevo o fuera.
     Teclado: Enter o Espacio abren y cierran; Escape cierra y devuelve el foco. Solo hay una abierta a la vez
     y siempre queda dentro de la pantalla. Sin JavaScript las descripciones quedan visibles en cada tarjeta. */
  (function valores() {
    var items = [].slice.call(doc.querySelectorAll('[data-valor]'));
    if (!items.length) return;
    var hoverTimer = 0;
    var MARGIN = 12;

    function btnOf(li) { return li.querySelector('.valor__btn'); }
    function popOf(li) { return li.querySelector('.valor__pop'); }

    function place(li) {
      var pop = popOf(li);
      if (!pop) return;
      li.classList.remove('is-up');
      pop.style.left = '0px';
      var vw = doc.documentElement.clientWidth || window.innerWidth;
      var vh = window.innerHeight || 800;
      var r = li.getBoundingClientRect();
      var w = pop.offsetWidth;
      var h = pop.offsetHeight;
      var left = r.left;
      if (left + w > vw - MARGIN) left = vw - MARGIN - w;
      if (left < MARGIN) left = MARGIN;
      pop.style.left = Math.round(left - r.left) + 'px';
      if (r.bottom + h > vh - 8 && r.top - h > 8) li.classList.add('is-up');
    }

    function render(li) {
      var open = !!(li._pin || li._hov);
      var was = li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btnOf(li).setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && !was) place(li);
      else if (!open && was) setTimeout(function () { if (!li.classList.contains('is-open')) popOf(li).style.left = ''; }, 260);
    }

    function closeAll(except) {
      items.forEach(function (li) {
        if (li === except) return;
        if (li._pin || li._hov || li.classList.contains('is-open')) { li._pin = false; li._hov = false; render(li); }
      });
    }

    items.forEach(function (li) {
      var btn = btnOf(li);
      li._pin = false; li._hov = false;

      btn.addEventListener('click', function () {
        closeAll(li);
        if (li._pin) { li._pin = false; li._hov = false; }
        else { li._pin = true; }
        render(li);
      });
      li.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(hoverTimer);
        closeAll(li);
        li._hov = true;
        render(li);
      });
      li.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        hoverTimer = setTimeout(function () { li._hov = false; render(li); }, 120);
      });
      li.addEventListener('focusout', function (e) {
        var next = e.relatedTarget;
        if (next && li.contains(next)) return;
        li._pin = false; render(li);
      });
    });

    doc.addEventListener('pointerdown', function (e) {
      var inside = e.target.closest && e.target.closest('[data-valor]');
      closeAll(inside || null);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = items.filter(function (li) { return li.classList.contains('is-open'); });
      if (!open.length) return;
      var focused = doc.activeElement && doc.activeElement.closest ? doc.activeElement.closest('[data-valor]') : null;
      closeAll(null);
      if (focused) btnOf(focused).focus();
    });
    window.addEventListener('resize', function () {
      items.forEach(function (li) {
        var pop = popOf(li);
        if (li.classList.contains('is-open')) place(li);
        else if (pop) pop.style.left = '';
      });
    });
  })();

  /* ---------- 5. Título que nunca se corta ----------
     El CSS ya calcula el tamaño con el ancho de la columna; esto lo reduce un poco más solo si la tipografía
     (por ejemplo, una de respaldo más ancha) hace que la palabra no quepa. */
  (function fitTitle() {
    var els = [].slice.call(doc.querySelectorAll('[data-fit]'));
    if (!els.length) return;
    function fit(el) {
      el.style.removeProperty('--fs');
      var avail = el.clientWidth;
      var need = el.scrollWidth;
      if (!avail || need <= avail) return;
      var cur = parseFloat(window.getComputedStyle(el).fontSize) || 0;
      if (cur) el.style.setProperty('--fs', Math.floor((cur * avail * 0.985) / need) + 'px');
    }
    function all() { els.forEach(fit); }
    all();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(all);
    window.addEventListener('load', all);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { all(); });
      els.forEach(function (el) { ro.observe(el.parentNode); });
    } else window.addEventListener('resize', all);
  })();

  /* ---------- 6. Transición entre páginas ---------- */
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
