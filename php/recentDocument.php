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

                <form action="../../php/download.php" method="get" target="_blank">
                    <input type="hidden" name="file_id" value="' . $doc['docID'] . '">
                    <button type="submit">Download</button>
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
    
    echo 'erro decoding json';
}

if ($documents === false) {
    echo 'error getting documents.';
}
?>