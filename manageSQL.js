const mysql = require('mysql');
const config = require('./config');
const log = require('./utils/log');


module.exports = (sql, values, next) => {

    if (arguments.length === 2) {
        next = values;
        values = null;
    }

    const connection = mysql.createConnection({
        host     : config.get('db_host'),
        user     : config.get('db_user'),
        port     : config.get('db_port'),
        password : config.get('db_password'),
        database : config.get('db_name')
    });
    connection.connect((err) => {
        if (err) {
            log.info("[MYSQL] Error connecting to mysql:" + err);
        }
    });

    connection.query(sql, values, (err) => {
        connection.end();
        if (err) {
            throw err;
        }
        next.apply(this, arguments);
    });
};