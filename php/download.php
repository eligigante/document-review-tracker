<?php
ob_start();

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

require_once('functions.php');

require_once('db.php');

if (isset($_GET['file_id'])) {

    $fileID = $_GET['file_id'];


    $fileInfo = getFile($con, $fileID);


    if ($fileInfo) {
        $fileName = $fileInfo['title'];
        $fileData = $fileInfo['file'];
        
        echo "Debugging: Before headers";
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');

        ob_end_flush(); 
        
        echo $fileData;
        exit();
    } else {
        echo 'File not found.';
    }
} else {
    echo 'Invalid request.';
}
?>