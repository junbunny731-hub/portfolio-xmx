(function () {
  const titles = document.querySelectorAll(".title-reveal");

  if (!("IntersectionObserver" in window)) {
    titles.forEach((title) => title.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  titles.forEach((title) => observer.observe(title));
})();
