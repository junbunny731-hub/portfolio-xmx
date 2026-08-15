(function () {
  const page = document.querySelector(".page-2");
  const trigger = document.querySelector(".page-2 .flow-voice");
  const startDelayMs = 150;
  let startTimer = 0;

  if (!page || !trigger) {
    return;
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function resetSequence() {
    clearTimeout(startTimer);
    startTimer = 0;
    page.classList.remove("flow-sequence-active");
  }

  function startSequence() {
    if (startTimer || page.classList.contains("flow-sequence-active")) {
      return;
    }

    startTimer = window.setTimeout(() => {
      if (isInViewport(trigger)) {
        page.classList.add("flow-sequence-active");
      }
      startTimer = 0;
    }, startDelayMs);
  }

  if (!("IntersectionObserver" in window)) {
    page.classList.add("flow-sequence-active");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startSequence();
        } else {
          resetSequence();
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(trigger);
})();
