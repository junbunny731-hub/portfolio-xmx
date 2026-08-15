(function () {
  const titles = document.querySelectorAll('[data-name="标题"].title-reveal');

  if (!("IntersectionObserver" in window)) {
    titles.forEach((title) => title.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.15,
    }
  );

  titles.forEach((title) => observer.observe(title));
})();
