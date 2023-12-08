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

            $stmtInsertDocumentDetails = $con->prepare($sqlInsertDocumentDetails);

            if ($stmtInsertDocumentDetails) {
                $stmtInsertDocumentDetails->bind_param("issss", $userID, $fileName, $copies, $dateFormat, $fileContent);
                $stmtInsertDocumentDetails->execute();

            $tempvar = rand();
            $pending = 'Processing';


                    $documentID = $stmtInsertDocumentDetails->insert_id;
                    
                    $sqlInsertDocumentLogs = "INSERT INTO document_logs (document_ID, department_ID, user_ID, referral_Date, review_Date, remarks, received_file, reviewed_file, approved_file, document_status)
                        VALUES (?, 1, ?, ?, null, null, ?, null, null, 'Processing')";

            if ($stmt) {
                $stmt->bind_param("iisisss", $tempvar, $userID, $fileName, $copies,$pending,$dateFormat, $fileContent);
                $stmt->execute();

                    if ($stmtInsertDocumentLogs) {
                        $stmtInsertDocumentLogs->bind_param("iiss", $documentID, $userID, $dateFormat, $fileContent);
                        $stmtInsertDocumentLogs->execute();

                        if ($stmtInsertDocumentLogs->affected_rows > 0) {
                            header("Location: ../ver3/user/doc.php");
                            exit();
                        } else {
                            echo "failed to insert into document_logs " . $con->error;
                        }

                        $stmtInsertDocumentLogs->close();
                    } else {
                        echo "error preparing statement for document_logs " . $con->error;
                    }
                } else {
                    echo "failed to insert " . $con->error;
            
                }

                $stmtInsertDocumentDetails->close();
            } else {
                echo "error " . $con->error;
        
            }
        }
    } else {
        echo "file is null";
    
    }

    exit();
}
}
?>
