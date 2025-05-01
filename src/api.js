// src/api.js
const API_BASE_URL = 'https://voice-over-api-140d9b2c8155.herokuapp.com';

export function fetchQuestions() {
    return fetch(`${API_BASE_URL}/questions`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(json => {
        console.log("Fetched data:", json); // データを確認
        const questions = Array.isArray(json.data) ? json.data : [];
        return questions;
      })
      .catch(error => {
        console.error('There was a problem with fetch:', error);
        return []; // エラー発生時に空配列を返す
      });
  }

export function sendVoiceResponse(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-response.wav');

  return fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    body: formData,
  }).then(response => response.json());
}