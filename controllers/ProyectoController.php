<?php

namespace Controllers;

use Model\Proyecto;

class ProyectoController
{
    public static function index()
    {
        checkSession();

        $id = $_SESSION["id"];
        $proyectos = Proyecto::belongsTo("propietarioId", $id);

        echo json_encode(["proyectos" => $proyectos]);
    }

    public static function eliminar()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            // Validar que el proyecto exista y que sea de usuario que a iniciado sesion
            $proyecto = Proyecto::where("url", $_POST["url"]);

            checkSession();

            if (!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]) {
                $respuesta = [
                    "tipo" => "error",
                    "mensaje" => "Hubo un error al eliminar el proyecto"
                ];

                echo json_encode($respuesta);
                return;
            }

            $resultado = $proyecto->eliminar();

            $resultado = [
                "resultado" => $resultado,
                "mensaje" => "Eliminado correctamente",
                "tipo" => "exito"
            ];

            echo json_encode($resultado);
        }
    }
}
