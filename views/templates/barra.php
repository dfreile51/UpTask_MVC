<div class="barra-mobile">
    <h1>UpTask</h1>

    <div class="menu">
        <img id="mobile-menu" class="cerrada" src="build/img/menu.svg" alt="imagen menu">
    </div>

</div>

<div class="barra-mobile-options hidden">
    <?php include __DIR__ . "/nav-sidebar.php" ?>

    <div class="cerrar-sesion-mobile">
        <a href="/logout" class="cerrar-sesion">Cerrar Sesion</a>
    </div>
</div>

<div class="barra">
    <p>Hola: <span><?php echo $_SESSION["nombre"]; ?></span></p>

    <a href="/logout" class="cerrar-sesion">Cerrar Sesión</a>
</div>