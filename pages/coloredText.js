import React,{useEffect, useState} from 'react';
import { useRouter } from 'next/router';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const ColoredText = ({ text }) => {
  const linearConversion = (x) => {
    return (x - 375) * (3 - 1) / (1300 - 375) + 1.5;
  }
  const router = useRouter();
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const bodyStyles = window.getComputedStyle(document.body);
    setScreenSize({
      width: parseInt(bodyStyles.width),
      height: parseInt(bodyStyles.height)
    });
  }, [router]);
  return (
    <div>
      {text.split('').map((letter, index) => (
        <span 
          key={index}
          style={{ color: colors[index % colors.length], 
          fontSize: `${linearConversion(screenSize.width)}rem`,
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