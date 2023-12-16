<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "teamang-final";

$con = new mysqli($servername, $username, $password, $dbname);
// die("Connection successful");
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
?>
