// src/AudioRecorder.js
import React, { useState } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];
  
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        function sendVoiceResponse(audioBlob) {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');
        
          return fetch('https://voice-over-api-140d9b2c8155.herokuapp.com/upload', {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => {
              console.log('Successfully uploaded:', data);
            })
            .catch(error => {
              console.error('Error uploading:', error);
            });
        }
      };
  
      mediaRecorder.start();
      setIsRecording(true);
  
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000); // 5秒間録音
    } catch (err) {
      console.error('Microphone access denied or error occurred:', err);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      {audioURL && (
        <audio controls src={audioURL} />
      )}
    </div>
  );
};

export default AudioRecorder;