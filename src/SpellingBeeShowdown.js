// SpellingBeeShowdown.js
import React, { useState } from 'react';

// Family/friends/character name pool
const namePool = [
  "Mom", "Dad", "Papaw", "Raelyn", "Tickles", "Tickles the ferret", 
  "Aunt Christine", "Aunt Kelly", "Kayson"
];

// Mix of general and personalized encouragement
const positiveFeedback = [
  "Fantastic job, J!",
  "You're a spelling champ!",
  "Awesome work!",
  "You got it!",
  "Correct, J!",
  "Great spelling!",
  "Perfect, Jeremiah!",
  "Amazing!",
  "You nailed it!",
  () => `Mom is so proud of you!`,
  () => `Raelyn says you're the best!`,
  () => `Kayson would love that spelling!`,
  () => `Dad says: Awesome work!`,
  () => `Papaw gives you a thumbs-up!`,
  () => `${randName()} is cheering for you!`,
  () => `Tickles just did a happy dance!`,
  () => `Aunt Christine says: Great spelling!`,
  () => `Aunt Kelly: That was perfect!`
];

// Streak bonus messages (mix of general and personalized)
const streakMessages = [
  "You're on fire, J! 🔥",
  "Hot streak! Keep going! 🌟",
  "Unstoppable! 💪",
  "Amazing streak! 🚀",
  () => `Raelyn says: Hot streak! 🌟`,
  () => `Kayson: Keep it going! 💪`,
  () => `Dad says: Unstoppable! 🚀`,
  () => `Tickles just did a triple backflip! 🐾`,
  () => `${randName()} is so proud of your streak!`
];

// Utility to get a random name
function randName() {
  return namePool[Math.floor(Math.random() * namePool.length)];
}

// Utility to get feedback (handles both strings and functions)
function getFeedback(arr) {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return typeof item === 'function' ? item() : item;
}

function SpellingBeeShowdown({ wordSet, selectedVoice, onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(Array(wordSet.length).fill(false));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Speak using selected global voice
  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function speakWord(word) {
    speak(word);
  }

  function handleInputChange(val) {
    setInput(val);
  }

  function checkSpelling() {
    const target = wordSet[currentIdx].full;
    if (input.trim().toLowerCase() === target.toLowerCase()) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Use mixed feedback
      let praise = getFeedback(positiveFeedback);
      
      // Bonus for streak
      if (newStreak >= 3 && newStreak % 3 === 0) {
        praise = getFeedback(streakMessages);
      }

      setFeedback(praise);
      setShowSuccess(true);
      speak(`${praise} The word was ${target}.`);

      if (!completed[currentIdx]) {
        setCompleted(completed.map((done, idx) => idx === currentIdx ? true : done));
        setScore(score + 1);
      }

      setTimeout(() => {
        setShowSuccess(false);
        if (currentIdx < wordSet.length - 1) {
          nextWord();
        }
      }, 1500);

    } else {
      setStreak(0);
      const encouragement = [
        "Try again!",
        "Almost there!",
        "Give it another shot!",
        () => `Try again! ${randName()} believes in you!`,
        () => `Keep trying, J! ${randName()} is rooting for you!`
      ];
      const msg = getFeedback(encouragement);
      setFeedback(msg);
      speak("Try again, J!");
      setShowSuccess(false);
    }
  }

  function nextWord() {
    setInput('');
    setFeedback('');
    setShowSuccess(false);
    if (currentIdx < wordSet.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }

  function prevWord() {
    setInput('');
    setFeedback('');
    setShowSuccess(false);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  }

  // Progress percentage
  const progressPercent = Math.round((score / wordSet.length) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 font-sans p-4">
      <h2 className="text-4xl font-black mb-6 text-blue-800 text-center drop-shadow-lg">
        🦋 Spelling Bee Showdown!
      </h2>
      <div className="bg-white px-8 py-7 rounded-3xl shadow-2xl min-w-[360px] max-w-md w-full flex flex-col items-center border-4 border-yellow-300 transition-all">

        {/* Progress Pills */}
        <div className="flex gap-2 mb-4">
          {wordSet.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                completed[idx]
                  ? 'bg-green-500 scale-110'
                  : idx === currentIdx
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-gray-300'
              }`}
              aria-label={`Word ${idx + 1}`}
            />
          ))}
        </div>

        <h3 className="font-bold mb-3 text-2xl text-blue-700">
          Word {currentIdx + 1} of {wordSet.length}
        </h3>

        {/* Streak indicator */}
        {streak >= 3 && (
          <div className="bg-orange-100 border-2 border-orange-400 rounded-full px-4 py-1 mb-3 text-orange-700 font-bold animate-bounce">
            🔥 {streak} in a row!
          </div>
        )}

        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full px-8 py-3 font-black mb-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
          onClick={() => speakWord(wordSet[currentIdx].full)}
        >
          🔊 Hear Word
        </button>

        <div className="mb-3 text-xl font-semibold text-gray-700 bg-yellow-100 px-4 py-2 rounded-lg">
          {wordSet[currentIdx].hint}
        </div>

        <input
          type="text"
          className={`border-4 rounded-xl px-4 py-3 text-2xl font-bold mb-3 w-52 text-center transition-all focus:ring-4 focus:ring-blue-300 ${
            showSuccess
              ? 'border-green-400 bg-green-50'
              : feedback.includes("Try") || feedback.includes("Almost") || feedback.includes("Keep")
              ? 'border-red-400 bg-red-50'
              : 'border-blue-400 bg-white'
          }`}
          value={input}
          onChange={e => handleInputChange(e.target.value)}
          disabled={completed[currentIdx]}
          autoFocus
          onKeyPress={e => {
            if (e.key === 'Enter' && input.trim() !== '' && !completed[currentIdx]) {
              checkSpelling();
            }
          }}
        />

        <button
          onClick={checkSpelling}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-3 mt-2 rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={completed[currentIdx] || input.trim() === ''}
        >
          ✅ Check Spelling
        </button>

        {feedback && (
          <div
            className={`font-black mt-4 text-xl px-4 py-2 rounded-lg transition-all ${
              feedback.includes("Try") || feedback.includes("Almost") || feedback.includes("Keep")
                ? "text-red-700 bg-red-100 border-2 border-red-400"
                : "text-green-700 bg-green-100 border-2 border-green-400 animate-bounce"
            }`}
          >
            {feedback.includes("Try") || feedback.includes("Almost") || feedback.includes("Keep") ? "❌ " : "✅ "}
            {feedback}
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">{progressPercent}% Complete</div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={prevWord}
            disabled={currentIdx === 0}
            className="px-5 py-2 rounded-full bg-gray-300 hover:bg-gray-400 font-semibold shadow hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={nextWord}
            disabled={currentIdx === wordSet.length - 1 || !completed[currentIdx]}
            className="px-5 py-2 rounded-full bg-blue-400 hover:bg-blue-500 font-bold shadow hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            Next →
          </button>
        </div>

        <div className="mt-6 text-2xl font-bold text-purple-800 bg-purple-100 px-6 py-2 rounded-full border-2 border-purple-300">
          Score: {score} / {wordSet.length}
        </div>

        <button
          className="mt-5 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 px-7 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
          onClick={onExit}
        >
          🚪 Exit to Games Menu
        </button>
      </div>
    </div>
  );
}

export default SpellingBeeShowdown;
