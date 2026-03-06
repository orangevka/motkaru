/* =============================================================
   Motka — common scripts
   ============================================================= */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Lazy load images with data-src
(function() {
  var lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function(img) { observer.observe(img); });
  } else {
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
    });
  }
})();
