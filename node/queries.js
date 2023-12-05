const verifyCredentials = 'SELECT * FROM user WHERE user_ID = ? AND password = ?';
const verifyUser = 'SELECT * FROM user WHERE user_ID = ?'
const userRole = 'SELECT role FROM user WHERE user_ID = ?'

function checkUser(connection, id){
    return new Promise((resolve, reject) => {
        var sql = verifyUser;
        
        connection.query(sql, [id], function(error, result, fields) {
          resolve(result.length > 0);
        });
      });
}

module.exports = {
    verifyCredentials, 
    verifyUser,
    userRole,
    checkUser,
}

// module.exports.checkUser = checkUser;

// function getUser(id) {
//     if (checkUser(id) ) {
//         const result = db.query('SELECT * FROM user WHERE user_ID = ?', [id]);
//         const rows = result[0];
//         return rows;
//     }
//     else {
//         return "";
//     }   
// }

// function insertUser(user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status) {
//     var sql = 'INSERT INTO user (user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status)' +
//     'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     db.query(sql, [user_ID, email, password, last_Name, first_Name, middle_Name, department_ID, position, status])
//     console.log("User data has been inserted into the database.")
// }

// function deleteUser(id) {
//     var sql = 'DELETE FROM user WHERE user.`user_ID` = ?';
//     db.query(sql, [id]);
//     console.log("User had been deleted from the database.");    
// }

// function checkIfOnline(id) {
//     var sql = 'SELECT user_ID FROM user WHERE user_ID=\'202302\' AND status=\'Online\'';
//     const result = db.query(sql, [id]);
//     return Boolean(result);
// }

// function checkUser(db, id) {
//     var sql = 'SELECT * FROM user WHERE user_ID = ?';
//     db.query(sql, [id], function(error, result, fields) {
//         if (result.length > 0) {
//             return true
//         }
//         else {
//             return false
//         }
//     });
// }

// function checkPassword (id, password) {
//     var sql = 'SELECT user_ID, password FROM user WHERE user_ID = ? AND password = ?';
//     const result = db.query(sql, [id, password]);
//     return Boolean(result);
// }

// function getUserDocuments (id) {
//     var sql = 'SELECT * FROM document_details WHERE user_ID = ?';
//     const result = db.query(sql, [id]);
//     const rows = result[0];
//     return rows;
// }

// function getDocumentLog (doc_ID) {
//     var sql = 'SELECT * FROM document_logs WHERE document_ID = ?';
//     const result = db.query(sql, [doc_ID]);
//     const rows = result[0];
//     return rows;
// }

// function checkReviewer (department_ID, position) {
//     var sql = 'SELECT department_ID, position FROM user WHERE department_ID = ? AND position = ?';
//     const result = db.query(sql, [department_ID, position]);
//     return Boolean(result);
// }

// function getReviewerDocuments (department_ID, position) {
//     if (checkReviewer(department_ID, position)) {
//         var sql = 'SELECT * FROM document_logs WHERE department_ID = ?';
//         const result = db.query(sql, [department_ID])
//         const rows = result[0];
//         return rows;
//     }
    
// }

// module.exports = {
//     getUser, 
//     insertUser,
//     deleteUser,
//     checkIfOnline,
//     checkUser,
//     checkPassword,
//     getUserDocuments,
//     getDocumentLog,
//     checkReviewer,
//     getReviewerDocuments
// }


// console.log(insertUser(2220172, '2220172@slu.edu.ph', '123abc', 'Zapanta', 'Adrienne Marie', 'Banday', 10, 'President', 'online'));
