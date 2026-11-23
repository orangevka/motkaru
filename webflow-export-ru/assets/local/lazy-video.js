// Ленивые фоновые видео: <video data-lazy-video preload="none"> с <source data-src type [data-media]>.
// Запуск — только после window.load (постеры уже на экране, LCP не делит канал с роликами)
// и только когда блок подъезжает к экрану. Скрытые через display:none (пара desktop/mobile)
// не пересекают экран и не грузятся вовсе.
// Источник выбирается здесь один раз (data-media + canPlayType) и ставится в video.src:
// так браузер не перевыбирает <source> при ресайзе и не качает несколько файлов.
// При prefers-reduced-motion видео не грузятся: остаётся постер.
(function () {
  const videos = document.querySelectorAll("video[data-lazy-video]");
  if (!videos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function pickSrc(video) {
    for (const s of video.querySelectorAll("source[data-src]")) {
      const media = s.dataset.media;
      if (media && !window.matchMedia(media).matches) continue;
      if (s.type && !video.canPlayType(s.type)) continue;
      return s.dataset.src;
    }
    return null;
  }

  function start(video) {
    const src = pickSrc(video);
    if (!src) return;
    video.src = src;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  function init() {
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
  }

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init, { once: true });
})();
