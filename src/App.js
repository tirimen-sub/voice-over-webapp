import React, { useEffect, useState, useRef } from 'react';
import { fetchQuestions, sendVoiceResponse } from './api';
import QuestionCircle from './QuestionCircle';

const App = () => {
  const [questions, setQuestions]       = useState([]);
  const [selectedQuestion, setSelected] = useState(null);
  const [error, setError]               = useState(null);
  const [isRecording, setIsRecording]   = useState(false);
  const [audioBlob, setAudioBlob]       = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  // 質問のフェッチ
  useEffect(() => {
    (async () => {
      const qs = await fetchQuestions();
      setQuestions(qs);
    })();
  }, []);

  // 録音開始
  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mr.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      setError('マイクへのアクセスに失敗しました');
    }
  };

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // サーバーへアップロード
  const uploadAudio = async () => {
    if (!selectedQuestion || !audioBlob) return;
    setError(null);
    try {
      const res = await sendVoiceResponse(selectedQuestion.id, audioBlob);
      console.log('サーバー応答:', res);
      // 質問を「回答済み」にマーク
      setQuestions(qs =>
        qs.map(q =>
          q.id === selectedQuestion.id
            ? { ...q, answered: true }
            : q
        )
      );
      // UIをリセット
      setSelected(null);
      setAudioBlob(null);
    } catch (e) {
      setError('音声回答の送信に失敗しました');
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Voice Over</h1>

      {/* 質問リスト */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {questions.map(q => (
          <div key={q.id} onClick={() => { if (!q.answered) {
            setSelected(q)
          }
        }}
        >
            <QuestionCircle text={q.text} answered={q.answered} />
          </div>
        ))}
      </div>

      {/* 選択中の質問が未回答なら録音UIを表示 */}
      {selectedQuestion && !selectedQuestion.answered && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h2>質問: {selectedQuestion.text}</h2>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{ padding: '8px 16px', marginRight: 10 }}
          >
            {isRecording ? '録音停止' : '録音開始'}
          </button>

          {/* 録音終了後、音声データがあればアップロードボタンを表示 */}
          {audioBlob && (
            <button
              onClick={uploadAudio}
              style={{ padding: '8px 16px' }}
            >
              音声をアップロード
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;