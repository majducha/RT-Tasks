<?php

include 'connectDB.php';

$PARTID 		= stripslashes(htmlspecialchars($_POST['partID']));
$EXPID 		= stripslashes(htmlspecialchars($_POST['expID']));
$TNAME 		= stripslashes(htmlspecialchars($_POST['tsName']));
$TRIAL 		= stripslashes(htmlspecialchars($_POST['trial']));

$RTS 		= stripslashes(htmlspecialchars($_POST['reactionTime']));

$SYMBOL 	= stripslashes(htmlspecialchars($_POST['symbol']));
$SYMBOLID 	= stripslashes(htmlspecialchars($_POST['symbolID']));
$SYM_PROB	= stripslashes(htmlspecialchars($_POST['symbolProb']));
$SYM_REW		= stripslashes(htmlspecialchars($_POST['symbolReward']));
$SYM_EV	= stripslashes(htmlspecialchars($_POST['symbolEv']));

$RESP_KEY 		= stripslashes(htmlspecialchars($_POST['respKey']));
$INIT_PROB	= stripslashes(htmlspecialchars($_POST['initProb']));
$RESP_PROB 		= stripslashes(htmlspecialchars($_POST['respProb']));
$RESP_REW 		= stripslashes(htmlspecialchars($_POST['respReward']));
$RESP_EV 		= stripslashes(htmlspecialchars($_POST['respEv']));
$RESP_DIFF	= stripslashes(htmlspecialchars($_POST['respDifference']));
$RESP_REW_COR	= stripslashes(htmlspecialchars($_POST['respRewCorrect']));
$RESP_PROB_COR	= stripslashes(htmlspecialchars($_POST['respProbCorrect']));

$TOTALREW 		= stripslashes(htmlspecialchars($_POST['totalReward']));
$TRIALREW 		= stripslashes(htmlspecialchars($_POST['trialReward']));

$PROB_POINTS 		= stripslashes(htmlspecialchars($_POST['probPoints']));
$REW_POINTS 		= stripslashes(htmlspecialchars($_POST['rewPoints']));


$stmt = $db->prepare("INSERT INTO RT_ValuationUnited VALUE(?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?, NOW())");
$stmt->bind_param("sssidiiiidiiiiddiidddd",
    $PARTID,$EXPID,$TNAME,$TRIAL,
    $RTS,
    $SYMBOL,$SYMBOLID,$SYM_PROB,$SYM_REW,$SYM_EV,
    $RESP_KEY,$INIT_PROB,$RESP_PROB ,$RESP_REW,$RESP_EV,$RESP_DIFF,
    $RESP_REW_COR,$RESP_PROB_COR,
    $TOTALREW,$TRIALREW,$PROB_POINTS,$REW_POINTS);
$stmt->execute();
$err = $stmt->errno ;
$data = array(
      'error' => $err,
    );
$stmt->close();
 $db->close();
echo json_encode($data);
 ?>
