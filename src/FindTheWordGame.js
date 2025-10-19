import React, { useState, useEffect } from 'react';

// Use your comprehensive master word list (paste your full array here)
const masterWordList = [
  "this", "here", "find", "me", "that", "no", "work", "come", "how", "help", "day", "what", "down", "case", "ever", "two", "same", "said", "new", "an", "baseball", "factory", "learned", "felt", "sold", "midnight", "party", "below", "horn", "rush", "ground", "fixed", "idea", "ring", "east", "sand", "thanks", "deck", "receiving", "half", "building", "plant", "desk", "alone", "worn", "mean", "week", "sleep", "grip", "draw", "repeat", "pat", "motion", "bed", "rest", "pair", "black", "trip", "gate", "trap", "opening", "ready", "having", "try", "raise", "trade", "paint", "everything", "goods", "pack", "sight", "root", "behind", "height", "lips", "blood", "memory", "sudden", "perform", "river", "air", "hole", "mine", "bag", "powerful", "afternoon", "beauty", "clock", "envelope", "sale", "friend", "sky", "free", "date", "smile", "meaning", "park", "sink", "needs", "sum", "kept", "cap", "hard", "fishing", "hill", "tonight", "hidden", "perhaps", "dog", "speaker", "arrive", "ladies", "wild", "buy", "track", "chair", "sister", "human", "inch", "split", "loves", "pound", "cream", "row", "partner", "slip", "winning", "football", "fool", "kitchen", "all", "number", "same", "how", "one", "case", "get", "find", "just", "with", "still", "had", "the", "why", "over", "against", "we", "never", "to", "back", "book", "favor", "net", "split", "complete", "crowd", "hung", "baseball", "funny", "soft", "terrible", "double", "addition", "pocket", "drop", "march", "receive", "warning", "shadow", "empty", "desk", "shot", "kind", "darkness", "calendar", "pick", "city", "hall", "tiny", "solve", "chest", "fight", "silver", "thanks", "went", "snow", "bag", "mail", "pink", "write", "married", "motor", "bent", "able", "blind", "gift", "size", "build", "wooden", "wall", "inch", "trade", "sweet", "color", "pilot", "award", "dog", "musical", "change", "top", "deep", "silence", "wake", "worn", "eight", "air", "load", "harm", "page", "coffee", "tie", "lane", "chicken", "happen", "ahead", "act", "alive", "large", "body", "mixture", "forward", "winning", "plane", "mile", "wife", "acting", "fire", "solid", "ball", "breakfast", "sound", "yourself", "stretch", "anger", "coat", "hat", "mystery", "husband", "sing", "born", "milk", "envelope", "highway", "anything", "strong", "throw", "match", "seeing", "grow", "save"
];

function getRandomWords(wordList, count) {
  const copy = [...wordList];
  const arr = [];
  while (arr.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    arr.push(copy.splice(idx, 1)[0]);
  }
  return arr;
}

function FindTheWordGame({ selectedVoice, gridSize = 4 }) {
  const [gridWords, setGridWords] = useState([]);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [tries, setTries] = useState(0);

  // Only reset grid on mount or gridSize change
  useEffect(() => {
    resetGrid();
  }, [gridSize, resetGrid]);

  // define resetGrid as stable using useCallback
  const resetGrid = React.useCallback(() => {
    const chosen = getRandomWords(masterWordList, gridSize * gridSize);
    setGridWords(chosen);
    const answerIdx = Math.floor(Math.random() * chosen.length);
    setAnswer(chosen[answerIdx]);
    setMessage('');
    setTries(0);
  }, [gridSize]);

  function speakWord(word) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function check(clickedWord) {
    if (clickedWord === answer) {
      setMessage(`✅ Correct! Score: ${score + 1}`);
      setScore(s => s + 1);
      setTimeout(() => {
        resetGrid();
      }, 1500);
    } else {
      setMessage('❌ Try again!');
      setTries(t => t + 1);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-800 drop-shadow text-center">
        Find the Word Game
      </h2>
      <div className="bg-white rounded-2xl shadow-xl px-6 py-8 max-w-lg w-full flex flex-col items-center">
        <p className="mb-4 text-lg font-bold">Listen and tap/click the matching word:</p>
        <button
          onClick={() => speakWord(answer)}
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-black shadow text-2xl"
        >
          Hear Word
        </button>
        <div
          className="grid mb-8 gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: '100%',
          }}
        >
          {gridWords.map((word, i) => (
            <button
              key={word + i}
              onClick={() => check(word)}
              className="bg-gray-100 hover:bg-green-200 text-gray-900 rounded-xl shadow px-4 py-3 text-xl font-bold transition border-2 border-blue-200"
              style={{ minWidth: '5em' }}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="text-lg min-h-2.2em font-bold text-green-700">{message}</div>
        <div className="mt-6 text-blue-500 text-base text-center">
          Score: {score} | Tries: {tries}
        </div>
        <button
          onClick={() => { setScore(0); resetGrid(); }}
          className="mt-6 bg-purple-400 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default FindTheWordGame;
