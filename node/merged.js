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
// const { request } = require('http');

const connection = db.connectDatabase(mysql);
db.getConnection(connection);

const app = express();

app.use(session({
    secret : 'document-tracker-key',
    resave : true,
    saveUninitialized : true,
    cookie: {maxAge: 86400000}
  }));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(cookie());
app.use(express.static(path.resolve(__dirname + "/../public")));
app.use("/public", express.static(path.resolve(__dirname, "../public")));
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
  }})

app.get('/verify', function(request, response) {
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
    }})

app.get('/home_admin', (request, response) => {
  if (request.session.verify) {
  connection.query(queries.getUsers, function(error, result, fields) {
    console.log(result)
    console.log("Showing admin home page...")
    response.render('admin', {data: result})})
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get("/sort_users_ascending", (request, response) => {
  if (request.session.verify) {
      connection.query(queries.sortAdminUserAscending, function(error, result, fields) {
        console.log("User data successfully retrieved.")
        response.render('admin', {data: result});
    })
  }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get("/sort_users_descending", (request, response) => {
  if (request.session.verify) {
      connection.query(queries.sortAdminUserDescending, function(error, result, fields) {
        console.log("User data successfully retrieved.")
        response.render('admin', {data: result});
    })
  }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
      }
})

app.get("/filter_users_offline", (request, response) => {
  if (request.session.verify) {
    connection.query(queries.filterByOfflineUsers, function(error, result, fields) {
      console.log("Showing filtered users (offline)...")
      response.render('admin', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
      }
})

app.get("/filter_users_online", (request, response) => {
  if (request.session.verify) {
    connection.query(queries.filterByOnlineUsers, function(error, result, fields) {
      console.log("Showing filtered users (online)...")
      response.render('admin', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
      }
})

app.get("/sort_manage_ascending", (request, response) => {
  var data = '';
  if (request.session.verify) {
      connection.query(queries.sortAdminManageAscending, function(error, result, fields) {
        data = result.map(row => ({
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_Name: row.department_Name,
          role: row.role,
          status: row.status
        }));
        console.log("User data successfully retrieved.")
        response.render('manage_user', {data});
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get("/sort_manage_descending", (request, response) => {
  var data = '';
  if (request.session.verify) {
      connection.query(queries.sortAdminManageDescending, function(error, result, fields) {
        data = result.map(row => ({
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_Name: row.department_Name,
          role: row.role,
          status: row.status
        }));
        console.log("User data successfully retrieved.")
        response.render('manage_user', {data});
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get("/filter_manage_offline", (request, response) => {
  var data = '';
  if (request.session.verify) {
      connection.query(queries.filterManageOfflineUsers, function(error, result, fields) {
        data = result.map(row => ({
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_Name: row.department_Name,
          role: row.role,
          status: row.status
        }));
        console.log("User data successfully retrieved.")
        response.render('manage_user', {data});
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get("/filter_manage_online", (request, response) => {
  var data = '';
  if (request.session.verify) {
      connection.query(queries.filterManageOnlineUsers  , function(error, result, fields) {
        data = result.map(row => ({
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_Name: row.department_Name,
          role: row.role,
          status: row.status
        }));
        console.log("User data successfully retrieved.")
        response.render('manage_user', {data});
    })
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get('/home_reviewer', (request, response) => {
    if (request.session.verify) {
    var departmentID = '';
    connection.query(queries.getDepartmentIDOfUser, [request.session.userID], function(error, result, fields) {
        departmentID = result[0].department_ID;
        connection.query(queries.getPendingDocuments, [departmentID], function(error, result, fields) {
            console.log("Showing reviewer home page...")
            response.render('reviewer', {data: result})})
        })
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
          first_Name: row.first_Name,
          middle_Name: row.middle_Name,
          last_Name: row.last_Name,
          department_Name: row.department_Name,
          role: row.role,
          status: row.status
        }));
        console.log("User data successfully retrieved.")
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
    console.log("Showing admin profile...")
    console.log(result[0]);
    response.render('admin_profile', {data: result[0]});
  })}
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})

app.get('/reviewer_profile', (request, response) => {
    if (request.session.verify) {
      connection.query(queries.getUserDetails, [request.session.userID], function(error, result, fields) {
      console.log("Showing reviewer profile...")
      console.log(result[0]);
      response.render('reviewer_profile', {data: result[0]});
    })}
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
      }
  })

app.get('/my_review', (request, response) => {
    if (request.session.verify) {
        var departmentID = '';
        connection.query(queries.getDepartmentIDOfUser, [request.session.userID], function(error, result, fields) {
            departmentID = result[0].department_ID;
            connection.query(queries.getMyReviewDetails, [request.session.userID], function(error, result, fields) {
                console.log("Showing my review page...")
                response.render('my_review', {data: result})})
            })
        }
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
  if (request.session.verify) {
    var userID = ''; 
    var departmentOptions = '';
    connection.query(queries.getLastUserID, function(error, result, fields) {
      userID = (result[0].user_ID + 1);
      connection.query(queries.getDepartmentOptions, function(error, result, fields) {
        departmentOptions = result.map(row => ({
          department_ID: row.department_ID,
          department_Name: row.department_Name
        }))
    
        console.log("Rendering add user form...");
        response.render('add_user', {userID, departmentOptions});
      });
    });
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})
   
app.post('/add_user_request', (request, response) => {
  if (request.session.verify) {
    var email = request.body['contact-email'];
    var password = request.body['contact-password'];
    var lastName = request.body['contact-last-name'];
    var firstName = request.body['contact-first-name'];
    var middleName = request.body['contact-middle-name'];
    var departmentID = request.body.department;
    var position = request.body['contact-position'];
    var role = request.body.role;
    var status = request.body.status;

    console.log(email, password);

    connection.query(queries.addUser, [email, password, lastName, firstName, middleName, departmentID, position, role, status], 
    function(error, result, fields) {
      console.log('User successfully added.');
      response.redirect('/manage_user');
  });  
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
    }
})
  app.get('/edit_user', (request, response) => {
    if (request.session.verify) {
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
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
      }
  })

app.post('/edit_user_request', (request, response) => {
  if (request.session.verify) {
    var id = request.body.user;
    var email = request.body['contact-email'];
    console.log(email)
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
  }
  else {
    console.log("Please login or logout from your current session.")
    response.redirect('/');
  }
})

app.get("/review_doc", (request, response) => {
    if (request.session.loggedIn && request.session.role === "reviewer") {
  
      connection.query(queries.getReviewerDocuments, [request.session.department_ID], (err, results) => {
        if (err) {
          console.error("Error querying documents:", err);
          throw err;
        }
  
        console.log("Results:", results);
        response.render("review_doc", { data: results });
      });
    } else {
      response.redirect("/");
    }
  });

app.get('/sort_asc_reviewer', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.sortAscReviewer,  [request.session.department_ID], function(error, result, fields) {
      console.log("Showing sorted users (reviewer - A-Z)...")
      console.log(result);
      response.render('reviewer', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/sort_desc_reviewer', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.sortDescReviewer, [request.session.department_ID], function(error, result, fields) {
      console.log("Showing sorted users (reviewer - Z-A)...")
      response.render('reviewer', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/filter_processing_reviewer', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.filterProcessing, [request.session.department_ID], function(error, result, fields) {
      console.log("Showing filtered documents (processing)...")
      response.render('reviewer', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})
  
app.get('/filter_accepted_reviewer', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.filterAccepted, [request.session.department_ID], function(error, result, fields) {
      console.log("Showing filtered documents (accepted)...")
      response.render('reviewer', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/filter_rejected_reviewer', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.filterRejected, [request.session.department_ID], function(error, result, fields) {
      console.log("Showing filtered documents (rejected)...")
      response.render('reviewer', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/my_sort_asc', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.mySortAsc, function(error, result, fields) {
      console.log("Showing sorted users (Oldest) (accepted docs)...")
      response.render('my_review', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/my_sort_desc', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.mySortAsc, function(error, result, fields) {
      console.log("Showing sorted users (Newest) (accepted docs)...")
      response.render('my_review', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/sort_asc_queue', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.sortAscQueue, function(error, result, fields) {
      console.log("Showing sorted users (Oldest) (pending docs)...")
      response.render('review_doc', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get('/sort_desc_queue', (request, response) => {
  if (request.session.verify) {
    connection.query(queries.sortDescQueue, function(error, result, fields) {
      console.log("Showing sorted users (Newest) (pending docs)...")
      response.render('review_doc', {data: result})})
    }
    else {
      console.log("Please login or logout from your current session.")
      response.redirect('/');
    }
})

app.get("/downloadAndConvert/:documentId", (req, res) => {
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
            Buffer.from(blobData, "binary") // Specify binary encoding
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
  });
  
  app.get("/pdfviewer", (request, response) => {
    const filePath = path.join(__dirname, "temp", request.query.filePath);
  
    response.render("pdfviewer", { filePath });
  });
  
  annotationHandler(app);
  
  app.post("/acceptDocument", async (req, res) => {
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
            remarks: null,
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
  
  async function updateAcceptLog(
    documentId,
    departmentId,
    user_ID,
    originalFileData,
    reviewedFilePath,
    filePath,
    referralDate
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        queries.updateAcceptDocumentLog,
        [
          new Date(),
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
  
  function extractDocumentId(filePath) {
    const match = filePath.match(/document_(\d+)\.pdf/);
    return match ? match[1] : null;
  }
  
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
  
  app.post("/rejectDocument", async (req, res) => {
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
  
  async function updateRejectLog(
    documentId,
    departmentId,
    originalFileData,
    filePath,
    referralDate
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        queries.updateRejectDocumentLog,
        [
          new Date(),
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
  
  app.get('/redirect-to-review-doc', (req, res) => {
    res.redirect('/review_doc');
  });
  
  

