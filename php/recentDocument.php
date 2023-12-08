<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    
    header("Location: index.html");
    exit();
}

require_once('functions.php');
require_once('db.php');

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
            <a href="../../php/download.php?file_id=' . $doc['docID'] . '" target="_blank">Download</a>
            </td>
        </tr>';
    }
} else {
    echo '<tr>
            <td></td>
        </tr>';
}

if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Error decoding JSON: ' . json_last_error_msg();
}

if ($documents === false) {
    echo 'Error retrieving documents.';
}
?>