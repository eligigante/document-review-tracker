<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}
$userID = $_SESSION['user_id'];

require_once('../../php/functions.php');

$imageUser = getUserImg($con, $userID);

if ($imageUser !== false) {
    $imageSrc = "data:image/jpeg;base64," . $imageUser; 
} else {
    echo "<script>alert('no image')</script>";
}



?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Boxicons -->
    <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
    <!-- JQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- CSS -->
    <link rel="stylesheet" href="../style.css">
    <title>AdminHub</title>
</head>

<body>


    <!-- SIDEBAR -->
    <section id="sidebar">
        <span class="overlay"></span>
        <div class="modal-box">
            <h2>Confirmation</h2>
            <h3>Are you sure you want to logout?</h3>

            <div class="buttons">
                <a class="close-btn">Cancel</a>
                <a class="logout-btn" href = "../../php/logout.php">
                    <i class='bx bx-log-out'></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
        <a href="#" class="brand">
            <i class='bx bxs-file-find'></i>
            <span class="text">SLU</span>
        </a>
        <ul class="side-menu top">
            <li class="active">
                <a href="#" onclick= "loadContent('home')">
                    <i class='bx bxs-home'></i>
                    <span class="text">Home</span>
                </a>
            </li>
            <li>
                <a href="#"onclick= "loadContent('document')">
                    <i class='bx bx-upload'></i>
                    <span class="text">Submit Document</span>
                </a>
            </li>
            <li>
                <a href="#"onclick= "loadContent('myDocs')">
                    <i class='bx bxs-file-doc'></i>
                    <span class="text">My Documents</span>
                </a>
            </li>
            <li>
                <a href="#"onclick= "loadContent('profile')">
                    <i class='bx bxs-face'></i>
                    <span class="text">Profile</span>
                </a>
            </li>
        </ul>

        <ul class="side-menu">
            <li>
                <a href="#" class="logout">
                    <i class='bx bx-log-out'></i>
                    <span class="text">Logout</span>
                </a>
            </li>
        </ul>


    </section>
    <!-- SIDEBAR -->



    <!-- CONTENT -->
    <section id="content">
        <!-- NAVBAR -->
        <nav>
            <i class='bx bx-menu'></i>
            <form action="#">
                <div class="form-input">
                    <input type="search" placeholder="Search...">
                    <button type="submit" class="search-btn"><i class='bx bx-search'></i></button>
                </div>
            </form>
            <button class="drop-btn" id="drop-btn">
                <i class='bx bxs-bell'></i>
            </button>
            <div class="dropdown" id="dropdown">
                <div class="notify_item">
					<div class="notify_img">
						<img src="img/people.png" alt="profile_pic" style="width: 50px">
					</div>
					<div class="notify_info">
						<p>Alex commented on<span>Timeline Share</span></p>
						<span class="notify_time">10 minutes ago</span>
					</div>
				</div>
				<div class="notify_item">
					<div class="notify_img">
						<img src="img/people.png" alt="profile_pic" style="width: 50px">
					</div>
					<div class="notify_info">
						<p>Ben hur commented on your<span>Timeline Share</span></p>
						<span class="notify_time">55 minutes ago</span>
					</div>
				</div>
				<div class="notify_item">
					<div class="notify_img">
						<img src="img/people.png" alt="profile_pic" style="width: 50px">
					</div>
					<div class="notify_info">
						<p>Meryn trant liked your<span>Cover Picture</span></p>
						<span class="notify_time">2 hours ago</span>
					</div>
				</div>
				<div class="notify_item">
					<div class="notify_img">
						<img src="img/people.png" alt="profile_pic" style="width: 50px">
					</div>
					<div class="notify_info">
						<p>John wick commented on your<span>Profile Picture</span></p>
						<span class="notify_time">6 hours ago</span>
					</div>
				</div>
              </div>
            <a href="#" class="profile">
                <img src="<?php echo $imageSrc ?>">
            </a>
        </nav>
        <!-- NAVBAR -->

        <!-- MAIN -->
        <main id = "tite">
           
        </main>
        <!-- MAIN -->
    </section>
    <!-- CONTENT -->


    <script src="script.js"></script>
</body>

</html>