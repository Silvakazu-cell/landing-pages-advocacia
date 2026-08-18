/* ============================================================
   KAZUNARI ADVOCACIA — CAMADA DE MOVIMENTO
   Módulos independentes, ativados apenas quando o markup existe.
   Respeita integralmente prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* --- Revelação progressiva no scroll, com escalonamento por grupo --- */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    // Escalonamento: cada filho de [data-stagger] entra com um atraso incremental.
    $$('[data-stagger]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
      $$('[data-reveal]', group).forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * step) + 'ms');
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* --- Estado do cabeçalho ao rolar + barra de progresso de leitura --- */
  function initScrollChrome() {
    var header = $('[data-header]');
    var bar = $('[data-progress]');
    var dock = $('[data-dock]');
    var dockAnchor = dock && document.getElementById(dock.getAttribute('data-dock-after') || '');
    if (!header && !bar && !dock) return;

    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;

      if (header) header.classList.toggle('is-scrolled', y > 12);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
      }

      if (dock) {
        var show = dockAnchor
          ? dockAnchor.getBoundingClientRect().bottom < 0
          : y > window.innerHeight * 0.6;
        dock.classList.toggle('is-visible', show);
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* --- Contagem animada de métricas --- */
  function initCounters() {
    var counters = $$('[data-count-to]');
    if (!counters.length) return;

    function render(el, value) {
      var decimals = parseInt(el.getAttribute('data-count-decimals'), 10) || 0;
      el.textContent =
        (el.getAttribute('data-count-prefix') || '') +
        value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
        (el.getAttribute('data-count-suffix') || '');
    }

    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { render(el, parseFloat(el.getAttribute('data-count-to'))); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);

        var target = parseFloat(el.getAttribute('data-count-to')) || 0;
        var duration = parseInt(el.getAttribute('data-count-duration'), 10) || 1400;
        var start = null;

        function frame(now) {
          if (start === null) start = now;
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
          render(el, target * eased);
          if (p < 1) window.requestAnimationFrame(frame);
        }

        window.requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* --- Realce que acompanha o cursor sobre os cartões --- */
  function initSpotlight() {
    if (reduced || window.matchMedia('(hover: none)').matches) return;
    var cards = $$('[data-spotlight]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var frame = null;
      card.addEventListener('pointermove', function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
          frame = null;
        });
      });
    });
  }

  /* --- Acordeão acessível com abertura fluida --- */
  function initAccordion() {
    $$('[data-accordion]').forEach(function (root) {
      var single = root.getAttribute('data-accordion') !== 'multi';
      var items = $$('.accordion__item', root);

      items.forEach(function (item) {
        var trigger = $('.accordion__trigger', item);
        var panel = $('.accordion__panel', item);
        if (!trigger || !panel) return;

        trigger.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

        trigger.addEventListener('click', function () {
          var willOpen = !item.classList.contains('is-open');

          if (single && willOpen) {
            items.forEach(function (other) {
              other.classList.remove('is-open');
              var t = $('.accordion__trigger', other);
              if (t) t.setAttribute('aria-expanded', 'false');
            });
          }

          item.classList.toggle('is-open', willOpen);
          trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });
    });
  }

  /* --- Destaque do link de navegação da seção visível --- */
  function initSectionSpy() {
    var links = $$('[data-spy]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = links.map(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var section = document.getElementById(id);
      if (section) map[id] = link;
      return section;
    }).filter(Boolean);

    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var link = map[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* --- Gráficos: dispara o traçado quando a figura entra na viewport --- */
  function initCharts() {
    var charts = $$('[data-chart]');
    if (!charts.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      charts.forEach(function (el) { el.classList.add('is-charted'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-charted');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    charts.forEach(function (el) { observer.observe(el); });
  }

  /* --- Menu lateral: abre, fecha, escalona os itens e prende o foco --- */
  function initDrawer() {
    var toggle = $('[data-drawer-toggle]');
    var drawer = $('[data-drawer]');
    if (!toggle || !drawer) return;

    var panel = $('.drawer__panel', drawer);
    var scrim = $('.drawer__scrim', drawer);
    var closeBtn = $('[data-drawer-close]', drawer);
    var items = $$('.drawer__item', drawer);
    var root = document.documentElement;
    var ultimoFoco = null;

    items.forEach(function (el, i) { el.style.setProperty('--d', (i * 45) + 'ms'); });

    function focaveis() {
      return $$('a[href], button:not([disabled])', panel).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function abrir() {
      ultimoFoco = document.activeElement;
      drawer.classList.add('is-open');
      root.classList.add('is-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('aria-hidden');
      window.setTimeout(function () {
        var alvo = closeBtn || focaveis()[0];
        if (alvo) alvo.focus();
      }, reduced ? 0 : 120);
    }

    function fechar() {
      drawer.classList.remove('is-open');
      root.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
    }

    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) fechar(); else abrir();
    });
    if (closeBtn) closeBtn.addEventListener('click', fechar);
    if (scrim) scrim.addEventListener('click', fechar);

    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;
      var lista = focaveis();
      if (!lista.length) return;
      var primeiro = lista[0], ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });

    // Um link do menu que aponta para a própria página apenas fecha o painel.
    $$('a[href]', panel).forEach(function (link) {
      if (link.getAttribute('href').charAt(0) === '#') link.addEventListener('click', fechar);
    });
  }

  /* --- Ano corrente no rodapé --- */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    initReveal();
    initScrollChrome();
    initCounters();
    initSpotlight();
    initAccordion();
    initCharts();
    initDrawer();
    initSectionSpy();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
