import React, { useState, useEffect } from 'react';
import { spellingWeeks } from './spellingWords';
import SpellingBeeShowdown from './SpellingBeeShowdown';
import SpellingGame from './SpellingGame';
import MathModule from './MathModule';
import ReadingModule from './ReadingModule';
import FindTheWordGame from './FindTheWordGame';

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

  // Splash screen
  if (!subject) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundColors.default} font-sans p-6`}>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-8 md:mb-12 drop-shadow text-center">
          Jslearning Lab
        </h1>
        <p className="text-white mb-3 text-lg text-center">
          Choose your preferred voice:
        </p>
        <select
          className="mb-8 rounded-lg px-2 py-2 border-2 border-cyan-500 bg-white text-cyan-900 w-full max-w-xs mx-auto"
          value={selectedVoice}
          onChange={e => setSelectedVoice(e.target.value)}
          aria-label="Select voice"
        >
          {voices.map(v =>
            <option key={v.name} value={v.name}>
              {v.name}
            </option>
          )}
        </select>
        <p className="text-white mb-6 text-lg text-center">
          Choose a subject to begin learning:
        </p>
        <div className="flex flex-col gap-6 items-center w-full max-w-xs mx-auto md:flex-row md:max-w-none md:gap-8 md:justify-center">
          <button
            onClick={() => setSubject('spelling')}
            className="bg-pink-400 hover:bg-pink-600 text-white rounded-full px-8 py-4 text-2xl font-bold shadow-lg transition w-full md:w-auto"
          >
            📝 Spelling
          </button>
          <button
            onClick={() => setSubject('math')}
            className="bg-blue-400 hover:bg-blue-600 text-white rounded-full px-8 py-4 text-2xl font-bold shadow-lg transition w-full md:w-auto"
          >
            🔢 Math
          </button>
          <button
            onClick={() => setSubject('reading')}
            className="bg-green-500 hover:bg-green-700 text-white rounded-full px-8 py-4 text-2xl font-bold shadow-lg transition w-full md:w-auto"
          >
            📚 Reading
          </button>
          <button
            onClick={() => setSubject('findword')}
            className="bg-yellow-300 hover:bg-yellow-400 text-green-800 rounded-full px-8 py-4 text-2xl font-bold shadow-lg transition w-full md:w-auto"
          >
            👀 Find the Word
          </button>
        </div>
      </div>
    );
  }

  // Week picker for spelling
  if (subject === 'spelling' && selectedWeekIdx === null) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundColors.spelling} font-sans p-8`}>
        <button
          onClick={() => { setSubject(null); setSelectedWeekIdx(null); setSpellingMode(null); }}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Subjects
        </button>
        <h2 className="text-3xl font-extrabold mb-8 text-pink-900 drop-shadow text-center">
          Pick Which Week’s Spelling Words!
        </h2>
        <div className="max-w-xl w-full flex flex-col gap-5 mb-6">
          {spellingWeeks.map((week, idx) => (
            <button
              key={week.label}
              onClick={() => setSelectedWeekIdx(idx)}
              className="w-full bg-cyan-200 hover:bg-cyan-300 px-8 py-4 rounded-2xl font-bold text-2xl shadow transition text-pink-900"
            >
              {week.label}
            </button>
          ))}
        </div>
        <div className="mt-6 text-gray-700 text-base">
          Your words will be loaded from the week you select!
        </div>
      </div>
    );
  }

  // Game Mode picker for this week's set
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

  // Game screens
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
