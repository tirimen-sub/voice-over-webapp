import React from 'react';

const QuestionCircle = ({ text, answered }) => {
  const style = {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: answered ? '#ccc' : '#4da6ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    cursor: 'pointer',
    padding: '0 6px',
    textAlign: 'center',
    userSelect: 'none'
  };
  return <div style={style}>{text}</div>;
};

export default QuestionCircle;