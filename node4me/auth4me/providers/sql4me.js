const mysql = require("mysql");
const bcrypt = require("bcrypt")
module.exports = class sql4me {
    constructor(hostname = "localhost", username = "root", password = "", init = true) {
        // PRIVATE
        this.field = {};
        this.status;
        this.bcrypt = 16;
        // CONNECT
        this.database = mysql.createConnection({
            host: hostname,
            user: username,
            password: password
        });
        let database = this.database;
        this.database.connect((error) => {
            database.error = error ? [false, "Error establishing a database connection."] : [true, "Connection established successfully!"];
        });
        // INIT
        if (init) {
            this.schema();
            this.init();
        }
        this.status = this.init()[0] ? [true, "Provider was initialized successfully"] : [false, "Error initializing provider: " + this.database.error];
    }

    init() {
        let database = this.database.query("CREATE DATABASE IF NOT EXISTS " + this.field.database + ";") ? [true, "Database created successfully"] : [false, "Error creating database: " + this.database.error];
        this.database.changeUser({
            database: this.field.database
        }, function(err) {
            if (err) throw err;
        });
        let table = this.database.query("CREATE TABLE IF NOT EXISTS `" + this.field.table + "`( `" + this.field.id + "` BIGINT NOT NULL COMMENT 'id, unique index', `" + this.field.username + "` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'username, unique', `" + this.field.email + "` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'email, unique', `" + this.field.password + "` char(60) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user password', PRIMARY KEY (`" + this.field.id + "`), UNIQUE KEY `" + this.field.username + "` (`" + this.field.username + "`), UNIQUE KEY `" + this.field.email + "` (`" + this.field.email + "`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';") ? [true, "Table created successfully"] : [false, "Error creating table: " + this.database.error];
        let drop = this.database.query("DROP TRIGGER " + this.field.table + "_uuid;") ? [true, "Trigger dropped successfully"] : [false, "Error dropping trigger: " + this.database.error];
        let trigger = this.database.query("CREATE TRIGGER " + this.field.table + "_uuid BEFORE INSERT ON " + this.field.table + " FOR EACH ROW SET NEW." + this.field.id + " = UUID_SHORT();;") ? [true, "Trigger created successfully"] : [false, "Error creating trigger: " + this.database.error];
        return database[0] && table[0] && drop && trigger ? [true, "Initialization succeeded"] : [false, "Initialization failed with error: " + this.database.error];
    }

    schema(id = "id", username = "username", password = "password", email = "email", table = "users", database = "auth4me") {
        this.field.id = id;
        this.field.username = username;
        this.field.password = password;
        this.field.email = email;
        this.field.table = table;
        this.field.database = database;
    }

    signin(username, password) {
        return new Promise((res) => {
            this.select("SELECT " + this.field.id + ", " + this.field.password + " FROM " + this.field.table + " WHERE " + this.field.username + " = ? OR " + this.field.email + " = ?;", [username, username]).then((result) => {
                result[0] ? bcrypt.compareSync(password, result[1].password) ? res([true, result[1].id]) : res([bcrypt.hashSync(password, this.bcrypt) ? false : false, "Incorrect username or password!"]) : res([bcrypt.hashSync(password, this.bcrypt) ? false : false, "Incorrect username or password!"]);
            });
        });
    }

    signup(username, password, email) {
        return new Promise((res) => {
            this.select("SELECT " + this.field.id + " FROM " + this.field.table + " WHERE " + this.field.username + " = ? OR " + this.field.email + " = ?;", [username, username]).then((result) => {
                if (!result[0]) {
                    this.insert("INSERT INTO " + this.field.table + " (" + this.field.username + ", " + this.field.email + ", " + this.field.password + ") VALUES (?, ?, ?);", [username, email, bcrypt.hashSync(password, this.bcrypt)]).then((result) => {
                        result[0] ? res([true, "Account created successfully!"]) : res([false, "There was an error trying to create your account."]);
                    });
                } else {
                    res([false, "There was an error trying to create your account."]);
                }
            });
        });
    }

    password(id, password) {
        return new Promise((res) => {
            this.insert("UPDATE `" + this.field.table + "` SET `" + this.field.password + "` = ? WHERE `" + this.field.id + "` = ?;", [bcrypt.hashSync(password, this.bcrypt), id]).then((result) => {
                result[0] ? res([true, "Password was set sucessfully!"]) : res([false, "There was an error trying to set the password."]);
            });
        });
    }

    email(id, email) {
        return new Promise((res) => {
            this.insert("UPDATE `" + this.field.table + "` SET `" + this.field.email + "` = ? WHERE `" + this.field.id + "` = ?;", [email, id]).then((result) => {
                result[0] ? res([true, "E-mail was set sucessfully!"]) : res([false, "There was an error trying to set the e-mail."]);
            });
        });
    }

    select(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(error, fields) {
                fields.length ? res([true, fields[0]]) : res([false, "No results for your query."]);
            });
        });
    }

    insert(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(error) {
                !error ? res([true, "Success!"]) : res([false, "Fail!"]);
            })
        });
    }
}
