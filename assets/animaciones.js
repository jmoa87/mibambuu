// Mi Bambuu: animaciones de la web.
(function () {
  document.documentElement.classList.add('js');
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Aparecer al hacer scroll, con un pequeño escalonado entre elementos vecinos.
  var elementos = document.querySelectorAll('[data-aparece]');
  if (!('IntersectionObserver' in window) || reducir) {
    elementos.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var hermanos = Array.prototype.filter.call(e.target.parentNode.children, function (n) { return n.hasAttribute('data-aparece'); });
        e.target.style.setProperty('--retraso', (hermanos.indexOf(e.target) % 3) * 0.12 + 's');
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elementos.forEach(function (el) { obs.observe(el); });
  }
  if (reducir) return;

  // Título principal: cada letra en su propia caja para la ola.
  var titulo = document.querySelector('.portada h1');
  if (titulo) {
    titulo.setAttribute('aria-label', titulo.textContent.replace(/\s+/g, ' ').trim());
    var n = 0;
    Array.prototype.slice.call(titulo.childNodes).forEach(function (nodo) {
      if (nodo.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      nodo.textContent.split(/(\s+)/).forEach(function (palabra) {
        if (!palabra) return;
        if (/^\s+$/.test(palabra)) { frag.appendChild(document.createTextNode(palabra)); return; }
        var p = document.createElement('span');
        p.style.whiteSpace = 'nowrap'; p.setAttribute('aria-hidden', 'true');
        palabra.split('').forEach(function (ch) {
          var l = document.createElement('span'); l.className = 'letra'; l.textContent = ch;
          l.style.setProperty('--i', n++); p.appendChild(l);
        });
        frag.appendChild(p);
      });
      titulo.replaceChild(frag, nodo);
    });
  }

  // Hojas de bambú cayendo (solo en la página principal).
  if (!document.querySelector('script[data-hojas]')) return;
  var colores = ['#4F8A4B', '#5E9A4F', '#3F6B4A', '#7BAA6A', '#A9A262'];
  var capa = document.createElement('div');
  capa.className = 'hojas'; capa.setAttribute('aria-hidden', 'true');
  var cantidad = window.innerWidth < 640 ? 9 : 16;
  function azar(a, b) { return a + Math.random() * (b - a); }
  for (var i = 0; i < cantidad; i++) {
    var c = colores[i % colores.length];
    var h = document.createElement('div');
    h.className = 'hoja';
    h.style.setProperty('--x', azar(0, 100).toFixed(1) + 'vw');
    h.style.setProperty('--dur', azar(32, 48).toFixed(1) + 's');
    h.style.setProperty('--retraso', (-azar(0, 48)).toFixed(1) + 's');
    h.style.setProperty('--vaiven', azar(4, 6.5).toFixed(1) + 's');
    h.style.setProperty('--tam', azar(18, 38).toFixed(0) + 'px');
    h.style.setProperty('--op', azar(0.45, 0.85).toFixed(2));
    h.innerHTML = '<svg viewBox="0 0 60 16"><path d="M0 8 Q27 -2 60 8 Q27 14 0 8Z" fill="' + c + '"/><path d="M2 8 L56 8" stroke="rgba(255,255,255,.35)" stroke-width=".8"/></svg>';
    capa.appendChild(h);
  }
  document.body.appendChild(capa);
})();
