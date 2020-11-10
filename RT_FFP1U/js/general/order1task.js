import {getID,end} from "./dExperimentFunctions.js";
import {disableF5} from "./dRandomFunctions.js";
import {consentForm} from "./dExperimentConsent.js";
import {InstructionsA, InstructionsB,InstructionsC,InstructionsSMSQ} from "../Instructions/Instructions.js"
import {SMSQ} from "../Questionnaires/Questionnaire.js"

function orderFunc (test){
  let check = test.orderCheck;
  switch (check) {

    case 0:
      InstructionsC.init(test)
      test.orderCheck++
      break;   
    case 1:
      test.taskValuations.init(test) ;
      test.orderCheck++
      break;
    case 2:
      end(test);
      break;

    default:
      $('#Stage').html('<p>Error!</p>');

  }
}

export{orderFunc}
