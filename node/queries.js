const verifyCredentials = "SELECT * FROM user WHERE user_ID = ? AND password = ?";
const verifyUser = "SELECT * FROM user WHERE user_ID = ?";
const userLogin = "SELECT user_ID, role, department_ID, status FROM user WHERE user_ID = ?";
const getUsers =
  "SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, user.status " +
  "FROM user JOIN departments ON user.department_ID = departments.department_ID";
const setOnlineStatus = "UPDATE user SET status = 'Online' WHERE user_ID = ?";
const setOfflineStatus = "UPDATE user SET status = 'Offline' WHERE user_ID = ?";
const addUser =
  'INSERT INTO user (email, password, last_Name, first_Name, middle_Name, department_ID, position, role, status) ' 
+ 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const deleteUser = "DELETE FROM user WHERE user.`user_ID` = ?";
const editUser = "UPDATE user SET email = ?, password = ?, last_Name = ?, first_Name = ?, middle_Name = ?, " +
"department_ID = ?, position = ?, role = ?, status = ? WHERE user_ID = ?";
const getUserDetails = "SELECT user.user_ID, departments.department_ID, user.first_Name, user.middle_Name, user.last_Name, user.email, departments.department_Name, user.position, user.role FROM user JOIN departments ON user.department_ID = departments.department_ID WHERE user.user_ID = ?"
const manageUserDetails =
  "SELECT user.first_Name, user.middle_Name, user.last_Name, departments.department_Name, user.role, user.status " 
+ "FROM user JOIN departments ON user.department_ID = departments.department_ID ORDER BY user.user_ID ASC";
const getLastUserID = "SELECT user_ID FROM user ORDER BY user_ID DESC LIMIT 1";
const getDepartmentOptions = "SELECT department_ID, department_Name FROM departments";
const getDepartmentID = "SELECT department_ID FROM departments WHERE department_Name = ?";
const getUsersAndDepartments = "SELECT user.user_ID, departments.department_ID, departments.department_Name " 
+ "FROM user JOIN departments ON user.department_ID = departments.department_ID";
const getUserOptions = "SELECT user_ID from user ORDER BY user_ID ASC";
const getReviewerDocuments = 'SELECT user.first_Name, user.middle_Name, user.last_Name, document_details.document_Title, '
+ 'document_details.pages, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'document_logs.document_status, document_details.document_ID FROM user JOIN '
+ 'document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.document_status = \'processing\' '
+ 'AND document_logs.department_ID = ?'
const getReceivedFile = "SELECT received_file FROM document_logs WHERE document_ID = ? AND department_ID = ? AND document_status = 'processing'";
const getUserIDFromDepartment = "SELECT user_ID FROM departments WHERE department_ID = ?";
const updateAcceptDocumentLog =
  "UPDATE document_logs SET review_Date = ?, received_file = ?, reviewed_file = ?, approved_file = ?, " +
  "document_status = ? WHERE document_ID = ? AND department_ID = ?";
const updateRejectDocumentLog =
  "UPDATE document_logs SET review_Date = ?, received_file = ?, reviewed_file = ?, " +
  "returned_file = ?, document_status = ? WHERE document_ID = ? AND department_ID = ?";
const getPendingDocuments = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ?'
const getDepartmentIDOfUser = 'SELECT department_ID FROM user WHERE user_ID = ?'
const getMyReviewDetails = 'SELECT user.last_Name, user.first_Name, user.middle_Name, document_details.document_Title, '
+ 'DATE_FORMAT(document_logs.review_Date, \'%Y-%m-%d\') AS review_Date, '
+ 'document_logs.department_ID, document_logs.document_status FROM user JOIN document_details ON '
+ 'user.user_ID = document_details.user_ID JOIN document_logs ON document_details.document_ID = document_logs.document_ID '
+ 'WHERE document_logs.department_ID = ? AND document_logs.document_status = \'accepted\'';
const sortAdminUserAscending = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.status FROM user JOIN departments ON user.department_ID = departments.department_ID ORDER BY user.last_Name ASC';
const sortAdminUserDescending = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.status FROM user JOIN departments ON user.department_ID = departments.department_ID  ORDER BY user.last_Name DESC';
const filterByOfflineUsers = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.status FROM user JOIN departments ON user.department_ID = departments.department_ID WHERE user.status = \'Offline\''
const filterByOnlineUsers = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.status FROM user JOIN departments ON user.department_ID = departments.department_ID WHERE user.status = \'Online\''
const sortAdminManageAscending = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.role, user.status FROM user JOIN departments ON user.department_ID = departments.department_ID ORDER BY user.last_Name ASC';
const sortAdminManageDescending = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.role, user.status FROM user JOIN departments ON user.department_ID = departments.department_ID ORDER BY user.last_Name DESC';
const filterManageOfflineUsers = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.role  , user.status FROM user JOIN departments ON user.department_ID = departments.department_ID WHERE user.status = \'Offline\''
const filterManageOnlineUsers = 'SELECT departments.department_Name, user.first_Name, user.middle_Name, user.last_Name, '
+ 'user.role, user.status FROM user JOIN departments ON user.department_ID = departments.department_ID WHERE user.status = \'Online\''
const sortAscReviewer = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ? ORDER BY document_logs.referral_Date ASC';
const sortDescReviewer = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ? ORDER BY document_logs.referral_Date DESC';
const filterProcessing = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ? AND '
+ 'document_logs.document_status = \'processing\'';
const filterAccepted = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ? AND '
+ 'document_logs.document_status = \'accepted\'';
const filterRejected = 'SELECT document_details.document_Title, document_details.document_ID, user.last_Name, user.first_Name, '
+ 'user.middle_Name, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'DATE_FORMAT(document_details.upload_Date, \'%Y-%m-%d\') AS upload_Date, document_logs.document_status FROM user '
+ 'JOIN document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.department_ID = ? AND '
+ 'document_logs.document_status = \'rejected\'';
const mySortAsc = 'SELECT user.last_Name, user.first_Name, user.middle_Name, document_details.document_Title, '
+ 'DATE_FORMAT(document_logs.review_Date, \'%Y-%m-%d\') AS review_Date, '
+ 'document_logs.department_ID, document_logs.document_status FROM user JOIN document_details ON '
+ 'user.user_ID = document_details.user_ID JOIN document_logs ON document_details.document_ID = document_logs.document_ID '
+ 'WHERE document_logs.department_ID = ? AND document_logs.document_status = \'accepted\' ORDER BY document_logs.review_Date ASC';
const mySortDesc = `
  SELECT
    user.last_Name,
    user.first_Name,
    user.middle_Name,
    document_details.document_Title,
    DATE_FORMAT(document_logs.review_Date, '%Y-%m-%d') AS review_Date,
    document_logs.department_ID,
    document_logs.document_status
  FROM
    user
  JOIN
    document_details ON user.user_ID = document_details.user_ID
  JOIN
    document_logs ON document_details.document_ID = document_logs.document_ID
  WHERE
    document_logs.department_ID = ? AND document_logs.document_status = 'accepted'
  ORDER BY
    review_Date DESC
`;
const sortAscQueue = 'SELECT user.first_Name, user.middle_Name, user.last_Name, document_details.document_Title, '
+ 'document_details.pages, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'document_logs.document_status, document_details.document_ID FROM user JOIN '
+ 'document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.document_status = \'processing\' '
+ 'AND document_logs.department_ID = ? ORDER BY document_logs.referral_Date ASC'
const sortDescQueue = 'SELECT user.first_Name, user.middle_Name, user.last_Name, document_details.document_Title, '
+ 'document_details.pages, DATE_FORMAT(document_logs.referral_Date, \'%Y-%m-%d\') AS referral_Date, '
+ 'document_logs.document_status, document_details.document_ID FROM user JOIN '
+ 'document_details ON user.user_ID = document_details.user_ID JOIN document_logs ON '
+ 'document_details.document_ID = document_logs.document_ID WHERE document_logs.document_status = \'processing\' '
+ 'AND document_logs.department_ID = ? ORDER BY document_logs.referral_Date DESC'


function checkUser(connection, id) {
  return new Promise((resolve, reject) => {
    var sql = verifyUser;

    connection.query(sql, [id], function (error, result, fields) {
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
  getReviewerDocuments,
  getReceivedFile,
  updateAcceptDocumentLog,
  updateRejectDocumentLog,
  getPendingDocuments,
  getDepartmentIDOfUser,
  getMyReviewDetails,
  sortAdminUserAscending, 
  sortAdminUserDescending,
  filterByOfflineUsers,
  filterByOnlineUsers,
  getUserIDFromDepartment,
  sortAdminManageAscending,
  sortAdminManageDescending,
  filterManageOfflineUsers,
  filterManageOnlineUsers,
  sortAscReviewer,
  sortDescReviewer,
  filterProcessing,
  filterAccepted,
  filterRejected,
  mySortAsc,
  mySortDesc,
  sortAscQueue,
  sortDescQueue,
  checkUser
};
