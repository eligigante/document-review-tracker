<?php
include_once('db.php');

$documentID = 7;

$sql = "SELECT file FROM document_details WHERE document_ID = ?";
$stmt = $con->prepare($sql);
if ($stmt) {
    $stmt->bind_param("i", $documentID);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($fileContent);
        $stmt->fetch();

        // Decode the retrieved base64-encoded file content
        $decodedContent = base64_decode($fileContent);

        // Output the decoded content to a file
        file_put_contents('output_file.doc', $decodedContent);

        // Now, redirect the user to download the file
        header('Content-Type: application/msword');
        header('Content-Disposition: attachment; filename="output_file.doc"');
        readfile('output_file.doc');

        // Delete the temporary file after downloading
        unlink('output_file.doc');
    } else {
        echo "No document found with the specified ID";
    }

    $stmt->close();
} else {
    echo "Failed to fetch document: " . $con->error;
}
?>