import React, { useState } from 'react';
import SpellingGame from './SpellingGame';
import MathModule from './MathModule';
import ReadingModule from './ReadingModule';

export default function App() {
  const [subject, setSubject] = useState(null);

  const backgroundColors = {
    spelling: 'bg-gradient-to-br from-cyan-500 via-pink-400 to-yellow-200',
    math: 'bg-gradient-to-br from-green-400 to-blue-500',
    reading: 'bg-gradient-to-br from-green-600 via-green-400 to-yellow-300',
    default: 'bg-gradient-to-br from-gray-500 to-gray-700'
  };

  if (!subject) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundColors.default} font-sans p-6`}>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-8 md:mb-12 drop-shadow text-center">
          Jslearning Lab
        </h1>
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
        </div>
      </div>
    );
  }

  return (
    <div className={`${backgroundColors[subject]} min-h-screen`}>
      <button
        onClick={() => setSubject(null)}
        className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
      >
        ← Back to Subjects
      </button>

      {subject === 'spelling' && <SpellingGame />}
      {subject === 'math' && <MathModule />}
      {subject === 'reading' && <ReadingModule />}
    </div>
  );
}
