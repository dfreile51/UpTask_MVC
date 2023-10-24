<div class="barra-mobile">
    <h1>UpTask</h1>

    <div class="menu">
        <img id="mobile-menu" class="cerrada" src="build/img/menu.svg" alt="imagen menu">
    </div>

</div>

<div class="barra-mobile-options hidden">
    <nav class="sidebar-nav">
        <a class="<?php echo ($titulo === "Proyectos") ? "activo" : ""; ?>" href="/dashboard">Proyectos</a>
        <a class="<?php echo ($titulo === "Crear Proyecto") ? "activo" : ""; ?>" href="/crear-proyecto">Crear Proyectos</a>
        <a class="<?php echo ($titulo === "Perfil") ? "activo" : ""; ?>" href="/perfil">Perfil</a>
    </nav>

    <div class="cerrar-sesion-mobile">
        <a href="/logout" class="cerrar-sesion">Cerrar Sesion</a>
    </div>
</div>

<div class="barra">
    <p>Hola: <span><?php echo $_SESSION["nombre"]; ?></span></p>

    <a href="/logout" class="cerrar-sesion">Cerrar Sesión</a>
</div>