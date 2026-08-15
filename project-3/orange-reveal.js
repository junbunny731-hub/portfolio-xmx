(function () {
  const orangeFrame = document.querySelector('[data-name="橙"].orange-reveal');
  const revealDelayMs = 500;
  let revealTimer = 0;
  let ticking = false;

  if (!orangeFrame) {
    return;
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function updateOrangeState() {
    if (isVisible(orangeFrame)) {
      if (!orangeFrame.classList.contains("is-active") && !revealTimer) {
        revealTimer = window.setTimeout(() => {
          if (isVisible(orangeFrame)) {
            orangeFrame.classList.add("is-active");
          }
          revealTimer = 0;
        }, revealDelayMs);
      }
    } else {
      clearTimeout(revealTimer);
      revealTimer = 0;
      orangeFrame.classList.remove("is-active");
    }

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(updateOrangeState);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateOrangeState();
})();
