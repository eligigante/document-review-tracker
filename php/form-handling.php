<?php
session_start();

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


        
        $fileContent = file_get_contents($tempFilePath);

        if ($fileContent !== null) {


        

            $sql = "INSERT INTO document_details (user_ID, document_Title, copies, upload_Date, file)
                    VALUES (?, ?, ?, ?, ?)";




            $stmt = $con->prepare($sql);





            if ($stmt) {
                $stmt->bind_param("issss", $userID, $fileName, $copies, $dateFormat, $fileContent);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "New record created successfully";
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
?>