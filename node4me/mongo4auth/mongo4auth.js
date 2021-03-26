const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");
module.exports = class mongo4auth {
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
            if (init) {
                this.schema();
            }
        } catch (err) {
            console.error(err);
            require("process").exit();
        }
    }

    schema(id = "id", username = "username", password = "password", email = "email", collection = "users", database = "auth4me") {
        this.field.id = id;
        this.field.username = username;
        this.field.password = password;
        this.field.email = email;
        this.field.collection = collection;
        this.field.database = database;
    }

    signin(username, password) {
        let database = this.database;
        return new Promise((res) => {
            this.database.select(this.field.database, this.field.collection, {
                $or: [{
                    "username": username
                }, {
                    "password": username
                }]
            }).then((result) => {
                result[0] ? result[1].then((result) => {
                    bcrypt.compareSync(password, result[0].password) ? res([true, result[0]._id], database.close()) : res([bcrypt.hashSync(password, this.bcrypt) && false, "Incorrect username or password!"], database.close())
                }) : res([bcrypt.hashSync(password, this.bcrypt) && false, "Incorrect username or password!"], database.close());
            });
        });
    }

    signup(username, password, email) {
        let database = this.database;
        return new Promise((res) => {
            this.database.select(this.field.database, this.field.collection, {
                $or: [{
                    "username": username
                }, {
                    "password": username
                }]
            }).then((result) => {
                if (!result[0]) {
                    this.database.insert(this.field.database, this.field.collection, [{
                        "username": username,
                        "email": email,
                        "password": bcrypt.hashSync(password, this.bcrypt)
                    }]).then((result) => {
                        result[0] ? res([true, "Account created successfully!"], database.close()) : res([false, "There was an error trying to create your account."], database.close());
                    });
                } else {
                    bcrypt.hashSync(password, this.bcrypt)
                    res([false, "There was an error trying to create your account."], database.close());
                }
            });
        });
    }

    password(id, password) {
        let database = this.database;
        return new Promise((res) => {
            this.database.update(this.field.database, this.field.collection, {
                "_id": ObjectId(id)
            }, {
                "password": bcrypt.hashSync(password, this.bcrypt)
            }).then((result) => {
                result[0] ? res([true, "Password was changed sucessfully!"]) : res([false, "There was an error trying to change the password."]);
                database.close();
            });
        });
    }

    email(id, email) {
        let database = this.database;
        return new Promise((res) => {
            this.database.update(this.field.database, this.field.collection, {
                "_id": ObjectId(id)
            }, {
                "email": email
            }).then((result) => {
                result[0] ? res([true, "Email was changed sucessfully!"]) : res([false, "There was an error trying to change the email."]);
                database.close();
            });
        });
    }
}