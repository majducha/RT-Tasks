import {StimuliSettings} from "./dStimuliSettings.js";
import {SliderManager,range,appendElement,generateSubmitButton,generateImg,generateQuestion} from "./dSlider.js";
import {taskFixedFeedbackInterleaved} from "../FixedFeedbackInterleaved/TaskFixedFeedbackInterleaved.js";

import {sendToDB} from "../../general/dExperimentSendToDB.js";
import {orderFunc} from "../../general/order.js";
import {shuffle,getLastValue} from "../../general/dRandomFunctions.js";

var task1 = taskFixedFeedbackInterleaved.stimuliSettings;

var ss = new StimuliSettings(
    { nStim: task1.nStim,
      stimPath: task1.StimPath,

      probs: task1.p,
      rewards: task1.r,
      losses: task1.l,

      vi: task1.vi,
      A: task1.A,

      nResp: 4,
      RespPath: "images/values/",
      resps: [-90,-10,10,90],
      })

var taskValuations = {
      stimuliSettings:ss ,

      taskSettings:{
        taskName: 'ValuationsUnited',
        maxTrials: 24,//8,
        borderMS:500,//10,
      },

      results: {
        trial: 0, // number of trials
        stim: 0, //  between 0 - max trials in a block

        symbol: [],//  which symbol was presented
        symbolReward: [],
        symbolProb: [],
        symbolEv: [], // expected value of the symbol

        optionList: [],  // in which order were the responses presented

        respKey: [], // which response matrix was chosen (0-1)
        respReward: [], // which reward was rewSelected
        respProb: [], // which probablity was selected
        respEv: [], // expected value chosen by participant
        respDifference: [], // how close was the response Probability to the correct Probability

        respRewCorrect: [], // was the chosen Reward response correct?
        respProbCorrect: [], // was the chosen Probability response correct?

        rt: [],  // reaction times
        rt_point: [],  // actual timepoints of each click

        tRew: 0, // total reward
        rewPoints:0,
        probPoints:0,
        trialRew:0,// reward each trial

        respSel:999,
        respSlide:999,
      },

      init: function(test){
    	  let object = this;

        let Title = '<H3 align = "center">Task<br></H3>';
        $('#Top').html(Title);
        $('#Stage').empty();

        let resp0 ='<div class="col"><div align = "center"><canvas class="rounded mt-5" id="myResp0" width="302" height="302" style="width: 100%;height: auto; max-width:120px;"></canvas></div></div>';
        let resp1 ='<div class="col"><div align = "center"><canvas class="rounded mt-5" id="myResp1" width="302" height="302" style=" width: 100%;height: auto; max-width:120px;"></canvas></div></div>';
        let resp2 ='<div class="col"><div align = "center"><canvas class="rounded mt-5" id="myResp2" width="302" height="302" style="width: 100%;height: auto; max-width:120px;"></canvas></div></div>';
        let resp3 ='<div class="col"><div align = "center"><canvas class="rounded mt-5" id="myResp3" width="302" height="302" style="width: 100%;height: auto; max-width:120x;"></canvas></div></div>';

        $('#Vals').html(resp0+resp1+resp2+resp3);

        setTimeout(function(){showStimuli(object,test)},300)
      }
  };

export{taskValuations}

function  showStimuli(object,test){
    let rs = object.results;
    let ss = object.stimuliSettings;
    let ts = object.taskSettings;

    // if the trial number exceeded maximum number of trials - stop
    if(rs.trial==ts.maxTrials){endTask(object,test); return}

    //if all symbols have been shown, show them again
    if(rs.stim > ss.nStim-1){shuffle(ss.gi);  rs.stim =0 ;}

    // record the time at click
    rs.rt_point.push(Date.now());


  // show reward buttons
    drawMat2(ss.RespImage[ss.ri[0]], "myResp0",302);
    drawMat2(ss.RespImage[ss.ri[1]], "myResp1",302);
    drawMat2(ss.RespImage[ss.ri[2]], "myResp2",302);
    drawMat2(ss.RespImage[ss.ri[3]], "myResp3",302);

  // show the slider
  let initValue = range(0, 100, 1);
  shuffle(initValue);
  rs.initValue = initValue[0];
  ss.clickEnabled = true;
  ss.rewSelected = false;
  let sliderHTML = SliderManager.generateSlider({ text: "",
      min: 0.0, max: 100.0, step: 1, initValue: initValue[0]});
  let buttonHTML = generateSubmitButton();
  let currentImage = ss.StimImage[ss.gi[ss.A[rs.stim]]];

  $('#Stage').html(currentImage);
  $('#Slider').html(sliderHTML);
  $('#GameButton').html(buttonHTML);
  //appendElement('Slider', sliderHTML);
  //appendElement('GameButton', buttonHTML);

    // Button Selection
    rs.respSel = 999;
    document.getElementById("myResp0").onclick = function(){selectReward(object)};
    document.getElementById("myResp1").onclick = function(){selectReward(object)};
    document.getElementById("myResp2").onclick = function(){selectReward(object)};
    document.getElementById("myResp3").onclick = function(){selectReward(object)};


    // Submit Button Manager
    rs.respSlide = 999;
    SliderManager.listenOnSlider({}, function (event) {
        if (ss.clickEnabled&ss.rewSelected) {
            rs.respSlide = event.data.slider.val();
            recordResponse(object,test)
        }
    });

    // allows to change value using left and right arrows
   SliderManager.listenOnArrowKeys();
}

  // record responses
function  recordResponse(object,test){
    let rs = object.results;
    let ss = object.stimuliSettings;
    let ts = object.taskSettings;


    let symbol = ss.vi[ss.gi[ss.A[rs.stim]]];

    // Prevent another button press
      ss.clickEnabled= false;
      ss.rewSelected = false;

      // Record RT
      rs.rt.push(Date.now()-rs.rt_point[rs.rt_point.length-1]);

    // Record response and send to DB
    //  rs.respKey.push(parseInt(event.target.id.charAt(6))); // which position was chosen
    //  rs.respKeyID.push(event.target.id); // exact id of the position

      rs.symbol.push(ss.gi[ss.A[rs.stim]]);  // which symbol was presented
      rs.symbolReward.push(ss.r[symbol]);
      rs.symbolProb.push(ss.p[symbol]);
      rs.symbolEv.push(ss.r[symbol]*ss.p[symbol]/100);

      rs.respKey.push(rs.respSel)
      rs.respReward.push(ss.resps[ss.ri[rs.respSel]])
      rs.respProb.push(rs.respSlide)
      rs.respEv.push(rs.respSlide*ss.resps[ss.ri[rs.respSel]]/100)

      // What was the probablity difference
      let difference = Math.abs(getLastValue(rs.symbolProb)-getLastValue(rs.respProb));
      rs.respDifference.push(difference);

      // Was the reward correct?
      if(getLastValue(rs.symbolReward) == getLastValue(rs.respReward)){
        rs.respRewCorrect.push(1);
        rs.rewPoints = 5 ;
      }
      else{
        rs.respRewCorrect.push(0);
        rs.rewPoints = 0 ;
      }

      // Was the probability correct? (i.e. less than 10% from the correct percentage)
      if (difference <= 10){
        rs.respProbCorrect.push(1);
        rs.probPoints = (10-difference)/2;
      }

      // if the response is more than 10 points from the goal, give 0
      else{
        rs.respProbCorrect.push(0);
        rs.probPoints = 0;
      }

      rs.trialRew = rs.rewPoints + rs.probPoints;
      rs.tRew = rs.tRew+rs.trialRew;

   //Send to Database
   sendToDB(0,
   { partID: test.ID,
     expID: test.expID,
     tsName: ts.taskName,
     trial: rs.trial,
     reactionTime: getLastValue(rs.rt),
     symbol: getLastValue(rs.symbol),
     symbolID: symbol,
     symbolProb: getLastValue(rs.symbolProb),
     symbolReward:getLastValue(rs.symbolReward),
     symbolEv:getLastValue(rs.symbolEv),
     initProb: rs.initValue,
     respKey:getLastValue(rs.respKey),
     respProb:getLastValue(rs.respProb),
     respReward:getLastValue(rs.respReward),
     respEv:getLastValue(rs.respEv),
     respDifference:getLastValue(rs.respDifference),
     respRewCorrect:getLastValue(rs.respRewCorrect),
     respProbCorrect:getLastValue(rs.respProbCorrect),
     totalReward:rs.tRew,
     trialReward:rs.trialRew,
     probPoints: rs.probPoints,
     rewPoints: rs.rewPoints,

},
'php/InsertValuationUnitedDataDB.php');

// Start the new trial
  //$('#Stage').empty();
  //$('#Slider').empty();
  //$('#GameButton').empty();

// Raise trial Num
    rs.trial ++
    rs.stim ++
// shuffle response order for the next trial
    shuffle(ss.ri)

  let newTrial =  setTimeout(function(){showStimuli(object,test)},  200);
}

function  selectReward(object) {
  let rs = object.results;
  let newId = event.target.id;

  if(rs.respSel == 999){
    GV_highlight(newId)
    rs.respSel =parseInt(event.target.id.charAt(6))
    ss.rewSelected=true
  }
  else{
    let id = "myResp"+rs.respSel;
    drawMat2(ss.RespImage[ss.ri[rs.respSel]],id,302);
    GV_highlight(newId)
    rs.respSel =parseInt(event.target.id.charAt(6))
    ss.rewSelected=true
  }
}

function  GV_highlight(canvasID) {
    let  frx = document.getElementById(canvasID).getContext("2d");
    frx.lineWidth = "25";
    frx.strokeStyle = "black";
    frx.strokeRect(0, 0, 302, 302);}

function     endTask(object,test){
       let ts = object.taskSettings;
       let rs = object.results;

       // clear everything
         $('#Stage').empty();
         $('#Vals').empty();
	 $('#Slider').empty();
	$('#GameButton').empty();
         $('#Bottom').empty();
         $('#Top').empty();


       // Write on the matrix end of the trial
         let Title = '<h3 align = "center" style="color: #3C455C;"> End </h3>'
         let EndText ='<div class="col"><h5 align = "center"> <br> This is the end of the task!</h5> ' +
     	'<p align = "center" ><br> You won '+rs.tRew+' points. <br></p></div>' ;

         let EndBut = '<div align="center"><input type="button"  class="btn btn-default" id="bEnd" value="Please click here to continue" style="background-color: #3C455C; color:#FFFFFF"></div>';

         $('#Top').html('<div class="row justify-content-center">'+Title+'</div>');
         $('#Stage').html('<div class="row justify-content-center">'+EndText+'</div>');
         $('#GameButton').html('<div class="row justify-content-center">'+EndBut+'</div>');

         document.getElementById("bEnd").onclick = function(){

                 $('#Top').empty();
                 $('#Stage').empty();
                 $('#Vals').empty();
                 $('#GameButton').empty();
                 $('#Bottom').empty();
                 orderFunc(test);
               };

     }

     function drawMat(image,id,size) {
       let Ax = document.getElementById(id).getContext("2d");
       Ax.drawImage(image,0,0);
       Ax.lineWidth = "5";
       Ax.strokeStyle = "black";
       Ax.strokeRect(0, 0, size, size);
     }

     function drawMat2(image,id,size) {
       let Ax = document.getElementById(id).getContext("2d");
       Ax.drawImage(image,0,0);
       Ax.lineWidth = "10";
       Ax.strokeStyle = "black";
       Ax.strokeRect(0, 0, size, size);
     }


     function drawResp(resp,id,size) {
       let Ax = document.getElementById(id).getContext("2d");
       Ax.fillText(resp,0,0);
       Ax.lineWidth = "5";
       Ax.strokeStyle = "black";
       Ax.strokeRect(0, 0, size, size);
     }
