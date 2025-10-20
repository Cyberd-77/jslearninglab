import React, { useState } from 'react';

// Each story: show exactly ONE given value, others as blanks. All blanks are labeled.
const stories = [
  {
    textParts: [
      "Mom had ", " hot dogs. She gave away ", " to friends. Now she has ", " left."
    ],
    numbers: [
      { value: 5, label: "hot dogs at first", given: true },
      { value: 3, label: "hot dogs given away", given: false },
      { value: 2, label: "hot dogs left", given: false }
    ],
    choices: [2, 3, 5, 6]
  },
  {
    textParts: [
      "There are ", " apples on the tree. If ", " fall down, how many are left? ", ""
    ],
    numbers: [
      { value: 10, label: "apples at first", given: true },
      { value: 4, label: "apples that fell", given: false },
      { value: 6, label: "apples left", given: false }
    ],
    choices: [4, 6, 8, 10]
  },
  {
    textParts: [
      "Tom had ", " marbles. He won ", " more. Now he has ", " marbles in total."
    ],
    numbers: [
      { value: 7, label: "marbles at first", given: true },
      { value: 5, label: "marbles won", given: false },
      { value: 12, label: "total marbles", given: false }
    ],
    choices: [5, 7, 9, 12]
  },
  {
    textParts: [
      "Jeremiah had ", " race cars. He lost ", ". How many does he still have? ", ""
    ],
    numbers: [
      { value: 8, label: "race cars at first", given: true },
      { value: 3, label: "race cars lost", given: false },
      { value: 5, label: "race cars left", given: false }
    ],
    choices: [3, 5, 6, 8]
  },
  {
    textParts: [
      "J picked ", " flowers for mom and then picked ", " more. Altogether, he picked ", " flowers."
    ],
    numbers: [
      { value: 6, label: "flowers at first", given: true },
      { value: 2, label: "flowers picked after", given: false },
      { value: 8, label: "total flowers", given: false }
    ],
    choices: [2, 4, 6, 8]
  },
  {
    textParts: [
      "A baker made ", " cookies. She gave away ", " cookies at school. How many remain? ", ""
    ],
    numbers: [
      { value: 12, label: "cookies made", given: true },
      { value: 5, label: "cookies given away", given: false },
      { value: 7, label: "cookies left", given: false }
    ],
    choices: [5, 7, 9, 12]
  },
  {
    textParts: [
      "Jeremiah saw ", " birds outside. ", " flew away. Now there are ", " birds left."
    ],
    numbers: [
      { value: 9, label: "birds seen", given: true },
      { value: 4, label: "birds that flew", given: false },
      { value: 5, label: "birds left", given: false }
    ],
    choices: [4, 5, 7, 9]
  },
  {
    textParts: [
      "J has ", " pennies. He finds ", " more under the couch. How many does he have now? ", ""
    ],
    numbers: [
      { value: 3, label: "pennies at first", given: true },
      { value: 4, label: "pennies found", given: false },
      { value: 7, label: "total pennies", given: false }
    ],
    choices: [3, 4, 6, 7]
  },
  {
    textParts: [
      "A basket holds ", " oranges. If you eat ", " oranges, how many are left in the basket? ", ""
    ],
    numbers: [
      { value: 7, label: "oranges at first", given: true },
      { value: 2, label: "oranges eaten", given: false },
      { value: 5, label: "oranges left", given: false }
    ],
    choices: [2, 5, 7, 9]
  },
  {
    textParts: [
      "Jeremiah built ", " LEGO towers. He built ", " more the next day. In total, he built ", " towers."
    ],
    numbers: [
      { value: 2, label: "LEGO towers at first", given: true },
      { value: 3, label: "LEGO towers built after", given: false },
      { value: 5, label: "total LEGO towers", given: false }
    ],
    choices: [2, 3, 4, 5]
  }
];

const positiveFeedback = [
  "Awesome job, J!",
  "Great work, Jeremiah!",
  "Perfect answer!",
  "You're a math superstar!",
  "Correct, J!",
  "You did it, Jeremiah!"
];

function FillTheBlankNumberStory({ selectedVoice }) {
  const [currentStory, setCurrentStory] = useState(0);

  // For this story, only blanks (not given) get inputs
  const blanksIdx = stories[currentStory].numbers
    .map((n, idx) => (!n.given ? idx : null))
    .filter(idx => idx !== null);

  const [inputs, setInputs] = useState(Array(blanksIdx.length).fill(''));
  const [feedback, setFeedback] = useState(Array(blanksIdx.length).fill(null));
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

  function selectChoiceForBlank(blankIdx, val) {
    const newInputs = [...inputs];
    newInputs[blankIdx] = val;
    setInputs(newInputs);
  }

  function checkAnswers() {
    const answers = stories[currentStory].numbers
      .filter(n => !n.given)
      .map(n => n.value);

    let newFeedback = [];
    let correctCount = 0;
    for (let i = 0; i < answers.length; i++) {
      if (parseInt(inputs[i], 10) === answers[i]) {
        newFeedback[i] = true;
        correctCount++;
      } else {
        newFeedback[i] = false;
      }
    }
    setFeedback(newFeedback);
    setScore(correctCount);
    const voiceMsg = randomFeedback(correctCount, answers.length);
    speak(voiceMsg);
    if (correctCount === answers.length) {
      setCompleted(true);
    }
  }

  function nextStory() {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      const nextBlanksLen = stories[currentStory + 1].numbers.filter(n => !n.given).length;
      setInputs(Array(nextBlanksLen).fill(''));
      setFeedback(Array(nextBlanksLen).fill(null));
      setScore(0);
      setCompleted(false);
    }
  }

  function restart() {
    setCurrentStory(0);
    const firstBlanksLen = stories[0].numbers.filter(n => !n.given).length;
    setInputs(Array(firstBlanksLen).fill(''));
    setFeedback(Array(firstBlanksLen).fill(null));
    setScore(0);
    setCompleted(false);
  }

  const story = stories[currentStory];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-purple-700 text-center">
        Fill-the-Blank Number Story
      </h2>
      <div className="bg-white rounded-2xl shadow-lg px-5 py-8 max-w-xl w-full flex flex-col items-center">
        <div className="mb-8 text-lg text-gray-900">
          {story.textParts.map((part, idx) => {
            const numberObj = story.numbers[idx];
            let blankNumber = null;
            if (numberObj && !numberObj.given) {
              blankNumber = blanksIdx.indexOf(idx);
            }
            return (
              <span key={idx} style={{ display: 'inline-block', minWidth: 72 }}>
                {part}
                {numberObj && numberObj.given && (
                  <span className="inline-flex flex-col items-center mx-2">
                    <span className="px-4 py-2 mb-1 rounded border-2 border-indigo-400 bg-indigo-100 text-lg font-bold min-w-[40px]">
                      {numberObj.value}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{numberObj.label}</span>
                  </span>
                )}
                {blankNumber !== null && (
                  <span className="inline-flex flex-col items-center mx-2">
                    <span
                      className={`block px-4 py-2 mb-1 rounded border-2 text-lg min-w-[40px] ${
                        feedback[blankNumber] === true
                          ? "border-green-400 bg-green-100"
                          : feedback[blankNumber] === false
                          ? "border-red-400 bg-red-100"
                          : "border-gray-400 bg-gray-50"
                      }`}
                      style={{ minWidth: 42, textAlign: 'center' }}
                      aria-label={`Answer blank ${blankNumber + 1}`}
                    >
                      {inputs[blankNumber] !== '' ? inputs[blankNumber] : '\u00A0'}
                    </span>
                    <div className="flex gap-1 justify-center">
                      {story.choices.map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => selectChoiceForBlank(blankNumber, String(num))}
                          className={`px-2 py-1 rounded font-bold text-base border-2
                            ${inputs[blankNumber] === String(num)
                              ? "border-blue-500 bg-blue-200 text-blue-800"
                              : "border-gray-200 bg-gray-100 text-gray-700"}
                            hover:bg-blue-300 hover:border-blue-700`}
                          disabled={completed}
                          aria-label={`Choose ${num} for blank ${blankNumber + 1}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{numberObj.label}</span>
                  </span>
                )}
              </span>
            );
          })}
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
            {randomFeedback(score, story.numbers.filter(n => !n.given).length)}
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
