const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const cookie = require('cookie-parser');
const queries = require('./queries');
const server = require('./server');
const db = require('./db');

const connection = db.connectDatabase(mysql);
db.getConnection(connection);

const app = express();

app.use(session({
    secret : 'document-tracker-key',
    resave : true,
    saveUninitialized : true,
    cookie: {maxAge: 86400}
  }));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(cookie());
app.use(express.static(path.resolve(__dirname + "/../public")));

server.startServer(app);

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

app.post('/login', (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;
  if (id && password) {
    if ((queries.checkUser(connection, id))) {
      connection.query(queries.verifyCredentials, [id, password], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          connection.query(queries.userRole, [id], function(err, result, fields) {
            request.session.role = result[0].role;
            request.session.loggedIn = true;
            console.log("Successfully logged in.");
            response.redirect('/home');
          })  
        }
        else {
          console.log("Incorrect password.");
          response.redirect('/');
        }
      })
    }
    else {
      console.log("User does not exist.");
      response.redirect('/');
    }
  }})

app.get('/home', function(request, response) {
  if (request.session.loggedIn) {
    console.log('Role:', request.session.role);
    if (request.session.role == 'admin') {
    response.sendFile(path.resolve(__dirname + '/../public/admin.html'));
    console.log("Welcome back, Admin!")
    }
    else if (request.session.role == 'reviewer') {
      response.sendFile(path.resolve(__dirname + '/../public/reviewer.html'));
      console.log("Welcome back, Reviewer!")
    }
    else {
      // response.sendFile(path.resolve(__dirname + '/../public/home.html'));
      // console.log("Welcome back, User!")
      console.log("This login page is for reviewers and admins only.")
      response.redirect('/');
    }
  }
  else {
    console.log("Please login.")
    response.redirect('/');
    }})
    
app.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/')
})




