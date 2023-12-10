<?php
session_start();

include_once('db.php');

$userID = $_SESSION['user_id'];

$dateNow = new DateTime('now', new DateTimeZone('Asia/Manila'));

$dateFormat = $dateNow->format('Y-m-d');


$newDocumentTitle = $_POST['subject'] ?? "Default Title";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $uploadedFile = $_FILES["img_logo"] ?? null;

    $fileName = "";
    $fileContent = "";
    $copies = 1;

    if ($uploadedFile != null) {
        $fileName = $uploadedFile["name"];

        $tempFilePath = $uploadedFile["tmp_name"];

        $fileContent = file_get_contents($tempFilePath);

        $totalPages = preg_match_all("/\\bPage\\b/", $fileContent, $dummy);

        if ($fileContent !== null) {
    

                $sqlInsertDocumentDetails = "INSERT INTO document_details (user_ID, document_Title, pages, status, upload_Date, file)
                                             VALUES (?, ?, ?,'pending',?, ?)";

                $stmtInsertDocumentDetails = $con->prepare($sqlInsertDocumentDetails);

                if ($stmtInsertDocumentDetails) {
                    $stmtInsertDocumentDetails->bind_param("issss", $userID, $newDocumentTitle, $totalPages, $dateFormat, $fileContent);


                    $stmtInsertDocumentDetails->execute();

                    if ($stmtInsertDocumentDetails->affected_rows > 0) {


                        $documentID = $stmtInsertDocumentDetails->insert_id;

                        $sqlInsertDocumentLogs = "INSERT INTO document_logs (document_ID, department_ID, user_ID, referral_Date, review_Date, remarks, received_file, reviewed_file, approved_file, document_status)
                                                 SELECT ?, d.department_ID, d.user_ID, ?, null, null, ?, null, null, 'Processing'
                                                 FROM departments d
                                                 WHERE d.department_ID = ?";

                        $stmtInsertDocumentLogs = $con->prepare($sqlInsertDocumentLogs);

                        if ($stmtInsertDocumentLogs) {
                            $departmentID = 1; 
                            $stmtInsertDocumentLogs->bind_param("issi", $documentID, $dateFormat, $fileContent, $departmentID);
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
                        echo "failed to insert into document_details " . $con->error;
                    }

                    $stmtInsertDocumentDetails->close();
                } else {
                    echo "error preparing statement for document_details " . $con->error;
                }
            } else {
                echo "error preparing statement for latest document number " . $con->error;
            }
        } else {
            echo "failed to get contents";
        }
    } else {
        echo "file is null";
    }

    exit();

?>