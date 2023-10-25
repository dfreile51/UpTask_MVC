(function () {
  obtenerTareas();

  let tareas = [];
  let filtradas = [];

  const estados = {
    0: "Pendiente",
    1: "Completa",
  };

  // Botón para mostrar el Modal de Agregar tarea
  const nuevaTareaBtn = document.querySelector("#agregar-tarea");
  nuevaTareaBtn.addEventListener("click", () => {
    mostrarFormulario();
  });

  /* 
    Filtros de búsqueda
  */
  const filtros = document.querySelectorAll("#filtros input[type='radio']");
  filtros.forEach((radio) => {
    radio.addEventListener("input", filtrarTareas);
  });

  /* 
    Filtra las tareas cuando seleccionamos entre los diferentes radio buttons
  */
  function filtrarTareas(e) {
    const filtro = e.target.value;

    if (filtro !== "") {
      filtradas = tareas.filter((tarea) => tarea.estado === filtro);
    } else {
      filtradas = [];
    }
    mostrarTareas();
  }

  async function obtenerTareas() {
    try {
      const id = obtenerProyecto();
      const url = `${location.origin}/api/tareas?id=${id}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      tareas = resultado.tareas;

      mostrarTareas();
    } catch (error) {
      console.log(error);
    }
  }

  function mostrarTareas() {
    limpiarTareas();
    totalPedientes();
    totalCompletas();

    const arrayTareas = filtradas.length ? filtradas : tareas;

    if (arrayTareas.length === 0) {
      const textoNoTareas = document.createElement("LI");
      textoNoTareas.textContent = "No Hay Tareas";
      textoNoTareas.classList.add("no-tareas");

      const contenedorTareas = document.querySelector("#listado-tareas");
      contenedorTareas.appendChild(textoNoTareas);
      return;
    }

    arrayTareas.forEach((tarea) => {
      const { id, nombre, estado } = tarea;

      const contenedorTarea = document.createElement("LI");
      contenedorTarea.dataset.tareaId = id;
      contenedorTarea.classList.add("tarea");

      const nombreTarea = document.createElement("P");
      nombreTarea.textContent = nombre;
      nombreTarea.ondblclick = function () {
        mostrarFormulario(true, { ...tarea });
      };

      const opcionesDiv = document.createElement("DIV");
      opcionesDiv.classList.add("opciones");

      // Botones
      const btnEstadoTarea = document.createElement("BUTTON");
      btnEstadoTarea.classList.add("estado-tarea");
      btnEstadoTarea.classList.add(`${estados[estado].toLowerCase()}`);
      btnEstadoTarea.textContent = estados[estado];
      btnEstadoTarea.dataset.estadoTarea = estado;
      btnEstadoTarea.ondblclick = function () {
        cambiarEstadoTarea({ ...tarea });
      };

      const btnEliminarTarea = document.createElement("BUTTON");
      btnEliminarTarea.classList.add("eliminar-tarea");
      btnEliminarTarea.dataset.idTarea = id;
      btnEliminarTarea.textContent = "Eliminar";
      btnEliminarTarea.ondblclick = function () {
        confirmarEliminarTarea({ ...tarea });
      };

      opcionesDiv.appendChild(btnEstadoTarea);
      opcionesDiv.appendChild(btnEliminarTarea);

      contenedorTarea.appendChild(nombreTarea);
      contenedorTarea.appendChild(opcionesDiv);

      const contenedorTareas = document.querySelector("#listado-tareas");
      contenedorTareas.appendChild(contenedorTarea);
    });
  }

  /* 
    Revisa si hay tareas pedientes
  */
  function totalPedientes() {
    const totalPedientes = tareas.filter((tarea) => tarea.estado === "0");

    const pedientesRadio = document.querySelector("#pendientes");

    if (totalPedientes.length === 0) {
      pedientesRadio.disabled = true;
    } else {
      pedientesRadio.disabled = false;
    }
  }

  function totalCompletas() {
    const totalCompletas = tareas.filter((tarea) => tarea.estado === "1");

    const completasRadio = document.querySelector("#completadas");

    if (totalCompletas.length === 0) {
      completasRadio.disabled = true;
    } else {
      completasRadio.disabled = false;
    }
  }

  function mostrarFormulario(editar = false, tarea = {}) {
    const modal = document.createElement("DIV");

    modal.classList.add("modal");
    modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${
                  editar ? "Editar Tarea" : "Añade una nueva tarea"
                }</legend>
                <div class="campo">
                    <label for="tarea">Tarea</label>
                    <input type="text" name="tarea" placeholder="${
                      editar
                        ? "Edita la Tarea"
                        : "Añadir Tarea al proyecto actual"
                    }" id="tarea" value = "${tarea.nombre ? tarea.nombre : ""}">
                </div>
                <div class="opciones">
                    <input type="submit" class="submit-nueva-tarea" value="${
                      editar ? "Guardar Cambios" : "Añadir Tarea"
                    }">
                    <button type="buton" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `;

    setTimeout(() => {
      const formulario = document.querySelector(".formulario");
      formulario.classList.add("animar");
    }, 0);

    modal.addEventListener("click", function (e) {
      e.preventDefault();

      if (e.target.classList.contains("cerrar-modal")) {
        const formulario = document.querySelector(".formulario");
        formulario.classList.add("cerrar");

        setTimeout(() => {
          modal.remove();
        }, 500);
      }

      if (e.target.classList.contains("submit-nueva-tarea")) {
        const nombreTarea = document.querySelector("#tarea").value.trim();

        if (nombreTarea === "") {
          // Mostrar una alerta de error
          mostrarAlerta(
            "El Nombre de la tarea es Obligatorio",
            "error",
            document.querySelector(".formulario legend")
          );

          return;
        }

        if (editar) {
          tarea.nombre = nombreTarea;
          actualizarTarea(tarea);
        } else {
          agregarTarea(nombreTarea);
        }
      }
    });

    document.querySelector(".dashboard").appendChild(modal);
  }

  // Muestra un mensaje en la interfaz
  function mostrarAlerta(mensaje, tipo, referencia) {
    //Previene la creación de multiples alertas
    const alertaPrevia = document.querySelector(".alerta");
    if (alertaPrevia) alertaPrevia.remove();

    const alerta = document.createElement("DIV");
    alerta.classList.add("alerta", tipo);
    alerta.textContent = mensaje;

    // Inserta la alerta antes del legend
    referencia.parentElement.insertBefore(
      alerta,
      referencia.nextElementSibling
    );

    // Eliminar la alerta despues de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }

  // Consultar el servidor para añadir una nueva tarea al proyecto actual
  async function agregarTarea(tarea) {
    // Construir la petición
    const datos = new FormData();
    datos.append("nombre", tarea);
    datos.append("proyectoId", obtenerProyecto());

    try {
      const url = `${location.origin}/api/tarea`;
      const respuesta = await fetch(url, {
        method: "POST",
        body: datos,
      });

      const resultado = await respuesta.json();

      mostrarAlerta(
        resultado.mensaje,
        resultado.tipo,
        document.querySelector(".formulario legend")
      );

      if (resultado.tipo === "exito") {
        const modal = document.querySelector(".modal");
        setTimeout(() => {
          modal.remove();
        }, 3000);

        // Agregar el objeto de tarea al global de tareas
        const tareaObj = {
          id: String(resultado.id),
          nombre: tarea,
          estado: "0",
          proyectoId: resultado.proyectoId,
        };

        tareas = [...tareas, tareaObj];
        mostrarTareas();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Cambiar el estado de la tarea 
    1 = "completa"
    0 = "pendiente"
  */
  function cambiarEstadoTarea(tarea) {
    const nuevoEstado = tarea.estado === "1" ? "0" : "1";
    tarea.estado = nuevoEstado;
    actualizarTarea(tarea);
  }

  /*
    Manda una petición a la URL /api/tarea/actualizar 
    para actualizar el nombre de la tarea o el estado de la tarea
  */
  async function actualizarTarea(tarea) {
    const { estado, id, nombre } = tarea;

    const datos = new FormData();
    datos.append("id", id);
    datos.append("nombre", nombre);
    datos.append("estado", estado);
    datos.append("proyectoId", obtenerProyecto());

    // for (let valor of datos.values()) {
    //   console.log(valor);
    // }

    try {
      const url = `${location.origin}/api/tarea/actualizar`;

      const respuesta = await fetch(url, {
        method: "POST",
        body: datos,
      });
      const resultado = await respuesta.json();

      if (resultado.respuesta.tipo === "exito") {
        Swal.fire({
          title: "Actualizado!",
          text: resultado.respuesta.mensaje,
          icon: "success",
          customClass: {
            popup: "sweet-container-success",
          },
        });

        const modal = document.querySelector(".modal");
        if (modal) modal.remove();

        tareas = tareas.map((tareaMemoria) => {
          if (tareaMemoria.id === id) {
            tareaMemoria.estado = estado;
            tareaMemoria.nombre = nombre;
          }

          return tareaMemoria;
        });

        mostrarTareas();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Muestra una alerta al usuario para confirmar la eleminacion de la tarea, 
    si la confirma dispara la funcion "eliminarTarea" la cual eliminará dicha tarea
  */
  function confirmarEliminarTarea(tarea) {
    Swal.fire({
      title: "¿Eliminar Tarea?",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      customClass: {
        popup: "sweet-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarTarea(tarea);
      }
    });
  }

  /*
    Manda una petición a la URL /api/tarea/eliminar para eliminar la tarea indicada
  */
  async function eliminarTarea(tarea) {
    const { estado, id, nombre } = tarea;

    const datos = new FormData();
    datos.append("id", id);
    datos.append("nombre", nombre);
    datos.append("estado", estado);
    datos.append("proyectoId", obtenerProyecto());

    try {
      const url = `${location.origin}/api/tarea/eliminar`;
      const respuesta = await fetch(url, {
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

        tareas = tareas.filter((tareaMemoria) => tareaMemoria.id !== tarea.id);
        mostrarTareas();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Obtiene el valor del parametro "id" de la URL
  */
  function obtenerProyecto() {
    const proyectoParams = new URLSearchParams(window.location.search);
    const proyecto = Object.fromEntries(proyectoParams.entries());

    return proyecto.id;
  }

  /*
    Limpia es listado de las tareas
  */
  function limpiarTareas() {
    const contenedorTareas = document.querySelector("#listado-tareas");

    while (contenedorTareas.firstChild) {
      contenedorTareas.removeChild(contenedorTareas.firstChild);
    }
  }
})();
