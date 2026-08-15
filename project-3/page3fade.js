(function () {
  const frame = document.querySelector(".page-3-orange-fade");
  const revealDelayMs = 300;
  let revealTimer = 0;

  if (!frame) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    frame.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!revealTimer && !frame.classList.contains("is-visible")) {
            revealTimer = window.setTimeout(() => {
              if (entry.target.getBoundingClientRect().bottom > 0 && entry.target.getBoundingClientRect().top < window.innerHeight) {
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
      });
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(frame);
})();
