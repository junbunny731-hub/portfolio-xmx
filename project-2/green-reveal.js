(function () {
  const page1Green = document.querySelector('[data-node-id="575:1359"]');
  const page2Green = document.querySelector('[data-node-id="575:1617"]');
  const page3Green = document.querySelector('[data-node-id="583:1340"]');
  const page2 = document.querySelector('[data-node-id="575:1434"]');
  const page3 =
    document.querySelector('[data-node-id="575:1779"]') ||
    document.querySelector(".page-3");
  const page1RevealDelayMs = 300;
  const page2RevealDelayMs = 300;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let page1DelayTimer = 0;
  let page2DelayTimer = 0;

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function isVisibleByRatio(element, ratio) {
    const rect = element.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, window.innerHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    return rect.height > 0 && visibleHeight / rect.height >= ratio;
  }

  function updateGreenStates() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY >= lastScrollY;
    const page2Rect = page2.getBoundingClientRect();
    const page3Rect = page3.getBoundingClientRect();

    if (isVisible(page1Green)) {
      if (!page1Green.classList.contains("is-active") && !page1DelayTimer) {
        page1DelayTimer = window.setTimeout(() => {
          if (isVisible(page1Green)) {
            page1Green.classList.add("is-active");
          }
          page1DelayTimer = 0;
        }, page1RevealDelayMs);
      }
    } else {
      clearTimeout(page1DelayTimer);
      page1DelayTimer = 0;
      page1Green.classList.remove("is-active");
    }

    const page2GreenReady = isVisibleByRatio(page2Green, 0.33);

    if (page2Rect.top >= window.innerHeight) {
      clearTimeout(page2DelayTimer);
      page2DelayTimer = 0;
      page2Green.classList.remove("is-active");
    } else if (scrollingDown && page2GreenReady) {
      if (!page2Green.classList.contains("is-active") && !page2DelayTimer) {
        page2DelayTimer = window.setTimeout(() => {
          if (isVisibleByRatio(page2Green, 0.33)) {
            page2Green.classList.add("is-active");
          }
          page2DelayTimer = 0;
        }, page2RevealDelayMs);
      }
    } else if (!scrollingDown) {
      clearTimeout(page2DelayTimer);
      page2DelayTimer = 0;
    } else if (!page2GreenReady) {
      clearTimeout(page2DelayTimer);
      page2DelayTimer = 0;
    }

    if (scrollingDown && page3Rect.top < window.innerHeight * 0.82 && page3Rect.bottom > 0) {
      page3Green.classList.add("is-active");
    }

    if (!scrollingDown && page3Rect.top > 0) {
      page3Green.classList.remove("is-active");
    }

    if (scrollingDown && page3Rect.bottom <= 0) {
      page3Green.classList.remove("is-active");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(updateGreenStates);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateGreenStates();
})();
