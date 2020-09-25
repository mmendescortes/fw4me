<?php
        require_once("../../../sql4me/sql4me.php");
        require_once("../../../sql4auth/sql4auth.php");
        require_once("../../auth4me.php");
        $engine = new sql4me();
        $provider = new sql4auth($engine);
        $auth = new auth4me($provider);
	echo $auth->signin("the_username_or_email","the_user_password")[1];
?>
