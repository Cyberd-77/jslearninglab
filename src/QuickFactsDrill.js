import React, { useState, useEffect } from 'react';

// Generate ALL addition/subtraction problems for 0-20 (result also max 20, no negatives)
const ADDITION_PROBLEMS = Array.from({ length: 21 }, (_, a) =>
  Array.from({ length: 21 }, (_, b) => ({
    type: 'addition',
    prompt: `${a} + ${b}`,
    answer: a + b
  }))
).flat().filter(q => q.answer <= 20);

const SUBTRACTION_PROBLEMS = Array.from({ length: 21 }, (_, a) =>
  Array.from({ length: 21 }, (_, b) => a - b >= 0 ? {
    type: 'subtraction',
    prompt: `${a} - ${b}`,
    answer: a - b
  } : null)
).flat().filter(q => q && q.answer <= 20);

const ALL_PROBLEMS = [...ADDITION_PROBLEMS, ...SUBTRACTION_PROBLEMS];

// Random response templates
const positivePhrases = [
  "Great job!",
  "Awesome work, J!",
  "Correct, Jeremiah!",
  "Well done!",
  "You got it, J!",
  "Nice thinking!",
  "You nailed it!",
  "Excellent, Jeremiah!",
  "You're fast, J!",
  "Superstar math work!"
];

const encouragementPhrases = [
  "Keep trying, J!",
  "You can do it, Jeremiah!",
  "Think about it one more time.",
  "Try again, J!",
  "Don't give up, Jeremiah!",
  "Take another chance!",
  "Keep going!",
  "You're getting closer!",
  "Try your best, J!",
  "Math takes practice!"
];

function getRandomSample(arr, count = 10) {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function QuickFactsDrill({ selectedVoice, numQuestions = 10 }) {
  const [quiz, setQuiz] = useState(() => getRandomSample(ALL_PROBLEMS, numQuestions));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuiz(getRandomSample(ALL_PROBLEMS, numQuestions));
    setIndex(0);
    setInput('');
    setFeedback('');
    setScore(0);
  }, [numQuestions]); // Reset when changing number of questions in future feature

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function randomPhrase(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function handleInput(e) {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInput(value);
  }

  function checkAnswer() {
    const currentProblem = quiz[index];
    if (parseInt(input, 10) === currentProblem.answer) {
      const phrase = randomPhrase(positivePhrases);
      speak(phrase);
      setFeedback(`✅ ${phrase}`);
      setScore(score + 1);
      setTimeout(() => {
        setFeedback('');
        setInput('');
        if (index < quiz.length - 1) setIndex(index + 1);
      }, 950);
    } else {
      const encouragement = randomPhrase(encouragementPhrases);
      speak(encouragement);
      setFeedback(`❌ ${encouragement}`);
    }
  }

  function nextQuestion() {
    setFeedback('');
    setInput('');
    setIndex(i => Math.min(i + 1, quiz.length - 1));
  }

  function prevQuestion() {
    setFeedback('');
    setInput('');
    setIndex(i => Math.max(i - 1, 0));
  }

  function restartQuiz() {
    setQuiz(getRandomSample(ALL_PROBLEMS, numQuestions));
    setIndex(0);
    setInput('');
    setFeedback('');
    setScore(0);
  }

  // Refs to current problem
  const currentProblem = quiz[index];

  // Final screen
  if (index === quiz.length) {
    const phrase = randomPhrase([
      "You finished, Jeremiah!",
      "Awesome job, J!",
      "You're a math star!",
      "Quiz complete. Well done!"
    ]);
    speak(phrase);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 p-8 font-sans">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-4 text-green-700">{phrase}</h2>
          <div className="mb-4 text-xl text-purple-800">Score: {score} / {quiz.length}</div>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white rounded-full px-7 py-3 font-bold text-lg mt-2 shadow"
            onClick={restartQuiz}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 p-8 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-800 drop-shadow text-center">
        🚦 Quick Facts Drill
      </h2>
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
        <div className="mb-4 text-xl font-bold text-gray-700">
          Problem {index + 1} of {quiz.length}
        </div>
        <div className="mb-8 text-4xl font-black text-purple-900 tracking-wid">
          {currentProblem.prompt}
        </div>
        <button
          onClick={() => speak(currentProblem.prompt.replace('*', 'times').replace('/', 'divided by'))}
          className="mb-4 bg-blue-400 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-bold shadow"
        >
          🔊 Read Problem
        </button>
        <input
          type="text"
          value={input}
          onChange={handleInput}
          className="mb-4 border-2 border-blue-400 rounded-lg px-6 py-3 w-32 text-center text-2xl font-mono"
          placeholder="Answer"
          aria-label="Type answer"
          autoFocus
        />
        <button
          className="bg-green-400 hover:bg-green-600 text-white px-9 py-3 rounded-full text-lg font-bold shadow mb-2"
          onClick={checkAnswer}
        >
          Check
        </button>
        <div className="text-lg min-h-[2em] font-bold text-green-700 mt-2">{feedback}</div>
        <div className="flex gap-3 mt-4 w-full justify-center">
          <button
            onClick={prevQuestion}
            disabled={index === 0}
            className="bg-gray-300 hover:bg-gray-500 text-gray-900 px-4 py-2 rounded-lg font-bold"
          >⬅️ Back</button>
          <button
            onClick={nextQuestion}
            disabled={index >= quiz.length - 1}
            className="bg-gray-300 hover:bg-gray-500 text-gray-900 px-4 py-2 rounded-lg font-bold"
          >Next ➡️</button>
        </div>
        <div className="mt-5 text-lg text-blue-700">Score: {score}</div>
        <button
          onClick={restartQuiz}
          className="mt-6 bg-purple-400 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow"
        >
          🔄 Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default QuickFactsDrill;
