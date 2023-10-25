(function () {
  obtenerProyectos();

  let proyectos = [];

  async function obtenerProyectos() {
    try {
      const url = `${location.origin}/api/proyectos`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      proyectos = resultado.proyectos;

      mostrarProyectos();
    } catch (error) {
      console.log(error);
    }
  }

  function mostrarProyectos() {
    if (proyectos.length === 0) {
      const textoNoProyectos = document.createElement("P");
      textoNoProyectos.innerHTML =
        "No hay Proyectos Aún <a href='/crear-proyecto'>Comienza creando uno</a>";
      textoNoProyectos.classList.add("no-proyectos");

      const contenedorProyectos = document.querySelector(".contenido");
      contenedorProyectos.appendChild(textoNoProyectos);
      return;
    }

    const contenedorProyectos = document.createElement("UL");
    contenedorProyectos.classList.add("listado-proyectos");

    proyectos.forEach((proyectoItem) => {
      const { proyecto, url } = proyectoItem;

      const contenedorProyecto = document.createElement("LI");
      contenedorProyecto.classList.add("proyecto");

      const enlaceProyecto = document.createElement("A");
      enlaceProyecto.href = `/proyecto?id=${url}`;
      enlaceProyecto.textContent = proyecto;

      const btnEliminar = document.createElement("BUTTON");
      btnEliminar.innerHTML =
        "<img src='build/img/cross.svg' alt='imagen cerrar'>";

      contenedorProyecto.appendChild(enlaceProyecto);
      contenedorProyecto.appendChild(btnEliminar);
      contenedorProyectos.appendChild(contenedorProyecto);
    });

    document.querySelector(".contenido").appendChild(contenedorProyectos);
  }
})();
