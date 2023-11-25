
<?php
require_once('db.php');
require_once('functions.php');

session_start();

if (!isset($_SESSION['user_id'])) {
   
    header("Location: index.php");
    exit();

}

$userID = $_SESSION['user_id'];
$userDetails = get_name($con, $userID);



//user full name

if ($userDetails) {
    $firstName = $userDetails['first_Name'];
    $lastName = $userDetails['last_Name'];
} else {
    
  null;
}



echo var_dump($_GET['page']);





if ($_GET['page'] === 'home') {
    echo '<main id="tite">
    

    
    <div class="head-title">
    <div class="left">
        <h1>Dashboard</h1>
        <h1> Hello User '. $firstName ." ". $lastName .' </h1>
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
    <a href="#" class="btn-download">
        <i class="bx bxs-cloud-download"></i>
        <span class="text">Download PDF</span>
    </a>
</div>

<ul class="box-info">
    <li>
        <i class="bx bxs-calendar-check"></i>
        <span class="text">
            <h3>1020</h3>
            <p>New Order</p>
        </span>
    </li>
    <li>
        <i class="bx bxs-group"></i>
        <span class="text">
            <h3>2834</h3>
            <p>Visitors</p>
        </span>
    </li>
    <li>
        <i class="bx bxs-dollar-circle"></i>
        <span class="text">
            <h3>$2543</h3>
            <p>Total Sales</p>
        </span>
    </li>
</ul>

<div class="table-data">
    <div class="order">
        <div class="head">
            <h3>Recent Orders</h3>
            <i class="bx bx-search"></i>
            <i class="bx bx-filter"></i>
        </div>
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Date Order</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <img src="img/people.png">
                        <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td><span class="status completed">Completed</span></td>
                </tr>
                <!-- Other table rows -->
            </tbody>
        </table>
    </div>
    <div class="todo">
    <div class="head">
        <h3>Todos</h3>
        <i class="bx bx-plus"></i>
        <i class="bx bx-filter"></i>
    </div>
    <ul class="todo-list">
        <li class="completed">
            <p>Todo List</p>
            <i class="bx bx-dots-vertical-rounded"></i>
        </li>
        <li class="completed">
            <p>Todo List</p>
            <i class="bx bx-dots-vertical-rounded"></i>
        </li>
        <li class="not-completed">
            <p>Todo List</p>
            <i class="bx bx-dots-vertical-rounded"></i>
        </li>
        <li class="completed">
            <p>Todo List</p>
            <i class="bx bx-dots-vertical-rounded"></i>
        </li>
        <li class="not-completed">
            <p>Todo List</p>
            <i class="bx bx-dots-vertical-rounded"></i>
        </li>
    </ul>
</div>
</div>
</div>
    
    
    </main>';
} elseif ($_GET['page'] === 'settings') {
    echo '<h1>This is the Settings content</h1>';
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
                <input type="text" id="fname" name="firstname" placeholder="Your name..">
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="lname">Last Name</label>
            </div>
            <div class="col-75">
                <input type="text" id="lname" name="lastname" placeholder="Your last name..">
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="department">Department</label>
            </div>
            <div class="col-75">
                <select id="department" name="department">
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









