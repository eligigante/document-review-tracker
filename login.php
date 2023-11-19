<?php



include("db.php");
include("functions.php");

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
 
    if (isset($_POST['submit'])) {
        $accountID = $_POST['accountID'];
        $password = $_POST['password'];

       
        $user = check_login($con, $accountID, $password);

        if ($user) {
         
            $_SESSION['user_id'] = $user['user_ID'];
    
        
            header("Location: landing.php"); 
            exit();
        } else {
            echo "<script>alert('Invalid credentials'); window.location.href = 'index.html';</script>";
            exit();
          
        }
    }
}
?>