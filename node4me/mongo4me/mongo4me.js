const mongodb = require('mongodb').MongoClient;
module.exports = class mongo4me {
    constructor(uri) {
        // CONNECT
        try {
            this.database = new mongodb(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch(err) {
            console.err("Couldn't create connection.");
            require("process").exit();
        }
    }

    async select(database, collection, query={}, options={}) {
        this.connection = await this.database.connect();
        database = this.connection.db(database);
        collection = database.collection(collection);
        let fields = await collection.find(query, options);
        let count = await fields.count();
        return new Promise((res) => {
            try {
                count ? res([true, fields.toArray()]) : res([false, "No results for your query."]);
            } catch(err) {
                if(err) {
                    console.error("Couldn't complete select query.");
                    require("process").exit();
                }
            };
        });
    }
    async insert(database, collection, documents) {
        this.connection = await this.database.connect();
        database = this.connection.db(database);
        collection = database.collection(collection);
        let fields = await collection.insertMany(documents, {ordered: true});
        let count = fields.insertedCount;
        return new Promise((res) => {
            try {
                count ? res([true, "Insert operation was completed sucessfully"]) : res([false, "Couldn't complete insert operation."]);
            } catch(err) {
                if(err) {
                    console.error("Couldn't complete insert query.");
                    require("process").exit();
                }
            };
        });
    }
    async update(database, collection, where, values, options={}) {
        this.connection = await this.database.connect();
        database = this.connection.db(database);
        collection = database.collection(collection);
        let fields = await collection.updateOne(where, values, options);
        let count = fields.modifiedCount || fields.upsertedCount;
        return new Promise((res) => {
            try {
                count ? res([true, "Update operation was completed sucessfully"]) : res([false, "Couldn't complete update operation."]);
            } catch(err) {
                if(err) {
                    console.error("Couldn't complete insert query.");
                    require("process").exit();
                }
            };
        });
    }
    async delete(database, collection, where) {
        this.connection = await this.database.connect();
        database = this.connection.db(database);
        collection = database.collection(collection);
        let fields = await collection.deleteOne(where);
        let count = fields.deletedCount;
        return new Promise((res) => {
            try {
                count ? res([true, "Delete operation was completed sucessfully"]) : res([false, "Couldn't complete delete operation."]);
            } catch(err) {
                if(err) {
                    console.error("Couldn't complete insert query.");
                    require("process").exit();
                }
            };
        });
    }
    close(){
      this.connection.close();
    };
}