const icons = document.querySelectorAll(".navbar-icon__container i");

icons.forEach((icon) => {
  icon.addEventListener("click", function () {
    icons.forEach((icon) => icon.classList.remove("active"));
    this.classList.add("active");
  });
});
