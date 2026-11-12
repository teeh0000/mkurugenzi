(function () {
  var WA = '254716265661', MAIL = 'info@mkurugenzi.co.ke';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---- scroll reveal ---- */
  var rv = [].slice.call(document.querySelectorAll('.cx .rv, .cx .cx-title'));
  if (rv.length && 'IntersectionObserver' in window && !calm) {
    document.documentElement.classList.add('cx-js');
    var io = new IntersectionObserver(function (l) {
      l.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rv.forEach(function (el, i) { if (el.classList.contains('rv')) el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
  }

  /* ---- ripple on the send button ---- */
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.cx .send'); if (!b || calm) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
    d.className = 'rip'; d.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(d); setTimeout(function () { d.remove(); }, 650);
  });

  /* ---- form ---- */
  var form = $('#cx-form'); if (!form) return;
  var via = 'wa', seg = $('#cx-seg'), rail = $('.cx-prog i'), ids = ['name', 'phone', 'email'];
  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    via = b.getAttribute('data-via'); seg.setAttribute('data-v', via);
    [].slice.call(seg.querySelectorAll('button')).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
  });
  var rules = {
    name:  function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
    phone: function (v) { return /^\+?[\d\s-]{9,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.'; }
  };
  function progress() {
    var n = 0; ids.forEach(function (id) { if (!rules[id]($('#f-' + id).value)) n++; });
    if (rail) rail.style.setProperty('--p', n / 3);
  }
  function check(id, shake) {
    var f = $('#f-' + id), wrap = f.closest('.fld'), msg = rules[id](f.value);
    wrap.classList.toggle('bad', !!msg); wrap.classList.toggle('ok', !msg && !!f.value);
    wrap.querySelector('.err').textContent = msg;
    if (msg && shake && !calm) { wrap.classList.remove('shake'); void wrap.offsetWidth; wrap.classList.add('shake'); }
    return !msg;
  }
  ids.forEach(function (id) {
    var f = $('#f-' + id);
    f.addEventListener('blur', function () { if (f.value) check(id); });
    f.addEventListener('input', function () {
      if (f.closest('.fld').classList.contains('bad') || !rules[id](f.value)) check(id); else f.closest('.fld').classList.remove('ok');
      progress();
    });
  });
  function confetti() {
    if (calm) return;
    var cols = ['#C2B280', '#B5651D', '#F6F1E4', '#5C4033'];
    for (var i = 0; i < 26; i++) {
      var c = document.createElement('i'); c.className = 'conf';
      var a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 120;
      c.style.cssText = 'background:' + cols[i % 4] + ';--x:' + Math.cos(a) * d + 'px;--y:' + (Math.sin(a) * d - 30) + 'px;--r:' + (Math.random() * 540 - 270) + 'deg;animation-delay:' + (Math.random() * .15) + 's';
      form.appendChild(c); setTimeout(function (n) { n.remove(); }.bind(null, c), 1600);
    }
  }
  function link() {
    var n = $('#f-name').value.trim(), p = $('#f-phone').value.trim(), e = $('#f-email').value.trim(), m = $('#f-msg').value.trim();
    if (via === 'wa') {
      var t = 'Hello Mkurugenzi, my name is ' + n + '.' + (m ? '\n\n' + m : '') + '\n\nPhone: ' + p + '\nEmail: ' + e;
      return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
    }
    var body = (m ? m + '\n\n' : '') + 'Name: ' + n + '\nPhone: ' + p + '\nEmail: ' + e;
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Message from ' + n) + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    ids.forEach(function (id) { if (!check(id, true)) ok = false; });
    if (!ok) { var bad = $('.fld.bad input'); if (bad) bad.focus(); return; }
    var url = link(), btn = $('.send', form);
    btn.classList.add('sending');
    setTimeout(function () {
      form.classList.add('sent'); confetti();
      $('#cx-open').setAttribute('href', url);
      $('#cx-via').textContent = via === 'wa' ? 'WhatsApp' : 'your email app';
      window.location.href = url;
    }, calm ? 0 : 1000);
  });
  $('#cx-again').addEventListener('click', function () {
    form.reset(); form.classList.remove('sent'); $('.send', form).classList.remove('sending');
    [].slice.call(form.querySelectorAll('.fld')).forEach(function (f) { f.classList.remove('bad'); f.classList.remove('ok'); });
    progress();
  });
})();
