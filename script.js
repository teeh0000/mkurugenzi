(function () {
  var body = document.body,
      burger = document.getElementById('burger'),
      links = document.querySelectorAll('#menu .nav a');

  function setOpen(o) {
    body.classList.toggle('menu-open', o);
    burger.setAttribute('aria-expanded', o);
    burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  }

  burger.addEventListener('click', function () { setOpen(!body.classList.contains('menu-open')); });
  document.getElementById('scrim').addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  // Collections accordion
  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.has-sub');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  // Page links: in-page anchors scroll smoothly, real pages (ladies.html, ...) just navigate
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') { setOpen(false); return; }
      e.preventDefault();
      links.forEach(function (l) { l.removeAttribute('aria-current'); });
      a.setAttribute('aria-current', 'page');
      setOpen(false);
      var t = document.querySelector(href);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// Image slider: auto-fades every few seconds, dots + swipe
(function () {
  var box = document.querySelector('.slider');
  if (!box) return;
  var slides = [].slice.call(box.querySelectorAll('.slide'));
  if (slides.length < 2) return;
  var wrap = box.querySelector('.dots'), i = 0, timer;

  slides.forEach(function (_, n) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show image ' + (n + 1));
    b.addEventListener('click', function () { go(n); restart(); });
    wrap.appendChild(b);
  });
  var dots = [].slice.call(wrap.children);

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i); });
  }
  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { go(i + 1); }, 4500);
  }
  function restart() { clearInterval(timer); start(); }

  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 !== null) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    }
    x0 = null;
    restart();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(timer); else restart();
  });


  go(0);
  start();
})();
