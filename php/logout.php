<?php
session_start();

require_once('db.php');
require_once('functions.php');


$userID = $_SESSION['user_id'];


    set_user_offline($con, $userID);



$_SESSION = array();



session_destroy();


header("Location: ../index.html");
exit();
?>