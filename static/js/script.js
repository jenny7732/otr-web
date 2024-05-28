

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

btn.disabled = true;

btn.onclick = function () {
    
    // analysis-btn 클릭 시 서버에 GET 요청을 보냅니다.
    // const audioUrl = document.getElementById("audio_url").innerText;
    
    fetch(`/similarity`, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            // 응답에서 similarity를 가져와서 HTML에 표시합니다.
            const similarity = document.getElementById("similarity");
            const result = document.getElementById("result");
            similarity.textContent = data.similarity;
            result.textContent = `당신의 올투리력은 ${data.similarity}% 입니다`;
        })
        .catch(error => console.error('Error:', error));
    
    // 모달창을 표시합니다.
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


let audioRecorder;
var audio = document.querySelector('audio'); 

function startRecording(){
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        audioRecorder = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,
            desiredSampRate: 16000,
            bufferSize: 16384,
        });

        audioRecorder.startRecording();
    })
    .catch(function (error) {
        console.error('getUserMedia error:', error);
    });
}

function stopRecording(){
    if (audioRecorder) {
        audioRecorder.stopRecording(function() {
            let audioBlob = audioRecorder.getBlob();
            const url = window.URL.createObjectURL(audioBlob);
            audio.src = url;
            audio.play();
            
            // // 파일 다운로드
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'recorded_audio.wav';
            // a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            // 서버에 업로드
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recorded_audio.wav');
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                console.log(data.file_path);
            })
            .catch(error => console.error('Error:', error));
        });
    } else {
        console.error('audioRecorder is not defined');
    }

    document.getElementById("analysis-btn").style.backgroundColor = "#C24914";
    btn.disabled = false;
}

document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);

