const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const cookie = require('cookie-parser');
const queries = require('./queries');
const server = require('./server');
const db = require('./db');
const { request } = require('http');
const fs = require("fs");
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

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
app.use(express.static(path.resolve(__dirname, "../public")));
app.set('views', path.resolve(__dirname + "/../public/views"))
app.set('view engine', 'ejs');
server.startServer(app);

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

const tempFolderPath = path.resolve(__dirname, "../temp");
if (!fs.existsSync(tempFolderPath)) {
  fs.mkdirSync(tempFolderPath);
}

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
    console.log('Role:', request.session.role);
    if (request.session.role == 'admin') {
    console.log(request.session.userID);
    connection.query(queries.setOnlineStatus, [request.session.userID])
    // response.sendFile(path.resolve(__dirname + '/../public/admin.html'));
    console.log("Successfully logged in. Welcome back, Admin!");
    response.redirect('/home_admin');
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
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }})

app.get('/home_admin', (request, response) => {
  connection.query(queries.getUsers, function(error, result, fields) {
    console.log(result[0].department_ID)
    response.render('admin', {data: result})})
  })

app.get('/manage_user', (request, response) => {
  // connection.query(queries.verifyUser, [request.session.userID], function(error, result, fields) {
  //   console.log(result);
  // })
  response.render('manage_user');
})

app.get('/admin_profile', (request, response) => {
  connection.query(queries.getUserDetails, [request.session.userID], function(error, result, fields) {
    console.log(result[0])
    response.render('admin_profile', {data: result[0]});
  })
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

app.post('/add_user', (request, response) => {
  var id = request.session.userID;
  var email = request.body.email;
  var password = request.body.password;
  var lastName = request.body.lastName;
  var firstName = request.body.firstName;
  var middleName = request.body.middleName;
  var departmentID = request.body.departmentID;
  var position = request.body.position;
  var role = request.body.role;
  var status = request.body.status;

  connection.query(queries.addUser, [id, email, password, lastName, firstName, middleName, departmentID, position, role, status]);
  console.log('User successfully added.');
  response.redirect('/manage_user');
})

app.post('/delete_user', (request, response) => {
  connection.query(queries.deleteUser, [id]);
  console.log('User successfully deleted.');
  response.redirect('/manage_user');
})

app.post('/edit_user', (request, response) => {
  var id = request.session.userID;
  var email = request.body.email;
  var password = request.body.password;
  var lastName = request.body.lastName;
  var firstName = request.body.firstName;
  var middleName = request.body.middleName;
  var departmentID = request.body.departmentID;
  var position = request.body.position;
  var role = request.body.role;
  var status = request.body.status;

  connection.query(queries.editUser, [id, email, password, lastName, firstName, middleName, departmentID, position, role, status]);
  console.log('User details successfully updated.');
  response.redirect('/manage_user');
})

app.get("/review_doc", (request, response) => {
  if (request.session.loggedIn && request.session.role === "reviewer") {
    connection.query(
      "SELECT document_ID, user_ID, document_Title, copies, upload_Date, file FROM document_details",
      (err, results) => {
        if (err) throw err;
        response.render("review_doc", { data: results });
      }
    );
  } else {
    response.redirect("/");
  }
});

app.get("/pdfviewer", function (req, res) {
  res.sendFile(path.resolve(__dirname + "../public/pdfviewer.html"));
  console.log(path.resolve(__dirname, "../public/pdfviewer.html"));
});

app.get("/downloadAndConvert/:documentId", (req, res) => {
  try {
    const documentId = req.params.documentId;

    if (!documentId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    connection.query(
      "SELECT file FROM document_details WHERE document_ID = ?",
      [documentId],
      (err, results) => {
        if (err) throw err;

        const blobData = results[0].file;

        const filename = `../temp/document_${documentId}.pdf`;
        fs.writeFileSync(filename, Buffer.from(blobData));

        res.contentType("application/pdf");
        res.sendFile(path.resolve(__dirname, filename));
      }
    );
  } catch (error) {
    console.error("Error downloading and converting Blob data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




  
  

