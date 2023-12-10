<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once('db.php');
require_once('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['submit'])) {
        $accountID = $_POST['accountID'];
        $password = $_POST['password'];

        $user = check_login($con, $accountID, $password);

        if ($user) {
            $_SESSION['user_id'] = $user['user_ID'];
            header("Location: ../ver3/user/doc.php");
            exit();
        } else {
            echo "<script>alert('Invalid credentials'); window.location.href = '../index.html';</script>";
            exit();
        }
    }
}

?>