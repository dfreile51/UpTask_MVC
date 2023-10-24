const mobileMenuBtn = document.querySelector("#mobile-menu");
const barraMobileOptions = document.querySelector(".barra-mobile-options");

window.addEventListener("resize", () => {
  const anchoPantalla = document.body.clientWidth;

  if (anchoPantalla >= 768) {
    barraMobileOptions.classList.add("hidden");
    barraMobileOptions.classList.remove("mostrar");
    barraMobileOptions.classList.remove("ocultar");

    if (barraMobileOptions.classList.contains("mostrar")) {
      mobileMenuBtn.src = "build/img/cerrar.svg";
      mobileMenuBtn.classList.remove("cerrada");
      mobileMenuBtn.classList.add("abierta");
    } else {
      mobileMenuBtn.src = "build/img/menu.svg";
      mobileMenuBtn.classList.remove("abierta");
      mobileMenuBtn.classList.add("cerrada");
    }
  }
});

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", function (e) {
    barraMobileOptions.classList.remove("hidden");
    if (barraMobileOptions.classList.contains("mostrar")) {
      barraMobileOptions.classList.remove("mostrar");
      barraMobileOptions.classList.add("ocultar");

      e.target.src = "build/img/menu.svg";
      e.target.classList.remove("abierta");
      e.target.classList.add("cerrada");
    } else {
      barraMobileOptions.classList.remove("ocultar");
      barraMobileOptions.classList.add("mostrar");

      e.target.src = "build/img/cerrar.svg";
      e.target.classList.remove("cerrada");
      e.target.classList.add("abierta");
    }
  });
}
