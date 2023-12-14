<?php

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.html");
    exit();
}

require_once('functions.php');
require_once('db.php');
$userID = $_SESSION['user_id'];

$notifications = countUnreadDocuments($con, $userID);

echo $notifications;
?>