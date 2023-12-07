const verifyCredentials = 'SELECT * FROM user WHERE user_ID = ? AND password = ?';
const verifyUser = 'SELECT * FROM user WHERE user_ID = ?'
const userLogin = 'SELECT user_ID, role, department_ID, status FROM user WHERE user_ID = ?'
const getUsers = 'SELECT departments.department_ID, user.first_Name, user.middle_Name, user.last_Name, user.status '
+ 'FROM user JOIN departments ON user.department_ID = departments.department_ID';
const setOnlineStatus = 'UPDATE user SET status = \'Online\' WHERE user_ID = ?'
const setOfflineStatus = 'UPDATE user SET status = \'Offline\' WHERE user_ID = ?'
const addUser = 'INSERT INTO user (email, password, last_Name, first_Name, middle_Name, department_ID, position, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const deleteUser = 'DELETE FROM user WHERE user.`user_ID` = ?'
const editUser = 'UPDATE user SET email = ?, password = ?, last_Name = ?, first_Name = ?, middle_Name = ?, ' + 
'department_ID = ?, position = ?, role = ?, status = ? WHERE user_ID = ?' ;
const getUserDetails = 'SELECT first_Name, middle_Name, last_Name, email, user_ID FROM user WHERE user_ID = ?'; 
const manageUserDetails = 'SELECT user.user_ID, user.first_Name, user.middle_Name, user.last_Name, departments.department_ID, user.status '
+ 'FROM user JOIN departments ON user.department_ID = departments.department_ID';
const getLastUserID = 'SELECT user_ID FROM user ORDER BY user_ID DESC LIMIT 1';
const getDepartmentOptions = 'SELECT department_ID, department_Name FROM departments';
const getDepartmentID = 'SELECT department_ID FROM departments WHERE department_Name = ?'

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
    userLogin,
    getUsers,
    setOnlineStatus,
    setOfflineStatus,
    addUser,
    deleteUser,
    editUser,
    getUserDetails,
    manageUserDetails,
    getLastUserID,
    getDepartmentOptions,
    getDepartmentID,
    checkUser
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
//     var sql = ;
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
