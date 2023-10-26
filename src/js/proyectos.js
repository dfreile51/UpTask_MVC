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
    limpiarProyectos();

    if (proyectos.length === 0) {
      const textoNoProyectos = document.createElement("P");
      textoNoProyectos.innerHTML =
        "No hay Proyectos Aún <a href='/crear-proyecto'>Comienza creando uno</a>";
      textoNoProyectos.classList.add("no-proyectos");

      const contenedorProyectos = document.querySelector(".contenido");
      contenedorProyectos.appendChild(textoNoProyectos);
      return;
    }

    const contenedorProyectos = document.querySelector(".listado-proyectos");

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
      btnEliminar.onclick = function () {
        confirmarEliminarProyecto({ ...proyectoItem });
      };

      contenedorProyecto.appendChild(enlaceProyecto);
      contenedorProyecto.appendChild(btnEliminar);
      contenedorProyectos.appendChild(contenedorProyecto);
    });

    document.querySelector(".contenido").appendChild(contenedorProyectos);
  }

  function confirmarEliminarProyecto(proyecto) {
    Swal.fire({
      title: "¿Eliminar Proyecto?",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      customClass: {
        popup: "sweet-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarProyecto(proyecto);
      }
    });
  }

  async function eliminarProyecto(proyectoItem) {
    const { id, proyecto, url, propietarioId } = proyectoItem;

    const datos = new FormData();
    datos.append("id", id);
    datos.append("proyecto", proyecto);
    datos.append("url", url);
    datos.append("propietarioId", propietarioId);

    const urlApi = `${location.origin}/api/proyecto/eliminar`;
    const respuesta = await fetch(urlApi, {
      method: "POST",
      body: datos,
    });
    const resultado = await respuesta.json();

    if (resultado.resultado) {
      Swal.fire({
        title: "Eliminado!",
        text: resultado.mensaje,
        icon: "success",
        customClass: {
          popup: "sweet-container-success",
        },
      });

      proyectos = proyectos.filter(
        (proyectoMemoria) => proyectoMemoria.id !== id
      );
      mostrarProyectos();
    } else {
      Swal.fire({
        title: "Opps...",
        text: resultado.mensaje,
        icon: "error",
        customClass: {
          popup: "sweet-container-error",
        },
      });
    }
  }

  function limpiarProyectos() {
    const listadoProyectos = document.querySelector(".listado-proyectos");

    while (listadoProyectos.firstChild) {
      listadoProyectos.removeChild(listadoProyectos.firstChild);
    }
  }
})();
