import React, { useEffect, useState } from 'react';
import { fetchQuestions, sendVoiceResponse } from './api';
import QuestionCircle from './QuestionCircle';
import AudioRecorder from './AudioRecorder';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions()
      .then(fetchedQuestions => setQuestions(fetchedQuestions))
      .catch(err => setError('Failed to fetch questions'));
  }, []);

  const handleSendResponse = (audioBlob) => {
    if (selectedQuestion) {
      sendVoiceResponse(audioBlob)
        .then(response => {
          console.log('Response received:', response);
          // 回答が成功したときに質問を更新する処理を追加できます
        })
        .catch(err => setError('Failed to send voice response'));
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {questions.map((q) => (
          <div key={q.id} onClick={() => setSelectedQuestion(q)}>
            <QuestionCircle text={q.text} answered={q.answered} />
          </div>
        ))}
      </div>
      {selectedQuestion && !selectedQuestion.answered && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>Question: {selectedQuestion.text}</h2>
          <AudioRecorder onRecordFinish={handleSendResponse} />
        </div>
      )}
      
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      {audioBlob && (
        <button onClick={uploadAudio}>Upload Audio</button>
      )}

    </div>
  );
};

export default App;