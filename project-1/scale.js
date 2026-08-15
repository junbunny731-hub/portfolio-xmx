(function () {
  const designWidth = 1920;
  const designHeight = 1080;
  const pageCount = 9;
  const scrollRoot = document.querySelector(".project-scroll");
  const stage = document.querySelector(".design-stage");

  function fitProjectToViewport() {
    const scale = Math.min(window.innerWidth / designWidth, 1);
    document.documentElement.style.setProperty("--project-scale", String(scale));
    scrollRoot.style.height = `${designHeight * pageCount * scale}px`;
    stage.style.height = `${designHeight * pageCount}px`;
  }

  window.addEventListener("resize", fitProjectToViewport);
  fitProjectToViewport();

  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".title").forEach((title) => {
    titleObserver.observe(title);
  });

  const bandTimers = new WeakMap();
  const bandObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const band = entry.target;
        const pending = bandTimers.get(band);

        if (pending) {
          clearTimeout(pending);
          bandTimers.delete(band);
        }

        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => {
            band.classList.add("active");
            bandTimers.delete(band);
          }, 300);
          bandTimers.set(band, timer);
        } else {
          band.classList.remove("active");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".band-1, .pink-band").forEach((band) => {
    bandObserver.observe(band);
  });

  const bluePanel = document.querySelector(".blue-panel");
  const page5 = document.querySelector(".page-5");
  let bluePanelTimer = 0;
  let lastScrollY = window.scrollY;
  let blueTicking = false;

  function visibleRatio(element) {
    const rect = element.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, window.innerHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    return rect.height > 0 ? visibleHeight / rect.height : 0;
  }

  function updateBluePanel() {
    if (!bluePanel || !page5) {
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY >= lastScrollY;
    const page5Rect = page5.getBoundingClientRect();
    const blueReady = visibleRatio(bluePanel) >= 0.33;

    if (page5Rect.top >= window.innerHeight) {
      clearTimeout(bluePanelTimer);
      bluePanelTimer = 0;
      bluePanel.classList.remove("active");
    } else if (scrollingDown && blueReady) {
      if (!bluePanel.classList.contains("active") && !bluePanelTimer) {
        bluePanelTimer = window.setTimeout(() => {
          if (visibleRatio(bluePanel) >= 0.33) {
            bluePanel.classList.add("active");
          }
          bluePanelTimer = 0;
        }, 300);
      }
    } else if (!scrollingDown || !blueReady) {
      clearTimeout(bluePanelTimer);
      bluePanelTimer = 0;
    }

    lastScrollY = currentScrollY;
    blueTicking = false;
  }

  function requestBluePanelUpdate() {
    if (blueTicking) {
      return;
    }

    blueTicking = true;
    requestAnimationFrame(updateBluePanel);
  }

  window.addEventListener("scroll", requestBluePanelUpdate, { passive: true });
  window.addEventListener("resize", requestBluePanelUpdate);
  updateBluePanel();
})();
