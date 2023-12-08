<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);


include_once('db.php');

$userID = $_SESSION['user_id'];

$dateNow = new DateTime('now', new DateTimeZone('Asia/Manila'));
$dateFormat = $dateNow->format('Y-m-d');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $uploadedFile = $_FILES["img_logo"] ?? null;
    $fileName = "";
    $fileContent = "";
    $copies = "ewan ko pano kunin";

    if ($uploadedFile != null) {
        $fileName = $uploadedFile["name"];
        $tempFilePath = $uploadedFile["tmp_name"];


     

        $pdf = ['application/pdf'];
        $fileType = mime_content_type($tempFilePath);



        if (in_array($fileType, $pdf)) {
            $fileContent = base64_encode(file_get_contents($tempFilePath));




        if ($fileContent !== null) {


            $sql = "INSERT INTO document_details (document_ID, user_ID, document_Title, pages, status, upload_Date, file)
                    VALUES (?,?,?,?,?,?,?)";


            $stmt = $con->prepare($sql);

            $tempvar = rand();
            $pending = 'Processing';



            if ($stmt) {
                $stmt->bind_param("iisisss", $tempvar, $userID, $fileName, $copies,$pending,$dateFormat, $fileContent);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {

            
                    header("Location: ../ver3/user/doc.php");
                    exit();

                } else {
                    echo "failed to insert " . $con->error;
            
                }
                $stmt->close();
            } else {
                echo "error " . $con->error;
        
            }
        } else {
            echo "failed to get contents";
          
        }
    } else {
        echo "file is null";
    
    }

    exit();
}
}
?>