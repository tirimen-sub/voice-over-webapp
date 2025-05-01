import React, { useEffect, useState, useRef } from 'react';
import {
  fetchQuestions,
  sendVoiceResponse,
  fetchResponses
} from './api';
import QuestionCircle from './QuestionCircle';

const App = () => {
  const [questions, setQuestions]     = useState([]);
  const [selectedQuestion, setSelected] = useState(null);
  const [mode, setMode]               = useState(null); // 'record' or 'play'
  const [playUrls, setPlayUrls]       = useState([]);
  const [error, setError]             = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob]     = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  useEffect(() => {
    (async () => {
      const qs = await fetchQuestions();
      setQuestions(qs);
    })();
  }, []);

  // 質問クリック時
  const handleSelect = async (q) => {
    setError(null);
    setAudioBlob(null);
    if (!q.answered) {
      // 録音モード
      setMode('record');
      setSelected(q);
    } else {
      // 再生モード
      setMode('play');
      setSelected(q);
      try {
        const responses = await fetchResponses(q.id);
        setPlayUrls(responses.map(r => r.audio_url));
      } catch (e) {
        setError('音声取得に失敗しました');
      }
    }
  };

  // 録音開始
  const startRecording = async () => {
    setError(null);
    setPlayUrls([]);
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
    } catch {
      setError('マイクへのアクセスに失敗しました');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!selectedQuestion || !audioBlob) return;
    setError(null);
    try {
      const res = await sendVoiceResponse(selectedQuestion.id, audioBlob);
      // 質問を回答済みに更新
      setQuestions(qs =>
        qs.map(q =>
          q.id === selectedQuestion.id
            ? { ...q, answered: true }
            : q
        )
      );
      setMode('play');
      // アップロード直後、再生URLを画面に反映
      setPlayUrls([res.data.audioUrl]);
    } catch {
      setError('音声回答の送信に失敗しました');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Voice Over</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* 質問リスト */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {questions.map(q => (
          <div key={q.id} onClick={() => handleSelect(q)}>
            <QuestionCircle text={q.text} answered={q.answered} />
          </div>
        ))}
      </div>

      {/* 録音モード */}
      {selectedQuestion && mode === 'record' && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h2>質問: {selectedQuestion.text}</h2>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? '録音停止' : '録音開始'}
          </button>
          {audioBlob && <button onClick={uploadAudio}>音声をアップロード</button>}
        </div>
      )}

      {/* 再生モード */}
      {selectedQuestion && mode === 'play' && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h2>回答済みの質問: {selectedQuestion.text}</h2>
          {playUrls.length > 0 ? (
            playUrls.map((url, i) => (
              <audio key={i} controls src={url} style={{ display: 'block', margin: '10px auto' }} />
            ))
          ) : (
            <p>音声が見つかりません</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;