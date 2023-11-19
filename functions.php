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

