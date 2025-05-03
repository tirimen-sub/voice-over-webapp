// src/components/AudioRecorder.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { sendVoiceResponse } from './api';

const AudioRecorder = ({ questionId, onUploaded, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        const response = await sendVoiceResponse(questionId, blob);
        onUploaded(response);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      setError('マイクアクセスに失敗しました');
    }
  };

  const stop = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="recorder">
      {error && <div className="error">{error}</div>}
      {!isRecording
        ? <button onClick={start}>録音開始</button>
        : <button onClick={stop}>録音停止＆アップロード</button>}
      <button onClick={onCancel}>キャンセル</button>
    </div>
  );
};

AudioRecorder.propTypes = {
  questionId: PropTypes.number.isRequired,
  onUploaded: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AudioRecorder;