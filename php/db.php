<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "docuhehi";

$con = new mysqli($servername, $username, $password, $dbname);
// die("Connection successful");
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
?>
