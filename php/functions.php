<?php

include_once('db.php');




/*

  Created by: kevin king Yabut
  Description: Checks login credentials through the database. If execution is successful,
  returns the user data; otherwise, returns null.

 */
function check_login($con, $accountID, $password) {
    $query = "SELECT * FROM user WHERE user_ID = ? AND password = ?";
    $stmt = mysqli_prepare($con, $query);
    mysqli_stmt_bind_param($stmt, "ss", $accountID, $password);
    mysqli_stmt_execute($stmt);

    $result = mysqli_stmt_get_result($stmt);

    if ($result && mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);


        if ($user['role'] === 'user') {
           
            
            if ($user['status'] === 'Online') {

                return null; 
            }

            $onlineStatus = 'Online';

            $updateQuery = "UPDATE user SET status = ? WHERE user_ID = ?";

            $updateStmt = mysqli_prepare($con, $updateQuery);

            mysqli_stmt_bind_param($updateStmt, "ss", $onlineStatus, $user['user_ID']);


            mysqli_stmt_execute($updateStmt);

            mysqli_stmt_close($updateStmt);


            return $user;
        }
    }

    mysqli_stmt_close($stmt);
    return null;
}


/*
  Created by: Kevin King Yabut
  Description: Sets the user's status to 'Offline' in the database.
 */
function set_user_offline($con, $accountID) {


    $offline = 'Offline';
    $query = "UPDATE user SET status = ? WHERE user_ID = ?";


    $stmt = mysqli_prepare($con, $query);

    mysqli_stmt_bind_param($stmt, "ss", $offline, $accountID);

    mysqli_stmt_execute($stmt);
    
    mysqli_stmt_close($stmt);
}


/*
  Created by: Kevin King Yabut
  Description: Retrieves the general information of the user, including first name, middle name, 
  last name, email, and user ID.
  The information is stored in an array, which is later converted to a JSON-encoded string representation
  of the $documents array.
 */
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


/*
  Created by: Kevin king Yabut
  Description: Retrieves general information of the user's documents, including document ID,
  title, upload date, status, department ID, and department name, and stores it in an array.
 */
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



/*
  Created by: Kevin king Yabut
  Description: retrieves the document notifications associated for the user, including document ID, department name,
  and timestamp, and stores them in an array, then later converted into a json representation of the array.
 */
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


/*
 Created by: Kevin king Yabut

  Description: retrieves the rejected documents for the user, including document ID,
  department ID, returned file, user ID, and document title, and stores it in an array.
 */
function getRejected($con, $accountID) {
    $query = "
        SELECT
            document_logs.document_ID,
            document_logs.department_ID,
            document_logs.returned_file,
            document_details.user_ID,
            document_details.document_Title
        FROM
            document_logs
        JOIN
            document_details ON document_logs.document_ID = document_details.document_ID
        WHERE
            document_details.user_ID = ? AND
            document_logs.document_status = 'rejected'
    ";

    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 's', $accountID);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $document_ID, $departmentID, $returnedFile, $userID, $documentTitle);

        $documents = array();
        while (mysqli_stmt_fetch($stmt)) {
            $documents[] = array(
                "docID" => $document_ID,
                "depID" => $departmentID,
                "userID" => $userID,
                "docTitle" => $documentTitle,
                "returnedFile" => $returnedFile,
            );
        }
        mysqli_stmt_close($stmt);
        return $documents;
    } else {
        echo "Error: " . mysqli_error($con);
        return null;
    }
}


/*
  Created by: Kevin king Yabut
  Description: retrieves the document title and the blob file of the rejected documents associated based on the documentID to the user.
  and stores it into $documentInfo array
 */
function getFile($con, $documentID) {
    $query = "
    SELECT dd.document_Title, dl.returned_file
    FROM document_details dd
    JOIN document_logs dl ON dd.document_ID = dl.document_ID
    WHERE dd.document_ID = ? AND dl.document_status = 'rejected';    
    ";

    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 's', $documentID);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_bind_result($stmt, $document_Title, $returned_file);

        if (mysqli_stmt_fetch($stmt)) {
            $documentInfo = array(
                "title" => $document_Title,
                "file" => $returned_file
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

/*
  Created by: Kevin king Yabut
  Description:
  Updates a rejected document with a new file, changing its status to 'processing' and
  incrementing the revision count.
 */
function updateFile($con, $docID, $accountID, $newFileBlob) {
    $query = "
        UPDATE document_logs
        JOIN document_details ON document_logs.document_ID = document_details.document_ID
        SET document_logs.received_file = ?,
            document_logs.document_status = 'processing',
            document_details.status = 'pending',
            document_details.revisions = document_details.revisions + 1
        WHERE document_logs.document_ID = ? AND document_details.user_ID = ? AND document_logs.document_status = 'rejected';
    ";

    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'sss', $newFileBlob, $docID, $accountID);
        $result = mysqli_stmt_execute($stmt);
        mysqli_stmt_send_long_data($stmt, 0, $newFileBlob);
        mysqli_stmt_close($stmt);
        return $result;
    } else {
        return false;
    }
}