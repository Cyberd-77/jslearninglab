import React, { useState, useEffect } from 'react';

// Game words (customize sentences for personality!)
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

function SpellingGame() {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(words.length).fill(false));
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    setShuffledWords(shuffleList(words));
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(words.length).fill(false));
    setSpeakOnStart(true);
    setMessage('');
  }, []);

  useEffect(() => {
    const populateVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      const softFemale = voicesList.find(v =>
        (v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('eva')
      );
      setSelectedVoice(softFemale ? softFemale.name : voicesList[0]?.name);
    };
    window.speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  useEffect(() => {
    if (speakOnStart && shuffledWords.length > 0) {
      readWord();
      setSpeakOnStart(false);
    }
  }, [current, shuffledWords]); // eslint-disable-line

  if (!shuffledWords.length) return <div>Loading...</div>;
  const wordObj = shuffledWords[current];
  const fullWord = wordObj.suffix || wordObj.root;

  function getVoiceByName(name) {
    return voices.find(v => v.name === name);
  }

  function readWord() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(`Spell ${fullWord}`);
      utter.voice = getVoiceByName(selectedVoice);
      window.speechSynthesis.speak(utter);
    }
  }

  function readSentence() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(wordObj.sentence);
      utter.voice = getVoiceByName(selectedVoice);
      window.speechSynthesis.speak(utter);
    }
  }

  function spellingBeeRecap(word) {
    const lettersSpaced = word.toUpperCase().split('').join('... ');
    const recapText = `Correct, ${word}. ${lettersSpaced}. ${word}.`;
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(recapText);
      utter.voice = getVoiceByName(selectedVoice);
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
      }, 2800); // let audio finish
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
          >
            ⬅️ Back
          </button>
          <button
            onClick={nextWord}
            disabled={current === shuffledWords.length - 1}
            className={`bg-gray-400 text-white px-4 py-2 rounded-lg font-bold
              ${current === shuffledWords.length - 1 ? 'opacity-50' : 'hover:bg-gray-600'}
              shadow`}
          >
            Next ➡️
          </button>
        </div>

        <div
          className="mt-4 min-h-[2.5em] w-full text-center text-xl font-bold
            text-purple-700"
        >
          {message}
        </div>

        <div className="mt-2 text-xl font-black text-cyan-700">
          Score: {score} / {words.length}
        </div>

        <button
          onClick={shuffleWords}
          className="bg-purple-400 hover:bg-purple-600 transition text-white font-black rounded-full px-6 py-2 mt-5 text-lg shadow-lg"
        >
          🔀 Shuffle Words
        </button>

        {completed.every(Boolean) && (
          <div className="my-6 text-2xl font-extrabold text-yellow-600 animate-bounce">
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
