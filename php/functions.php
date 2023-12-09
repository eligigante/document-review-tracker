<?php

include_once('db.php');



function check_login($con, $accountID, $password){

    $query = "SELECT * FROM user WHERE user_ID = '$accountID' AND password = '$password' ";
    $result = mysqli_query($con, $query);

    if ($result && mysqli_num_rows($result) > 0) {
      
        return mysqli_fetch_assoc($result);
    } else {
     
    return null;
      
    }
}

function get_name($con, $accountID) {
    $query = "SELECT last_Name, first_Name, middle_Name, email, user_ID FROM user WHERE user_ID = ?";

    
    if ($stmt = mysqli_prepare($con, $query)) {
       
        mysqli_stmt_bind_param($stmt, "s", $accountID);

     
        mysqli_stmt_execute($stmt);



      
        mysqli_stmt_bind_result($stmt, $last_Name, $first_Name, $middle_Name, $email, $user_ID);

   
        mysqli_stmt_fetch($stmt);


        
        mysqli_stmt_close($stmt);




        
        return array(
            "first_Name" => $first_Name,
            "last_Name" => $last_Name,
            "middle_Name" => $middle_Name,
            "email" => $email,
            "ID" => $user_ID
        );
    } else {
       
        return null;
    }

   
}

function get_docs($con, $accountID){

    $query = "SELECT document_details.document_ID, document_details.document_Title, document_details.upload_Date, document_details.status, document_logs.department_ID, departments.department_Name FROM document_details
    JOIN document_logs ON document_details.document_ID = document_logs.document_ID
    JOIN departments ON document_logs.department_ID = departments.department_ID
    WHERE document_details.user_ID = ?";
      
    if ($stmt = mysqli_prepare($con, $query)) {
   
    mysqli_stmt_bind_param($stmt, "s", $accountID);

 
    mysqli_stmt_execute($stmt);



    mysqli_stmt_bind_result($stmt, $document_ID, $document_Title, $upload_Date,$status, $department_ID, $department);

    $documents = array();


    while (mysqli_stmt_fetch($stmt)) {
        $documents[] = array(
            "docID" => $document_ID,
            "title" => $document_Title,
            "uploadDate" => $upload_Date,
            "status" => $status,
            "department" => $department_ID,
            "depName" => $department
      
        );
    }

    
    mysqli_stmt_close($stmt);

    return json_encode($documents);
} else {
   
    return null;


}
}




function get_recent($con, $accountID){

    $query = "SELECT document_ID, document_Title, upload_Date, status FROM document_details WHERE user_ID = ? ORDER BY document_ID DESC LIMIT 2";




    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 's', $accountID);


        mysqli_stmt_execute($stmt);
 

        mysqli_stmt_bind_result($stmt, $document_ID, $document_Title, $upload_Date, $status);
        
        $documents = array();

        while (mysqli_stmt_fetch($stmt)) {
            $documents[] = array(
                "docID" => $document_ID,
                "title" => $document_Title,
                "uploadDate" => $upload_Date,
                "status" => $status
            );
        }

        mysqli_stmt_close($stmt);
        return json_encode($documents);
    } else {
        return null;
    }
}

//img



function documentNotif($con, $userID) {
    $notifications = array();

    $query = "SELECT DISTINCT document_ID, department_ID FROM document_logs WHERE user_ID = $userID";



    $result = mysqli_query($con, $query);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {


            $documentID = $row['document_ID'];
            $departmentID = $row['department_ID'];


            
            $deptQuery = "SELECT department_name FROM departments WHERE department_ID = $departmentID";


            $deptResult = mysqli_query($con, $deptQuery);

            if ($deptResult && mysqli_num_rows($deptResult) > 0) {


                $departmentRow = mysqli_fetch_assoc($deptResult);
                $departmentName = $departmentRow['department_name'];


                $notification = array(

                    "documentID" => $documentID,
                    "departmentName" => $departmentName,
                    "timestamp" => date('Y-m-d H:i:s')
                );

                array_push($notifications, $notification);
            }
        }
        //serialize to json string
        return json_encode($notifications);
    } else {
        return null;
    }
}


function getRejected($con, $accountID){

    $query = "
        SELECT
            document_logs.document_ID,
            document_logs.department_ID,
            document_logs.remarks,
            document_details.document_Title
        FROM
            document_logs
        JOIN
            document_details ON document_logs.document_ID = document_details.document_ID
        WHERE
            document_logs.user_ID = ? AND
            document_logs.document_status = ?
    ";

    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {

        $rejected = 'rejected';

        mysqli_stmt_bind_param($stmt, 'ss', $accountID, $rejected);

        mysqli_stmt_execute($stmt);

        mysqli_stmt_bind_result($stmt, $document_ID, $departmentID, $remarks, $documentTitle);

        $documents = array();

        while (mysqli_stmt_fetch($stmt)) {
            $documents[] = array(
                "docID" => $document_ID,
                "depID" => $departmentID,
                "docTitle" => $documentTitle,
                "remarks" => $remarks,
            );
        }

        mysqli_stmt_close($stmt);

        return $documents;
    } else {
        // Print the error message for debugging
        echo "Error: " . mysqli_error($con);
        return null;
    }
}



function getFile($con, $documentID) {
    $query = "SELECT document_Title, file FROM document_details WHERE document_ID = ?";
    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {

        mysqli_stmt_bind_param($stmt, 's', $documentID);

        mysqli_stmt_execute($stmt);


        mysqli_stmt_bind_result($stmt, $document_Title, $file);


        if (mysqli_stmt_fetch($stmt)) {
            $documentInfo = array(
                "title" => $document_Title,
                "file" => $file
            );

            mysqli_stmt_close($stmt); 
            return $documentInfo;
        } else {
            mysqli_stmt_close($stmt);
            return null;
        }
    } else {
        return null;
    }
}

function updateFile($con, $docID, $userID, $newFileBlob) {
    $query = "UPDATE document_logs SET received_file = ?, document_status = 'Processing' WHERE document_ID = ? AND user_ID = ? AND document_status = 'rejected'";
    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'sss', $newFileBlob, $docID, $userID);

        mysqli_stmt_send_long_data($stmt, 0, $newFileBlob);

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_close($stmt);
            return true;
        } else {
            mysqli_stmt_close($stmt);
            return false;
        }
    } else {
        return false;
    }
}
