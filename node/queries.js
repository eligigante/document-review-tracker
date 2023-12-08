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
+ 'FROM user JOIN departments ON user.department_ID = departments.department_ID ORDER BY user.user_ID ASC';
const getLastUserID = 'SELECT user_ID FROM user ORDER BY user_ID DESC LIMIT 1';
const getDepartmentOptions = 'SELECT department_ID, department_Name FROM departments';
const getDepartmentID = 'SELECT department_ID FROM departments WHERE department_Name = ?'
const getUsersAndDepartments = 'SELECT user.user_ID, departments.department_ID, departments.department_Name ' 
+ 'FROM user JOIN departments ON user.department_ID = departments.department_ID';
const getUserOptions = 'SELECT user_ID from user'

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
    getUsersAndDepartments,
    getUserOptions,
    checkUser
}