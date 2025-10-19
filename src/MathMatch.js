import React, { useState, useEffect } from 'react';

// Math problems generation helpers reused from QuickFactsDrill
const ADDITION_PROBLEMS = Array.from({ length: 21 }, (_, a) =>
  Array.from({ length: 21 }, (_, b) => ({
    type: 'addition',
    prompt: `${a} + ${b}`,
    answer: a + b
  }))
).flat().filter(q => q.answer <= 20);

const SUBTRACTION_PROBLEMS = Array.from({ length: 21 }, (_, a) =>
  Array.from({ length: 21 }, (_, b) =>
    a - b >= 0
      ? {
          type: 'subtraction',
          prompt: `${a} - ${b}`,
          answer: a - b
        }
      : null
  )
)
  .flat()
  .filter(q => q && q.answer <= 20);

const ALL_PROBLEMS = [...ADDITION_PROBLEMS, ...SUBTRACTION_PROBLEMS];

function getRandomSample(arr, count = 10) {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// Generate multiple-choice options, one correct and 3 random distractors
function generateChoices(correctAnswer) {
  const choices = new Set();
  choices.add(correctAnswer);
  while (choices.size < 4) {
    const distractor = Math.floor(Math.random() * 21);
    if (distractor !== correctAnswer) {
      choices.add(distractor);
    }
  }
  return shuffleArray(Array.from(choices));
}

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

function MathMatch({ selectedVoice, numQuestions = 10 }) {
  const [quiz, setQuiz] = useState(() => getRandomSample(ALL_PROBLEMS, numQuestions));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    const firstProblem = quiz[0];
    if (firstProblem) {
      setChoices(generateChoices(firstProblem.answer));
    }
  }, [quiz]);

  useEffect(() => {
    const currentProblem = quiz[index];
    if (currentProblem) {
      setChoices(generateChoices(currentProblem.answer));
      setFeedback('');
    }
  }, [index, quiz]);

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

  function speakPromptMathFriendly(prompt) {
    let spoken = prompt
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/\*/g, ' times ')
      .replace(/\//g, ' divided by ');
    speak(spoken.trim());
  }

  function handleChoice(choice) {
    const currentProblem = quiz[index];
    if (choice === currentProblem.answer) {
      const phrase = randomPhrase(positivePhrases);
      speak(phrase);
      setFeedback(`✅ ${phrase}`);
      setScore(score + 1);
      if (index < quiz.length - 1) {
        setTimeout(() => {
          setIndex(index + 1);
          setFeedback('');
        }, 1000);
      } else {
        setTimeout(() => setFinished(true), 1000);
      }
    } else {
      const encouragement = randomPhrase(encouragementPhrases);
      speak(encouragement);
      setFeedback(`❌ ${encouragement}`);
    }
  }

  function restartQuiz() {
    setQuiz(getRandomSample(ALL_PROBLEMS, numQuestions));
    setIndex(0);
    setFeedback('');
    setScore(0);
    setFinished(false);
  }

  if (finished) {
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

  const currentProblem = quiz[index];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 p-8 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-800 drop-shadow text-center">
        🚦 Math Match
      </h2>
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
        <div className="mb-6 text-xl font-bold text-gray-700">
          Problem {index + 1} of {quiz.length}
        </div>
        <div className="mb-8 text-5xl font-black text-purple-900 tracking-widest selection:bg-pink-300 selection:text-white">
          {currentProblem.prompt}
        </div>
        <button
          onClick={() => speakPromptMathFriendly(currentProblem.prompt)}
          className="mb-6 bg-blue-400 hover:bg-blue-600 text-white rounded-full px-6 py-3 font-bold shadow"
        >
          🔊 Read Problem
        </button>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-4">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className="bg-gray-100 hover:bg-green-300 rounded-lg px-4 py-3 text-3xl font-extrabold text-black shadow-md"
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="text-lg min-h-[2em] font-bold text-green-700">{feedback}</div>
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

export default MathMatch;
