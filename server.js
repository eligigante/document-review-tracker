const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

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


module.exports = db;

const app = express();

app.use(session({
    secret : 'webslesson',
    resave : true,
    saveUninitialized : true
  }));  

app.listen('8001', () => {
    console.log('Server has connected to port 8001')
})





// function getUser(id) {
//     const result = db.query('SELECT * FROM user WHERE user_ID = ?', [id])
//     const rows = result[0];
//     return rows;
// }

// function insertUser(user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status) {
//     var sql = 'INSERT INTO user (user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status)' +
//     'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     const result = db.query(sql, [user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status])
// }

// console.log(insertUser(2220172, '2220172@slu.edu.ph', '123abc', 'Zapanta', 'Adrienne Marie', 'Banday', 10, 'President', 'online'));
