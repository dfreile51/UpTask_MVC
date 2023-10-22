<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;
use MVC\Router;

class TareaController
{
    public static function index(Router $router)
    {
    }

    public static function crear()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {

            checkSession();

            $proyectoId = $_POST["proyectoId"];
            $proyecto = Proyecto::where("url", $proyectoId);

            if (!$proyecto || $proyecto->propietarioId !== $_SESSION["id"]) {
                $respuesta = [
                    "tipo" => "error",
                    "mensaje" => "Hubo un error al agregar la tarea"
                ];

                echo json_encode($respuesta);
                return;
            }

            // Todo bien, instanciar y crear la tarea
            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();
            $respuesta = [
                "tipo" => "exito",
                "id" => $resultado["id"],
                "mensaje" => "Tarea Creada Correctamente"
            ];
            echo json_encode($respuesta);
        }
    }

    public static function actualizar()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
        }
    }

    public static function eliminar()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
        }
    }
}
