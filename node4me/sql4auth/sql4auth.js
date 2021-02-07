const bcrypt = require("bcrypt")
module.exports = class sql4me {
    constructor(engine, init = true) {
        // PRIVATE
        this.field = {};
        // PUBLIC
        this.status;
        this.bcrypt = 16;
        // INIT
        this.database = engine;
        // INIT
        try {
            if(init) {
                this.schema();
                this.init();
            }
        } catch(err) {
            console.error(err);
            require("process").exit();
        }
    }

    init() {
        try {
            this.database.query("CREATE DATABASE IF NOT EXISTS " + this.field.database + ";");
            this.database.select_db(this.field.database);
            this.database.query("CREATE TABLE IF NOT EXISTS `" + this.field.table + "`( `" + this.field.id + "` BIGINT NOT NULL COMMENT 'id, unique index', `" + this.field.username + "` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'username, unique', `" + this.field.email + "` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'email, unique', `" + this.field.password + "` char(60) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user password', PRIMARY KEY (`" + this.field.id + "`), UNIQUE KEY `" + this.field.username + "` (`" + this.field.username + "`), UNIQUE KEY `" + this.field.email + "` (`" + this.field.email + "`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';");
            this.database.query("DROP TRIGGER IF EXISTS " + this.field.table + "_uuid;") ? [true, "Trigger dropped successfully"] : [false, "Error dropping trigger."];
            this.database.query("CREATE TRIGGER " + this.field.table + "_uuid BEFORE INSERT ON " + this.field.table + " FOR EACH ROW SET NEW." + this.field.id + " = UUID_SHORT();;");
        } catch(err) {
            console.error(err);
            require("process").exit();
        }
    }

    schema(id="id",username="username",password="password",email="email",table="users",database="auth4me") {
        this.field.id = id;
        this.field.username = username;
        this.field.password = password;
        this.field.email = email;
        this.field.table = table;
        this.field.database = database;
    }

    signin(username, password) {
        return new Promise((res) => {
            this.database.select("SELECT " + this.field.id + ", " + this.field.password + " FROM " + this.field.table + " WHERE " + this.field.username + " = ? OR " + this.field.email + " = ?;", [username, username]).then((result) => {
                result[0] ? bcrypt.compareSync(password, result[1][0].password) ? res([true, result[1][0].id]) : res([bcrypt.hashSync(password, this.bcrypt) ? false : false, "Incorrect username or password!"]) : res([bcrypt.hashSync(password, this.bcrypt) ? false : false, "Incorrect username or password!"]);
            });
            this.database.database.end();
        });
    }

    signup(username, password, email) {
        return new Promise((res) => {
            this.database.select("SELECT " + this.field.id + " FROM " + this.field.table + " WHERE " + this.field.username + " = ? OR " + this.field.email + " = ?;", [username, username]).then((result) => {
                if (!result[0]) {
                    this.database.insert("INSERT INTO " + this.field.table + " (" + this.field.username + ", " + this.field.email + ", " + this.field.password + ") VALUES (?, ?, ?);", [username, email, bcrypt.hashSync(password, this.bcrypt)]).then((result) => {
                        result ? res([true, "Account created successfully!"]) : res([false, "There was an error trying to create your account."]);
                    });
                    this.database.database.end();
                } else {
                    bcrypt.hashSync(password, this.bcrypt)
                    res([false, "There was an error trying to create your account."]);
                    this.database.database.end();
                }
            });
        });
    }

    password(id, password) {
        return new Promise((res) => {
            this.database.insert("UPDATE `" + this.field.table + "` SET `" + this.field.password + "` = ? WHERE `" + this.field.id + "` = ?;", [bcrypt.hashSync(password, this.bcrypt), id]).then((result) => {
                result ? res([true, "Password was set sucessfully!"]) : res([false, "There was an error trying to set the password."]);
            });
            this.database.database.end();
        });
    }

    email(id, email) {
        return new Promise((res) => {
            this.database.insert("UPDATE `" + this.field.table + "` SET `" + this.field.email + "` = ? WHERE `" + this.field.id + "` = ?;", [email, id]).then((result) => {
                result ? res([true, "E-mail was set sucessfully!"]) : res([false, "There was an error trying to set the e-mail."]);
            });
            this.database.database.end();
        });
    }
}
