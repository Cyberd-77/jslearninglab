import React, { useState } from 'react';

// Every 2nd grade reading word from your charts
const readingWords = [
  "this","here","find","me","that","no","work","come","how","help","day","what","down","case","ever","two","same","said","new","an","baseball","factory","learned","felt","sold","midnight","party","below","horn","rush","ground","fixed","idea","ring","east","sand","thanks","deck","receiving","half","building","plant","desk","alone","worn","mean","week","sleep","grip","draw","repeat","pat","motion","bed","rest","pair","black","trip","gate","trap","opening","ready","having","try","raise","trade","paint","everything","goods","pack","sight","root","behind","height","lips","blood","memory","sudden","perform","river","air","hole","mine","bag","powerful","afternoon","beauty","clock","envelope","sale","friend","sky","free","date","smile","meaning","park","sink","needs","sum","kept","cap","hard","fishing","hill","tonight","hidden","perhaps","dog","speaker","arrive","ladies","wild","buy","track","chair","sister","human","inch","split","loves","pound","cream","row","partner","slip","winning","football","fool","kitchen","all","number","same","how","one","case","get","find","just","with","still","had","the","why","over","against","we","never","to","back","book","favor","net","split","complete","crowd","hung","baseball","funny","soft","terrible","double","addition","pocket","drop","march","receive","warning","shadow","empty","desk","shot","kind","darkness","calendar","pick","city","hall","tiny","solve","chest","fight","silver","thanks","went","snow","bag","mail","pink","write","married","motor","bent","able","blind","gift","size","build","wooden","wall","inch","trade","sweet","color","pilot","award","dog","musical","change","top","deep","silence","wake","worn","eight","air","load","harm","page","coffee","tie","lane","chicken","happen","ahead","act","alive","large","body","mixture","forward","winning","plane","mile","wife","acting","fire","solid","ball","breakfast","sound","yourself","stretch","anger","coat","hat","mystery","husband","sing","born","milk","envelope","highway","anything","strong","throw","match","seeing","grow","save"
];

// Shuffle function for variety each session
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffledSet = () => shuffle(readingWords);

function ReadingModule({ selectedVoice }) {
  const [index, setIndex] = useState(0);
  const [wordList, setWordList] = useState(shuffledSet());
  const [message, setMessage] = useState('');

  function speakWord(word) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }
  }

  function nextWord() {
    if (index < wordList.length - 1) {
      setIndex(index + 1);
    } else {
      setMessage("🎉 Great job! You've practiced them all! Shuffle for more.");
    }
  }

  function prevWord() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function reshuffleWords() {
    setWordList(shuffledSet());
    setIndex(0);
    setMessage('');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 p-6 font-sans">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-700 tracking-tight text-center">📚 2nd Grade Reading Words</h2>
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
        <div className="mb-4 text-3xl font-black text-blue-700 min-h-[2.5em]">{wordList[index]}</div>
        <button
          onClick={() => speakWord(wordList[index])}
          className="mb-6 bg-green-400 hover:bg-green-600 text-white rounded-full px-6 py-2 font-bold shadow transition"
        >
          🔊 Hear Word
        </button>
        <div className="flex gap-4 mb-6 w-full">
          <button
            onClick={prevWord}
            disabled={index === 0}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg font-bold w-1/2 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            onClick={nextWord}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold w-1/2"
          >
            Next →
          </button>
        </div>
        <button
          onClick={reshuffleWords}
          className="mt-2 bg-purple-400 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow"
        >
          🔀 Shuffle
        </button>
        <div className="mt-6 text-green-700 min-h-[2em] text-center font-extrabold">{message}</div>
        <div className="mt-6 text-center text-gray-500 text-xs">Word {index + 1} of {wordList.length}</div>
      </div>
    </div>
  );
}

export default ReadingModule;
