import React, { useState, useEffect } from 'react';

// Game words (customize as needed)
const words = [
  { root: "smile", suffix: "smiling", hint: "s____g", sentence: "She was smiling all day at the finish line!" },
  { root: "race", suffix: "racing", hint: "r____g", sentence: "The cars are racing super fast!" },
  { root: "hope", suffix: "hoping", hint: "h____g", sentence: "He is hoping to win his Roblox match." },
  { root: "bake", suffix: "baking", hint: "b____g", sentence: "Mom is baking the best treats for J." },
  { root: "invite", suffix: "inviting", hint: "i______g", sentence: "He is inviting his friends to Roblox." },
  { root: "confuse", suffix: "confusing", hint: "c_______g", sentence: "Those racing rules are confusing!" },
  { root: "taste", suffix: "tasting", hint: "t_____g", sentence: "She is tasting a snack after the race." },
  { root: "compete", suffix: "competing", hint: "c_______g", sentence: "Red and blue cars are competing again." },
  { root: "hop", suffix: "hopping", hint: "h______g", sentence: "The bunny is hopping across the finish line!" },
  { root: "were", suffix: "", hint: "w___", sentence: "They were happy when the game ended." }
];

function shuffleList(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function SpellingGame({ selectedVoice }) {
  // State variables
  const [section, setSection] = useState("rootPractice");
  const [shuffledWords, setShuffledWords] = useState([]);
  const [rootIndex, setRootIndex] = useState(0);
  const [rootInput, setRootInput] = useState('');
  const [rootComplete, setRootComplete] = useState(Array(words.length).fill(false));
  const [rootMsg, setRootMsg] = useState('');
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(words.length).fill(false));

  // Root Practice state
  const [rootIndex, setRootIndex] = useState(0);
  const [rootInput, setRootInput] = useState('');
  const [rootComplete, setRootComplete] = useState(Array(words.length).fill(false));
  const [rootMsg, setRootMsg] = useState('');

  // Test state
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(words.length).fill(false));

  // Helper variables
  const wordObj = shuffledWords.length > 0 ? shuffledWords[current] : null;
  const fullWord = wordObj ? (wordObj.suffix || wordObj.root) : "";
  const rootObj = shuffledWords.length > 0 ? shuffledWords[rootIndex] : null;
  const rootWord = rootObj ? rootObj.root : "";

  // Shuffle on mount
  useEffect(() => {
    setShuffledWords(shuffleList(words));
    setRootIndex(0);
    setRootInput('');
    setRootComplete(Array(words.length).fill(false));
    setRootMsg('');
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(words.length).fill(false));
    setSpeakOnStart(true);
    setMessage('');
  }, []);

  // --- Voice handling using selectedVoice from props ---
  function playWordAudio(word) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function readWord() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(`Spell ${fullWord}`);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function readSentence() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(wordObj.sentence);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function spellingBeeRecap(word) {
    const lettersSpaced = word.toUpperCase().split('').join('... ');
    const recapText = `Correct, ${word}. ${lettersSpaced}. ${word}.`;
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(recapText);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  // --- Root Practice Logic ---
  function handleRootInput(e) {
    setRootInput(e.target.value);
  }
  function checkRootWord() {
    if (rootInput.trim().toLowerCase() === rootWord.toLowerCase()) {
      const nextComplete = [...rootComplete];
      nextComplete[rootIndex] = true;
      setRootComplete(nextComplete);
      setRootMsg("✅ Great spelling! Click 'Next' or try again.");
      setTimeout(() => {
        if (rootIndex < shuffledWords.length - 1) {
          setRootIndex(rootIndex + 1);
          setRootInput('');
          setRootMsg('');
        } else {
          setSection("preview");
        }
      }, 1200);
    } else {
      setRootMsg("❌ Try again!");
    }
  }
  function nextRoot() {
    setRootMsg('');
    setRootInput('');
    if (rootIndex < shuffledWords.length - 1) setRootIndex(rootIndex + 1);
  }
  function prevRoot() {
    setRootMsg('');
    setRootInput('');
    if (rootIndex > 0) setRootIndex(rootIndex - 1);
  }

  // --------------- PREVIEW UI ---------------
  if (section === "rootPractice") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 via-pink-300 to-yellow-200 font-sans p-6">
        <h2 className="text-4xl font-extrabold mb-3 text-white drop-shadow text-center">✏️ Practice Root Words!</h2>
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mb-5">
          <div className="flex justify-between items-center py-2 px-4 rounded-lg border border-cyan-400">
            <span className="text-xl font-semibold text-cyan-800">{rootWord}</span>
            <button
              onClick={() => playWordAudio(rootWord)}
              className="bg-cyan-400 hover:bg-cyan-600 text-white rounded-full px-3 py-1 font-bold"
              aria-label={`Hear ${rootWord}`}
            >
              🔊
            </button>
          </div>
          <input
            value={rootInput}
            onChange={handleRootInput}
            className="my-3 w-full border-2 border-cyan-400 rounded-xl px-4 py-2 text-lg tracking-widest font-mono"
            placeholder="Type the root word!"
            aria-label="Type root word"
            autoFocus
          />
          <button
            onClick={checkRootWord}
            className="bg-green-400 hover:bg-green-600 text-white rounded-full px-6 py-2 font-extrabold transition shadow"
          >
            Check
          </button>
          <div className="my-3 text-lg min-h-[1.5em] text-purple-600 font-bold">{rootMsg}</div>
          <div className="flex justify-between mt-2">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg font-bold"
              onClick={prevRoot} disabled={rootIndex === 0}
            >⬅️ Back</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg font-bold"
              onClick={nextRoot} disabled={rootIndex === shuffledWords.length - 1}
            >Next ➡️</button>
          </div>
        </div>
        <div>
          <button
            onClick={() => setSection("preview")}
            className="mt-6 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-700 font-black text-white shadow-lg"
            disabled={!rootComplete.every(Boolean)}
          >
            Next: Preview "ing" Words ➡️
          </button>
        </div>
      </div>
    );
  }

  if (section === "preview") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200 font-sans p-6">
        <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow text-center">
          📝 Preview the Words You'll Spell!
        </h2>
        <ul className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-3">
          {shuffledWords.map(({ suffix, root }) => {
            const previewWord = suffix || root;
            return (
              <li key={previewWord} className="flex justify-between items-center py-2 px-4 rounded-lg border border-cyan-400 hover:bg-cyan-50 cursor-pointer">
                <span className="text-xl font-semibold text-cyan-800">{previewWord}</span>
                <button
                  onClick={() => playWordAudio(previewWord)}
                  className="bg-cyan-400 hover:bg-cyan-600 text-white rounded-full px-3 py-1 font-bold"
                  aria-label={`Hear ${previewWord}`}
                >
                  🔊
                </button>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => setSection("test")}
          className="mt-8 px-6 py-3 rounded-full bg-green-500 hover:bg-green-700 font-black text-white shadow-lg transition"
        >
          Start Test ➡️
        </button>
      </div>
    );
  }

  // --- Test UI ---
  function readWord() {
    if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }
}
  function readSentence() {
    if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }
}
  function spellingBeeRecap(word) {
    if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
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
      setMessage('🏁 Blazing Fast, J!');
      spellingBeeRecap(fullWord);
      setTimeout(() => {
        setMessage('');
        setInput('');
        setShowHint(false);
        if (current < shuffledWords.length - 1) {
          setCurrent(current + 1);
          setSpeakOnStart(true);
        } else {
          setMessage('🎆 You finished the race! Press Shuffle to play again.');
        }
      }, 2800);
    } else {
      setMessage('Try again!');
    }
  }
  function giveHint() {
    setShowHint(true);
  }
  function shuffleWords() {
    setShuffledWords(shuffleList(words));
    setSection("rootPractice");
    setRootIndex(0);
    setRootInput('');
    setRootComplete(Array(words.length).fill(false));
    setRootMsg('');
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

  const progressPercent = Math.round((current + 1) / shuffledWords.length * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200 font-sans">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white drop-shadow flex items-center gap-2">
        <span role="img" aria-label="racecar">🏎️</span>
        J's Spelling Speedway!
        <span role="img" aria-label="racecar">🏎️</span>
      </h2>
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl p-8 flex flex-col items-center bg-white border-8 border-yellow-200 ring-4 ring-pink-200 animate__animated animate__fadeIn">
        {/* Progress Bar */}
        <div className="w-full h-6 rounded-full bg-gray-200 mb-5 shadow-inner relative overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all rounded-full flex items-center justify-end pr-2 text-lg text-green-900 font-bold"
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent > 10 ? `${progressPercent}%` : ""}
          </div>
        </div>
        {/* Voice Select */}
        <div className="mb-4 w-full">
          <label className="font-bold mr-2 text-cyan-700">Voice:</label>
          <select
            className="rounded-lg px-2 py-1 border-2 border-cyan-500 bg-white text-cyan-900 w-2/3"
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            aria-label="Select voice"
          >
            {voices.map(v =>
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            )}
          </select>
        </div>
        <h3 className="text-2xl text-yellow-500 font-black mb-4 tracking-widest">Please spell the word!</h3>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <button
            onClick={readWord}
            className="bg-cyan-500 hover:bg-cyan-700 transition text-white rounded-full px-4 py-2 text-lg shadow font-bold flex gap-2 items-center"
          >
            🗣️ Hear word
          </button>
          <button
            onClick={readSentence}
            className="bg-yellow-300 hover:bg-yellow-500 transition text-purple-700 rounded-full px-4 py-2 text-lg shadow font-bold flex gap-2 items-center"
          >
            📢 Hear sentence
          </button>
        </div>
        {showHint ? (
          <div className="text-lg text-pink-600 mb-3 font-semibold animate-pulse">Hint: {wordObj.hint}</div>
        ) : (
          <button
            onClick={giveHint}
            className="bg-pink-400 hover:bg-pink-600 transition text-white rounded-full px-4 py-2 mb-3 font-bold drop-shadow"
          >
            🧩 Show Hint
          </button>
        )}
        <input
          value={input}
          onChange={handleInput}
          className="text-lg tracking-widest text-center border-4 border-cyan-500 rounded-xl px-4 py-2 mb-4 w-full font-mono shadow-inner"
          placeholder="Type here!"
          aria-label="Spell the word input"
        />
        <button
          onClick={checkAnswer}
          className="bg-green-400 hover:bg-green-600 transition text-white font-black rounded-full px-8 py-3 mb-3 text-xl drop-shadow-2xl animate-bounce-slow"
        >
          🚦 Check Answer 🚦
        </button>
        {/* Navigation */}
        <div className="flex justify-between w-full mb-2 gap-2">
          <button
            onClick={prevWord}
            disabled={current === 0}
            className={`bg-gray-400 text-white px-4 py-2 rounded-lg font-bold
              ${current === 0 ? 'opacity-50' : 'hover:bg-gray-600'}
              shadow`}
            aria-label="Previous word"
          >
            ⬅️ Back
          </button>
          <button
            onClick={nextWord}
            disabled={current === shuffledWords.length - 1}
            className={`bg-gray-400 text-white px-4 py-2 rounded-lg font-bold
              ${current === shuffledWords.length - 1 ? 'opacity-50' : 'hover:bg-gray-600'}
              shadow`}
            aria-label="Next word"
          >
            Next ➡️
          </button>
        </div>
        <div
          className="mt-4 min-h-[2.5em] w-full text-center text-xl font-bold
            text-purple-700"
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
        <div className="mt-2 text-xl font-black text-cyan-700" aria-label="Score">
          Score: {score} / {words.length}
        </div>
        <button
          onClick={shuffleWords}
          className="bg-purple-400 hover:bg-purple-600 transition text-white font-black rounded-full px-6 py-2 mt-5 text-lg shadow-lg"
          aria-label="Shuffle words"
        >
          🔀 Shuffle Words
        </button>
        {completed.every(Boolean) && (
          <div className="my-6 text-2xl font-extrabold text-yellow-600 animate-bounce" role="status" aria-live="polite">
            🏆 Race Winner! All words complete!
          </div>
        )}
      </div>
      <div className="text-lg mt-7 text-white font-black drop-shadow-lg tracking-wide flex items-center gap-3">
        Powered by J's Learning Lab! 🎮🏁🚗
      </div>
    </div>
  );
}

export default SpellingGame;
