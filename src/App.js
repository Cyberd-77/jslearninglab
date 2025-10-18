import React, { useState, useEffect } from 'react';

// Spelling words, each with a sample sentence
const words = [
  { root: "smile", suffix: "smiling", hint: "s____g", sentence: "She was smiling all day." },
  { root: "race", suffix: "racing", hint: "r____g", sentence: "We are racing to the finish line." },
  { root: "hope", suffix: "hoping", hint: "h____g", sentence: "He is hoping for good weather." },
  { root: "bake", suffix: "baking", hint: "b____g", sentence: "Mom is baking cookies." },
  { root: "invite", suffix: "inviting", hint: "i______g", sentence: "He is inviting friends to his party." },
  { root: "confuse", suffix: "confusing", hint: "c_______g", sentence: "That puzzle is confusing me." },
  { root: "taste", suffix: "tasting", hint: "t_____g", sentence: "She is tasting the soup." },
  { root: "compete", suffix: "competing", hint: "c_______g", sentence: "Two teams are competing for the trophy." },
  { root: "hop", suffix: "hopping", hint: "h______g", sentence: "The rabbit is hopping in the garden." },
  { root: "were", suffix: "", hint: "w___", sentence: "They were very happy together." } // tricky word
];

const colors = ["#FFB6C1","#ADD8E6","#90EE90","#FFFACD","#E6E6FA","#FFDAB9","#D3FFCE","#FFCCCB"];

function shuffleList(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function SpellingGame() {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(words.length).fill(false));

  useEffect(() => {
    setShuffledWords(shuffleList(words));
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(words.length).fill(false));
    setSpeakOnStart(true);
    setMessage('');
  }, []); // shuffle only on mount

  useEffect(() => {
    if (speakOnStart && shuffledWords.length > 0) {
      readWord();
      setSpeakOnStart(false);
    }
    // eslint-disable-next-line
  }, [current, shuffledWords]);

  if (!shuffledWords.length) return <div>Loading...</div>;
  const wordObj = shuffledWords[current];
  const fullWord = wordObj.suffix || wordObj.root;

  function readWord() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(`Spell ${fullWord}`);
      window.speechSynthesis.speak(utter);
    }
  }

  function readSentence() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(wordObj.sentence);
      window.speechSynthesis.speak(utter);
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
  }

  function checkAnswer() {
    if (input.toLowerCase() === fullWord.toLowerCase()) {
      if (!completed[current]) {
        setScore(score + 1);
        setCompleted(completed.map((done, idx) => idx === current ? true : done));
      }
      setMessage('🎉 Awesome job, J!');
      setTimeout(() => {
        setMessage('');
        setInput('');
        setShowHint(false);
        if (current < shuffledWords.length - 1) {
          setCurrent(current + 1);
          setSpeakOnStart(true);
        } else {
          setMessage('🎆 All words completed! Shuffle to play again.');
        }
      }, 2000);
    } else {
      setMessage('Try again!');
    }
  }

  function giveHint() {
    setShowHint(true);
  }

  function shuffleWords() {
    setShuffledWords(shuffleList(words));
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(words.length).fill(false));
    setMessage('');
    setSpeakOnStart(true);
  }

  function nextWord() {
    setMessage('');
    setInput('');
    setShowHint(false);
    if (current < shuffledWords.length - 1) {
      setCurrent(current + 1);
      setSpeakOnStart(true);
    }
  }

  function prevWord() {
    setMessage('');
    setInput('');
    setShowHint(false);
    if (current > 0) {
      setCurrent(current - 1);
      setSpeakOnStart(true);
    }
  }

  // Progress bar calculation
  const progressPercent = Math.round((current + 1) / shuffledWords.length * 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: colors[current % colors.length],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    }}>
      <h2 style={{ fontSize: '2.5rem' }}>🔤 Spelling Game for J!</h2>
      {/* Progress Bar */}
      <div style={{
        background: '#dfe4ea',
        borderRadius: '10px',
        width: '340px',
        height: '20px',
        margin: '0.6rem 0'
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: '#00b894',
          borderRadius: '10px',
          transition: 'width 0.3s'
        }}></div>
      </div>
      <div style={{
        background: '#fff',
        borderRadius: '25px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        padding: '2rem',
        margin: '1rem',
        width: '340px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '2rem', color: '#333' }}>Please spell the word!</h3>
        <button onClick={readWord} style={{
          background: '#74b9ff', border: 'none', borderRadius: '10px',
          color: '#fff', padding: '0.5rem 1.5rem', fontSize: '1.1rem', margin: '0.5rem'
        }}>
          🔊 Hear word
        </button>
        <button onClick={readSentence} style={{
          background: '#fdcb6e', border: 'none', borderRadius: '10px',
          color: '#333', padding: '0.5rem 1.5rem', fontSize: '1.1rem', margin: '0.5rem'
        }}>
          📢 Hear sentence
        </button>
        {showHint ? (
          <div style={{ fontSize: '1.25rem', color: '#d35400', margin: '1rem 0' }}>
            Hint: {wordObj.hint}
          </div>
        ) : (
          <button onClick={giveHint}
            style={{
              background: '#81ecec',
              border: 'none',
              borderRadius: '10px',
              color: '#636e72',
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
            🧩 Show Hint
          </button>
        )}
        <input
          value={input}
          onChange={handleInput}
          style={{
            fontSize: '1.2rem', letterSpacing: '0.2em', textAlign: 'center',
            border: '2px solid #b2bec3', borderRadius: '8px', padding: '0.5em'
          }}
          placeholder="Type here!"
        />
        <div>
          <button onClick={checkAnswer}
            style={{
              marginTop: '1rem',
              background: '#00b894',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              padding: '0.5rem 2rem',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
            Check Answer
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.2rem'
        }}>
          <button onClick={prevWord} disabled={current === 0}
            style={{
              background: '#636e72',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 1.2rem',
              fontSize: '1.1rem',
              opacity: current === 0 ? 0.5 : 1
            }}
          >
            ⬅️ Back
          </button>
          <button onClick={nextWord} disabled={current === shuffledWords.length - 1}
            style={{
              background: '#636e72',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 1.2rem',
              fontSize: '1.1rem',
              opacity: current === shuffledWords.length - 1 ? 0.5 : 1
            }}
          >
            Next ➡️
          </button>
        </div>
        <div style={{ margin: '1rem', fontSize: '1.1rem', color: '#6c5ce7', minHeight: '2em' }}>{message}</div>
        <div style={{
          fontSize: '1.1rem', color: '#00b894', marginTop: '1em'
        }}>Score: {score} / {words.length}</div>
        <button onClick={shuffleWords} style={{
          background: '#00b894',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1.2rem',
          fontSize: '1rem',
          marginTop: '1rem'
        }}>
          🔀 Shuffle Words
        </button>
        {completed.every(Boolean) && 
          <div style={{margin: '1rem', fontWeight: 'bold', color: '#fd79a8'}}>🏆 You completed all the words!</div>
        }
      </div>
      <div style={{ fontSize: '1.1rem', marginTop: '2em', color: '#636e72' }}>
        Powered by J's Learning Lab! 🍭
      </div>
    </div>
  );
}

export default SpellingGame;
