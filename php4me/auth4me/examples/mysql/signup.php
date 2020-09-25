<?php
        require_once("../../../sql4me/sql4me.php");
        require_once("../../../sql4auth/sql4auth.php");
        require_once("../../auth4me.php");
        $engine = new sql4me();
        $provider = new sql4auth($engine);
        $auth = new auth4me($provider);
	echo $auth->signup("the_username","the_user_password","the_user_email_is_optional_you_can_delete_this_argument_if_you_want")[1];
?>
