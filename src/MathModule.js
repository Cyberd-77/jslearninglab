import React, { useState } from 'react';
import QuickFactsDrill from './QuickFactsDrill';

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
          <p className="text-gray-600 text-center text-sm">More games coming soon!</p>
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
          ← Back to Games
        </button>
        <QuickFactsDrill selectedVoice={selectedVoice} />
      </div>
    );
  }

  return null;
}

export default MathModule;
