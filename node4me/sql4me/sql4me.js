const mysql = require("mysql");
module.exports = class sql4me {
    constructor(hostname = "localhost", username = "root", password = "") {
        // CONNECT
        try {
            this.database = mysql.createConnection({
                host: hostname,
                user: username,
                password: password,
                supportBigNumbers: true,
                bigNumberStrings: true
            });
        } catch(err) {
            console.err("SQL4ME ERROR: Couldn't create connection.");
            require("process").exit();
        }
        this.database.connect((err) => {
            if(err) {
                console.error("SQL4ME ERROR: Couldn't create connection.");
                require("process").exit();
            }
        });
    }

    select(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(err, fields) {
                if(err) {
                    console.error("SQL4ME ERROR: Couldn't complete select query.");
                    require("process").exit();
                } else {
                    fields.length ? res([true, fields]) : res([false, "No results for your query."]);
                }
            });
        });
    }

    insert(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(err, fields) {
                if(err) {
                    console.error("SQL4ME ERROR: Couldn't complete operation.");
                    require("process").exit();
                } else {
                    res(fields.affectedRows >= 1);
                }
            })
        });
    }

    update(query, bind) {
        return this.insert(query, bind);
    }
    drop(query, bind) {
        return this.insert(query, bind);
    }
    query(query, bind, callback) {
        return new Promise((res) => {
            this.database.query(query, bind, callback)
        });
    }
    select_db(field_database) {
        this.database.changeUser({database: field_database}, function(err) {
            if(err) {
                console.error("SQL4ME ERROR: Fail on changing database!");
                require("process").exit();
            }
        });
    }
}
