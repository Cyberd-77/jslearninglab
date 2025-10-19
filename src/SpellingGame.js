import React, { useState, useEffect } from 'react';

// Master word sets for each week
const WEEKLY_WORD_SETS = {
  current: [
    { root: "smile", suffix: "ing", full: "smiling", hint: "s____g", sentence: "She was smiling all day at the finish line!" },
    { root: "race", suffix: "ing", full: "racing", hint: "r____g", sentence: "The cars are racing super fast!" },
    { root: "hope", suffix: "ing", full: "hoping", hint: "h____g", sentence: "He is hoping to win his Roblox match." },
    { root: "bake", suffix: "ing", full: "baking", hint: "b____g", sentence: "Mom is baking the best treats for J." },
    { root: "invite", suffix: "ing", full: "inviting", hint: "i______g", sentence: "He is inviting his friends to Roblox." },
    { root: "confuse", suffix: "ing", full: "confusing", hint: "c_______g", sentence: "Those racing rules are confusing!" },
    { root: "taste", suffix: "ing", full: "tasting", hint: "t_____g", sentence: "She is tasting a snack after the race." },
    { root: "compete", suffix: "ing", full: "competing", hint: "c_______g", sentence: "Red and blue cars are competing again." },
    { root: "hop", suffix: "ing", full: "hopping", hint: "h______g", sentence: "The bunny is hopping across the finish line!" },
    { root: "were", suffix: "", full: "were", hint: "w___", sentence: "They were happy when the game ended." }
  ],
  lastweek: [
    { root: "yell", suffix: "ed", full: "yelled", hint: "y___d", sentence: "He yelled for help in the park." },
    { root: "yank", suffix: "ed", full: "yanked", hint: "y____d", sentence: "She yanked her backpack off the hook." },
    { root: "slump", suffix: "ed", full: "slumped", hint: "sl____d", sentence: "He slumped down in his chair." },
    { root: "limp", suffix: "ed", full: "limped", hint: "l____d", sentence: "She limped home after the race." },
    { root: "plop", suffix: "ed", full: "plopped", hint: "p_o___d", sentence: "He plopped onto the couch." },
    { root: "smile", suffix: "ed", full: "smiled", hint: "s____d", sentence: "She smiled after she finished her homework." },
    { root: "shrug", suffix: "ed", full: "shrugged", hint: "s______d", sentence: "He shrugged when he didn’t know the answer." },
    { root: "like", suffix: "ed", full: "liked", hint: "l_k_d", sentence: "He liked playing soccer." },
    { root: "pat", suffix: "ed", full: "patted", sentence: "She patted the dog on the head." },
    { root: "you", suffix: "", full: "you", hint: "__u", sentence: "Everyone was thrilled when you won the game!" }
  ]
};

function shuffleList(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function SpellingGame({ selectedVoice }) {
  // Section state includes: setPicker, rootPractice, preview, test
  const [section, setSection] = useState("setPicker");
  const [wordSet, setWordSet] = useState("current");

  // The list for the chosen week
  const words = WEEKLY_WORD_SETS[wordSet];

  // Roots practice
  const [rootIndex, setRootIndex] = useState(0);
  const [rootInput, setRootInput] = useState('');
  const [rootComplete, setRootComplete] = useState(Array(words.length).fill(false));
  const [rootMsg, setRootMsg] = useState('');

  // Test state
  const [shuffledWords, setShuffledWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(words.length).fill(false));

  // Reshuffle, reset state whenever the week selection changes
  useEffect(() => {
    setRootIndex(0);
    setRootInput('');
    setRootComplete(Array(words.length).fill(false));
    setRootMsg('');
    setShuffledWords(shuffleList(words));
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(words.length).fill(false));
    setSpeakOnStart(true);
    setMessage('');
  }, [wordSet]);

  // Speech helpers
  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
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
    const rootWord = words[rootIndex].root;
    if (rootInput.trim().toLowerCase() === rootWord.toLowerCase()) {
      const nextComplete = [...rootComplete];
      nextComplete[rootIndex] = true;
      setRootComplete(nextComplete);
      setRootMsg("✅ Great spelling! Click 'Next' or try again.");
      speak(`Correct! ${rootWord}`);
      setTimeout(() => {
        if (rootIndex < words.length - 1) {
          setRootIndex(rootIndex + 1);
          setRootInput('');
          setRootMsg('');
        } else {
          setSection("preview");
        }
      }, 1200);
    } else {
      setRootMsg("❌ Try again!");
      speak("Try again");
    }
  }
  function nextRoot() {
    setRootMsg('');
    setRootInput('');
    if (rootIndex < words.length - 1) setRootIndex(rootIndex + 1);
  }
  function prevRoot() {
    setRootMsg('');
    setRootInput('');
    if (rootIndex > 0) setRootIndex(rootIndex - 1);
  }

  // TEST: Read the word at start of each test round
  useEffect(() => {
    if (
      section === "test" &&
      speakOnStart && shuffledWords.length > 0
    ) {
      readWord();
      setSpeakOnStart(false);
    }
    // eslint-disable-next-line
  }, [current, section, shuffledWords, speakOnStart]);

  // --- Test UI helpers ---
  function readWord() {
    if ('speechSynthesis' in window) {
      const wordObj = shuffledWords[current];
      const fullWord = wordObj ? (wordObj.full) : "";
      const utter = new window.SpeechSynthesisUtterance(`Spell ${fullWord}`);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }
  function readSentence() {
    const wordObj = shuffledWords[current];
    let sentence = wordObj && wordObj.sentence;
    if (!sentence) {
      sentence = `Here is a sentence using the word ${wordObj.full}.`;
    }
    const utter = new window.SpeechSynthesisUtterance(sentence);
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
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
  function handleInput(e) {
    setInput(e.target.value);
  }
  function checkAnswer() {
    const wordObj = shuffledWords[current];
    const fullWord = wordObj ? (wordObj.full) : '';
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
      }, 2000);
    } else {
      setMessage('Try again!');
      speak("Try again");
    }
  }
  function giveHint() {
    setShowHint(true);
  }
  function shuffleWords() {
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
    setSection("rootPractice");
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
  const wordObj = words[rootIndex] || shuffledWords[current];

  // Set Picker
  if (section === "setPicker") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 via-purple-100 to-yellow-100 p-8">
        <h2 className="text-3xl font-bold mb-4 text-cyan-700">Choose Your Spelling Words</h2>
        <button
          className="mb-4 bg-blue-400 hover:bg-blue-600 text-white font-bold text-xl px-10 py-4 rounded-full shadow"
          onClick={() => { setWordSet("current"); setSection("rootPractice"); }}>
          Current Week
        </button>
        <button
          className="bg-purple-400 hover:bg-purple-600 text-white font-bold text-xl px-10 py-4 rounded-full shadow"
          onClick={() => { setWordSet("lastweek"); setSection("rootPractice"); }}>
          Last Week
        </button>
      </div>
    );
  }

  // Root Practice
  if (section === "rootPractice") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 via-pink-300 to-yellow-200 font-sans p-6">
        <h2 className="text-4xl font-extrabold mb-3 text-white drop-shadow text-center">✏️ Practice Root Words!</h2>
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mb-5">
          <div className="flex justify-between items-center py-2 px-4 rounded-lg border border-cyan-400">
            <span className="text-xl font-semibold text-cyan-800">{wordObj.root}</span>
            <button
              onClick={() => speak(wordObj.root)}
              className="bg-cyan-400 hover:bg-cyan-600 text-white rounded-full px-3 py-1 font-bold"
              aria-label={`Hear ${wordObj.root}`}
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
              onClick={nextRoot} disabled={rootIndex === words.length - 1}
            >Next ➡️</button>
          </div>
        </div>
        <div>
          <button
            onClick={() => setSection("preview")}
            className="mt-6 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-700 font-black text-white shadow-lg"
            disabled={!rootComplete.every(Boolean)}
          >
            Next: Preview Spelling Words ➡️
          </button>
        </div>
      </div>
    );
  }

  // Preview UI
  if (section === "preview") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200 font-sans p-6">
        <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow text-center">
          📝 Preview the Words You'll Spell!
        </h2>
        <ul className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-3">
          {words.map((obj, i) => (
            <li key={obj.full + "-" + i} className="flex justify-between items-center py-2 px-4 rounded-lg border border-cyan-400 hover:bg-cyan-50 cursor-pointer">
              <span className="text-xl font-semibold text-cyan-800">{obj.full}</span>
              <button
                onClick={() => speak(obj.full)}
                className="bg-cyan-400 hover:bg-cyan-600 text-white rounded-full px-3 py-1 font-bold"
                aria-label={`Hear ${obj.full}`}
              >
                🔊
              </button>
            </li>
          ))}
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

  // Test UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200 font-sans">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white drop-shadow flex items-center gap-2">
        <span role="img" aria-label="racecar">🏎️</span>
        J's Spelling Speedway!
        <span role="img" aria-label="racecar">🏎️</span>
      </h2>
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl p-8 flex flex-col items-center bg-white border-8 border-yellow-200 ring-4 ring-pink-200">
        {/* Progress Bar */}
        <div className="w-full h-6 rounded-full bg-gray-200 mb-5 shadow-inner relative overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all rounded-full flex items-center justify-end pr-2 text-lg text-green-900 font-bold"
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent > 10 ? `${progressPercent}%` : ""}
          </div>
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
        {showHint && shuffledWords[current].hint ? (
          <div className="text-lg text-pink-600 mb-3 font-semibold animate-pulse">
            Hint: {shuffledWords[current].hint}
          </div>
        ) : shuffledWords[current].hint ? (
          <button
            onClick={giveHint}
            className="bg-pink-400 hover:bg-pink-600 transition text-white rounded-full px-4 py-2 mb-3 font-bold drop-shadow"
          >
            🧩 Show Hint
          </button>
        ) : null}
        <input
          value={input}
          onChange={handleInput}
          className="text-lg tracking-widest text-center border-4 border-cyan-500 rounded-xl px-4 py-2 mb-4 w-full font-mono shadow-inner"
          placeholder="Type here!"
          aria-label="Spell the word input"
        />
        <button
          onClick={checkAnswer}
          className="bg-green-400 hover:bg-green-600 transition text-white font-black rounded-full px-8 py-3 mb-3 text-xl drop-shadow-2xl"
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
        <button
          onClick={() => setSection("setPicker")}
          className="mt-8 px-6 py-2 bg-gray-300 text-cyan-900 font-bold rounded-full hover:bg-gray-400 shadow-lg"
        >
          ⬅️ Change Word Set
        </button>
      </div>
      <div className="text-lg mt-7 text-white font-black drop-shadow-lg tracking-wide flex items-center gap-3">
        Powered by J's Learning Lab! 🎮🏁🚗
      </div>
    </div>
  );
}

export default SpellingGame;
