(function () {
  const frame = document.querySelector(".page-3-orange-fade");
  const page = document.querySelector('[data-node-id="241:596"]');
  const revealDelayMs = 500;
  let revealTimer = 0;

  if (!frame || !page) {
    return;
  }

  function isPageFullyVisible() {
    const rect = page.getBoundingClientRect();
    const tolerance = 12;
    return Math.abs(rect.top) <= tolerance && rect.bottom <= window.innerHeight + tolerance;
  }

  function updateOrangeFade() {
    if (isPageFullyVisible()) {
      if (!revealTimer && !frame.classList.contains("is-visible")) {
        revealTimer = window.setTimeout(() => {
          if (isPageFullyVisible()) {
            frame.classList.add("is-visible");
          }
          revealTimer = 0;
        }, revealDelayMs);
      }
    } else {
      clearTimeout(revealTimer);
      revealTimer = 0;
      frame.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", updateOrangeFade, { passive: true });
  window.addEventListener("resize", updateOrangeFade);
  updateOrangeFade();
})();
