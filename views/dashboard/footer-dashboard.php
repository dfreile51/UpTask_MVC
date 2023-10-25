        </div>
    </div>
</div>

<?php 
    $script = "<script src='build/js/app.js'></script>";
    $_SERVER["PATH_INFO"] === "/dashboard" ? $script .= "<script src='build/js/proyectos.js'></script>" : "";
?>