<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.html");
    exit();
   
}

require_once('functions.php');
require_once('db.php');

$userID = $_SESSION['user_id'];

$statusChanging = "";

$documents = get_docs($con, $userID);

$docs = json_decode($documents, true);

if ($docs !== null) {

    $statusChanging = "";

    foreach ($docs as $doc) {
        switch ($doc['status']) {
            case 'pending':
                $statusChanging = 'status pending';
                break;
            case 'finished':
                $statusChanging = 'status completed';
                break;
            case 'rejected':
                $statusChanging = 'status denied';
                break;
        }


        echo '
        <tr>
            <td>
                <span>' . $doc['docID'] . '</span>
            </td>
            <td>
                <span>' . $doc['title'] . '</span>
            </td>
            <td>
                <span>' . $doc['uploadDate'] . '</span>
            </td>
            <td>
                <span class="' . $statusChanging . '">' . $doc['status'] . '</span>
            </td>
            <td>';
    

               

            switch ($doc['department']) {

                

                case '1':

                    echo '<div class="delivery-tracking">
                    <div class="word-container orange transition" id="circle1">OGRAA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle2">OVPAA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle3">OVPF</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle4">OLA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle5">OVPA</div>
                  </div>';

            break;
                case '2':
                    echo '<div class="delivery-tracking">
                    <div class="word-container green transition" id="circle1">OGRAA</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container orange transition" id="circle2">OVPAA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle3">OVPF</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle4">OLA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle5">OVPA</div>
                  </div>';

                    break;
                case '3':

                    echo '<div class="delivery-tracking">
                    <div class="word-container green transition" id="circle1">OGRAA</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container green transition" id="circle2">OVPAA</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container orange transition" id="circle3">OVPF</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle4">OLA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle5">OVPA</div>
                  </div>';

                    break;
                case '4':



                    echo '<div class="delivery-tracking">
                    <div class="word-container green transition" id="circle1">OGRAA</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container green transition" id="circle2">OVPAA</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container green transition" id="circle3">OVPF</div>
                    <div class="line green-line transition"></div>
                    <div class="word-container orange transition" id="circle4">OLA</div>
                    <div class="line no-green transition"></div>
                    <div class="word-container transition" id="circle5">OVPA</div>
                  </div>';
                 
                    break;
                    case '5':
                      
                        echo '<div class="delivery-tracking">
                        <div class="word-container green transition" id="circle1">OGRAA</div>
                        <div class="line green-line transition"></div>
                        <div class="word-container green transition" id="circle2">OVPAA</div>
                        <div class="line green-line transition"></div>
                        <div class="word-container green transition" id="circle3">OVPF</div>
                        <div class="line green-line transition"></div>
                        <div class="word-container green transition" id="circle4">OLA</div>
                        <div class="line green-line transition"></div>
                        <div class="word-container orange transition" id="circle5">OVPA</div>
                      </div>';
                     

                        break;
                default:
         
                    echo '';
            }


            

               
           echo ' </td>
        </tr>';
    }
} else {
    echo '<tr>
            <td>No documents found.</td>
        </tr>';
}
?>

