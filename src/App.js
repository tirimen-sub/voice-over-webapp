// src/App.js
import React, { useEffect, useState } from 'react';
import { fetchQuestions, sendVoiceResponse } from './api';
import QuestionCircle from './QuestionCircle';
import AudioRecorder from './AudioRecorder';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions().then(fetchedQuestions => setQuestions(fetchedQuestions));
  }, []);

  const handleSendResponce = (audioBlob) => {
    if (selectedQuestion){
      sendVoiceResponse(audioBlob).then(response => {
        console.log('Response received:', response);

      });
    }
  };

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
          <AudioRecorder onRecordFinish={handleSendResponce} />
        </div>
      )}
    </div>
  );
};

export default App;