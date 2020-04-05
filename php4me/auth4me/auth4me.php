<?php
class auth4me {
	function __construct($provider) {
		$this->provider = $provider;
	}
	function signin($username, $password){
		return $this->provider->signin($username, $password);
	}
	function signup($username, $password, $email=false){
		return $email ? $this->provider->signup($username, $password, $email) : $this->provider->signup($username, $password, $username . "@example.com");
	}
	function signout(){
	}
	function password($id, $password){
		return $this->provider->password($id, $password);
	}
	function email($id, $email){
		return $this->provider->email($id, $email);
	}
};
?>