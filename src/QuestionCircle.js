import React from 'react';
const QuestionCircle = ({ text, answered }) => {
  const style = {
    width: 100,
    height: 100,
    borderRadius: '50%',
    // answered===true → 青, answered===false → グレー
    backgroundColor: answered ? '#4da6ff' : '#ccc',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
     // 録音済みはクリック不可に見せる
     cursor: answered ? 'not-allowed' : 'pointer',
     padding: '0 6px',
     textAlign: 'center',
     userSelect: 'none'
   };
   return <div style={style}>{text}</div>;
 };

export default QuestionCircle;