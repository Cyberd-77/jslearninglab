import React, { useState, useEffect } from 'react';
import { masterWordList } from './masterWordsList';

function getRandomOptions(target, words, n) {
  const filtered = words.filter(w => w !== target);
  const options = [target];
  while (options.length < n) {
    const rand = filtered[Math.floor(Math.random() * filtered.length)];
    if (!options.includes(rand)) options.push(rand);
  }
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export default function FindTheWordGame({ selectedVoice, onExit }) {
  const roundCount = 8;
  const questionWords = [...masterWordList]
    .sort(() => 0.5 - Math.random())
    .slice(0, roundCount);
  const questions = questionWords.map(word => ({
    target: word,
    options: getRandomOptions(word, masterWordList, 4)
  }));

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    setShuffledOptions(questions[current].options);
    // Auto-speak target word (Minecraft style)
    const word = questions[current].target;
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
    // eslint-disable-next-line
  }, [current, selectedVoice]);

  function speakWord(word) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }

  function handleOptionClick(option) {
    if (
      option.trim().toLowerCase() === questions[current].target.trim().toLowerCase()
    ) {
      setMessage("✅ Great job, Steve!");
      setScore(score + 1);
      setTimeout(() => {
        if (current < questions.length - 1) {
          setMessage('');
          setCurrent(current + 1);
        } else {
          setMessage("🏆 You finished all the blocks!");
        }
      }, 1200);
    } else {
      setMessage("☠️ Creeper says: Try again!");
    }
  }

  function handleHearWord() {
    speakWord(questions[current].target);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Minecraft-style layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="h-2/5 bg-gradient-to-b from-blue-300 to-blue-100 w-full"></div>
        <div className="h-[60px] bg-gradient-to-b from-green-400 to-green-600 w-full" style={{borderBottom: '14px solid #A0522D'}}></div>
        <div className="h-[120px] bg-yellow-900 w-full"></div>
      </div>
      {/* Block-style emoji accents */}
      <div className="absolute left-16 top-40 text-5xl pointer-events-none select-none">🟩</div>
      <div className="absolute right-20 bottom-40 text-5xl pointer-events-none select-none">🟫</div>
      <div className="absolute left-[45%] top-10 text-[38px] pointer-events-none select-none">🧑‍🌾</div>
      <div className="absolute right-[23%] top-28 text-[38px] pointer-events-none select-none">💚</div>
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center z-10 border-[6px] border-green-600">
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 drop-shadow flex flex-row gap-2 items-center justify-center">👾 Find the Word! <span className="text-2xl">🟩</span></h2>
        <h3 className="text-xl font-bold mb-6 text-yellow-900 flex flex-row gap-1 items-center justify-center">Which block has the word you heard?</h3>
        <button
          onClick={handleHearWord}
          className="bg-gradient-to-r from-green-400 via-lime-400 to-yellow-500 hover:from-green-500 hover:to-yellow-400 text-white font-black rounded-full px-8 py-3 shadow-lg mb-6 transition hover:scale-105"
        >
          🔊 Hear Word Again
        </button>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="bg-gradient-to-br from-green-300 via-yellow-200 to-lime-200 hover:from-green-400 hover:to-yellow-300 px-6 py-3 rounded-xl text-xl font-extrabold shadow-lg border-4 border-yellow-600 transition-all hover:scale-105"
            >
              {option}
            </button>
          ))}
        </div>
        <div className={`mt-3 font-black text-2xl ${message.includes('Great') || message.includes('block') ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </div>
        <div className="mt-6 font-black text-lg text-yellow-900 bg-gradient-to-r from-yellow-300 via-green-200 to-lime-100 px-4 py-2 rounded-full shadow-inner">
          Score: {score} / {questions.length}
        </div>
        <button
          onClick={onExit}
          className="mt-6 bg-yellow-400 hover:bg-green-400 px-6 py-2 rounded-full text-white font-bold shadow-lg border-2 border-yellow-800 transition"
        >
          ← Back to Game Menu
        </button>
      </div>
    </div>
  );
}
