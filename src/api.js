const API_BASE_URL = 'https://voice-over-api-140d9b2c8155.herokuapp.com';

// HTTP レスポンスから data 部分だけ取り出して throw もまとめる
async function parseJson(res) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || res.statusText);
  }
  return json.data;
}

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE_URL}/questions`);
  return await parseJson(res);
}

export async function postQuestion(text) {
  const res = await fetch(`${API_BASE_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return await parseJson(res);
}

/**
 * 送信後に返ってくる data の形は
 *   { id, question_id, audio_url, created_at }
 * を、camelCase に変換して返す
 */
export async function sendVoiceResponse(questionId, audioBlob) {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('audio', audioBlob, `response-${questionId}.wav`);

  const res = await fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    body: formData
  });
  const d = await parseJson(res);
  return {
    id:         d.id,
    questionId: d.question_id,
    audioUrl:   d.audio_url,
    createdAt:  d.created_at
  };
}

/**
 * fetchResponses は
 *   [ { audio_url, created_at } ]
 * を返すので、こちらも camelCase に直す
 */
export async function fetchResponses(questionId) {
  const res = await fetch(`${API_BASE_URL}/responses/${questionId}`);
  const ary = await parseJson(res);
  return ary.map(d => ({
    audioUrl:  d.audio_url,
    createdAt: d.created_at
  }));
}