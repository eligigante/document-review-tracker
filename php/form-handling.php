<?php
session_start();


include_once('db.php');

$userID = $_SESSION['user_id'];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
 
    $firstName = $_POST["firstname"] ?? "";
    $lastName = $_POST["lastname"] ?? "";
    $department = $_POST["department"] ?? "";
    $subject = $_POST["subject"] ?? "";

  
    $uploadedFile = $_FILES["img_logo"] ?? null;
    $fileName = "";
    if ($uploadedFile) {
        $fileName = $uploadedFile["name"];
        $tempFilePath = $uploadedFile["tmp_name"];
        $targetDirectory = "storage/";

        $targetFilePath = $targetDirectory . $fileName;
        if (move_uploaded_file($tempFilePath, $targetFilePath)) {

            $sql = "INSERT INTO document_details (user_ID, document_Title, copies, remarks, file)
            VALUES ('$userID', '$subject', 'number_of_copies', '$subject', '$fileName')";

        if ($con->query($sql) === TRUE) {
            echo "New record created successfully";


        }else{

            echo "error: " . $sql . "<br>" . $con->error;
        }


        } else {
        
            echo "error uploading.";
        }
    }


    exit();
}
?>