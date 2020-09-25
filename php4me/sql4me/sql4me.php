<?php
	class sql4me {
		public $status;
		function __construct($hostname="localhost", $username="root", $password="", $init=true) {
			// CONNECT
			$this->database = new mysqli($hostname, $username, $password);
			$this->connection = $this->database->connect_error ? [false, "Error establishing a database connection."] : [true, "Connection established successfully!"];
			$this->status = $this->connection[0] ? [true, "Database connection was initialized successfully"] : [false, "Error initializing provider: " . $this->database->error];
		}
		public function select($query, $type, ...$bind){
			$query = $this->database->prepare($query);
			if($query){
				$query->bind_param($type, ...$bind); 
				$query->execute();
				$meta = $query->result_metadata();
				$fields = [];
				while($field = $meta->fetch_field()){
					array_push($fields, $field->name);
				}
				$query->bind_result(...$fields);
				$query->store_result();
				$empty = $query->num_rows;
				$query->fetch();
				$query->close();
				return $empty ? [true, $fields] : [false, "No results for your query."];
			}
			return [false, "Fail!"];
		}
		public function insert($query, $type, ...$bind){
			$query = $this->database->prepare($query);
			if($query){
				$query->bind_param($type, ...$bind); 
				$success = $query->execute();
				$query->close();
				return $success ? [$success, "Success!"] : [$success, "Fail!"];
			}
			return [false, "Fail!"];
		}
		public function update($query, $type, ...$bind){
		    return $this->insert($query, $type, ...$bind);
		}
		public function drop($query, $type, ...$bind){
		    return $this->insert($query, $type, ...$bind);
		}
		public function query($query){
		    return $this->database->query($query);
		}
		public function select_db($database) {
		    return $this->database->select_db($database);
		}
	}
?>
