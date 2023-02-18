import mysql from 'mysql2';
import express from 'express';
import config from '../config.json';

/**
 * Beinhaltet alle Funktionen zu einer Datenbank
 */
export default class {

    /**
     * Stellt die Verbindung zu einer Datenbank her, wenn nichts übergeben, werden die Daten in der config.json gesucht.
     *
     * @param host: IP der Datenbank
     * @param database: Name der Datenbank
     * @param user: User zum einloggen
     * @param password: Passwort zum einloggen
     * @returns {Connection}: sql2 Datenbank Connection
     */
    static createConnection = (host = config.database.host, database = config.database.database, user = config.database.user, password = config.database.password) => {

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

    /**
     * Trennt die Verbindung mit der übergebenen Datenbank Verbindung.
     *
     * @param connection: sql2 Datenbank Connection
     */
    static endConnection(connection) {
        let id = connection.threadId;
        connection.destroy();
        console.log("Verbringung getrennt mit Datenbank unter id: " + id);
    }

    /**
     * Gibt Datenbank-Daten zurück anhand von der Tabelle, der Datenbank Connection, (Filtern und dem Verknüpfungs-Operator für Filter)
     * ~optional
     *
     * @param tableName: Name der Tabelle, in der Gesucht werden soll.
     * @param connection: sql2 Connection zur Datenbank
     * @param filter: Obejekt an Filtern nach denen gesucht wird, wenn nicht übergeben wird alles der Tabelle zurückgegeben
     * @param logicOperator: So werden die Filter miteinander verbunden ("AND"/"OR"), wenn nichts übergeben "AND", wenn bei "AND" nichts gefunden wird, wird "OR" zurückgegeben
     * @returns {Promise<unknown>}: SQL-Data
     */
    static getDataByTable(tableName, connection, filter = {}, logicOperator = "") {
        return new Promise(async (resolve, reject) => {

            let testBoth = false;

            if (logicOperator === "") {
                logicOperator = "AND"
                testBoth = true;
            }

            let sqlRequest = "SELECT * FROM " + tableName
            let optionsLength = Object.keys(filter).length;

            if (optionsLength !== 0) {
                sqlRequest += " WHERE "

                for (let i = 0; i < optionsLength; i++) {
                    let key = Object.keys(filter)[i]
                    sqlRequest += key + " = '" + filter[key] + "'"
                    if (i + 1 < optionsLength) sqlRequest += " " + logicOperator.toUpperCase() + " ";
                }
            }

            let data = null;
            try {
                data = await this.getSQLData(sqlRequest, connection);
                if (data.length === 0 && testBoth === true) data = await this.getDataByTable(tableName, connection, filter, (logicOperator === "OR") ? "AND" : "OR");
                resolve(data);
            } catch (err) {
                reject(err)
            }
        });
    }

    /**
     * Gibt die Daten einer Datenbank zurück anhand einer SQL Abfrage und der Datenbank Connection
     *
     * @param sqlRequest: String mit SQL Request
     * @param connection: sql2 Datenbank Connection
     * @returns {Promise<unknown>}: Erhaltene Daten aus Datenbank
     */
    static getSQLData(sqlRequest, connection) {
        return new Promise((resolve, reject) => {
            connection.query(sqlRequest, (err, data, fields) => {
                if (err) reject(err); else resolve(data);
            });
        });
    }
}