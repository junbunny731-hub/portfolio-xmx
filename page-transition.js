(function () {
  const ENTER_DURATION = 620;

  function setArtboardScale() {
    document.querySelectorAll("[data-scale-artboard]").forEach((artboard) => {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      artboard.style.setProperty("--page-scale", String(scale));
    });
  }

  function initPageEnter() {
    if (!document.body.classList.contains("page-transition-enter")) {
      return;
    }

    requestAnimationFrame(() => {
      document.body.classList.add("page-transition-ready");
    });

    window.setTimeout(() => {
      document.body.classList.remove("page-transition-enter", "page-transition-ready");
    }, ENTER_DURATION + 80);
  }

  function goTo(url) {
    window.setTimeout(() => {
      window.location.href = url;
    }, 120);
  }

  window.PageTransition = {
    goTo,
    setArtboardScale,
  };

  window.addEventListener("resize", setArtboardScale);
  setArtboardScale();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageEnter);
  } else {
    initPageEnter();
  }
})();
