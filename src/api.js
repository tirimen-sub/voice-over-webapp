// src/api.js
const API_BASE_URL =  'https://voice-over-api-140d9b2c8155.herokuapp.com';

/**
 * 質問一覧を取得
 */
export async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE_URL}/questions`);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('fetchQuestions error:', err);
    return [];
  }
}

/**
 * 音声回答を送信
 * @param {number|string} questionId
 * @param {Blob} audioBlob
 */
export async function sendVoiceResponse(questionId, audioBlob) {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('audio', audioBlob, `response-${questionId}.wav`);

  try {
    const res = await fetch(`${API_BASE_URL}/responses`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`status ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    console.error('sendVoiceResponse error:', err);
    throw err;
  }
}