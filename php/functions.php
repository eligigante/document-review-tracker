<?php




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
    $query = "SELECT last_Name, first_Name FROM user WHERE user_ID = ?";

    
    if ($stmt = mysqli_prepare($con, $query)) {
       
        mysqli_stmt_bind_param($stmt, "s", $accountID);

     
        mysqli_stmt_execute($stmt);



      
        mysqli_stmt_bind_result($stmt, $last_Name, $first_Name);

   
        mysqli_stmt_fetch($stmt);


        
        mysqli_stmt_close($stmt);




        
        return array(
            "first_Name" => $first_Name,
            "last_Name" => $last_Name
        );
    } else {
       
        return null;
    }
}

