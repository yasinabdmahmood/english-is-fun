import Head from "next/head";

import { useState } from "react";
import styles from "./index.module.css";
import titleStyle from "../styles/title.module.css"
import LoadingSpinner from "./LoadingSpinner";

const MultiColorText = ({ text }) => {
  const styles = {
  
    fontWeight: '700',
  }
  // Define the colors
  const colors = ['red', 'green', 'yellow', 'orange', 'purple'];

  // Split the text into an array of characters
  const characters = text.split('');

  // Map over the characters and wrap each one in a span with a color
  const coloredText = characters.map((char, index) => {
    const colorIndex = index % colors.length;
    const color = colors[colorIndex];
    return <span className={titleStyle['title']}  key={index} style={{ ...styles,color }}>{char}</span>;
  });

  return (
    <div>
      {coloredText}
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [word, setWord] = useState('');
  const options = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  
  async function generateWord(event) {
    setIsLoading(true);
    setTextInput('');
    event.preventDefault();
    try {
      const response = await fetch("/api/getWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level: selectedOption }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setWord(data.result);
      setIsLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  }
  ////////////////////////////////////
  async function onSubmit(event) {
    if(word === ''){
      window.alert('Please get a word to describe')
      return null;
    }
    if(textInput === ''){
      window.alert('Please fill out the input field')
      return null;
    }
    setIsLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/getFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: textInput, word }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTextInput(data.result.trim());
      setIsLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setIsLoading(false);
      alert(error.message);
    }
  }



  return (
    <div>
      <Head>
        <title>English is fun</title>
        <link rel="icon" href="/english.png" />
      </Head>
      <nav className={styles["nav"]}>
        <img src="/logo.png" alt="logo" />
        <MultiColorText text={'English is fun'} />
      </nav>
      <main className={styles.main}>
        <div className={styles["levels-container"]}>
          <h4>Select your Proficiency level</h4>
          <ul className={styles["levels"]}>
            {options.map(option => (
            <li key={option}   >
              <button
              className= {option===selectedOption? styles['selected-level']: null}
              onClick={()=>setSelectedOption(option)}>
                {option}
              </button>
            </li>
        ))}
          </ul>
        </div>
    
        <form onSubmit={onSubmit}>
          <textarea
            name="description"
            placeholder="Enter the description"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className={styles["buttons"]}>
          <button type="submit" className={styles["myButton"]}>
          Get graded
          </button>
          <button className={styles["myButton"]} onClick={generateWord}>Get word</button>
          </div>
          
        </form>
        
        <h3>{word}</h3>
        {isLoading ? <LoadingSpinner /> : null}
      </main>
    </div>
  );
}
