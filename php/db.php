<?php
$servername = "192.168.1.6";
$username = "root";
$password = "";
$dbname = "document_tracker_db";

$con = new mysqli($servername, $username, $password, $dbname);
// die("Connection successful");
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
?>
