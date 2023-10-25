<?php

namespace Controllers;

use MVC\Router;
use Model\Usuario;
use Model\Proyecto;

class DashboardController
{
    public static function index(Router $router)
    {
        checkSession();
        isAuth();

        $id = $_SESSION["id"];
        $proyectos = Proyecto::belongsTo("propietarioId", $id);

        $router->render("dashboard/index", [
            "titulo" => "Proyectos",
            "proyectos" => $proyectos
        ]);
    }

    public static function crear_proyecto(Router $router)
    {
        checkSession();

        isAuth();

        $alertas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $proyecto = new Proyecto($_POST);

            // Validación
            $alertas = $proyecto->validarProyecto();

            if (empty($alertas)) {
                // Generar una URL única
                $hash = md5(uniqid());
                $proyecto->url = $hash;

                // Almacenar el creador del proyecto
                $proyecto->propietarioId = $_SESSION["id"];

                // Guardar Proyecto
                $proyecto->guardar();

                // Redireccionar
                header("Location: /proyecto?id=" . $proyecto->url);
            }
        }

        $router->render("dashboard/crear-proyecto", [
            "titulo" => "Crear Proyecto",
            "alertas" => $alertas
        ]);
    }

    public static function proyecto(Router $router)
    {
        checkSession();

        isAuth();

        $token = $_GET["id"];
        if (!$token) header("Location: /dashboard");

        // Revisar que la persona que visita el proyecto es quien la creo
        $proyecto = Proyecto::where("url", $token);
        if ($proyecto->propietarioId !== $_SESSION["id"]) header("Location: /dashboard");

        $router->render("dashboard/proyecto", [
            "titulo" => $proyecto->proyecto
        ]);
    }

    public static function perfil(Router $router)
    {
        checkSession();
        isAuth();

        $alertas = [];

        $usuario = Usuario::find($_SESSION["id"]);

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validar_perfil();

            if (empty($alertas)) {
                // Verificar que el email no exista en la base de datos
                $existeUsuario = Usuario::where("email", $usuario->email);

                if ($existeUsuario && $existeUsuario->id !== $usuario->id) {
                    // Mostrar un mensaje de error
                    Usuario::setAlerta("error", "Email no válido, ya pertenece a otra cuenta");
                    $alertas = Usuario::getAlertas();
                } else {
                    // Guardar el usuario
                    $usuario->guardar();

                    Usuario::setAlerta("exito", "Guardado Correctamente");
                    $alertas = Usuario::getAlertas();

                    // Asignar el nombre nuevo a la barra
                    $_SESSION["nombre"] = $usuario->nombre;
                }
            }
        }

        $router->render("dashboard/perfil", [
            "titulo" => "Perfil",
            "usuario" => $usuario,
            "alertas" => $alertas
        ]);
    }

    public static function cambiar_password(Router $router)
    {
        checkSession();
        isAuth();

        $alertas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $usuario = Usuario::find($_SESSION["id"]);

            // Sincronizar con los datos del usuario
            $usuario->sincronizar($_POST);

            $alertas = $usuario->nuevo_password();

            if (empty($alertas)) {
                $resultado = $usuario->comprobar_password();

                if ($resultado) {
                    $usuario->password = $usuario->password_nuevo;

                    // Eliminar propiedades no necesarias
                    unset($usuario->password_actual);
                    unset($usuario->password_nuevo);

                    // Hashear el nuevo password
                    $usuario->hashPassword();

                    // Actualizar en la base de datos
                    $resultado = $usuario->guardar();

                    if ($resultado) {
                        Usuario::setAlerta("exito", "Password Guardado Correctamente");
                        $alertas = Usuario::getAlertas();
                    }
                } else {
                    Usuario::setAlerta("error", "Password Incorrecto");
                    $alertas = Usuario::getAlertas();
                }
            }
        }

        $router->render("dashboard/cambiar-password", [
            "titulo" => "Cambiar Password",
            "alertas" => $alertas
        ]);
    }
}
