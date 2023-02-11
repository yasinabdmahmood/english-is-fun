import Head from "next/head";
import ColoredText from "./coloredText";
import { useState } from "react";
import styles from "./index.module.css";
import LoadingSpinner from "./LoadingSpinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [word, setWord] = useState('');
  const options = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  async function generateWord(event) {
    setIsLoading(true);
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
    event.preventDefault();
    try {
      const response = await fetch("/api/getFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: animalInput, word }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleLevelChange = (e) => {

  }

  return (
    <div>
      <Head>
        <title>English is fun</title>
        <link rel="icon" href="/english.png" />
      </Head>

      <main className={styles.main}>
        <img src="/english.png" style={{width: '100px', marginBottom: '2rem'}} />
        <ColoredText text={'English is fun'} />
        <div className={styles["levels-container"]}>
          <h4>Select Fluency level</h4>
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
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <button type="submit" className={styles["myButton"]}>
          Get graded
          </button>
        </form>
        <button className={styles["myButton"]} onClick={generateWord}>Get word</button>
        <h3>{word}</h3>
        {isLoading ? <LoadingSpinner /> : null}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
