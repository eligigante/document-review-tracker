<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.html");
    exit();
}

require_once('functions.php');
require_once('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['file_id']) && isset($_FILES['file'])) {
        $docID = $_POST['file_id'];
        $newFile = $_FILES['file'];

        if ($newFile['error'] === UPLOAD_ERR_OK && is_uploaded_file($newFile['tmp_name'])) {
            $newFileBlob = file_get_contents($newFile['tmp_name']);

            if (updateFile($con, $docID, $_SESSION['user_id'], $newFileBlob)) {
                header("Location: ../ver3/user/doc.php");
                exit();
            } else {
                echo 'update file did not execute';
            }
        } else {
            echo 'file upload error';
        }
    } else {
        echo 'problems with isset';
    }
} else {
    echo 'use post';
}
?>



