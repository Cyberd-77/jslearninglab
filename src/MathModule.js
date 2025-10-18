import React, { useState } from 'react';

function MathModule({ selectedVoice }) {
  const mathProblems = [
    { question: "5 + 3", answer: "8" },
    { question: "7 - 4", answer: "3" },
    { question: "6 + 6", answer: "12" }
  ];

  const positivePhrases = [
    (q, a) => `Great job J, ${q} equals ${a}.`,
    (q, a) => `Fantastic, ${q} is ${a}.`,
    (q, a) => `You nailed it! ${q} equals ${a}.`,
    (q, a) => `Excellent work! ${q} equals ${a}.`
  ];

  const negativePhrases = [
    () => `Try again, J.`,
    () => `Almost there, try once more.`,
    () => `Don't give up, J, try again.`,
    () => `Keep going! You can do it.`
  ];

  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  function speakFeedback(isCorrect, question, answer) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const phraseList = isCorrect ? positivePhrases : negativePhrases;
    const phraseIndex = Math.floor(Math.random() * phraseList.length);
    const text = isCorrect ? phraseList[phraseIndex](question, answer) : phraseList[phraseIndex]();

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  }

  function checkAnswer() {
    if (userAnswer.trim() === mathProblems[current].answer) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      speakFeedback(true, mathProblems[current].question, mathProblems[current].answer);
      setTimeout(() => {
        setMessage('');
        setUserAnswer('');
        if (current < mathProblems.length - 1) {
          setCurrent(current + 1);
        } else {
          setMessage(`🎉 All done! Your score: ${score + 1}/${mathProblems.length}`);
        }
      }, 1000);
    } else {
      setMessage('❌ Try again.');
      speakFeedback(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 font-sans p-6">
      <h2 className="text-4xl font-bold text-white mb-8 drop-shadow">🧮 Math Practice - Grade 2</h2>
      {current < mathProblems.length ? (
        <>
          <div className="text-4xl font-extrabold text-white mb-4">{mathProblems[current].question}</div>
          <input
            type="text"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            className="text-lg px-4 py-2 rounded-md w-48 text-center"
            aria-label="Answer input"
            autoFocus
          />
          <button
            onClick={checkAnswer}
            className="mt-4 bg-white text-blue-600 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-100 transition"
          >
            Check Answer
          </button>
          <div className="mt-4 text-white font-semibold min-h-[2em]">{message}</div>
        </>
      ) : (
        <div className="text-white text-xl font-bold">{message}</div>
      )}
    </div>
  );
}

export default MathModule;
