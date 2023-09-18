let mediaRecorder;
let audioChunks = [];


function saveScore() {

    const formData = new FormData();
    formData.append('avg_score', score);
    formData.append('nickname', "test");
    var score = 88;

    var xhr = new XMLHttpRequest();
    
    xhr.open('POST', '/rank/score', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // send score for form 
    xhr.send(formData);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('success');
        }
    }

}

// Access the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function (stream) {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function () {
      // Create a Blob from the audio chunks
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recorded_audio.wav');
      // Reset audioChunks array
      audioChunks = [];

      // Send the Blob to the server using the Fetch API
      fetch('/upload-audio', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          // Handle the server response here
          console.log('Audio file uploaded:', response);

          // After uploading, set the audio source and play it
          const audioPlayer = document.getElementById('audioPlayer');
          audioPlayer.src = URL.createObjectURL(audioBlob);
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
        });
    };
  })
  .catch(function (error) {
    console.error('Error accessing microphone:', error);
  });

// Start recording
document.getElementById('startRecord').addEventListener('click', function () {
  mediaRecorder.start();
  this.disabled = true;
  document.getElementById('stopRecord').disabled = false;
});

// Stop recording
document.getElementById('stopRecord').addEventListener('click', function () {
  mediaRecorder.stop();
  this.disabled = true;
  document.getElementById('startRecord').disabled = false;
});


        const sentences = [
            "올망졸망",
            "똘망똘망",
            "드르륵 두루륵 두르루륵"
        ];

        // 문장을 보여주는 요소와 버튼 요소 가져오기
        const sentenceDisplay = document.getElementById("sentenceDisplay");
        const showSentenceButton = document.getElementById("showSentenceButton");
        const finalButtonclass = document.getElementById("finalButtonclass");
        const finalButton = document.getElementById("finalButton");

        const result = document.getElementById('result');
        let resultArray=sessionStorage.getItem('result')?JSON.parse(sessionStorage.getItem('result')):[];

        let currentSentenceIndex = 0;
        
        // 초기에 finalButton 숨기기
        finalButtonclass.style.display = "none";

        // 초기에 첫 번째 문장을 보여주기
        sentenceDisplay.textContent = sentences[currentSentenceIndex];

        // 버튼 클릭 시 다음 문장 보여주기
        showSentenceButton.addEventListener("click", function(e) {
            currentSentenceIndex++;
            if (currentSentenceIndex >= sentences.length) {
                currentSentenceIndex = 0; // 마지막 문장 이후에는 첫 번째 문장으로 돌아갑니다.
                showSentenceButton.style.display = "none"; // showSentenceButton 숨기기
                startRecord.style.display="none";
                stopRecord.style.display="none";
                finalButtonclass.style.display = "block"; // finalButton 표시하기
            }
            sentenceDisplay.textContent = sentences[currentSentenceIndex];
            
            e.preventDefault();
            resultArray.push(result.value);
            sessionStorage.setItem('result',JSON.stringify(resultArray));
        });

        finalButton.addEventListener("click", function(e) {
          // resultArray 배열에 있는 모든 값을 더합니다.
          e.preventDefault()
          const nickname = document.getElementById("nickname").value;    

          const sum = resultArray.reduce((accumulator, currentValue) => {
            const numberValue = parseFloat(currentValue); // 결과 값이 문자열일 수 있으므로 숫자로 변환합니다.
            if (!isNaN(numberValue)) {
              return accumulator + numberValue;
            }
            return accumulator; // 숫자로 변환할 수 없는 값은 무시합니다.
          }, 0);
        
          const average = sum / resultArray.length;
        
          console.log('평균:', average);
          
          sessionStorage.clear();
        });