let detections = {};

const toggleBtnLight = document.querySelector('.toggle-light');
const toggleBtnFan = document.querySelector('.toggle-fan');
const toggleBtnDoor = document.querySelector('.toggle-door');

const detailBtnLight = document.querySelector('.detail-light');
const detailBtnFan = document.querySelector('.detail-fan');
const detailBtnDoor = document.querySelector('.detail-door');

const videoElement = document.getElementById('video');

let countDetect = 0 ;

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 4,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

hands.onResults(gotHands);

function gotHands(results) {
  detections = results;
  let {multiHandLandmarks} = results;
  let arr = multiHandLandmarks[0];
  if(arr){
    countDetect += 1; 
    console.log(arr[8])
    const {x} = arr[8]
    btnYesHandler(x);
  }
  else {
    toggleBtnLight.style.opacity = 1; 
    toggleBtnFan.style.opacity = 1;
    toggleBtnDoor.style.opacity = 1;
    countDetect = 0 ;
  }
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();
const btnYesHandler = (x) => {
  if (x>0.1 && x<0.25) {
    toggleBtnLight.style.opacity = 0.5;
    if(countDetect>30){
      detailBtnLight.textContent = detailBtnLight.textContent=='OFF'?'ON':'OFF';
      countDetect = 0 ; 
    }
  }
  else if (x>0.4 && x<0.65){
    toggleBtnFan.style.opacity = 0.5 ; 
    if(countDetect>30){
      detailBtnFan.textContent = detailBtnFan.textContent=='OFF'?'ON':'OFF';
      countDetect = 0 ; 
    }
  } 
  else if (x>0.8 && x<1){
    toggleBtnDoor.style.opacity = 0.5 ; 
    if(countDetect>30){
      detailBtnDoor.textContent = detailBtnDoor.textContent=='OFF'?'ON':'OFF';
      countDetect = 0 ;
    }
  }
  else {
    toggleBtnLight.style.opacity = 1; 
    toggleBtnFan.style.opacity = 1;
    toggleBtnDoor.style.opacity = 1;
    countDetect = 0 ;
  }
}