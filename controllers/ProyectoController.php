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
}
