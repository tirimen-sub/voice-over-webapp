// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  fetchQuestions,
  postQuestion,
  fetchResponses,
  checkIpAllowed,
} from './api';
import generateBubbleStyle from './bubble';
import AudioRecorder from './AudioRecorder';
import './App.css';
import BgVideo from './bgVideo.js';
import OverlayVideo from './OverlayVideo.js';

function App() {
  // --- State ---
  const [isStarted, setIsStarted]       = useState(false);
  const [isFading, setIsFading]         = useState(false);   // フェード中フラグ
  const [showThrowModal, setShowThrow]  = useState(false);
  const [questions, setQuestions] = useState([]);         // 質問一覧
  const [error, setError]         = useState(null);
  const [selectedQ, setSelectedQ] = useState(null);       // { id, text, answered? }
  const [mode, setMode]           = useState(null);       // 'record' | 'play'
  const [responses, setResponses] = useState([]);         // URL の配列
  const [newText, setNewText]     = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [allowed, setAllowed]     = useState(false)
  const [checked, setChecked]     = useState(false) //判定済み降らず

  useEffect(() => {
    checkIpAllowed()
      .then(({ allowed, clientIp }) => {
        console.log('Your IP is', clientIp);
        setAllowed(allowed);
      })
      .catch(err => {
        console.error('IPチェックでエラーが発生しました', err);
        setAllowed(false);    // エラー時は false にするなど
      })
      .finally(() => {
        setChecked(true);
      });
  }, []);

  // --- 初期質問取得 ---
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchQuestions();
        // スタイルを付与
        setQuestions(list.map(q => ({ ...q, style: generateBubbleStyle(q.text) })));
      } catch (e) {
        console.error(e);
        setError('質問の取得に失敗しました');
      }
    })();
  }, []);

  // --- 質問クリック ---
  const onSelect = async q => {
    setError(null);
    setSelectedQ(q);
    // 回答済みなら play へ
    if (q.answered) {
      try {
        const resList = await fetchResponses(q.id);
        setResponses(resList.map(r => r.audioUrl));
        setMode('play');
      } catch (e) {
        console.error(e);
        setError('回答の取得に失敗しました');
      }
    } else {
      // 未回答なら record モードへ
      setMode('record');
    }
  };

  // --- 録音完了後のコールバック ---
  const handleUploaded = data => {
    // 回答済みにフラグ更新
    setQuestions(prev =>
      prev.map(q =>
        q.id === selectedQ.id ? { ...q, answered: true } : q
      )
    );
    // プレイモードに切り替え
    setResponses(old => [...old, data.audioUrl]);
    setMode('play');
  };

  // --- 新規質問作成 ---
  const submitNew = async () => {
    if (!newText.trim()) return;
    try {
      const q = await postQuestion(newText.trim());
      setQuestions(prev => [
        { ...q, style: generateBubbleStyle(q.text) },
        ...prev
      ]);
      setNewText('');
      setShowAdd(false);
    } catch (e) {
      console.error(e);
      setError('質問の投稿に失敗しました');
    }
  };

  if (!checked) return <div>Loading…</div>;

  // --- 描画 ---
  return (
    <div className="App">
      <BgVideo />
      <OverlayVideo />
      {error && <div className="error">{error}</div>}
      {/* 質問バブル */}
      <div className="bubble-container">
        {questions.map(q => (
          <div
            key={q.id}
            className={`bubble ${q.answered ? 'answered' : ''}`}
            style={q.style}
            onClick={() => onSelect(q)}
          >
            {q.text}
          </div>
        ))}
      </div>
      
      {allowed && (
        <button
          className="new-question-btn"
          onClick={() => setShowAdd(true)}
          >
            ＋ 質問を投げる/Post a Question
          </button>


      )}
      {/* 新規作成ボタン */}

      {/* 質問追加モーダル */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            <h2>新しい質問を投稿</h2>
            <textarea
              rows="3"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="ここに質問を入力.../Input question here..."
            />
            <button disabled={!newText.trim()} onClick={submitNew}>送信</button>
          </div>
        </div>
      )}

      {/* レコード・プレイ モーダル */}
      {selectedQ && (
        <div className="modal-overlay" onClick={() => setSelectedQ(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedQ(null)}>×</button>

            <h2>{selectedQ.text}</h2>

            {mode === 'record' && (
              <AudioRecorder
                questionId={selectedQ.id}
                onUploaded={handleUploaded}
                onCancel={() => setSelectedQ(null)}
              />
            )}

            {mode === 'play' && (
              <div className="play-list">
                {responses.length > 0 ? (
                  responses.map((url, i) => (
                    <audio 
                    key={i}
                    controls
                    src={url}
                    crossOrigin='anonymous'
                    onLoadedMetadata={e =>
                      console.log(`audio[${i}] duration=`,e.currentTarget.duration)
                    }
                    style={{ display: 'block', margin: '1em 0' }} 
                    />
                  ))
                ) : (
                  <p>まだ回答がありません</p>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;