(function () {
  window.scrollTo(0, 0);

  const designWidth = 1920;
  const designHeight = 1080;
  const scrollRoot = document.querySelector(".project-scroll");
  const stage = document.querySelector(".design-stage");

  function fitProjectToViewport() {
    const pageCount = document.querySelectorAll(".figma-frame").length;
    const scale = Math.min(window.innerWidth / designWidth, 1);
    document.documentElement.style.setProperty("--project-scale", String(scale));
    scrollRoot.style.height = `${designHeight * pageCount * scale}px`;
    stage.style.height = `${designHeight * pageCount}px`;
  }

  window.addEventListener("resize", fitProjectToViewport);
  fitProjectToViewport();
})();
