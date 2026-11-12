/* Product cards: choose a size on the card, tap the card to see the photo big (swipe, double-tap or pinch to zoom). */
(function () {
  var SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  var cards = [].slice.call(document.querySelectorAll('.pc'));
  if (!cards.length) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.6 4.5c2 0 3.5 1 5.4 3 1.9-2 3.4-3 5.4-3 3.6 0 5.8 3.8 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var kes = function (n) { return 'KES ' + Math.round(n).toLocaleString('en-KE'); };
  var viewer = null;

  /* ---------- size on the card ---------- */
  function setSize(card, size) {
    card.dataset.size = size || '';
    [].forEach.call(card.querySelectorAll('.pc-size'), function (b) { b.setAttribute('aria-pressed', b.textContent === size); });
    var add = card.querySelector('.pc-add');
    if (size) { add.setAttribute('data-add', ''); add.dataset.size = size; }
    else { add.removeAttribute('data-add'); delete add.dataset.size; }
  }
  cards.forEach(function (c) { if (c.dataset.onesize) c.dataset.size = 'One size'; });

  function need(box, btn, label) {
    if (box) { box.classList.remove('need'); void box.offsetWidth; box.classList.add('need'); setTimeout(function () { box.classList.remove('need'); }, 1400); }
    if (btn) { var t = btn.textContent; btn.textContent = label || 'Select a size'; setTimeout(function () { btn.textContent = t; }, 1500); }
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.pc-size');
    if (chip && chip.closest('.pc')) { var card = chip.closest('.pc'); setSize(card, chip.textContent); return; }
    var add = e.target.closest('.pc-add');
    if (add && !add.hasAttribute('data-add')) { need(add.closest('.pc').querySelector('.pc-sizes'), add); return; }
    if (e.target.closest('button, a') && !e.target.closest('.pc-view')) return;
    var c = e.target.closest('.pc'); if (c) openViewer(c);
  });

  /* ---------- the viewer ---------- */
  function openViewer(card) {
    if (viewer) return;
    var d = card.dataset, imgs = (d.images || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!imgs.length) imgs = [null];
    var one = !!d.onesize, size = card.dataset.size || '';
    var el = document.createElement('div');
    el.className = 'vw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', d.name);
    el.innerHTML =
      '<div class="vw-scroll"><div class="vw-stage"><div class="vw-gal">' +
      imgs.map(function (src) {
        return '<div class="vw-slide"><div class="vw-zoom"><span class="vw-l">' + esc(d.name.charAt(0)) + '</span><span class="vw-soon">Product photo goes here</span>' +
          (src ? '<img src="' + esc(src) + '" alt="' + esc(d.name) + '" draggable="false" onerror="this.remove()">' : '') + '</div></div>';
      }).join('') +
      '</div><button class="vw-close" aria-label="Close">' + CLOSE + '</button>' +
      '<button class="cr-heart vw-heart" data-fav data-id="' + esc(d.id) + '" data-name="' + esc(d.name) + '" data-price="' + esc(d.price) + '" data-tag="' + esc(d.tag) + '"' + (one ? ' data-size="One size"' : '') + ' aria-pressed="false" aria-label="Favourite ' + esc(d.name) + '">' + HEART + '</button>' +
      (imgs.length > 1 ? '<span class="vw-count">1 / ' + imgs.length + '</span>' : '') +
      '<span class="vw-hint">Double-tap or pinch to zoom</span></div>' +
      '<div class="vw-info"><small>' + esc(d.tag) + '</small><h2>' + esc(d.name) + '</h2><strong>' + kes(d.price) + '</strong>' +
      '<p class="vw-lab"><span>' + (one ? 'Size' : 'Select size') + '</span><em>Sizes S to 3XL</em></p>' +
      (one ? '<div class="vw-sizes one"><span>One size</span></div>'
           : '<div class="vw-sizes" role="group" aria-label="Choose a size">' + SIZES.map(function (z) { return '<button type="button" class="pc-size" aria-pressed="' + (z === size) + '">' + z + '</button>'; }).join('') + '</div>') +
      '<p class="vw-del">Delivered countrywide. Add your discount code in the crate.</p></div></div>' +
      '<div class="vw-bar"><div><small>Price</small><b>' + kes(d.price) + '</b></div>' +
      '<button class="vw-add" data-id="' + esc(d.id) + '" data-name="' + esc(d.name) + '" data-price="' + esc(d.price) + '" data-tag="' + esc(d.tag) + '"' + (size ? ' data-add data-size="' + esc(size) + '"' : '') + '>Add to crate</button></div>';
    document.body.appendChild(el); viewer = el;
    document.documentElement.classList.add('vw-lock');
    var fav = window.Crate && Crate.favs().some(function (f) { return f.id === d.id; });
    var heart = el.querySelector('.vw-heart'); heart.classList.toggle('is-fav', !!fav); heart.setAttribute('aria-pressed', !!fav);
    var gal = el.querySelector('.vw-gal'), count = el.querySelector('.vw-count');
    gal.addEventListener('scroll', function () { if (count) count.textContent = (Math.round(gal.scrollLeft / gal.clientWidth) + 1) + ' / ' + imgs.length; }, { passive: true });
    [].forEach.call(el.querySelectorAll('.vw-zoom'), function (z) { zoomify(z, gal); });

    var addBtn = el.querySelector('.vw-add');
    el.addEventListener('click', function (e) {
      var ch = e.target.closest('.vw-sizes .pc-size');
      if (ch) { size = ch.textContent; setSize(card, size);
        [].forEach.call(el.querySelectorAll('.vw-sizes .pc-size'), function (b) { b.setAttribute('aria-pressed', b === ch); });
        addBtn.setAttribute('data-add', ''); addBtn.dataset.size = size; return; }
      if (e.target.closest('.vw-close')) { closeViewer(); return; }
      if (e.target.closest('.vw-add')) {
        if (!addBtn.hasAttribute('data-add')) { need(el.querySelector('.vw-sizes'), addBtn); return; }
        var t = 'Add to crate'; addBtn.textContent = 'Added \u2713'; setTimeout(function () { addBtn.textContent = t; }, 1500);
      }
    });
    if (calm) el.classList.add('open'); else requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('open'); }); });
    el.querySelector('.vw-close').focus({ preventScroll: true });
  }
  function closeViewer() {
    if (!viewer) return; var v = viewer; viewer = null;
    v.classList.remove('open'); document.documentElement.classList.remove('vw-lock');
    setTimeout(function () { v.remove(); }, calm ? 0 : 560);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeViewer(); });

  /* ---------- zoom: double-tap / pinch, drag to move around ---------- */
  function zoomify(wrap, gal) {
    var img = wrap.querySelector('img'); if (!img) return;
    var s = 1, tx = 0, ty = 0, ptr = {}, d0 = 0, s0 = 1, last = 0, moved = false;
    function clamp() { var mx = (s - 1) * wrap.clientWidth / 2, my = (s - 1) * wrap.clientHeight / 2; tx = Math.max(-mx, Math.min(mx, tx)); ty = Math.max(-my, Math.min(my, ty)); }
    function apply() { img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')'; var z = s > 1.02; wrap.classList.toggle('zoomed', z); gal.classList.toggle('lock', z); }
    function glide() { img.style.transition = 'transform .3s cubic-bezier(.22,1,.36,1)'; setTimeout(function () { img.style.transition = ''; }, 320); }
    function toggle(x, y) {
      glide();
      if (s > 1.02) { s = 1; tx = ty = 0; }
      else { var r = wrap.getBoundingClientRect(); s = 2.6; tx = (r.width / 2 - (x - r.left)) * (s - 1); ty = (r.height / 2 - (y - r.top)) * (s - 1); clamp(); }
      apply();
    }
    function dist() { var k = Object.keys(ptr); return Math.hypot(ptr[k[0]].x - ptr[k[1]].x, ptr[k[0]].y - ptr[k[1]].y); }
    wrap.addEventListener('pointerdown', function (e) {
      wrap.setPointerCapture(e.pointerId); ptr[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = false;
      if (Object.keys(ptr).length === 2) { d0 = dist(); s0 = s; }
    });
    wrap.addEventListener('pointermove', function (e) {
      var p = ptr[e.pointerId]; if (!p) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (Object.keys(ptr).length === 2) { s = Math.max(1, Math.min(4, s0 * dist() / d0)); clamp(); apply(); moved = true; }
      else if (s > 1.02) { tx += dx; ty += dy; clamp(); apply(); if (Math.abs(dx) + Math.abs(dy) > 3) moved = true; }
    });
    function up(e) {
      if (!ptr[e.pointerId]) return;
      var single = Object.keys(ptr).length === 1; delete ptr[e.pointerId];
      if (single && !moved && e.type === 'pointerup') { var now = Date.now(); if (now - last < 320) { last = 0; toggle(e.clientX, e.clientY); } else last = now; }
      if (s < 1.05) { s = 1; tx = ty = 0; glide(); apply(); }
    }
    wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  }
})();
