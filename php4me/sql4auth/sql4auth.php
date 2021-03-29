<?php
	class sql4auth {
		private $field;
		public $status;
		public $bcrypt = 16;
		
		function __construct($engine, $init=true) {
			// INIT
			$this->database = $engine;
			if($init) {
				$this->schema();
				$this->init();
			}
			$this->status = $this->database->status[0] && $this->init()[0] ? [true, "Provider was initialized successfully"] : [false, "Error initializing provider: " . $this->database->error];
		}
		
		function init(){
			$database = $this->database->query("CREATE DATABASE IF NOT EXISTS " . $this->field->database . ";") ? [true, "Database created successfully"] : [false, "Error creating database: " . $this->database->error];
			$this->database->select_db($this->field->database);
			$table = $this->database->query("CREATE TABLE IF NOT EXISTS `" . $this->field->table . "`( `" . $this->field->id . "` BIGINT NOT NULL COMMENT 'id, unique index', `" . $this->field->username . "` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'username, unique', `" . $this->field->email . "` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'email, unique', `" . $this->field->password . "` char(60) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user password', PRIMARY KEY (`" . $this->field->id . "`), UNIQUE KEY `" . $this->field->username . "` (`" . $this->field->username . "`), UNIQUE KEY `" . $this->field->email . "` (`" . $this->field->email . "`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';") ? [true, "Table created successfully"] : [false, "Error creating table: " . $this->database->error];
			$drop = $this->database->query("DROP TRIGGER " . $this->field->table . "_uuid;") ? [true, "Trigger dropped successfully"] : [false, "Error dropping trigger: " . $this->database->error];
			$trigger = $this->database->query("CREATE TRIGGER " . $this->field->table . "_uuid BEFORE INSERT ON " . $this->field->table . " FOR EACH ROW SET NEW." . $this->field->id . " = UUID_SHORT();;") ? [true, "Trigger created successfully"] : [false, "Error creating trigger: " . $this->database->error];
			return $database[0] && $table[0] && $drop[0] && $trigger[0] ? [true, "Initialization succeeded"] : [false, "Initialization failed with error: " . $this->database->error];
		}
		
		function schema($id="id",$username="username",$password="password",$email="email", $table="users", $database="test"){
			$this->field->id = $id;
			$this->field->username = $username;
			$this->field->password = $password;
			$this->field->email = $email;
			$this->field->table = $table;
			$this->field->database = $database;
		}
		
		function signin($username, $password){
			$query = $this->database->select("SELECT " . $this->field->id . ", " . $this->field->password . " FROM " . $this->field->table . " WHERE " . $this->field->username . " = ? OR " . $this->field->email . " = ?;", "ss", $username, $username);
			return $query[0] ? password_verify($password, $query[1][1]) ? [true, $query[1][0]] : [false, "Incorrect username or password!"] : [password_hash($password, PASSWORD_BCRYPT, ['cost' => $this->bcrypt]) ? false : false, "Incorrect username or password!"];
		}
		
		function signup($username, $password, $email){
			// TODO: Make the function duration the same for both entries
			if(!$this->database->select("SELECT " . $this->field->id . " FROM " . $this->field->table . " WHERE " . $this->field->username . " = ? OR " . $this->field->email . " = ?;", "ss", $username, $email)[0]){
				return [$this->database->insert("INSERT INTO " . $this->field->table . " (" . $this->field->username . ", " . $this->field->email . ", " . $this->field->password . ") VALUES (?, ?, ?);", "sss", $username, $email, password_hash($password, PASSWORD_BCRYPT, ['cost' => $this->bcrypt]))[0], "Account created successfully!"];
			}
			return [false, "There was an error trying to create your account."];
		}
		
		function password($id, $password){
			return $this->database->update("UPDATE `" . $this->field->table . "` SET `" . $this->field->password . "` = ? WHERE `" . $this->field->id . "` = ?;", "si", password_hash($password, PASSWORD_BCRYPT, ['cost' => $this->bcrypt]), $id)[0] ? [true, "Password was set sucessfully!"] : [false, "There was an error trying to set the password."];
		}
		
		function email($id, $email){
			return $this->database->update("UPDATE `" . $this->field->table . "` SET `" . $this->field->email . "` = ? WHERE `" . $this->field->id . "` = ?;", "si", $email, $id)[0] ? [true, "E-mail was set sucessfully!"] : [false, "There was an error trying to set the e-mail."];
		}
	}
?>
