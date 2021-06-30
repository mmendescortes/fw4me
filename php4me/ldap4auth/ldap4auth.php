<?php
	class ldap4auth {
		function __construct($engine, $init=true) {
			// INIT
			$this->ldap = $engine;
		}
		
		function init(){
			return [false, "Function not supported on this provider."];
		}
		
		function schema(){
			return [false, "Function not supported on this provider."];
		}
		
		function signin($username, $password){
			$query = $this->ldap->query($username, $password, "(&(sAMAccountName={$username}s!))");
			return empty($query[1]) == false ? [true, $username] : [false, "Incorrect username or password!"];
		}
		
		function signup($username, $password, $email){
			return [false, "Function not supported on this provider."];
		}
		
		function password($id, $password){
			return [false, "Function not supported on this provider."];
		}
		
		function email($id, $email){
			return [false, "Function not supported on this provider."];
		}
	}
?>
