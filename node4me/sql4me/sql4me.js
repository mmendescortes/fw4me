const mysql = require("mysql");
module.exports = class sql4me {
    constructor(hostname = "localhost", username = "root", password = "", init = true) {
        // CONNECT
        this.database = mysql.createConnection({
            host: hostname,
            user: username,
            password: password
        });
        this.database.connect((err) => {
            err ? console.error([false, "Error establishing a database connection."]) : console.debug([true, "Connection established successfully!"]);
        });
    }

    select(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(err, fields) {
                fields.length ? res([true, fields]) : res([false, "No results for your query."]);
            });
        });
    }

    insert(query, bind) {
        return new Promise((res) => {
            this.database.query(query, bind, function(err) {
                !err ? res([true, "Success!"]) : res([false, "Fail!"]);
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
            !err ? console.debug([true, "Database changed successfully!"]) : console.error([false, "Fail on changing database!"]);
        });
    }
}
