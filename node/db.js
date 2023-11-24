const mysql = require('mysql');

function connectDatabase () {
    const db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'document_tracker_db'
    })

    db.getConnection((err)=> {
        if (err) throw (err)
        console.log('Successfully connected to MySQL database.')
    })
}