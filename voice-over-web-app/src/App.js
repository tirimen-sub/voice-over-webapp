// src/App.js
import React, { useState } from 'react';
import QuestionCircle from './QuestionCircle';
import AudioRecorder from './AudioRecorder';

const App = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    { id: 1, text: 'What is your favorite color?', answered: false },
    { id: 2, text: 'How are you today?', answered: true },
  ];

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
          <AudioRecorder />
        </div>
      )}
    </div>
  );
};

export default App;