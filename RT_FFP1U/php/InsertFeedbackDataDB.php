<?php

include 'connectDB.php';

$PARTID 		= stripslashes(htmlspecialchars($_POST['partID']));
$PROLIFICID 		= stripslashes(htmlspecialchars($_POST['prolificID']));
$EXPID 		= stripslashes(htmlspecialchars($_POST['expID']));
$FEEDBACK 		= stripslashes(htmlspecialchars($_POST['feedback']));

$stmt = $db->prepare("INSERT INTO RT_Feedback VALUE(?,?,?,?, NOW())");
$stmt->bind_param("ssss",
    $PARTID,$PROLIFICID,$EXPID,$FEEDBACK
    );
$stmt->execute();
$err = $stmt->errno ;
$data = array(
      'error' => $err,
    );
$stmt->close();
 $db->close();
echo json_encode($data);
 ?>
