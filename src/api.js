const API_BASE_URL = 'https://voice-over-api-140d9b2c8155.herokuapp.com';

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE_URL}/questions`);
  if (!res.ok) throw new Error(res.statusText);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function sendVoiceResponse(questionId, audioBlob) {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('audio', audioBlob, `response-${questionId}.wav`);

  const res = await fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`status ${res.status}: ${text}`);
  }
  return await res.json();
}

export const postQuestion = text =>
  fetch(`${API_BASE_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(json => json.data);   // ← data 部分だけ返す

/**
 * 回答済みの音声URLを取得
 * @param {number|string} questionId
 * @returns {Promise<Array<{audio_url:string}>>}
 */
export async function fetchResponses(questionId) {
  const res = await fetch(`${API_BASE_URL}/responses/${questionId}`);
  if (!res.ok) throw new Error(res.statusText);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}