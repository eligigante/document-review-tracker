const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const cookie = require("cookie-parser");
const queries = require("./queries");
const server = require("./server");
const db = require("./db");
const fs = require("fs");
const annotationHandler = require("./annotationHandler");

const connection = db.connectDatabase(mysql);
db.getConnection(connection);

const app = express();

app.use(
  session({
    secret: "document-tracker-key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 86400 },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/public", express.static(path.resolve(__dirname, "../public")));
app.set("views", path.resolve(__dirname + "/../public/views"));
app.set("view engine", "ejs");
server.startServer(app);

app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname + "/../public/index.html"));
});

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
                const user = result[0];

                request.session.user_ID = user.user_ID;
                request.session.role = user.role;
                request.session.loggedIn = true;
                request.session.department_ID = user.department_ID;

                console.log("Successfully logged in.");
                console.log("Session:", request.session);
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
      const departmentID = request.session.department_ID;

      connection.query(queries.getReviewerDocuments, [departmentID], (err, results) => {
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

      if (departmentId < 5) {
        const reviewedFilePath = path.resolve(
          __dirname,
          "../public/temp",
          `document_${documentId}.pdf`
        );
        await updateAcceptLog(
          documentId,
          departmentId,
          originalFileData,
          reviewedFilePath,
          filePath,
          referralDate
        );
      } else {
        await updateDocumentStatus(documentId, "Finished");
      }

      if (departmentId < 5) {
        const nextDepartmentID = departmentId + 1;
        const nextReviewerDocumentLog = {
          document_ID: documentId,
          department_ID: nextDepartmentID,
          user_ID: req.session.user_ID,
          referral_Date: referralDate,
          review_Date: null,
          remarks: null,
          received_file: originalFileData,
          reviewed_file: null,
          approved_file: null,
          document_status: "Processing",
        };

        await insertDocumentLog(nextReviewerDocumentLog);
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  async function updateAcceptLog(
    documentId,
    departmentId,
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
        await updateDocumentStatus(documentId, "Finished");
      }

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
          filePath,
          null,
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
