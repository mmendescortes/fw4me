<?php
        require_once("../../../ldap4me/ldap4me.php");
        require_once("../../../ldap4auth/ldap4auth.php");
        require_once("../../auth4me.php");
        $engine = new ldap4me("ldap://your_ldap_address", "your_ldap_ou", "your_ldap_dc");
        $provider = new ldap4auth($engine);
        $auth = new auth4me($provider);
		echo $auth->signin("the_user","the_user_password")[1];
?>
