<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

require_once('functions.php');
require_once('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['file_id'])) {

        $documentID = $_GET['file_id'];


        $documentInfo = getFile($con, $documentID);


        if ($documentInfo !== null) {



            $title = $documentInfo['title'];

            $fileContent = $documentInfo['file'];

            $mime = 'application/pdf';



            header('Content-Type: ' . $mime);

            
            header('Content-Disposition: inline; filename="' . $title . '.pdf"');

            echo $fileContent;
            exit();
        } else {
            echo 'Error retrieving or invalid document information.';
        }
    } else {
        echo 'Invalid file ID.';
    }
} else {
    echo 'Invalid request method.';
}
?>