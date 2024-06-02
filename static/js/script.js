

document.getElementById("input-textarea").addEventListener("input", function() {
    var submitBtn = document.getElementById("submit-btn");
    if (this.value.trim() !== "") {
        submitBtn.style.backgroundColor = "#C24914";
    } else {
        submitBtn.style.backgroundColor = "#D9D9D9";
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('analysis-btn');
    const modal = document.getElementById('modalWrap');
    const closeBtn = document.getElementById('closeBtn');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message'); // <h4> 요소
    const graphImage = document.getElementById("graphImage");

    // URL에서 audio_url 값을 추출
    const audioUrl = new URLSearchParams(window.location.search).get('audio_url');
    const filePath = './static/audio/userAudio/recorded_audio.wav';

    btn.disabled = false; // 버튼 활성화

    btn.onclick = function () {
        fetch(`/similarity?audio_url=${audioUrl}&file_path=${filePath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                const similarityScore = data.similarity;
                const imagePath = data.imagePath;
                scoreElement.textContent = `당신의 올투리력은 ${similarityScore} % 입니다.`;
                graphImage.src = imagePath;

                // 유사성 점수에 따라 메시지 변경
                if (similarityScore <= 50) {
                    messageElement.textContent = "당신은 아직 서울 사람... ㅡ.ㅡ";
                } else if (similarityScore > 50 && similarityScore < 85) {
                    messageElement.textContent = "당신은 애매..하네요..";
                } else {
                    messageElement.textContent = "당신은 확신의 지방사람!";
                }

                modal.style.display = "block";
            })
            .catch(error => {
                console.error('Error fetching similarity score:', error);
                alert('유사성 점수를 가져오는 데 오류가 발생했습니다: ' + error.message);
            });
    };

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };
});


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

