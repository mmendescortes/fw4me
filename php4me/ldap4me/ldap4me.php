<?php
	class ldap4me {
		public $status;
		private $organizational_unit;
		private $domain_component;
		function __construct($ldap_server="localhost", $organizational_unit="test", $domain_component="test.example.com", $ldap_version=3, $ldap_referrals=0) {
			// CONNECT
			$this->ldap = ldap_connect($ldap_server);
			ldap_set_option($this->ldap, LDAP_OPT_PROTOCOL_VERSION, $ldap_version);
			ldap_set_option($this->ldap, LDAP_OPT_REFERRALS, $ldap_referrals);
			$this->connection = !$this->ldap ? [false, "Error establishing connection to LDAP server."] : [true, "LDAP connection was established successfully!"];
			$this->select_ou($organizational_unit);
			$this->select_dc($domain_component);
			$this->status = $this->connection[0] ? [true, "LDAP connection was initialized successfully"] : [false, "Error initializing provider: " . ldap_error($this->ldap)];
		}
		public function query($user="anonymous",$pass="",$query){
			try {
				$bind = ldap_bind($this->ldap, $user, $pass);
				return [true, ldap_get_entries($this->ldap, ldap_search($this->ldap, implode(",", [$this->organizational_unit,$this->domain_component]), $query))];
			} catch(Exception $e){
				print_r($e);
				if($e) return [false, "There was an error! LDAP couldn't complete query."]; 
			}
		}
		public function select_ou($organizational_unit) {
		    return $this->organizational_unit = "OU=" . $organizational_unit;
		}
		public function select_dc($domain_component) {
			return $this->domain_component = implode(",", array_map(function($dc_part){return "DC=".$dc_part;}, explode(".", $domain_component)));
		}
	}
?>
