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

    $query = "SELECT document_ID, document_Title, upload_Date, status FROM document_details WHERE user_ID = ?";

      
    if ($stmt = mysqli_prepare($con, $query)) {
   
    mysqli_stmt_bind_param($stmt, "s", $accountID);

 
    mysqli_stmt_execute($stmt);



    mysqli_stmt_bind_result($stmt, $document_ID, $document_Title, $upload_Date,$status);

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

function getUserImg($con, $accountID) {

    $query = "SELECT user_img FROM user WHERE user_ID = ?";
    $stmt = mysqli_prepare($con, $query);


    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "i", $accountID);


        mysqli_stmt_execute($stmt);


        mysqli_stmt_bind_result($stmt, $imageData);

        if (mysqli_stmt_fetch($stmt)) {
            mysqli_stmt_close($stmt);
            return base64_encode($imageData);
        } else {
            mysqli_stmt_close($stmt);
            echo '<script>("no user image found")' ;
        }
    } else {
        echo 'Error getting image' ;
    }
}


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

    $query = "SELECT document_ID, document_Title, file, upload_Date FROM document_details WHERE user_ID = ? AND status = ?";




    $stmt = mysqli_prepare($con, $query);

    if ($stmt) {

        $rejected = 'rejected';

        mysqli_stmt_bind_param($stmt, 'ss', $accountID, $rejected);



        mysqli_stmt_execute($stmt);


        mysqli_stmt_bind_result($stmt, $document_ID, $document_Title, $file, $upload_Date);
        
        $documents = array();



        while (mysqli_stmt_fetch($stmt)) {

            $decodeblob = base64_encode($file);



            $documents[] = array(
                "docID" => $document_ID,

                "title" => $document_Title,
                "uploadDate" => $upload_Date,
                "file" => $decodeblob
            );
        }

        mysqli_stmt_close($stmt);


        return json_encode($documents);
    } else {
        return null;
    }
}
function getFile($con, $documentID) {
    $query = "SELECT dd.document_Title, dl.returned_file 
    FROM document_details dd
    JOIN document_logs dl ON dd.document_ID = dl.document_ID
    WHERE dd.document_ID = ?";
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