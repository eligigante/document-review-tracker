<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

require_once('../../php/functions.php');
require_once('../../php/db.php');

$userID = $_SESSION['user_id'];

$documents = getRejected($con, $userID);

$docs = json_decode($documents, true);

if ($docs !== null) {
    foreach ($docs as $doc) {
        echo '
        <tr>
            <td>
                <span>' . $doc['title'] . '</span>
            </td>
            <td>
                <span>' . $doc['uploadDate'] . '</span>
            </td>
            <td>

            </td>
            <td>
            <form action="upload.php" method="POST" enctype= "multipart/form-data">
            <input type="file" name="file">
            <input type="submit" value="submit">
            </form>
            </td>
        </tr>';
    }
} else {
    echo '<tr>
            <td></td>
        </tr>';
}

if (json_last_error() !== JSON_ERROR_NONE) {
    
    echo 'error decoding json';
}

if ($documents === false) {
    echo 'error getting documents.';
}




