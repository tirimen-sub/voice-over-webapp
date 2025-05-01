// src/api.js
const API_BASE_URL = 'https://voice-over-api-140d9b2c8155.herokuapp.com';

export function fetchQuestions() {
  return fetch(`${API_BASE_URL}/questions`)
    .then(response => response.json());
}

export function sendVoiceResponse(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-response.wav');

  return fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    body: formData,
  }).then(response => response.json());
}