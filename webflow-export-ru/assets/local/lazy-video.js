// Ленивые фоновые видео: <video data-lazy-video preload="none"> с <source data-src>.
// Ролик грузится и запускается, только когда блок подъезжает к экрану.
// Скрытые через display:none (пара desktop/mobile) не пересекают экран и не грузятся вовсе.
// При prefers-reduced-motion видео не грузятся: остаётся постер.
(function () {
  const videos = document.querySelectorAll("video[data-lazy-video]");
  if (!videos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function start(video) {
    video.querySelectorAll("source[data-src]").forEach((s) => {
      s.src = s.dataset.src;
      s.removeAttribute("data-src");
    });
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  if (!("IntersectionObserver" in window)) {
    videos.forEach(start);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        start(e.target);
      });
    },
    { rootMargin: "200px 0px" },
  );

  videos.forEach((v) => io.observe(v));
})();
