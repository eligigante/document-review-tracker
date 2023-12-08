const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const cookie = require('cookie-parser');
const queries = require('./queries');
const server = require('./server');
const db = require('./db');
const { request } = require('http');

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
app.set('views', path.resolve(__dirname + "/../public/views"))
app.set('view engine', 'ejs');
server.startServer(app);

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

app.post('/login', (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;
  if (id && password) {
    if ((queries.checkUser(connection, id))) {
      connection.query(queries.verifyCredentials, [id, password], function(error, result, fields) {
        if (error) throw error;
        if (result.length > 0) {
          connection.query(queries.userLogin, [id], function(error, result, fields) {
            request.session.userID = result[0].user_ID;
            request.session.role = result[0].role;
            request.session.status = result[0].status;
            request.session.loggedIn = true;
            console.log('User exists.');
            response.redirect('/verify');
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

app.get('/verify', function(request, response) {
  if (request.session.loggedIn && request.session.status != 'Online') {
    request.session.verify = true;
    console.log('Role:', request.session.role);
    if (request.session.role == 'admin') {
    console.log(request.session.userID);
    connection.query(queries.setOnlineStatus, [request.session.userID])
    console.log("Successfully logged in. Welcome back, Admin!");
    response.redirect('/home_admin');
    }

    else if (request.session.role == 'reviewer') {
      response.sendFile(path.resolve(__dirname + '/../public/reviewer.html'));
      console.log("Welcome back, Reviewer!")
    }

    else {
      console.log("This login page is for reviewers and admins only.")
      response.redirect('/');
    }
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }})

app.get('/home_admin', (request, response) => {
  if (request.session.verify) {
  connection.query(queries.getUsers, function(error, result, fields) {
    console.log(result[0].department_ID)
    response.render('admin', {data: result})})
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get('/manage_user', (request, response) => {
  var data = '';
  if (request.session.verify) {
      connection.query(queries.manageUserDetails, function(error, result, fields) {
        data = result.map(row => ({
          user_ID: row.user_ID,
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_ID: row.department_ID,
          status: row.status
        }));
        response.render('manage_user', {data});
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get('/admin_profile', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.getUserDetails, [request.session.userID], function(error, result, fields) {
    console.log(result[0])
    response.render('admin_profile', {data: result[0]});
  })}
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.post('/logout', (request, response) => {
  const check = request.body.logout;
  if (check) {
    console.log(check)
    connection.query(queries.setOfflineStatus, [request.session.userID]);
    request.session.destroy();
    response.redirect('/');
    console.log('User has logged out.');
  }
})
app.get('/add_user', (request, response) => {
  var userID = ''; 
  var departmentOptions = '';
  connection.query(queries.getLastUserID, function(error, result, fields) {
    userID = (result[0].user_ID + 1) ;
    console.log(userID);  
    connection.query(queries.getDepartmentOptions, function(error, result, fields) {
      departmentOptions = result.map(row => ({
        department_ID: row.department_ID,
        department_Name: row.department_Name
      }))
  
      console.log(departmentOptions);
      console.log("Rendering add user form...")
      response.render('add_user', {userID, departmentOptions});
    });
  });
})
  
app.post('/add_user_request', (request, response) => {
  var email = request.body['contact-email'];
  var password = request.body['contact-password'];
  var lastName = request.body['contact-last-name'];
  var firstName = request.body['contact-first-name'];
  var middleName = request.body['contact-middle-name'];
  var departmentID = request.body.department;
  var position = request.body['contact-position'];
  var role = request.body.role;
  var status = 'Offline'

  connection.query(queries.addUser, [email, password, lastName, firstName, middleName, departmentID, position, role, status], 
    function(error, result, fields) {
      console.log(result);
      console.log('User successfully added.');
      response.redirect('/manage_user');
  });  
})

app.get('/delete_user', (request, response) => {
  var data = '';
  connection.query(queries.manageUserDetails, function(error, result, fields) {
    data = result.map(row => ({
      user_ID: row.user_ID,
      first_Name: row.first_Name,
      middle_Name: row.middle_Name,
      last_Name: row.last_Name,
      department_ID: row.department_ID,
      status: row.status
    }));
    console.log(data);
    response.render('manage_user', {data});
  })
})

app.post('/delete_user_request', (request, response) => {
  var id = request.body['user-id']
  connection.query(queries.deleteUser, [id]);
  console.log('User successfully deleted.');
  response.redirect('/manage_user');
})

  app.get('/edit_user', (request, response) => {
    var departmentOptions = '';
    var data = '';
    connection.query(queries.getDepartmentOptions, function(error, result, fields) {
        departmentOptions = result.map(row => ({
          department_ID: row.department_ID,
          department_Name: row.department_Name
        }))
        connection.query(queries.getUserOptions, function(error, result, fields) {
        data = result.map(row => row.user_ID)
        console.log("Rendering edit user form...")
        response.render('edit_user', {data, departmentOptions});
      });
    });
  })

app.post('/edit_user_request', (request, response) => {
  var id = request.body.user;
  var email = request.body['contact-email'];
  var password = request.body['contact-password'];
  var lastName = request.body['contact-last-name'];
  var firstName = request.body['contact-first-name'];
  var middleName = request.body['contact-middle-name'];
  var departmentID = request.body.department;
  var position = request.body['contact-position'];
  var role = request.body.role;
  var status = request.body.status;

  connection.query(queries.editUser, [email, password, lastName, firstName, middleName, departmentID, position, role, status, id]);
  console.log('User details successfully updated.');
  response.redirect('/manage_user');
})


  
  

