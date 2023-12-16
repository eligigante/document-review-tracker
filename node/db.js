function connectDatabase (mysql) {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'teamang-final'
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