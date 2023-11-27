const server = require('./server');
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const cookie = require('cookie-parser');
const { request } = require('http');

const connection = db.connectDatabase();
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
app.use(express.static(path.dirname('public')));

app.get('/', function(request, response) {
  response.sendFile(path.basename('public/index.html'))
})

app.post('/login', (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;

  if (id, password) {
    const check = db.checkUser(id);
    if (check) {
      connection.query(db.verifyCredentials, [id, [password], function(err, result, fields) {
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
      }])
    }
    else {
      console.log("User does not exist.");
      response.redirect('/');
    }
  }
})

app.get('/home', function(request, response) {
  if (request.session.loggedIn) {
    response.sendFile(path.basename('public/home.html'));
    console.log("Welcome back, User!")
    response.end();
  }
  else {
    console.log("Please login.")
    response.redirect('/');
    response.end();
  }
})

server.startServer(app);


  // if (id, password) {
  //   connection.query(db.verifyUser, [id], function(err, result, fields) {
  //     if (err) throw err;
  //     if (result.length > 0) {
  //       request.session.loggedin = true;
  //       request.session.username = username;
  //       console.log ("User Exists");
  //     } 
  //     else {
  //       console.log ("User does not exist")
  //     }
  //   })
  // }
//   if
// }))


// app.get('/', function(request, response) {
//     response.sendFile('/document-review-tracker-main/ver3/user/index.php');
// });

// app.post('/auth', function(request, response) {

//   let username = request.body.username;
//   let password = request.body.password;

//   if (username && password) {
//     var sql = 'SELECT user_ID, password FROM user WHERE user_ID = ? AND password = ?';
//     const result = db.query(sql, [username, password], function(error, results, fields) {
//       if (error) throw error;
//             if (results.length > 0) {
//                 request.session.loggedin = true;
//                 request.session.username = username;
//                 response.redirect('/home');
//             } else {
//                 response.send('Incorrect Username and/or Password!');
//             }           
//             response.end();
//     });
//     } else {
//         response.send('Please enter Username and Password!');
//         response.end();
//     }
// });


//  app.listen('8001', () => {
//         console.log('Server has connected to port 8001');
//     })





