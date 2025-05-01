// src/QuestionCircle.js
import React from 'react';

const QuestionCircle = ({ text, answered }) => {
  const circleStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: answered ? 'gray' : 'blue',
    color: 'white',
    margin: '10px',
  };

  return <div style={circleStyle}>{text}</div>;
};

export default QuestionCircle;