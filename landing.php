
<?php
    session_start();
    echo "<h3> PHP List All Session Variables</h3>";
    foreach ($_SESSION as $key=>$val)
    echo $key." ".$val."<br/>";

    if(isset($_SESSION['user_id'])){



        $user_id = $_SESSION['user_id'];


    }else{

        header("Location: login.php");
        exit();
    }
?>



<html>

<body>


<h1> successful Login! </h1>
<h1> Hello User <?php echo $user_id; ?> </h1>
</body>

</html>