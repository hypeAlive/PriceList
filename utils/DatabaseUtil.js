import mysql from 'mysql2';
import express from 'express';
import config from '../config.json';

export default class {
    static createConnection = (host     = config.database.host,
                               database = config.database.database,
                               user     = config.database.user,
                               password = config.database.password) => {

        const connection = mysql.createConnection({
            host: host, user: user, password: password, database: database,
        });
        connection.connect(function (err) {
            if (err) {
                console.error('Fehler beim verbinden: ' + err.stack);
                return;
            }
            console.log('Mit Datenbank verbunden unter id: ' + connection.threadId);
        });
        return connection;
    }

    static getItemData = (tableName, connection, category = '*') => {
        if (category === '*') {
            return this.createSQLGetRequest('/' + tableName + '/*',
                'SELECT * FROM ' + tableName,
                connection);
        } else {
            return this.createSQLGetRequest('/' + tableName + '/' + category,
                'SELECT * FROM ' + tableName + ' WHERE category = "' + category + '"',
                connection);
        }
    }

    static createSQLGetRequest(path, sqlRequest, connection){
        const router = express.Router();
        router.get(path, (req, res) => {
            connection.query(sqlRequest, (err, data, fields) => {
                if (err) throw err;
                res.send(data);
            })
        })
        return router;
    }
}