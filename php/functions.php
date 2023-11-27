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

    $query = "SELECT document_ID, document_Title, upload_Date FROM document_details WHERE user_ID = ?";

      
    if ($stmt = mysqli_prepare($con, $query)) {
   
    mysqli_stmt_bind_param($stmt, "s", $accountID);

 
    mysqli_stmt_execute($stmt);



    mysqli_stmt_bind_result($stmt, $document_ID, $document_Title, $upload_Date);

    $documents = array();


    while (mysqli_stmt_fetch($stmt)) {
        $documents[] = array(
            "docID" => $document_ID,
            "title" => $document_Title,
            "uploadDate" => $upload_Date,
      
        );
    }

    
    mysqli_stmt_close($stmt);

    return $documents;
} else {
   
    return null;


}
}

