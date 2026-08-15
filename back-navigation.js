document.querySelectorAll("[data-back-to-portfolio]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = "../?view=entrance";
  });
});
