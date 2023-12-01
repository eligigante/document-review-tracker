const mysql = require('mysql');

function connectDatabase (mysql) {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'document_tracker_db'
    })
}

function getConnection(connection) {
    connection.connect((err) => {
        if (err) throw (err) => {
            console.log ('Error encountered while connecting to database.');
        }
        else {
            console.log('Successfully connected to MySQL database.');
        }
    })
}

module.exports = {
    connectDatabase,
    getConnection
}