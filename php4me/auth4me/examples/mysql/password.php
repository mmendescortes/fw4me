<?php
	require_once("settings.php");
	require_once("../../providers/sql4me.php");
	require_once("../../auth4me.php");
	$database = new database;
	$provider = new sql4me();
	$auth = new auth4me($provider);
	echo $auth->password("the_user_id","the_user_password")[1];
?>