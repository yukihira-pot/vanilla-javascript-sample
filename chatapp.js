const icons = document.querySelectorAll(".navbar-icon__container i");
const iframes = document.querySelectorAll("iframe");

icons.forEach((icon) => {
  icon.addEventListener("click", function () {
    icons.forEach((icon) => icon.classList.remove("active"));
    this.classList.add("active");

    const activeClass = Array.from(this.classList).find((className) =>
      className.startsWith("attr-")
    );

    iframes.forEach((iframe) => (iframe.style.display = "none"));

    const activeIframe = document.querySelector(`iframe.${activeClass}`);
    if (activeIframe) {
      activeIframe.style.display = "block";
    }
  });
});
