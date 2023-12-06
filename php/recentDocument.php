<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

require_once('functions.php');

require_once('db.php');


$userID = $_SESSION['user_id'];


$documents = get_recent($con, $userID);


$docs = json_decode($documents, true);



if ($docs !== null) {
    foreach ($docs as $doc) {



        switch ($doc['status']) {
            case 'pending':
                $statusChanging = 'status pending';
                break;
            case 'approved':
                $statusChanging = 'status completed';
                break;
            case 'denied':
                $statusChanging =  'status denied';
                break;
        }



        echo '
        <tr>
            <td>
                <span>' . $doc['title'] . '</span>
            </td>
            <td>
                <span>' . $doc['uploadDate'] . '</span>
            </td>
            <td>
                <span class="' . $statusChanging . '">' . $doc['status'] . '</span>
            </td>
        </tr>';
    }
} else {
    echo '<tr>
            <td></td>
        </tr>';
}



