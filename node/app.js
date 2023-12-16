const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const cookie = require('cookie-parser');
const queries = require('./queries');
const server = require('./server');
const db = require('./db');
const fs = require("fs");
const annotationHandler = require("./annotationHandler");
const { request } = require('http');
const moment = require('moment');

const connection = db.connectDatabase(mysql);
db.getConnection(connection);

const app = express();

app.use(session({
  secret: 'document-tracker-key',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(cookie());
app.use(express.static(path.resolve(__dirname + "/../public")));
app.use("/public", express.static(path.resolve(__dirname, "../public")));
app.set('views', path.resolve(__dirname + "/../public/views"))
app.set('view engine', 'ejs');
server.startServer(app);

/*
Created by: Adrienne Zapanta
Description: This is the code section that prevents the browser from caching the pages, thus preventing users from accessing
the pages once they have logged out of the application
*/

function noCache(request, response, next) {
  response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  response.header('Expires', '-1');
  response.header('Pragma', 'no-cache');
  next();
}

/*
Created by: Adrienne Zapanta
Description: This is the code section that checks if the user has an active session; mostly used so that users are not able
to access former webpages that have a query in the URI
*/

const checkAuthentication = (request, response, next) => {
  if (request.session && request.session.verify) {
    next();
  } else {
    response.redirect('/'); 
  }
};

/*
Created by: Adrienne Zapanta
Description: This is the code section that sends the login page to the user
*/

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that verifies if the user is an existing user in the database
*/

app.post('/login', (request, response) => {
  const id = request.body.accountID;
  const password = request.body.password;
  if (id && password) {
    if ((queries.checkUser(connection, id))) {
      connection.query(queries.verifyCredentials, [id, password], function (error, result, fields) {
        if (error) throw error;
        if (result.length > 0) {
          connection.query(queries.userLogin, [id], function (error, result, fields) {
            request.session.userID = result[0].user_ID;
            request.session.role = result[0].role;
            request.session.status = result[0].status;
            request.session.department_ID = result[0].department_ID;
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
  }
})


/*
Created by: Adrienne Zapanta
Description: This is the code section that verifies if the user is either an admin or reviewer, 
and sets their status as online in the database. It will not allow the user to login should they be a user or 
are already online.
*/
app.get('/verify', function (request, response) {
  if (request.session.loggedIn && request.session.status != 'Online') {
    request.session.verify = true;
    console.log('Role:', request.session.role);
    if (request.session.role == 'admin') {
      connection.query(queries.setOnlineStatus, [request.session.userID])
      console.log("User ID:", request.session.userID)
      console.log("Successfully logged in. Welcome back, Admin!");
      response.redirect('/home_admin');
    }

    else if (request.session.role == 'reviewer') {
      connection.query(queries.setOnlineStatus, [request.session.userID])
      console.log("User ID:", request.session.userID)
      console.log("Successfully logged in. Welcome back, Reviewer!")
      response.redirect('/home_reviewer');
    }

    else {
      console.log("This login page is for reviewers and admins only.")
      response.redirect('/');
    }
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the home page for the admin
*/

app.get('/home_admin', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.getUsers, function (error, result, fields) {
      console.log("Showing admin home page...")
      response.render('admin', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that implements the search function in the home admin page
*/

app.get('/search_home_admin', checkAuthentication, noCache, (request, response) => {
  const query = request.query.search;
  const finalQuery = `%${query}%`;
  var sql = '';

  if (query != '') { sql = queries.searchGetUsers; } 
  else { sql = queries.getUsers; }

  connection.query(sql, [finalQuery, finalQuery, finalQuery], (error, result, fields) => {
      response.render('admin', { data: result });
  });
});


/*
Created by: Adrienne Zapanta
Description: This is the code section that implements the search function in the manage user page
*/

app.get('/search_manage',  checkAuthentication, noCache, (request, response) => {
  const query = request.query.manage;
  const finalQuery = `%${query}%`;
  var sql = '';

  if (query != '') { sql = queries.searchManageUser; } 
  else { sql = queries.manageUserDetails; }

  connection.query(sql, [finalQuery, finalQuery, finalQuery, finalQuery], (error, result, fields) => {
    response.render('manage_user', { data: result });
  });
});


/*
Created by: Adrienne Zapanta
Description: This is the code section that implements the search function in the home reviewer page
*/

app.get('/search_home_reviewer', checkAuthentication, noCache, (request, response) => {
  const query = request.query.search;
  const finalQuery = `%${query}%`;
  var sql = '';

  if (query != '') { sql = queries.searchHomeReviewer; } 
  else { sql = queries.getPendingDocuments; }

  connection.query(sql, [request.session.department_ID, finalQuery, finalQuery, finalQuery], (error, result, fields) => {
      console.log(result)
      response.render('reviewer', { data: result });
  });
});


/*
Created by: Adrienne Zapanta
Description: This is the code section that implements the search function in the document queue page
*/

app.get('/search_queue', checkAuthentication, noCache, (request, response) => {
  const query = request.query.search;
  const finalQuery = `%${query}%`;
  var sql = '';

  if (query != '') { sql = queries.searchReviewerDocuments; } 
  else { sql = queries.getReviewerDocuments; }

  connection.query(sql, [request.session.department_ID, finalQuery, finalQuery, finalQuery], (error, result, fields) => {
      console.log(result)
      response.render('review_doc', { data: result });
  });
});


/*
Created by: Adrienne Zapanta
Description: This is the code section that implements the search function in the my review page
*/

app.get('/search_my_review', checkAuthentication, noCache, (request, response) => {
  const query = request.query.search;
  const finalQuery = `%${query}%`;
  var sql = '';

  if (query != '') { sql = queries.searchMyReview; } 
  else { sql = queries.getMyReviewDetails; }

  connection.query(sql, [request.session.department_ID, finalQuery, finalQuery, finalQuery], (error, result, fields) => {
      console.log(result)
      response.render('my_review', { data: result });
  });
});

/*
Created by: Adrienne Zapanta
Description: This is the code section that sorts content of the admin home page alphabetically (A-Z)
*/

app.get("/sort_users_ascending", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.sortAdminUserAscending, function (error, result, fields) {
      console.log("User data successfully retrieved.")
      response.render('admin', { data: result });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that sorts content of the admin home page alphabetically (Z-A)
*/

app.get("/sort_users_descending", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.sortAdminUserDescending, function (error, result, fields) {
      console.log("User data successfully retrieved.")
      response.render('admin', { data: result });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that filter offline users in the admin home page
*/

app.get("/filter_users_offline", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.filterByOfflineUsers, function (error, result, fields) {
      console.log("Showing filtered users (offline)...")
      response.render('admin', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that filter online users in the admin home page
*/

app.get("/filter_users_online", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.filterByOnlineUsers, function (error, result, fields) {
      console.log("Showing filtered users (online)...")
      response.render('admin', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that sorts content of the admin manage user page alphabetically (A-Z)
*/

app.get("/sort_manage_ascending", noCache, (request, response) => {
  var data = '';
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.sortAdminManageAscending, function (error, result, fields) {
      data = result.map(row => ({
        first_Name: row.first_Name,
        middle_Name: row.middle_Name,
        last_Name: row.last_Name,
        department_Name: row.department_Name,
        role: row.role,
        status: row.status
      }));
      console.log("User data successfully retrieved.")
      response.render('manage_user', { data });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that sorts content of the admin manage user page alphabetically (Z-A)
*/

app.get("/sort_manage_descending", noCache, (request, response) => {
  var data = '';
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.sortAdminManageDescending, function (error, result, fields) {
      data = result.map(row => ({
        first_Name: row.first_Name,
        middle_Name: row.middle_Name,
        last_Name: row.last_Name,
        department_Name: row.department_Name,
        role: row.role,
        status: row.status
      }));
      console.log("User data successfully retrieved.")
      response.render('manage_user', { data });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that filter offline users in the admin manage user page
*/

app.get("/filter_manage_offline", noCache, (request, response) => {
  var data = '';
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.filterManageOfflineUsers, function (error, result, fields) {
      data = result.map(row => ({
        first_Name: row.first_Name,
        middle_Name: row.middle_Name,
        last_Name: row.last_Name,
        department_Name: row.department_Name,
        role: row.role,
        status: row.status
      }));
      console.log("User data successfully retrieved.")
      response.render('manage_user', { data });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that filter online users in the admin manage user page
*/

app.get("/filter_manage_online", noCache, (request, response) => {
  var data = '';
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.filterManageOnlineUsers, function (error, result, fields) {
      data = result.map(row => ({
        first_Name: row.first_Name,
        middle_Name: row.middle_Name,
        last_Name: row.last_Name,
        department_Name: row.department_Name,
        role: row.role,
        status: row.status
      }));
      console.log("User data successfully retrieved.")
      response.render('manage_user', { data });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the home page for the reviewer
*/

app.get('/home_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    var departmentID = '';
    connection.query(queries.getDepartmentIDOfUser, [request.session.userID], function (error, result, fields) {
      departmentID = result[0].department_ID;
      connection.query(queries.getPendingDocuments, [departmentID], function (error, result, fields) {
        console.log("Showing reviewer home page...")
        response.render('reviewer', { data: result })
      })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})


/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the manage user page for the admin
*/

app.get('/manage_user', noCache, (request, response) => {
  var data = '';
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.manageUserDetails, function (error, result, fields) {
      data = result.map(row => ({
        first_Name: row.first_Name,
        middle_Name: row.middle_Name,
        last_Name: row.last_Name,
        department_Name: row.department_Name,
        role: row.role,
        status: row.status
      }));
      console.log("User data successfully retrieved.")
      response.render('manage_user', { data });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the manage profile page for the admin
*/

app.get('/admin_profile', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    connection.query(queries.getUserDetails, [request.session.userID], function (error, result, fields) {
      console.log("Showing admin profile...")
      response.render('admin_profile', { data: result[0] });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the manage profile page for the reviewer
*/

app.get('/reviewer_profile', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.getUserDetails, [request.session.userID], function (error, result, fields) {
      console.log("Showing reviewer profile...")
      response.render('reviewer_profile', { data: result[0] });
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This is the code section that renders the my reviews page for the reviewer
*/

app.get('/my_review', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    var departmentID = '';
    connection.query(queries.getDepartmentIDOfUser, [request.session.userID], function (error, result, fields) {
      departmentID = result[0].department_ID;
      connection.query(queries.getMyReviewDetails, [request.session.department_ID], function (error, result, fields) {
        console.log("Showing my review page...")
        response.render('my_review', { data: result })
      })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This log outs the user from the application and sets their status as offline in the database
*/

app.post('/logout', noCache, (request, response) => {
  const check = request.body.logout;
  if (check) {
    console.log(check)
    connection.query(queries.setOfflineStatus, [request.session.userID]);
    request.session.destroy();
    response.redirect('/');
    console.log('User has logged out.');
  }
})

/*
Created by: Adrienne Zapanta
Description: This renders the add user form for the admin
*/

app.get('/add_user', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    var userID = '';
    var departmentOptions = '';
    connection.query(queries.getLastUserID, function (error, result, fields) {
      userID = (result[0].user_ID + 1);
      connection.query(queries.getDepartmentOptions, function (error, result, fields) {
        departmentOptions = result.map(row => ({
          department_ID: row.department_ID,
          department_Name: row.department_Name
        }))

        console.log("Rendering add user form...");
        response.render('add_user', { userID, departmentOptions });
      });
    });
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This processes the add user request and adds the newly created user details in the database
*/

app.post('/add_user_request', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    var email = request.body['contact-email'];
    var password = request.body['contact-password'];
    var lastName = request.body['contact-last-name'];
    var firstName = request.body['contact-first-name'];
    var middleName = request.body['contact-middle-name'];
    var departmentID = request.body.department;
    var position = request.body['contact-position'];
    var role = request.body.role;
    var status = request.body.status;

    if (middleName === null || middleName === '') {
      connection.query(queries.addUser, [email, password, lastName, firstName, null, departmentID, position, role, status],
        function (error, result, fields) {
          console.log('User successfully added (No middle name).');
          response.redirect('/manage_user');
        });
    }
    else {
      connection.query(queries.addUser, [email, password, lastName, firstName, middleName, departmentID, position, role, status],
        function (error, result, fields) {
          console.log('User successfully added.');
          response.redirect('/manage_user');
        });
    }
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This renders the edit user form for the admin
*/

app.get('/edit_user', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
    var departmentOptions = '';
    var data = '';
    connection.query(queries.getDepartmentOptions, function (error, result, fields) {
      departmentOptions = result.map(row => ({
        department_ID: row.department_ID,
        department_Name: row.department_Name
      }))
      connection.query(queries.getUserOptions, function (error, result, fields) {
        data = result.map(row => row.user_ID)
        console.log("Rendering edit user form...")
        response.render('edit_user', { data, departmentOptions });
      });
    });
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This processes the edit user request and updates the current user details in the database
*/

app.post('/edit_user_request', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'admin') {
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

    if (middleName == null || middleName == '') {
      connection.query(queries.editUser, [email, password, lastName, firstName, null, departmentID, position, role, status, id],
        function (error, result, fields) {
          console.log('User details successfully updated (No middle name).');
          response.redirect('/manage_user');
        });
    }
    else {
      connection.query(queries.editUser, [email, password, lastName, firstName, middleName, departmentID, position, role, status, id],
        function (error, result, fields) {
          console.log('User details successfully updated.');
          response.redirect('/manage_user');
        });
    }
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Checks if the user is logged in as a reviewer and will render the view of the reviewer
other will send the user back to the login page.
*/
app.get("/review_doc", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {

    connection.query(queries.getReviewerDocuments, [request.session.department_ID], (err, results) => {
      if (err) {
        console.error("Error querying documents:", err);
        throw err;
      }

      console.log("Results:", results);
      response.render("review_doc", { data: results });
    });
  } else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
});

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the home page of the reviewer from oldest to newest
*/

app.get('/sort_asc_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.sortAscReviewer, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (reviewer - oldest)...")
      console.log(result);
      response.render('reviewer', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the home page of the reviewer from newest to oldest
*/

app.get('/sort_desc_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.sortDescReviewer, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (reviewer - Z-A)...")
      response.render('reviewer', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This filters the content of the home page of the reviewer to only show 'processing' documents
*/

app.get('/filter_processing_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.filterProcessing, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing filtered documents (processing)...")
      response.render('reviewer', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This filters the content of the home page of the reviewer to only show 'accepted' documents
*/

app.get('/filter_accepted_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.filterAccepted, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing filtered documents (accepted)...")
      response.render('reviewer', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This filters the content of the home page of the reviewer to only show 'rejected' documents
*/

app.get('/filter_rejected_reviewer', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.filterRejected, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing filtered documents (rejected)...")
      response.render('reviewer', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the my review page of the reviewer from oldest to newest
*/

app.get('/my_sort_asc', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.mySortAsc, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (Oldest) (accepted docs)...")
      response.render('my_review', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the my review page of the reviewer from newest to oldest
*/

app.get('/my_sort_desc', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.mySortDesc, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (Newest) (accepted docs)...")
      response.render('my_review', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the review queue page of the reviewer from oldest to newest
*/

app.get('/sort_asc_queue', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.sortAscQueue, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (Oldest) (pending docs)...")
      response.render('review_doc', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Adrienne Zapanta
Description: This sorts the content of the review queue page of the reviewer from newest to oldest
*/

app.get('/sort_desc_queue', noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    connection.query(queries.sortDescQueue, [request.session.department_ID], function (error, result, fields) {
      console.log("Showing sorted users (Newest) (pending docs)...")
      response.render('review_doc', { data: result })
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is used to download the blob file from the database and convert to PDF
*/
app.get("/downloadAndConvert/:documentId", noCache, (req, res) => {
  try {
    const documentId = req.params.documentId;
    const departmentID = req.session.department_ID;
    console.log(documentId);

    if (!documentId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    connection.query(queries.getReceivedFile, [documentId, departmentID], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0 || !results[0].received_file) {
        return res
          .status(404)
          .json({ error: "Document not found or not processing" });
      }

      const blobData = results[0].received_file;

      const tempFolderPath = path.resolve(__dirname, "../public/temp");
      if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath);
      }

      const filename = `temp/document_${documentId}.pdf`;
      fs.writeFileSync(
        path.resolve(__dirname, "../public", filename),
        Buffer.from(blobData, "binary")
      );
      console.log(filename);
      res.contentType("application/pdf");
      res.sendFile(path.resolve(__dirname, "../public", filename));
    }
    );
  } catch (error) {
    console.error("Error downloading and converting Blob data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})


/*
Created by: Dominic Gabriel O. Ronquillo
Description: This creates the file path that pdfviewer will render.
*/
app.get("/pdfviewer", noCache, (request, response) => {
  if (request.session.verify && request.session.role === 'reviewer') {
    const filePath = path.join(__dirname, "temp", request.query.filePath);
    response.render("pdfviewer", { filePath });
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
});

annotationHandler(app);

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is the function to accept a document based on the documentID.
Depending on the departmentID this will either pass it to the next department or just update the logs.
*/
app.post("/acceptDocument", noCache, async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const documentId = extractDocumentId(filePath);

  if (!documentId) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  const reviewedFilePath = path.resolve(
    __dirname,
    "../public/temp",
    `document_${documentId}.pdf`
  );

  console.log("Original reviewed path: " + reviewedFilePath);

  try {
    const referralDate = await getReferralDate(documentId);

    const originalFilePath = path.resolve(
      __dirname,
      "../public/temp",
      `document_${documentId}.pdf`
    );

    console.log("Original file path: " + originalFilePath);
    const originalFileData = fs.readFileSync(originalFilePath);

    console.log(originalFileData);

    const departmentId = req.session.department_ID;

    if (departmentId <= 5) {
      const user_ID = await getUserIDFromDepartment(departmentId);

      await updateAcceptLog(
        documentId,
        departmentId,
        user_ID,
        originalFileData,
        reviewedFilePath,
        filePath,
        referralDate
      );

      if (departmentId < 5) {
        const nextDepartmentID = departmentId + 1;
        const nextUser_ID = await getUserIDFromDepartment(nextDepartmentID);

        const nextReviewerDocumentLog = {
          document_ID: documentId,
          department_ID: nextDepartmentID,
          user_ID: nextUser_ID,
          referral_Date: referralDate,
          review_Date: null,
          received_file: originalFileData,
          reviewed_file: null,
          approved_file: null,
          document_status: "processing",
        };

        await insertDocumentLog(nextReviewerDocumentLog);
      } else {
        await updateDocumentStatus(documentId, "finished");
      }
    } else {
      await updateAcceptLog(
        documentId,
        departmentId,
        req.session.user_ID,
        originalFileData,
        null,
        filePath,
        referralDate
      );
    }
    return res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is used to retrieve the userID of a departmentID.
*/
async function getUserIDFromDepartment(departmentId) {
  return new Promise((resolve, reject) => {
    connection.query(
      queries.getUserIDFromDepartment,
      [departmentId],
      (err, result) => {
        if (err) {
          console.error("Error fetching user_ID from departments:", err);
          reject(err);
        } else {
          const user_ID = result[0].user_ID;
          resolve(user_ID);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is used to update the current log to accepted and stores the file to accepted_file.
*/
async function updateAcceptLog(
  documentId,
  departmentId,
  user_ID,
  originalFileData,
  reviewedFilePath,
  filePath,
  referralDate
) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
    }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

  return new Promise((resolve, reject) => {
    connection.query(
      queries.updateAcceptDocumentLog,
      [
        formattedDate,
        originalFileData,
        reviewedFilePath,
        filePath,
        "accepted",
        documentId,
        departmentId,
        user_ID,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating database:", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is used to create a new row in the logs.
*/
function insertDocumentLog(documentLog) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO document_logs SET ?",
      documentLog,
      (err, result) => {
        if (err) {
          console.error("Error updating database:", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This extracts a document ID depending on the naming pattern set. 
This either returns a documentID or null.
*/
function extractDocumentId(filePath) {
  const match = filePath.match(/document_(\d+)\.pdf/);
  return match ? match[1] : null;
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is used to get the upload date in the logs.
*/
function getReferralDate(documentId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT upload_Date FROM document_details WHERE document_ID = ?",
      [documentId],
      (err, result) => {
        if (err || result.length === 0) {
          console.error("Error fetching referral date:", err);
          reject(err);
        } else {
          resolve(result[0].upload_Date);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This rejects a document based on the documentID and sends it back to the user.
*/
app.post("/rejectDocument", noCache, async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const documentId = extractDocumentId(filePath);

  if (!documentId) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  const originalFilePath = path.resolve(
    __dirname,
    "../public/temp",
    `document_${documentId}.pdf`
  );

  try {
    const referralDate = await getReferralDate(documentId);

    const originalFileData = fs.readFileSync(originalFilePath);

    const departmentId = req.session.department_ID;

    if (departmentId < 5) {
      await updateRejectLog(
        documentId,
        departmentId,
        originalFileData,
        filePath,
        referralDate
      );
    } else {
      await updateDocumentStatus(documentId, "finished");
    }
    updateDocumentStatus(documentId, "rejected");
    return res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This updates the current log to rejected and stores the file in returned_file.
*/
async function updateRejectLog(
  documentId,
  departmentId,
  originalFileData,
  filePath,
  referralDate
) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
    }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

  return new Promise((resolve, reject) => {
    connection.query(
      queries.updateRejectDocumentLog,
      [
        formattedDate,
        originalFileData,
        filePath,
        originalFileData,
        "rejected",
        documentId,
        departmentId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating database:", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This updates the document status to pending, denied, or finished.
*/
async function updateDocumentStatus(documentId, status) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE document_details SET status = ? WHERE document_ID = ?",
      [status, documentId],
      (err, result) => {
        if (err) {
          console.error("Error updating document status:", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This redirects the user back to the review page.
*/
app.get('/redirect-to-review-doc', noCache, (req, res) => {
  res.redirect('/review_doc');
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This function updates the remarks in the document_logs.
*/
async function updateRemarks(documentId, departmentId, remarks) {
  return new Promise((resolve, reject) => {
    const updateQuery = "UPDATE document_logs SET remarks = ? WHERE document_ID = ? AND department_ID = ?";
    const params = [remarks || null, documentId, departmentId];

    connection.query(updateQuery, params, (err, result) => {
      if (err) {
        console.error("Error updating remarks:", err);
        reject(err);
      } else {
        console.log('Remarks updated successfully:', result);
        resolve(result);
      }
    });
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This adds a remark in the document_logs.
*/
app.post('/submitRemarks', noCache, async (req, res) => {
  try {
    const { filePath, remarks } = req.body;
    const departmentId = req.session.department_ID;

    const documentId = extractDocumentId(filePath);

    console.log("Submitting remarks for document: ", documentId);
    const nextDepartmentID = departmentId + 1;

    console.log(nextDepartmentID);
    console.log(remarks);

    await updateRemarks(documentId, nextDepartmentID, remarks);

    res.status(200).json({ message: 'Remarks updated successfully!' });
  } catch (error) {
    console.error('Error handling submitRemarks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This retrieves the remarks.
*/
app.post('/retrieveRemarks', noCache, async (req, res) => {
  try {
    const { filePath } = req.body;

    const documentId = extractDocumentId(filePath);
    const departmentId = req.session.department_ID;

    console.log("Retrieving from document: " + documentId)
    console.log("Retrieving from department: " + departmentId)

    const result = await retrieveRemarksFromDatabase(documentId, departmentId);

    res.status(200).json({ remarks: result.remarks || null });
  } catch (error) {
    console.error('Error retrieving remarks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This is the query function that retrieves from the database.
*/
async function retrieveRemarksFromDatabase(documentId, departmentId) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT remarks FROM document_logs WHERE document_ID = ? AND department_ID = ?',
      [documentId, departmentId],
      (err, results) => {
        if (err) {
          console.error('Error retrieving remarks from the database:', err);
          reject(err);
        } else {
          if (results.length > 0) {
            resolve({ remarks: results[0].remarks });
          } else {
            resolve({ remarks: null });
          }
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This checks if a document is reviewable
*/
app.post('/checkIfReviewable', noCache, async (req, res) => {
  try {
    const { documentId } = req.body;
    const departmentId = req.session.department_ID;
    const referralDate = await getReferralDateFromLogs(documentId, departmentId);
    const isReviewable = !(await hasPendingDocumentsBefore(referralDate, departmentId));


    res.status(200).json({ isReviewable });
  } catch (error) {
    console.error('Error checking if document is reviewable:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Retrieves referral_Date from details_logs.
*/
function getReferralDateFromLogs(documentId, departmentId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT referral_Date FROM document_logs WHERE document_ID = ? AND department_ID = ?",
      [documentId, departmentId],
      (err, result) => {
        if (err || result.length === 0) {
          console.error("Error fetching referral date:", err);
          reject(err);
        } else {
          resolve(result[0].referral_Date);
        }
      }
    );
  });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Compares referral dates to determine which document can be reviewed first.
*/
async function hasPendingDocumentsBefore(referralDate, departmentId) {
  return new Promise((resolve, reject) => {
    console.log("Orginal date: " + referralDate)
    console.log(departmentId)
    const formattedReferralDate = moment(referralDate).format('YYYY-MM-DD HH:mm:ss');
    console.log('Received referral date:', formattedReferralDate);
    const query = 'SELECT COUNT(*) AS count FROM document_logs WHERE referral_Date < ? AND document_status = "processing" AND department_ID = ? ORDER BY referral_Date ASC';

    connection.query(
      query,
      [formattedReferralDate, departmentId],
      (err, results) => {
        if (err) {
          console.error('Error checking for pending documents:', err);
          reject(err);
        } else {
          console.log('Raw SQL Query:', connection.format(query, [formattedReferralDate], departmentId));
          console.log('SQL Query Results:', results);
          console.log('SQL Query:', query);
          console.log('Query Parameters:', [formattedReferralDate], departmentId);
          const count = results[0].count;
          console.log(count);
          resolve(count > 0);
        }
      }
    );
  });
}
