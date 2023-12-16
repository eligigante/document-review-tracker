<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.html");
    exit();
}

require_once('functions.php');
require_once('db.php');
$userID = $_SESSION['user_id'];
$notifications = documentNotif($con, $userID);
$notifArr = json_decode($notifications, true);

if ($notifArr !== null) {
    foreach ($notifArr as $notification) {
        echo '<div class="notify_item">';
        echo '<div class="notify_info">';
        echo '<p>Document ID: ' . $notification['documentID'] . ' is now at: ' . $notification['departmentName'] . '.</p>';
        echo '</div>';
        echo '</div>';
    }
} else {
    echo "Error showing notifs";
}
?>