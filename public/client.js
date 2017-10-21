// this is pretty much midnight hacking
// forgive the mess, and bless.

(function() {

  let width = 320;
  let height = 0;

  let streaming = false;
  let faceTrackInterval = null;

  let video = null;
  let canvas = null;
  let context = null;
  let faceRect = null;
  let emoji = null;
  
  // paste your own face api key here
  const faceApiKey = "";
  // paste your own face api region here
  const faceApiRegion = "eastus";
  const faceAttributes = ["emotion", "headPose"];
  const faceApiParams = `returnFaceAttributes=${faceAttributes.join(",")}`;
  const faceApiDetectUrl = `https://${faceApiRegion}.api.cognitive.microsoft.com/face/v1.0/detect?${faceApiParams}`;

  
  const emojiMap = {
    "neutral": "https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Fneutral.png?1508479373394",
    "anger": "https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Fanger.png?1508479373529",
    "happiness": "https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Fhappiness.png?1508479373769",
    "surprise": "https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Fsurprise.png?1508479373805",
    "sadness": "https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Fsadness.png?1508479373827" 
  };

  function onLoad() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    faceRect = document.getElementById("faceRect");
    emoji = document.getElementById("emoji");
    context = canvas.getContext("2d");
    

    video.addEventListener("canplay", onVideoCanPlay, false);
    
    video.addEventListener("error", (error) => {
      dealWithFailure(error);
      if (faceTrackInterval) clearInterval(faceTrackInterval);
    });
    
    const constraints = {
      video: true,
      audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(onGetMedia)
      .catch(dealWithFailure);
  }
  
  function onVideoCanPlay() {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);

      video.setAttribute("width", width);
      video.setAttribute("height", height);
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      streaming = true;

      if (faceTrackInterval) return;
      faceTrackInterval = setInterval(trackFace, 1000 / 7);
    }
  }

  function onGetMedia(stream) {
    const vendorURL = window.URL || window.webkitURL;
    video.src = vendorURL.createObjectURL(stream);
    video.play();
  }
  
  function trackFace() {
    context.drawImage(video, 0, 0, width, height);
    canvas.toBlob(updateFace);
  }
  
  function updateFace(photo) {
    detectFaces(photo)
      .then((response) => response.json())
      .then((response) => placeEmoji(response[0]))
      .catch(dealWithFailure);
  }
  
  // this places a green rectangle framing the face for debugging purposes
  function placeFaceRect(response) {
    const rect = response.faceRectangle;
    const roll = response.faceAttributes.headPose.roll;
    
    const styleUpdates = {
      height: `${rect.height}px`,
      width: `${rect.width}px`,
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      transform: `rotate(${roll}deg)`
    };
    
    requestAnimationFrame(() => {
      Object.keys(styleUpdates).forEach(prop => faceRect.style[prop] = styleUpdates[prop]);
    });
  }
  
  function placeEmoji(response) {
    const rect = response.faceRectangle;
    const roll = response.faceAttributes.headPose.roll;
    const emotion = findDominantEmotion(response.faceAttributes.emotion);
    const emojiSrc = emojiMap[emotion] || emojiMap.neutral;
    
    const styleUpdates = {
      height: `${rect.height}px`,
      width: `${rect.width}px`,
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      transform: `rotate(${roll}deg)`,
      display: "inline"
    };
    
    requestAnimationFrame(() => {
      Object.keys(styleUpdates).forEach(prop => emoji.style[prop] = styleUpdates[prop]);
      emoji.src = emojiSrc;
    });
  }
  
  function findDominantEmotion(emotions) {
    const sorted = Object.keys(emotions).sort((a,b) => emotions[a] - emotions[b]);
    return sorted.pop();
  }
  
  function detectFaces(photo) {
    const options = {
      method: "POST",
      body: photo,
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": faceApiKey
      }
    };

    return fetch(faceApiDetectUrl, options);
  }
  
  function dealWithFailure(reason) {
    console.error("fail!", reason);
  }

  window.addEventListener("load", onLoad, false);
})();