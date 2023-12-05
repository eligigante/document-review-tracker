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
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.resolve(__dirname, "../public")));
app.set('views', path.resolve(__dirname + "/../public/views"))
app.set('view engine', 'ejs');
server.startServer(app);

app.get("/pdfviewer", function (req, res) {
  res.sendFile(path.resolve(__dirname, "/../public/pdfviewer.html"));
});

app.get('/', function(request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

const tempFolderPath = path.resolve(__dirname, "../temp");
if (!fs.existsSync(tempFolderPath)) {
  fs.mkdirSync(tempFolderPath);
}

app.post("/login", (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;
  if (id && password) {
    if (queries.checkUser(connection, id)) {
      connection.query(
        queries.verifyCredentials,
        [id, password],
        function (err, result, fields) {
          if (err) throw err;
          if (result.length > 0) {
            connection.query(
              queries.userLogin,
              [id],
              function (err, result, fields) {
                request.session.role = result[0].role;
                request.session.loggedIn = true;
                console.log("Successfully logged in.");
                response.redirect("/home");
              }
            );
          } else {
            console.log("Incorrect password.");
            response.redirect("/");
          }
        }
      );
    } else {
      console.log("User does not exist.");
      response.redirect("/");
    }
  }
});

app.get("/home", function (request, response) {
  if (request.session.loggedIn) {
    console.log("Role:", request.session.role);
    if (request.session.role == "admin") {
      response.sendFile(path.resolve(__dirname + "/../public/admin.html"));
      console.log("Welcome back, Admin!");
    } else if (request.session.role == "reviewer") {
      response.sendFile(path.resolve(__dirname + "/../public/reviewer.html"));
      console.log("Welcome back, Reviewer!");
    } else {
      console.log("This login page is for reviewers and admins only.");
      response.redirect("/");
    }
  } else {
    console.log("Please login.");
    response.redirect("/");
  }
});

app.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

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
