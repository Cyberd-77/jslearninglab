import React, { useState } from 'react';

// Ten example number stories for young learners
const stories = [
  {
    textParts: ["Mom had ", " hot dogs. She gave away ", " to friends. Now she has ", " left."],
    blanks: [5, 3, 2]
  },
  {
    textParts: ["There are ", " apples on the tree. If ", " fall down, how many are left? ", ""],
    blanks: [10, 4, 6]
  },
  {
    textParts: ["Tom had ", " marbles. He won ", " more. Now he has ", " marbles in total."],
    blanks: [7, 5, 12]
  },
  {
    textParts: ["Jeremiah had ", " race cars. He lost ", ". How many does he still have? ", ""],
    blanks: [8, 3, 5]
  },
  {
    textParts: ["J picked ", " flowers for mom and then picked ", " more. Altogether, he picked ", " flowers."],
    blanks: [6, 2, 8]
  },
  {
    textParts: ["A baker made ", " cookies. She gave away ", " cookies at school. How many remain? ", ""],
    blanks: [12, 5, 7]
  },
  {
    textParts: ["Jeremiah saw ", " birds outside. ", " flew away. Now there are ", " birds left."],
    blanks: [9, 4, 5]
  },
  {
    textParts: ["J has ", " pennies. He finds ", " more under the couch. How many does he have now? ", ""],
    blanks: [3, 4, 7]
  },
  {
    textParts: ["A basket holds ", " oranges. If you eat ", " oranges, how many are left in the basket? ", ""],
    blanks: [7, 2, 5]
  },
  {
    textParts: ["Jeremiah built ", " LEGO towers. He built ", " more the next day. In total, he built ", " towers."],
    blanks: [2, 3, 5]
  }
];

const positiveFeedback = [
  "Awesome job, J!",
  "Great work, Jeremiah!",
  "Perfect answer!",
  "You're a math superstar!",
  "Correct, J!",
  "You did it, Jeremiah!",
];

function FillTheBlankNumberStory({ selectedVoice }) {
  const [currentStory, setCurrentStory] = useState(0);
  const [inputs, setInputs] = useState(Array(stories[0].blanks.length).fill(''));
  const [feedback, setFeedback] = useState(Array(stories[0].blanks.length).fill(null));
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function randomFeedback(correct, total) {
    return correct === total
      ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
      : `You got ${correct} out of ${total} correct. Keep trying, J!`;
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
    const voiceMsg = randomFeedback(correctCount, correctAnswers.length);
    speak(voiceMsg);
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

  function restart() {
    setCurrentStory(0);
    setInputs(Array(stories[0].blanks.length).fill(''));
    setFeedback(Array(stories[0].blanks.length).fill(null));
    setScore(0);
    setCompleted(false);
  }

  // Compose story text with blanks replaced by inputs
  const story = stories[currentStory];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-purple-700 text-center">
        Fill-the-Blank Number Story
      </h2>
      <div className="bg-white rounded-2xl shadow-lg px-5 py-8 max-w-xl w-full flex flex-col items-center">
        <div className="mb-8 text-lg">
          {story.textParts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < story.blanks.length && (
                <input
                  type="number"
                  value={inputs[idx]}
                  onChange={e => handleChange(idx, e.target.value)}
                  className={`mx-2 px-2 py-1 rounded-md border-2 ${feedback[idx] === true
                    ? "border-green-400 bg-green-50"
                    : feedback[idx] === false
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50"}`}
                  style={{ width: 50 }}
                  disabled={completed}
                  aria-label={`blank ${idx+1}`}
                />
              )}
            </span>
          ))}
        </div>
        <button
          onClick={checkAnswers}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-7 py-2 font-bold shadow text-lg mb-3"
          disabled={completed}
        >
          Check Answer
        </button>
        {completed && (
          <div className="text-green-700 font-bold mb-4 text-xl">
            {randomFeedback(score, story.blanks.length)}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={restart}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-5 py-2 font-semibold shadow"
          >
            Restart
          </button>
          <button
            onClick={nextStory}
            className="bg-purple-400 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-bold shadow"
            disabled={!completed || currentStory === stories.length - 1}
          >
            Next Story
          </button>
        </div>
        <div className="mt-4 text-blue-500 font-semibold text-base">
          Story {currentStory + 1} of {stories.length}
        </div>
      </div>
    </div>
  );
}

export default FillTheBlankNumberStory;
