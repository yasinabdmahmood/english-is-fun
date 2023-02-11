import React from 'react';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const ColoredText = ({ text }) => {
  return (
    <div>
      {text.split('').map((letter, index) => (
        <span 
          key={index}
          style={{ color: colors[index % colors.length], 
          fontSize: '3rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          }}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default ColoredText;