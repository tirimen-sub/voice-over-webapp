// src/services/api.js

// Heroku 上の API エンドポイント
// （必要に応じて環境変数化も可能です）
const API_BASE_URL = 'https://voice-over-api-140d9b2c8155.herokuapp.com';

// HTTP レスポンスの JSON をパースし、ok=false のときは例外を throw
async function parseJson(res) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || res.statusText);
  }
  return json.data;
}

// 質問一覧取得
export async function fetchQuestions() {
  const res = await fetch(`${API_BASE_URL}/questions`);
  return await parseJson(res);
}

// 質問投稿
export async function postQuestion(text) {
  const res = await fetch(`${API_BASE_URL}/questions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text })
  });
  return await parseJson(res);
}

// 録音データを送信 → { id, question_id, audio_url, created_at } を camelCase に変換
export async function sendVoiceResponse(questionId, audioBlob) {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('audio', audioBlob, `response-${questionId}.wav`);

  const res = await fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    body:   formData
  });
  const d = await parseJson(res);
  return {
    id:         d.id,
    questionId: d.question_id,
    audioUrl:   d.audio_url,
    createdAt:  d.created_at
  };
}

// 質問に紐づく回答一覧取得 → [{ audio_url, created_at }] を camelCase に変換
export async function fetchResponses(questionId) {
  const res = await fetch(`${API_BASE_URL}/responses/${questionId}`);
  const ary = await parseJson(res);
  return ary.map(d => ({
    audioUrl:  d.audio_url,
    createdAt: d.created_at
  }));
}


/**
 * サーバー側 /api/check-ip を叩いて
 * { allowed: true/false } を返すだけのシンプルな関数
 */
export async function checkIpAllowed() {
  const res = await fetch(`${API_BASE_URL}/api/check-ip`, {
    method: 'GET',
    // 必要なら credentials: 'include' など
  });
  // レスポンス JSON は { allowed: true } か { allowed: false }
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || res.statusText);
  }
  return json.allowed;
}