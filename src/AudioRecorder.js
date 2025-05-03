import React, { useState, useRef } from 'react';

const AudioRecorder = ({ questionId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL]       = useState(null);
  const [audioBlob, setAudioBlob]     = useState(null);

  // MediaRecorder と chunks を ref に格納しておく
  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // MIMEタイプはブラウザでサポートされているものを選ぶのがベター
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const mr = new MediaRecorder(stream, options);

      chunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mr.onstop = () => {
        // ブロブを作って state に保存
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);

      // 5秒後に自動停止
      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }, 5000);
    } catch (err) {
      console.error('Error during recording:', err);
    }
  };

  const sendVoiceResponse = async (blob) => {
    if (!questionId) {
      console.error('questionId が指定されていません');
      return;
    }
    const formData = new FormData();
    formData.append('questionId', questionId);
    formData.append('audio', blob, `response-${questionId}.webm`);

    try {
      const res = await fetch(
        'https://voice-over-api-140d9b2c8155.herokuapp.com/responses',
        {
          method: 'POST',
          body: formData
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`upload failed: ${res.status} ${text}`);
      }
      const json = await res.json();
      console.log('Successfully uploaded:', json);
      // 必要ならここで parent にコールバックして state 更新
    } catch (err) {
      console.error('Error uploading:', err);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? '録音中…' : '録音開始 (5秒間)'}
      </button>

      {audioURL && (
        <div style={{ marginTop: 10 }}>
          {/* 録音プレビュー */}
          <audio controls src={audioURL} />

          {/* アップロードボタン */}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => sendVoiceResponse(audioBlob)}
          >
            アップロード
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;