<?php
class auth4me {
	function __construct($provider) {
		$this->provider = $provider;
	}
	function signin($username, $password){
		return $this->provider->signin(strtolower($username), $password);
	}
	function signup($username, $password, $email=false){
		return $email ? $this->provider->signup(strtolower($username), $password, strtolower($email)) : $this->provider->signup(strtolower($username), $password, strtolower($username) . "@example.com");
	}
	function signout(){
	}
	function password($id, $password){
		return $this->provider->password($id, $password);
	}
	function email($id, $email){
		return $this->provider->email($id, strtolower($email));
	}
};
?>