// App.js
import React, { useEffect, useState, useRef } from 'react';
import {
  fetchQuestions,
  sendVoiceResponse,
  fetchResponses,
  postQuestion
} from './api';
import QuestionCircle from './QuestionCircle';
import './App.css';  // 下記CSSを追加してください
import BgVideo from './bgVideo.js';

const App = () => {
  // 追加ステート
  const [isStarted, setIsStarted]       = useState(false);
  const [showThrowModal, setShowThrow]  = useState(false);
  const [newQuestionText, setNewText]   = useState('');

  // 既存ステート
  const [questions, setQuestions]       = useState([]);
  const [selectedQuestion, setSelected] = useState(null);
  const [mode, setMode]                 = useState(null); // 'record' or 'play'
  const [playUrls, setPlayUrls]         = useState([]);
  const [error, setError]               = useState(null);
  const [isRecording, setIsRecording]   = useState(false);
  const [audioBlob, setAudioBlob]       = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

// App.js の上部にでも
function generateBubbleStyle(text) {
  const baseFontSize = 14;                        // フォントサイズ
  const textLength   = text.length;
  // 文字数に合わせた直径を算出（min=50px, max=200px）
  const diameter = Math.min(
    200,
    Math.max(50, textLength * baseFontSize + 20)
  );

  // 漂流アニメ用乱数
  const driftX   = Math.random() * 200 - 100;     // -100px～+100px
  const driftY   = Math.random() * 200 - 100;     // -100px～+100px
  const duration = Math.random() * 8 + 4;         // 4s～12s

  // 初期位置は画面中央寄り(20%～80%)
  const topPct  = 20 + Math.random() * 60;
  const leftPct = 20 + Math.random() * 60;

  return {
    width:             `${diameter}px`,
    height:            `${diameter}px`,
    fontSize:          `${baseFontSize}px`,
    top:               `${topPct}%`,
    left:              `${leftPct}%`,
    '--drift-x':       `${driftX}px`,
    '--drift-y':       `${driftY}px`,
    animationDuration: `${duration}s`,
  };
}

  useEffect(() => {
    (async () => {
      const qs = await fetchQuestions();
      console.log("APIリスト:", qs);
      const styled = qs.map(q => ({
        ...q,
        _style: generateBubbleStyle(q.text)
      }));
      setQuestions(styled);
    })();
  }, []);

  // タイトル画面のスタートボタン
  const handleStart = () => {
    setIsStarted(true);
  };

  // 質問クリック → モーダルオープン
  const handleSelect = async (q) => {
    setError(null);
    setAudioBlob(null);
    setSelected(q);
    if (!q.answered) {
      setMode('record');
    } else {
      setMode('play');
      try {
        const responses = await fetchResponses(q.id);
        setPlayUrls(responses.map(r => r.audio_url));
      } catch {
        setError('音声取得に失敗しました');
      }
    }
  };

  // 質問モーダルを閉じる
  const handleCloseQuestion = () => {
    setSelected(null);
    setMode(null);
    setPlayUrls([]);
  };

  // 録音開始／停止
  const startRecording = async () => {
    setError(null);
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

  // 音声アップロード → 回答完了
  const uploadAudio = async () => {
    if (!selectedQuestion || !audioBlob) return;
    setError(null);
    try {
      const res = await sendVoiceResponse(selectedQuestion.id, audioBlob);
      // 質問リストを更新
      setQuestions(qs =>
        qs.map(q =>
          q.id === selectedQuestion.id
            ? { ...q, answered: true }
            : q
        )
      );
      // モーダルはそのまま開いて play モードに切り替え
      setMode('play');
      setPlayUrls([res.data.audioUrl]);
    } catch {
      setError('音声回答の送信に失敗しました');
    }
  };

  // “ボトルを投げる”押下
  const handleThrowClick = () => {
    setShowThrow(true);
  };
  const handleCloseThrow = () => {
    setShowThrow(false);
    setNewText('');
  };

  // 新規質問POST
  const handleSubmitNewQuestion = async () => {
    if (!newQuestionText.trim()) return;
    try {
      const newQ = await postQuestion(newQuestionText.trim());
      const styledNewQ = {
        ...newQ,
        _style: generateBubbleStyle(newQ.text)
      }
      setQuestions(prev => [styledNewQ, ...prev]);
      handleCloseThrow();
    } catch {
      setError('質問の投稿に失敗しました');
    }
  };

  // 回答済みの数
  const answeredCount = questions.filter(q => q.answered).length;

  return (
    <div className="App">
      {/* タイトル画面 */}
      {!isStarted ? (
        <div className="title-screen">
          <BgVideo />
          <h1>Voice Over</h1>
          <button className="start-button" onClick={handleStart}>
            スタート
          </button>
        </div>
      ) : (
        <>
          <h1>Voice Over</h1>
          {error && <div className="error">{error}</div>}

          {/* 質問一覧 */}
            <div className="bubble-container">
              {questions.map(q => (
                <div
                  key={q.id}
                  className="bubble"
                  onClick={() => handleSelect(q)}
                  style={q._style}
                >
                    <div className="bubble-content">
                      {q.text}
                    </div>
                 </div>
                ))}
             </div>

          {/* 回答済みが１つ以上あれば “ボトルを投げる” ボタン表示 */}
          {answeredCount > 0 && (
            <button className="throw-button" onClick={handleThrowClick}>
              ボトルを投げる
            </button>
          )}
        </>
      )}

      {/* 質問モーダル */}
      {selectedQuestion && (
        <div className="modal-overlay" onClick={handleCloseQuestion}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseQuestion}>
              ×
            </button>
            {mode === 'record' && (
              <>
                <h2>質問: {selectedQuestion.text}</h2>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? '録音停止' : '録音開始'}
                </button>
                {audioBlob && (
                  <button onClick={uploadAudio}>音声をアップロード</button>
                )}
              </>
            )}
            {mode === 'play' && (
              <>
                <h2>回答済みの質問: {selectedQuestion.text}</h2>
                {playUrls.length > 0 ? (
                  playUrls.map((url, i) => (
                    <audio
                      key={`${url}-${i}`}
                      controls
                      src={url}
                      style={{ display: 'block', margin: '10px auto' }}
                    />
                  ))
                ) : (
                  <p>音声が見つかりません</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 投げるモーダル */}
      {showThrowModal && (
        <div className="modal-overlay" onClick={handleCloseThrow}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseThrow}>
              ×
            </button>
            <h2>新しい問いを投げる</h2>
            <textarea
              rows="4"
              value={newQuestionText}
              onChange={e => setNewText(e.target.value)}
              placeholder="ここに問いを入力..."
            />
            <button
              disabled={!newQuestionText.trim()}
              onClick={handleSubmitNewQuestion}
            >
              送信
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;