import React, { useState } from 'react';
import QuickFactsDrill from './QuickFactsDrill';
import MathMatch from './MathMatch';
import FillTheBlankNumberStory from './FillTheBlankNumberStory';

function MathModule({ selectedVoice }) {
  const [gameMode, setGameMode] = useState('menu');

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 p-8 font-sans">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-800 drop-shadow text-center">
          🧮 Math Games
        </h2>
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-md w-full flex flex-col items-center gap-4">
          <button
            onClick={() => setGameMode('quickfacts')}
            className="bg-green-400 hover:bg-green-600 text-white rounded-full px-8 py-4 text-xl font-bold shadow-lg transition w-full"
          >
            🚦 Quick Facts Drill
          </button>
          <button
            onClick={() => setGameMode('mathmatch')}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full px-8 py-4 text-xl font-bold shadow-lg transition w-full"
          >
            🎯 Math Match
          </button>
          <button
            onClick={() => setGameMode('fillblank')}
            className="bg-purple-600 hover:bg-purple-800 text-white rounded-full px-8 py-4 text-xl font-bold shadow-lg transition w-full"
          >
            📝 Fill The Blank Number Story
          </button>
          <p className="text-gray-600 text-center text-sm mt-4">More games coming soon!</p>
        </div>
      </div>
    );
  }

  if (gameMode === 'quickfacts') {
    return (
      <div>
        <button
          onClick={() => setGameMode('menu')}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Math Games
        </button>
        <QuickFactsDrill selectedVoice={selectedVoice} />
      </div>
    );
  }

  if (gameMode === 'mathmatch') {
    return (
      <div>
        <button
          onClick={() => setGameMode('menu')}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Math Games
        </button>
        <MathMatch selectedVoice={selectedVoice} />
      </div>
    );
  }

  if (gameMode === 'fillblank') {
    return (
      <div>
        <button
          onClick={() => setGameMode('menu')}
          className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 font-bold shadow hover:bg-gray-200 transition z-10"
        >
          ← Back to Math Games
        </button>
        <FillTheBlankNumberStory selectedVoice={selectedVoice} />
      </div>
    );
  }

  return null;
}

export default MathModule;
