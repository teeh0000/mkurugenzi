(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal cards as they scroll into view ---- */
  var els = [].slice.call(document.querySelectorAll('.cat, .pc'));
  if (!els.length || calm || !('IntersectionObserver' in window)) return;   // cards simply stay visible
  document.documentElement.classList.add('reveal-ready');
  var io = new IntersectionObserver(function (list) {
    list.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
      setTimeout(function () { en.target.style.removeProperty('--d'); }, 1400);   // so hover isn't delayed later
    });
  }, { threshold: 0.12 });
  /* gentle parallax on the collection photos */
  var cats = els.filter(function (e) { return e.classList.contains('cat'); }), ticking = false;
  function drift() {
    var vh = window.innerHeight;
    cats.forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      var p = ((r.top + r.height / 2) - vh / 2) / vh;                 // -1 .. 1
      c.style.setProperty('--py', (Math.max(-1, Math.min(1, p)) * -18).toFixed(1) + 'px');
    });
    ticking = false;
  }
  if (cats.length) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
    window.addEventListener('resize', drift); drift();
  }

  els.forEach(function (el, i) { el.style.setProperty('--d', (i % 2) * 90 + 'ms'); io.observe(el); });
})();
