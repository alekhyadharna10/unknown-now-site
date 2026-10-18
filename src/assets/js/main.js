(function () {
  var hero = document.querySelector('.hero-home');
  if (!hero) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    // Split the headline into words so they can arrive one after another.
    var title = hero.querySelector('.hero-title');
    if (title && !reduce) {
      var words = title.textContent.trim().split(/\s+/);
      title.setAttribute('aria-label', words.join(' '));
      title.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--i', i);
        span.textContent = word;
        title.appendChild(span);
        if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
      });
    }

    // Link the numbered figure labels and the legend, in both directions.
    var plate = hero.querySelector('.plate');
    var linked = plate ? plate.querySelectorAll('[data-region]') : [];
    var setActive = function (region, on) {
      plate.classList.toggle('has-active', on);
      Array.prototype.forEach.call(linked, function (el) {
        el.classList.toggle('is-active', on && el.getAttribute('data-region') === region);
      });
    };
    Array.prototype.forEach.call(linked, function (el) {
      var region = el.getAttribute('data-region');
      ['mouseenter', 'focus'].forEach(function (evt) {
        el.addEventListener(evt, function () { setActive(region, true); });
      });
      ['mouseleave', 'blur'].forEach(function (evt) {
        el.addEventListener(evt, function () { setActive(region, false); });
      });
    });

    // Gentle depth: the brain and network layers drift a little as you scroll.
    if (!reduce) {
      var ticking = false;
      var update = function () {
        var r = hero.getBoundingClientRect();
        var p = Math.min(Math.max(-r.top / r.height, 0), 1);
        hero.style.setProperty('--p', p.toFixed(3));
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
    }
  } finally {
    // Start the entrance once the first frame has painted.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-ready'); });
    });
  }
})();
