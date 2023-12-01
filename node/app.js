const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const queries = require('./queries');
const cookie = require('cookie-parser');
const { request } = require('http');

const connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'document_tracker_db'
      });


connection.connect((err) => {
  if (err) throw (err) => {
    console.log ('Error encountered while connecting to database.');
    }
  else {
    console.log('Successfully connected to MySQL database.');
    }
})

function checkUser(connection, id) {
  return new Promise((resolve, reject) => {
    var sql = queries.verifyUser;
    
    connection.query(sql, [id], function(error, result, fields) {
      resolve(result.length > 0);
    });
  });
}

const app = express();

app.use(session({
    secret : 'document-tracker-key',
    resave : true,
    saveUninitialized : true,
    cookie: {maxAge: 86400}
  }));  

const root = path.resolve(__dirname);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(cookie());
app.use(express.static(path.resolve(__dirname + "/../public")));

app.listen('8001', () => {
  console.log('Server has connected to port 8001');
})

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

app.post('/login', (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;

  if (id && password) {
    if ((checkUser(connection, id))) {
      connection.query(queries.verifyCredentials, [id, password], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          request.session.accountID = id;
          request.session.loggedIn = true;
          console.log("Successfully logged in.");
          response.redirect('/home');
        }
        else {
          console.log("Incorrect password.");
          response.redirect('/');
        }
        response.end();
      })
    }
    else {
      console.log("User does not exist.");
      response.redirect('/');
    }
  }})

app.get('/home', function(request, response) {
  if (request.session.loggedIn) {
    response.sendFile(path.resolve(__dirname + '/../public/home.html'));
    console.log("Welcome back, User!")
  }
  else {
    console.log("Please login.")
    response.redirect('/');
    }})
    
app.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/')
})




