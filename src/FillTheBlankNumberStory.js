import React, { useState } from 'react';

const stories = [
  {
    textParts: [
      "Mom had",
      "hot dogs. She gave away",
      "to friends. Now she has",
      "left."
    ],
    blanks: [5, 3, 2]  // correct answers in order
  },
  {
    textParts: [
      "There are",
      "apples on the tree. If",
      "fall down, how many are left?"
    ],
    blanks: [10, 4, 6]
  },
  {
    textParts: [
      "Tom had",
      "marbles. He won",
      "more. Now he has",
      "marbles in total."
    ],
    blanks: [7, 5, 12]
  }
];

function FillTheBlankNumberStory({ selectedVoice }) {
  const [currentStory, setCurrentStory] = useState(0);
  const [inputs, setInputs] = useState(Array(stories[0].blanks.length).fill(''));
  const [feedback, setFeedback] = useState(Array(stories[0].blanks.length).fill(null));
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function handleChange(index, value) {
    if (/^\d*$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
    }
  }

  function checkAnswers() {
    const correctAnswers = stories[currentStory].blanks;
    let newFeedback = [];
    let correctCount = 0;
    for(let i = 0; i < correctAnswers.length; i++) {
      if (parseInt(inputs[i], 10) === correctAnswers[i]) {
        newFeedback[i] = true;
        correctCount++;
      } else {
        newFeedback[i] = false;
      }
    }
    setFeedback(newFeedback);
    setScore(correctCount);
    speak(
      correctCount === correctAnswers.length
        ? "Great job! You got all of them right."
        : `You got ${correctCount} out of ${correctAnswers.length} correct. Keep trying!`
    );
    if (correctCount === correctAnswers.length) {
      setCompleted(true);
    }
  }

  function nextStory() {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setInputs(Array(stories[currentStory + 1].blanks.length).fill(''));
      setFeedback(Array(stories[currentStory + 1].blanks.length).fill(null));
      setScore(0);
      setCompleted(false);
    }
  }

  // Compose story text with blanks replaced by inputs
  const story = stories[currentStory];
  let fullText = "";
  for(let i = 0; i < story.blanks.length; i++) {
    fullText += story.textParts[i] + (inputs[i] || "___") + " ";
  }
  fullText += story.textParts[story.blanks.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 flex flex-col items-center justify-center p-6 font-sans">
      <h2 className="text-3xl mb-6 font-extrabold text-center text-green-700">Fill the Blank Number Story</h2>
      <div className="max-w-xl w-full bg-white rounded-xl p-6 shadow-lg space-y-4">
        <p className="text-lg leading-relaxed">
          {story.textParts.map((part, idx) => (
            <React.Fragment key={idx}>
              {part}{" "}
              {idx < story.blanks.length && (
                <input
                  type="text"
                  className={`w-16 border-2 rounded px-2 py-1 text-center text-lg font-semibold
                    ${feedback[idx] === null
                      ? "border-gray-300"
                      : feedback[idx] === true
                        ? "border-green-500 bg-green-100"
                        : "border-red-500 bg-red-100"}`
                  }
                  value={inputs[idx] || ''}
                  onChange={e => handleChange(idx, e.target.value)}
                  aria-label={`Blank ${idx + 1}`}
                />
              )}
            </React.Fragment>
          ))}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => speak(fullText)}
            className="bg-blue-400 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold shadow"
          >
            🔊 Hear Story
          </button>
          <button
            onClick={checkAnswers}
            className="bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold shadow"
          >
            Check Answers
          </button>
          {completed && currentStory < stories.length -1 && (
            <button
              onClick={nextStory}
              className="bg-purple-500 hover:bg-purple-700 text-white px-5 py-2 rounded font-semibold shadow"
            >
              Next Story →
            </button>
          )}
        </div>
        <div className="text-lg font-bold text-center mt-4">
          Score: {score} / {story.blanks.length}
        </div>
      </div>
    </div>
  );
}

export default FillTheBlankNumberStory;
