import {orderFunc} from "./order.js";
import {sendToDB} from "./dExperimentSendToDB.js";

function getFeedback(test){
let Prompt = '<form><div class="form-group">'+
              '<label for="freeText">'+
              'We are still developing this task and we would be very grateful for your feedback. ' +
	      'Was there anything you liked/disliked about the task? Anything you found difficult or confusing? '+
	      'Please, let us know!' +
              '</label>'+
              '<textarea class="form-control" id="freeText" rows="3"></textarea>'+
              '</div>'+
              '<form>';

let Buttons = '<div align="col m-5"><input align="left" type="button"  class="btn btn-default rounded" id="bSubmit" value="Next" style="background-color: #3C455C; color:#FFFFFF"></div>';

$('#Top').html('<p>Feedback</p>');
$('#Stage').html(Prompt);
$('#GameButton').html(Buttons);


$('#bSubmit').click(function(){
  test.feedback = document.getElementById('freeText').value;
  sendToDB(0,
        	{ partID: test.ID,
            prolificID: test.PID,
          	expID: test.expID,
          	feedback: test.feedback},
        'php/InsertFeedbackDataDB.php')
  orderFunc(test);
})
}

export {getFeedback}
