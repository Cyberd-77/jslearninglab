import React, { useState, useEffect } from 'react';
import { spellingWeeks } from './spellingWords';
import SpellingBeeShowdown from './SpellingBeeShowdown';
import SpellingGame from './SpellingGame';
import MathModule from './MathModule';
import ReadingModule from './ReadingModule';
import FindTheWordGame from './FindTheWordGame';

// Pick nearest future or latest week as 'current'
function getCurrentWeekIdx() {
  const today = new Date();
  let idx = 0;
  spellingWeeks.forEach((w, i) => {
    const testDate = new Date(w.testDate);
    if (testDate >= today) idx = i;
  });
  return idx;
}

export default function App() {
  const [subject, setSubject] = useState(null);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(null);
  const [spellingMode, setSpellingMode] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('Samantha');

  useEffect(() => {
    const populateVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      const defaultVoice = voicesList.find(v => v.name === 'Samantha');
      setSelectedVoice(defaultVoice ? defaultVoice.name : voicesList[0]?.name);
    };
    window.speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const backgroundColors = {
    spelling: 'bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200',
    math: 'bg-gradient-to-br from-green-400 to-blue-500',
    reading: 'bg-gradient-to-br from-green-600 via-green-400 to-yellow-300',
    findword: 'bg-gradient-to-br from-blue-200 via-green-200 to-yellow-100',
    default: 'bg-gradient-to-br from-gray-500 to-gray-700'
  };

  // SPLASH SCREEN SECTION
  if (!subject) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-cyan-400 via-fuchsia-300 to-yellow-200">
        {/* Animated bubble */}
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-pink-400 bg-opacity-20 blur-2xl rounded-full animate-bounce-slow z-0"></div>
        <div className="absolute bottom-[-80px] right-[-100px] w-[250px] h-[250px] bg-cyan-400 bg-opacity-20 blur-2xl rounded-full animate-pulse z-0"></div>
        <div className="absolute top-[100px] right-[-60px] w-[180px] h-[180px] bg-yellow-200 bg-opacity-20 blur-2xl rounded-full animate-ping z-0"></div>
        {/* Mascot */}
        <div className="z-10 mb-2 flex flex-col items-center select-none">
          <span className="inline-block w-[90px] h-[90px] rounded-lg bg-yellow-400 border-[7px] border-gray-900 mb-2 shadow-lg" style={{
            boxShadow: '0px 6px 26px 0 rgb(197 144 8 / 40%)'
          }}>
            <span className="block w-full text-center mt-1 text-[54px] drop-shadow-lg">🟥</span>
          </span>
          <span className="text-white text-5xl sm:text-6xl font-black drop-shadow-glow-warm tracking-tight mb-4">
            J's <span className="text-yellow-300">Roblox</span> Learning Lab!
          </span>
          <span className="text-fuchsia-800 font-bold italic mb-3 animate-pulse">
            Level up your brain. Build your skills. WIN prizes!
          </span>
        </div>
        {/* Voice selector */}
        <div className="z-10 bg-white bg-opacity-50 rounded-2xl px-8 py-6 mt-3 drop-shadow-xl flex flex-col items-center border-[3px] border-blue-200">
          <p className="text-xl font-semibold mb-2 text-blue-800">Choose your speaking voice:</p>
          <select
            className="mb-2 rounded-lg px-4 py-2 border-2 border-yellow-400 bg-white text-blue-900 w-64 font-bold focus:ring-4 focus:ring-pink-300 text-lg"
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            aria-label="Select voice"
          >
            {voices.map(v =>
              <option key={v.name} value={v.name}>{v.name}</option>
            )}
          </select>
        </div>
        {/* Subject Buttons */}
        <div className="z-10 flex flex-col gap-7 items-center mt-10 w-full max-w-lg animate-fadein">
          <button
            onClick={() => setSubject('spelling')}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-yellow-300 via-pink-200 to-fuchsia-200 hover:bg-gradient-to-tr hover:from-yellow-400 hover:to-fuchsia-300 transition-all shadow-2xl px-10 py-6 rounded-[20px] font-extrabold text-3xl text-fuchsia-900 border-4 border-white hover:scale-105 duration-300 ease-in animate-bounce hover:animate-none"
          >
            <span>📝🟩</span> Spelling
          </button>
          <button
            onClick={() => setSubject('math')}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-blue-300 via-cyan-200 to-green-200 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-green-200 transition-all shadow-2xl px-9 py-6 rounded-[20px] font-extrabold text-3xl text-blue-900 border-4 border-white hover:scale-105 duration-300 ease-in"
          >
            <span>🧮🟥</span> Math
          </button>
          <button
            onClick={() => setSubject('reading')}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-green-300 via-yellow-200 to-lime-200 hover:bg-gradient-to-tr hover:from-green-400 hover:to-yellow-200 transition-all shadow-2xl px-9 py-6 rounded-[20px] font-extrabold text-3xl text-green-900 border-4 border-white hover:scale-105 duration-300 ease-in"
          >
            <span>📚🟦</span> Reading
          </button>
          <button
            onClick={() => setSubject('findword')}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-yellow-200 via-blue-100 to-orange-100 hover:bg-gradient-to-tr hover:from-blue-200 hover:to-yellow-200 transition-all shadow-2xl px-9 py-6 rounded-[20px] font-extrabold text-3xl text-yellow-900 border-4 border-white hover:scale-105 duration-300 ease-in"
          >
            <span>🔎🟫</span> Find the Word
          </button>
        </div>
        {/* Footer */}
        <div className="z-10 mt-14 text-fuchsia-800 text-lg font-extrabold opacity-80 drop-shadow-md animate-bounce-slow">
          Ready, J? Pick a subject to start your Roblox adventure!
        </div>
        <style>
          {`
          .animate-bounce-slow { animation: bounce 2.8s infinite cubic-bezier(.85, .5, .35, 1.2);}
          .drop-shadow-glow-warm { filter: drop-shadow(0px 4px 14px rgba(236, 72, 153, 0.30)); }
          .animate-fadein { animation: fadeIn .8s 0.1s cubic-bezier(.6,.9,.32,.99) both; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1;transform:translateY(0); } }
          `}
        </style>
      </div>
    );
  }

  // SPELLING WEEK PICKER
  if (subject === 'spelling' && selectedWeekIdx === null) {
    const currentIdx = getCurrentWeekIdx();
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundColors.spelling} font-sans p-8`}>
        <button
          onClick={() => { setSubject(null); setSelectedWeekIdx(null); setSpellingMode(null); }}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Subjects
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-pink-900 drop-shadow text-center">
          Pick Your Spelling Week!
        </h2>
        <div className="w-full max-w-md mx-auto border-0 rounded-2xl bg-white bg-opacity-40 shadow-lg p-2">
          <div className="overflow-y-auto" style={{ maxHeight: "350px" }}>
            {spellingWeeks.map((week, idx) => (
              <button
                key={week.label + week.testDate}
                onClick={() => setSelectedWeekIdx(idx)}
                className={`w-full px-2 py-3 mb-2 rounded-xl font-bold text-lg flex flex-col items-start shadow transition border-2
                  ${idx === currentIdx ? 'border-yellow-500 bg-yellow-200 text-pink-900' 
                    : idx === 0 ? 'border-blue-400 bg-blue-100 text-blue-900' 
                    : 'border-gray-300 bg-white text-gray-900'}
                  hover:bg-cyan-100`}
              >
                <span className="font-bold">{week.label}</span>
                <span className="text-xs text-gray-500">Test date: {week.testDate || 'TBA'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 text-gray-700 text-base text-center">Scroll to find your week. The current week's words are highlighted!</div>
      </div>
    );
  }

  // SPELLING GAME MODE PICKER
  if (subject === 'spelling' && selectedWeekIdx !== null && !spellingMode) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundColors.spelling} font-sans p-8`}>
        <button
          onClick={() => { setSelectedWeekIdx(null); setSpellingMode(null); }}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Week Select
        </button>
        <h2 className="text-3xl font-extrabold mb-8 text-purple-800 drop-shadow text-center">
          Pick Your Spelling Game!
        </h2>
        <div className="max-w-xl w-full flex flex-col gap-5 mb-6">
          <button
            onClick={() => setSpellingMode('bee')}
            className="w-full bg-yellow-300 hover:bg-yellow-400 px-8 py-4 rounded-2xl font-bold text-2xl shadow transition text-purple-900"
          >
            🦋 Spelling Bee Showdown
          </button>
          <button
            onClick={() => setSpellingMode('testprep')}
            className="w-full bg-blue-200 hover:bg-blue-300 px-8 py-4 rounded-2xl font-bold text-lg shadow transition text-blue-900"
          >
            🚀 TestPrep Crash (Classic Study/Test mode)
          </button>
        </div>
        <div className="mt-6 text-gray-700 text-base text-center">
          Your chosen week’s words will be used for every game!
        </div>
      </div>
    );
  }

  // GAME SCREENS AND MAIN NAVIGATION
  return (
    <div className={`${backgroundColors[subject]} min-h-screen`}>
      <button
        onClick={() => {
          setSubject(null);
          setSelectedWeekIdx(null);
          setSpellingMode(null);
        }}
        className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
      >
        ← Back to Subjects
      </button>
      {subject === 'spelling' && spellingMode === 'bee' && (
        <SpellingBeeShowdown
          wordSet={spellingWeeks[selectedWeekIdx].words}
          selectedVoice={selectedVoice}
          onExit={() => setSpellingMode(null)}
        />
      )}
      {subject === 'spelling' && spellingMode === 'testprep' && (
        <SpellingGame
          wordSet={spellingWeeks[selectedWeekIdx].words}
          selectedVoice={selectedVoice}
          onExit={() => setSpellingMode(null)}
        />
      )}
      {subject === 'math' && <MathModule selectedVoice={selectedVoice} />}
      {subject === 'reading' && <ReadingModule selectedVoice={selectedVoice} />}
      {subject === 'findword' && <FindTheWordGame selectedVoice={selectedVoice} />}
    </div>
  );
}
