

document.getElementById("input-textarea").addEventListener("input", function() {
    var submitBtn = document.getElementById("submit-btn");
    if (this.value.trim() !== "") {
        submitBtn.style.backgroundColor = "#C24914";
    } else {
        submitBtn.style.backgroundColor = "#D9D9D9";
    }
});

const btn = document.getElementById("analysis-btn"); 
const modal = document.getElementById("modalWrap"); 
const closeBtn = document.getElementById("closeBtn"); 

btn.onclick = function () {
  modal.style.display = "block"; 
};

closeBtn.onclick = function () {
  modal.style.display = "none"; 
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none"; 
  }
};

let isRecording = false;
let recorder = null;
let chunks = [];
let audioPlayer = null; 

document.querySelector('.voice-btn').addEventListener('click', async () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
    isRecording = true;
    chunks = [];

    if (audioPlayer) {
        audioPlayer.remove();
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = function(e) {
                chunks.push(e.data);
            };
            recorder.onstop = function() {
                isRecording = false;
                const blob = new Blob(chunks, { 'type' : 'audio/wav' });
                const audioURL = URL.createObjectURL(blob);
                addAudioPlayer(audioURL);
            };
            recorder.start();
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
}

function stopRecording() {
    if (recorder) {
        recorder.stop();
    }
}

document.querySelector('.save-btn').addEventListener('click', () => {

    if (chunks.length === 0) {
        console.error('No audio data to upload');
        return; 
    }

    const blob = new Blob(chunks, { 'type' : 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', blob, 'recorded_audio.wav');

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('File uploaded successfully');
            document.getElementById('analysis-btn').style.backgroundColor = "#C24914";
        } else {
            console.error('Error uploading file');
            document.getElementById('analysis-btn').style.backgroundColor = "#D9D9D9";
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

function addAudioPlayer(audioURL) {
    const audioContainer = document.querySelector('.practice');
    audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.src = audioURL;
    audioContainer.appendChild(audioPlayer);
}
