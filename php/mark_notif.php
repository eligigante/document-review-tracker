<?php
session_start();
require_once('db.php');
require_once('functions.php');

if (isset($_SESSION['user_id'])) {
    $userID = $_SESSION['user_id'];

    updateDocumentLogs($userID, $con);

} else {
    echo "error";
}
?>