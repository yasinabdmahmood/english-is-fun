import Head from "next/head";
import ColoredText from "./coloredText";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [word, setWord] = useState('');
  const options = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  async function generateWord(event) {
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
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
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

  return (
    <div>
      <Head>
        <title>English is fun</title>
        <link rel="icon" href="/english.png" />
      </Head>

      <main className={styles.main}>
        <img src="/english.png" style={{width: '100px', marginBottom: '2rem'}} />
        <ColoredText text={'English is fun'} />
        <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
        <form onSubmit={onSubmit}>
          <textarea
            name="description"
            placeholder="Enter the description"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Get graded" />
        </form>
        <button className="btn" onClick={generateWord}>Get word</button>
        <h3>{word}</h3>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
