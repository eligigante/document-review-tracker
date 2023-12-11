
<?php
require_once('db.php');
require_once('functions.php');

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.html");
    exit();
   
}

$userID = $_SESSION['user_id'];
$userDetails = get_name($con, $userID);
$docDetails = get_docs($con, $userID);
$docs = json_decode($docDetails, true);
$documentRejected = getRejected($con, $userID);
$docRecent = get_recent($con, $userID);
$statusChange = "";
$statusChanging = "";


//user full name

if ($userDetails) {
    $firstName = $userDetails['first_Name'];
    $lastName = $userDetails['last_Name'];
    $middleName = $userDetails['middle_Name'];
    $email = $userDetails['email'];
    $id = $userDetails['ID'];
} else {
    
  null;
}

if ($_GET['page'] === 'home') {
    echo '
    
        <main>
            <div class="head-title">
                <div class="left">
                    <h1>Hello, ' . $firstName . ' ' . $lastName . '</h1>
                    <ul class="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i class="bx bx-chevron-right"></i></li>
                        <li>
                            <a class="active" href="#">Home</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Rejected Documents</h3>
                        <i class="bx bx-search"></i>
                        <i class="bx bx-filter"></i>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                            </tr>
                        </thead>
                        <tbody id="getDocs">';
    
    if ($documentRejected !== null) {
        foreach ($documentRejected as $doc) {
            echo '
                <tr>
                    <td>
                        <span class = "titleDoc">' . $doc['docTitle'] . '</span>
                    </td>
                    <td>
                        <form action="../../php/download.php" method="get" target="_blank">
                            <input type="hidden" name="file_id" value="' . $doc['docID'] . '">
                            <button type="submit" id="view" >View</button>
                        </form>
                    </td>
                    <td>
                        <form action="../../php/reupload.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="file_id" value="' . $doc['docID'] . '">
                       
                   
                            <input type="file" name="file" id = "file">
                           
                            <input type="submit" value="upload" id = "upload">
                        </form>
                    </td>
                </tr>';
        }
    } else {
        echo '<tr>
                    <td>
                        <span>' . "" . '</span>
                    </td>
                    <td>
                        <span>' . "" . '</span>
                    </td>
                    <td>
                        <span>' . "" . '</span>
                    </td>
                    <td>
                    </td>
                </tr>';
    }

    echo '</tbody>
                </table>
            </div>
        </div>
    </main>';
                     
    } else if ($_GET['page'] === 'myDocs') {

    echo '<main id = "tite">
    
    <div class="head-title">
    <div class="left">
        <h1>My Documents</h1>
    </div>
</div>

<div class="table-data">
    <div class="order">
        <div class="head">
            <h3>My Documents</h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Document ID</th>
                    <th>Document Title</th>
                    <th>Upload Date</th>
                    <th>Document Status</th>
                    <th>Current Department</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id = tbody>
        <tr>
                    <td>
                        <span>'. "" . '</span>
                    </td>
                    <td>
                        <span>'. "". '</span>
                    </td>
                    <td>
                        <span>'. "" . '</span>
                    </td>
                    <td>
                        <span class="status completed">'. "" . '</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
   </main>';
   


} elseif ($_GET['page'] === 'profile') {
    echo '<main id = "tite">
    
    <div class="head-title">
    <div class="left">
        <h1>My Profile</h1>
        <ul class="breadcrumb">
            <li>
                <a href="#">My Profile</a>
            </li>
            <li><i class="bx bx-chevron-right"></i></li>
            <li>
                <a class="active" href="#">Home</a>
            </li>
        </ul>
    </div>
</div>

<!-- here yung container -->
<div class="profile-container">
    
    <div class="sample-image">
        <img src="" class="sample-image">
    </div>
    <div class="profile-info">
        <div class="general-information-label">GENERAL INFORMATION</div>
        <div class="name-label">First Name: <span class="value"> '. $firstName .'</span></div>
        <div class="name-position">Middle Name: <span class="value">'. $middleName .'</span></div>
        <div class="name-label">Last Name: <span class="value">'. $lastName .'</span></div>
        <div class="name-label">Email: <span class="value">'. $email .'</span></div>
        <div class="name-label">User ID: <span class="value">'. $id .'</span></div>
        <!-- Add more divs for additional user information as needed -->
    </div> 
</div>
    </main>';
} elseif ($_GET['page'] === 'document') {
    echo '<main>
    
    <div class="head-title">
    <div class="left">
        <h1>Submit Document</h1>
    </div>
</div>

<div class="doc-container">
    <form action="../../php/form-handling.php" method="POST" enctype="multipart/form-data">
        <div class="row">
            <div class="col-25">
                <label for="fname">First Name</label>
            </div>
            <div class="col-75">
                <input type="text" id="fname" name="firstname" placeholder="Your name.." value = "'.$firstName.'" readonly>
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="lname">Last Name</label>
            </div>
            <div class="col-75">
                <input type="text" id="lname" name="lastname" placeholder="Your last name.." value = "'.$lastName.'" readonly>
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="department">Department</label>
            </div>
            <div class="col-75">
                <select id="department" name="department" onchange = getDoc() >
                    <option value="OGRAA">OGRAA</option>
                    <option value="OVPAA">OVPAA</option>
                    <option value="OVPF">OVPF</option>
                    <option value="OLA">OLA</option>
                    <option value="OVPA">OVPA</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="subject">Subject</label>
            </div>
            <div class="col-75">
                <textarea id="subject" name="subject" placeholder="Write something.." style="height:200px"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label class="control-label">Upload File</label>
                    <div class="preview-zone hidden">
                        <div class="box box-solid">
                            <div class="box-header with-border">
                                <div><b>Preview</b></div>
                                <div class="box-tools pull-right">
                                    <button type="button" class="btn btn-danger btn-xs remove-preview">
                                        <i class="fa fa-times"></i> Reset This Form
                                    </button>
                                </div>
                            </div>
                            <div class="box-body"></div>
                        </div>
                    </div>
                    <div class="dropzone-wrapper">
                        <div class="dropzone-desc">
                            <i class="glyphicon glyphicon-download-alt"></i>
                            <p>Choose an image file or drag it here.</p>
                        </div>
                        <input type="file" name="img_logo" class="dropzone">
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button type="submit" class="btn btn-primary pull-right">Submit</button>
            </div>
        </div>
    </form>
</div>
    </main>';
} else {
   
    echo '<h1>Page not found</h1>';
}
?>








