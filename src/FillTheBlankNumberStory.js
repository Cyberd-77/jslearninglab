import React, { useState } from 'react';

const stories = [
  {
    text: "J had 20 marbles. He gave away 7. Now he has ___ marbles.",
    answer: 13,
    choices: [14, 13, 12, 16],
    label: "marbles left",
    op: "-" , // operator for scratchpad
    numbers: [20,7]
  },
  {
    text: "There were 58 cookies. J ate 9. How many cookies are left?",
    answer: 49,
    choices: [48, 47, 49, 51],
    label: "cookies left",
    op: "-",
    numbers: [58,9]
  },
  {
    text: "Jeremiah found 16 shells and then found 8 more. Now he has ___ shells.",
    answer: 24,
    choices: [26, 18, 19, 24],
    label: "total shells",
    op: "+",
    numbers: [16,8]
  },
  {
    text: "A basket held 32 apples. J took out 15. How many apples are in the basket now?",
    answer: 17,
    choices: [15, 18, 17, 20],
    label: "apples left",
    op: "-",
    numbers: [32,15]
  },
  {
    text: "There are 67 kids at school. 23 more come. Now, there are ___ kids.",
    answer: 90,
    choices: [77, 90, 84, 88],
    label: "total kids",
    op: "+",
    numbers: [67,23]
  },
  {
    text: "A baker made 45 muffins and sold 28. ___ muffins are left.",
    answer: 17,
    choices: [15, 17, 13, 18],
    label: "muffins left",
    op: "-",
    numbers: [45,28]
  },
  {
    text: "There are 37 crayons in a box. J adds 24 more. Now there are ___ crayons.",
    answer: 61,
    choices: [51, 61, 57, 63],
    label: "total crayons",
    op: "+",
    numbers: [37,24]
  },
  {
    text: "39 students are on the playground. 15 go back inside. ___ students are left.",
    answer: 24,
    choices: [20, 31, 24, 27],
    label: "students left",
    op: "-",
    numbers: [39,15]
  },
  {
    text: "J has 43 pens and gets 16 more as a gift. Now J has ___ pens.",
    answer: 59,
    choices: [55, 56, 59, 61],
    label: "total pens",
    op: "+",
    numbers: [43,16]
  },
  {
    text: "50 birds were in the sky. 11 flew away. There are ___ birds still flying.",
    answer: 39,
    choices: [44, 39, 40, 38],
    label: "birds left",
    op: "-",
    numbers: [50,11]
  }
];

const positiveFeedback = [
  "Awesome job, J!",
  "Correct, Jeremiah!",
  "You're a math star!",
  "Perfect answer!", 
  "Great work, J!",
  "That's right, Jeremiah!"
];

function FillTheBlankNumberStory({ selectedVoice }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  // scratchpad state
  const [scratchTop, setScratchTop] = useState('');
  const [scratchBottom, setScratchBottom] = useState('');
  const [scratchResult, setScratchResult] = useState('');

  function speakQuestion() {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(stories[current].text.replace("___", "blank"));
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function checkAnswer() {
    const isCorrect = Number(selected) === stories[current].answer;
    setFeedback(isCorrect);
    speak(
      isCorrect
        ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
        : "Try again, J!"
    );
    if (isCorrect) setCompleted(true);
  }

  function nextStory() {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
      setSelected('');
      setFeedback(null);
      setCompleted(false);
      setScratchTop('');
      setScratchBottom('');
      setScratchResult('');
    }
  }

  function restart() {
    setCurrent(0);
    setSelected('');
    setFeedback(null);
    setCompleted(false);
    setScratchTop('');
    setScratchBottom('');
    setScratchResult('');
  }

  // Scratchpad logic
  function handleScratchChange(val, which) {
    let top = which === "top" ? val : scratchTop;
    let bottom = which === "bottom" ? val : scratchBottom;
    setScratchTop(top);
    setScratchBottom(bottom);
    let result;
    if (top !== '' && bottom !== '') {
      if (stories[current].op === "+") result = Number(top) + Number(bottom);
      else result = Number(top) - Number(bottom);
      setScratchResult(result);
    } else {
      setScratchResult('');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-purple-700 text-center">
        Fill-the-Blank Number Story
      </h2>
      <div className="bg-white rounded-2xl shadow-lg px-5 py-8 max-w-xl w-full flex flex-col items-center">

        {/* Audio Button */}
        <button
          onClick={speakQuestion}
          className="flex items-center px-4 py-1 mb-3 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-800"
          aria-label="Hear question"
        >
          <span role="img" aria-label="audio">🔊</span> &nbsp; Hear Question
        </button>

        {/* Story */}
        <div className="mb-8 text-lg text-gray-900 text-center" style={{minHeight: 80}}>
          <span>{stories[current].text.replace("___", 
            <span className="inline-flex flex-col items-center mx-2">
              <span className={`block px-4 py-2 mb-1 rounded border-2 text-lg min-w-[50px] ${
                  feedback == null
                    ? "border-gray-400 bg-gray-50"
                    : feedback
                    ? "border-green-400 bg-green-100"
                    : "border-red-400 bg-red-100"
                }`}
                style={{minWidth: 52, textAlign: "center"}}>
                {selected !== '' ? selected : '\u00A0'}
              </span>
              <span className="text-xs text-gray-500 mt-1">{stories[current].label}</span>
            </span>
          )}</span>
        </div>
        <div className="mb-5 flex flex-row flex-wrap gap-3 justify-center">
          {stories[current].choices.map((choice) => (
            <button
              key={choice}
              className={`px-4 py-2 rounded font-bold text-lg border-2
                ${String(choice) === selected
                  ? "border-blue-500 bg-blue-200 text-blue-800"
                  : "border-gray-200 bg-gray-100 text-gray-700"}
                hover:bg-blue-300 hover:border-blue-700`}
              onClick={() => {
                if (!completed) {
                  setSelected(String(choice));
                  setFeedback(null);
                }
              }}
              disabled={completed}
              aria-label={`Choose ${choice} for blank`}
            >
              {choice}
            </button>
          ))}
        </div>
        <button
          onClick={checkAnswer}
          disabled={completed || selected === ''}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-7 py-2 font-bold shadow text-lg mb-3"
        >
          Check Answer
        </button>
        {completed && (
          <div className="text-green-700 font-bold mb-4 text-xl">
            {positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]}
          </div>
        )}

        {/* Scratchpad */}
        <div className="bg-gray-100 rounded-xl p-4 mt-6 mb-2 w-full max-w-xs shadow border border-gray-300 text-center">
          <div className="text-lg font-bold mb-1 text-gray-700">Scratchpad</div>
          <div className="flex flex-col items-center">
            <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-end'}}>
              <input
                type="number"
                min="0"
                max="100"
                value={scratchTop}
                onChange={e => handleScratchChange(e.target.value, "top")}
                placeholder={stories[current].numbers[0]}
                style={{width: 70, marginBottom: 4, fontSize: 24, textAlign: 'right', border: '1.5px solid #bbb', borderRadius: 8}}
                aria-label="Top number"
              />
              <span style={{fontWeight: 'bold', fontSize: 20, color: '#333', marginRight: 5}}>
                {stories[current].op}
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={scratchBottom}
                onChange={e => handleScratchChange(e.target.value, "bottom")}
                placeholder={stories[current].numbers[1]}
                style={{width: 70, marginBottom: 4, fontSize: 24, textAlign: 'right', border: '1.5px solid #bbb', borderRadius: 8}}
                aria-label="Bottom number"
              />
              <div className="border-t border-gray-500 my-1 w-full"></div>
              <input
                type="text"
                readOnly
                value={scratchResult !== '' ? scratchResult : ''}
                style={{width: 70, fontSize: 24, textAlign: 'right', background:"#e7f3ff",color:"#135", border: '1.5px solid #bcd', borderRadius: 8, marginTop:2}}
                aria-label="Scratchpad result"
                placeholder="Result"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">Type numbers to add or subtract vertically</div>
        </div>

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
            disabled={!completed || current === stories.length - 1}
          >
            Next Story
          </button>
        </div>
        <div className="mt-4 text-blue-500 font-semibold text-base">
          Story {current + 1} of {stories.length}
        </div>
      </div>
    </div>
  );
}

export default FillTheBlankNumberStory;
