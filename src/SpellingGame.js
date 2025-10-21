import React, { useState, useEffect } from 'react';

// Utility function for shuffling
function shuffleList(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function SpellingGame({ selectedVoice, wordSet, onExit }) {
  const [section, setSection] = useState("rootPractice");
  const [rootIndex, setRootIndex] = useState(0);
  const [rootInput, setRootInput] = useState('');
  const [rootComplete, setRootComplete] = useState(Array(wordSet.length).fill(false));
  const [rootMsg, setRootMsg] = useState('');
  const [shuffledWords, setShuffledWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [speakOnStart, setSpeakOnStart] = useState(true);
  const [completed, setCompleted] = useState(Array(wordSet.length).fill(false));

  useEffect(() => {
    setSection("rootPractice");
    setRootIndex(0);
    setRootInput('');
    setRootComplete(Array(wordSet.length).fill(false));
    setRootMsg('');
    setShuffledWords(shuffleList(wordSet));
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(wordSet.length).fill(false));
    setSpeakOnStart(true);
    setMessage('');
  }, [wordSet]);

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  // --- ROOT PRACTICE ---
  function handleRootInput(e) { setRootInput(e.target.value); }
  function checkRootWord() {
    const rootWord = wordSet[rootIndex].root;
    if (rootInput.trim().toLowerCase() === rootWord.toLowerCase()) {
      const nextComplete = [...rootComplete];
      nextComplete[rootIndex] = true;
      setRootComplete(nextComplete);
      setRootMsg("✅ Great spelling! Click 'Next' or try again.");
      speak(`Correct! ${rootWord}`);
      setTimeout(() => {
        if (rootIndex < wordSet.length - 1) {
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
    if (rootIndex < wordSet.length - 1) setRootIndex(rootIndex + 1);
  }
  function prevRoot() {
    setRootMsg('');
    setRootInput('');
    if (rootIndex > 0) setRootIndex(rootIndex - 1);
  }

  // --- TEST MODE LOGIC ---
  useEffect(() => {
    if (section === "test" && speakOnStart && shuffledWords.length > 0) {
      readWord();
      setSpeakOnStart(false);
    }
  }, [current, section, shuffledWords, speakOnStart]);

  function readWord() {
    const wordObj = shuffledWords[current];
    const fullWord = wordObj ? (wordObj.full) : "";
    speak(`Spell ${fullWord}`);
  }
  function readSentence() {
    const wordObj = shuffledWords[current];
    let sentence = wordObj && wordObj.sentence;
    if (!sentence) {
      sentence = `Here is a sentence using the word ${wordObj.full}.`;
    }
    speak(sentence);
  }
  function spellingBeeRecap(word) {
    const lettersSpaced = word.toUpperCase().split('').join('... ');
    const recapText = `Correct, ${word}. ${lettersSpaced}. ${word}.`;
    speak(recapText);
  }
  function handleInput(e) { setInput(e.target.value); }
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
    setShuffledWords(shuffleList(wordSet));
    setRootIndex(0);
    setRootInput('');
    setRootComplete(Array(wordSet.length).fill(false));
    setRootMsg('');
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowHint(false);
    setCompleted(Array(wordSet.length).fill(false));
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

  // SECTION: ROOT PRACTICE
  if (section === "rootPractice") {
    const wordObj = wordSet[rootIndex];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 font-sans p-4">
        <h2 className="mb-5 text-2xl font-extrabold text-pink-600">TestPrep Crash: Roots Practice</h2>
        <div className="mb-3 text-xl font-bold text-blue-900">Word {rootIndex + 1} of {wordSet.length}</div>
        <div className="mb-1 text-base">{wordObj.sentence}</div>
        <div className="mb-3 text-md font-semibold">
          Type the <span className="underline">root</span> word for:
          <span className="ml-2 px-4 py-1 bg-cyan-200 rounded-md font-bold">{wordObj.full}</span>
        </div>
        <input
          className="mb-3 px-4 py-2 border-2 border-blue-400 rounded-lg text-lg text-center"
          value={rootInput}
          onChange={handleRootInput}
          autoFocus
        />
        <div className="flex gap-4">
          <button onClick={prevRoot} disabled={rootIndex === 0}
            className="bg-gray-300 rounded-full px-4 py-2 font-semibold shadow hover:bg-gray-400 disabled:opacity-40"
          >Previous</button>
          <button onClick={checkRootWord}
            className="bg-blue-500 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-blue-700"
          >Check</button>
          <button onClick={nextRoot} disabled={rootIndex === wordSet.length - 1}
            className="bg-gray-300 rounded-full px-4 py-2 font-semibold shadow hover:bg-gray-400 disabled:opacity-40"
          >Next</button>
        </div>
        <div className="mt-4 min-h-[28px] text-lg font-bold">{rootMsg}</div>
        <button
          onClick={() => setSection("preview")}
          className="mt-10 bg-purple-400 px-6 py-2 rounded-full text-white font-bold shadow hover:bg-purple-700"
        >
          Preview All Words
        </button>
        <button onClick={onExit}
          className="mt-5 bg-red-200 px-6 py-1 rounded-full text-red-700 font-semibold shadow hover:bg-red-300"
        >Exit to Game Menu</button>
      </div>
    );
  }

  // SECTION: WORD PREVIEW
  if (section === "preview") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 font-sans p-4">
        <h2 className="mb-4 text-xl font-extrabold text-purple-700">Preview All Spelling Words</h2>
        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
          {wordSet.map((w, idx) => (
            <div key={w.full} className="bg-white rounded-lg px-4 py-2 shadow flex flex-col">
              <div className="font-bold text-lg">{idx + 1}. <span className="text-blue-800">{w.full}</span></div>
              <div className="text-gray-700 text-base mb-1">{w.sentence}</div>
              <div className="text-xs text-gray-400">{w.hint}</div>
            </div>
          ))}
        </div>
        <button
          className="mt-6 bg-green-500 text-white rounded-full px-8 py-2 font-bold shadow hover:bg-green-700"
          onClick={() => setSection("test")}
        >
          Begin Test
        </button>
        <button onClick={onExit}
          className="mt-5 bg-red-200 px-6 py-1 rounded-full text-red-700 font-semibold shadow hover:bg-red-300"
        >Exit to Game Menu</button>
      </div>
    );
  }

  // SECTION: TEST
  const wordObj = shuffledWords[current];
  const progressPercent = Math.round(((current + 1) / shuffledWords.length) * 100);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 font-sans p-4">
      <h2 className="mb-5 text-2xl font-extrabold text-blue-700">TestPrep Crash: Test Mode</h2>
      <div className="mb-2 font-bold text-lg text-indigo-800">
        Word {current + 1} of {shuffledWords.length}
      </div>
      <button
        className="mb-3 bg-blue-200 hover:bg-blue-300 px-5 py-1 rounded-full font-medium text-blue-900"
        onClick={readWord}
      >Hear Word</button>
      <button
        className="mb-3 bg-yellow-200 hover:bg-yellow-300 px-5 py-1 rounded-full font-medium text-yellow-900"
        onClick={readSentence}
      >Hear in a sentence</button>
      <div className="mb-2 text-base text-gray-800">{showHint ? (wordObj ? wordObj.hint : '') : ''}</div>
      <input
        className="mb-3 px-4 py-2 border-2 border-blue-400 rounded-lg text-lg text-center"
        value={input}
        onChange={handleInput}
        placeholder="Type the word"
      />
      <div className="flex gap-3 mb-2">
        <button onClick={prevWord} disabled={current === 0}
          className="bg-gray-300 rounded-full px-3 py-1 shadow hover:bg-gray-400 disabled:opacity-40"
        >Prev</button>
        <button onClick={checkAnswer}
          className="bg-green-500 text-white rounded-full px-5 py-1 font-bold shadow hover:bg-green-700"
        >Check</button>
        <button onClick={nextWord} disabled={current === shuffledWords.length -1}
          className="bg-gray-300 rounded-full px-3 py-1 shadow hover:bg-gray-400 disabled:opacity-40"
        >Next</button>
        <button onClick={giveHint}
          className="bg-purple-300 hover:bg-purple-400 rounded-full px-3 py-1 font-medium text-purple-900"
        >Hint</button>
      </div>
      <div className="min-h-[32px] text-lg font-bold">{message}</div>
      <div className="w-full max-w-xs mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600">{progressPercent}% complete</div>
      <div className="flex gap-4 mt-4">
        <button onClick={shuffleWords}
          className="bg-orange-300 hover:bg-orange-400 px-4 py-1 rounded-full font-semibold text-orange-900"
        >Shuffle & Restart</button>
        <button onClick={onExit}
          className="bg-red-200 px-6 py-1 rounded-full text-red-700 font-semibold shadow hover:bg-red-300"
        >Exit to Game Menu</button>
      </div>
      <div className="mt-6 text-lg font-bold">
        Score: {score} / {shuffledWords.length}
      </div>
    </div>
  );
}

export default SpellingGame;
