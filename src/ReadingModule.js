import React, { useState, useEffect, useRef } from 'react';

// Sample stories, vocabulary, sight words, and questions for 2nd grade reading
const stories = [
  {
    id: 1,
    title: "The Happy Dog",
    text: "The dog runs very fast. It loves to play in the park.",
    audio: null, // placeholder for future audio file URL if needed
    vocab: ["dog", "runs", "park"],
    questions: [
      {
        question: "Where does the dog love to play?",
        choices: ["The park", "The house", "The school"],
        answer: "The park"
      }
    ]
  },
  {
    id: 2,
    title: "A Day at the Farm",
    text: "The cow gives milk. The farm has many animals.",
    audio: null,
    vocab: ["cow", "milk", "farm", "animals"],
    questions: [
      {
        question: "What does the cow give?",
        choices: ["Milk", "Eggs", "Honey"],
        answer: "Milk"
      }
    ]
  }
];

const sightWords = ["the", "and", "it", "has", "in", "to", "a", "of"];

function ReadingModule() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showVocab, setShowVocab] = useState(false);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [sightWordIndex, setSightWordIndex] = useState(0);
  const [sightWordInput, setSightWordInput] = useState('');
  const [sightWordMsg, setSightWordMsg] = useState('');
  const audioRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const currentVocabWord = showVocab ? currentStory.vocab[currentVocabIndex] : null;
  const currentQuestion = showQuestions ? currentStory.questions[currentQuestionIndex] : null;

  // Read-along: highlight word by word
  const wordsArray = currentStory.text.split(" ");
  useEffect(() => {
    if (!showVocab && !showQuestions) {
      setHighlightIndex(0);
      const timer = setInterval(() => {
        setHighlightIndex((idx) => {
          if (idx < wordsArray.length - 1) return idx + 1;
          clearInterval(timer);
          return idx;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [currentStoryIndex, showVocab, showQuestions]);

  // Speech synthesis for read-along
  function playStoryAudio() {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(currentStory.text);
      window.speechSynthesis.speak(utter);
    }
  }

  // Vocabulary flashcards
  function nextVocab() {
    if (currentVocabIndex < currentStory.vocab.length - 1) {
      setCurrentVocabIndex(currentVocabIndex + 1);
    } else {
      setShowVocab(false);
      setShowQuestions(true);
      setCurrentQuestionIndex(0);
    }
  }

  // Questions
  function selectChoice(choice) {
    setSelectedChoice(choice);
  }
  function checkAnswer() {
    if (selectedChoice === currentQuestion.answer) {
      setScore(score + 1);
      setMessage("Correct! Great job!");
      setTimeout(() => {
        setMessage('');
        if (currentQuestionIndex < currentStory.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedChoice(null);
        } else {
          setShowQuestions(false);
          setSelectedChoice(null);
          setMessage('');
        }
      }, 1000);
    } else {
      setMessage("Try again!");
    }
  }

  // Sight words practice
  function checkSightWord() {
    if (sightWordInput.toLowerCase() === sightWords[sightWordIndex]) {
      setSightWordMsg("Good job!");
      setSightWordInput('');
      setTimeout(() => {
        setSightWordMsg('');
        if (sightWordIndex < sightWords.length - 1) {
          setSightWordIndex(sightWordIndex + 1);
        } else {
          setSightWordIndex(0);
        }
      }, 1000);
    } else {
      setSightWordMsg("Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-300 to-green-400 p-6 font-sans">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow">📚 2nd Grade Reading</h2>

      {/* Story Title */}
      <h3 className="text-2xl font-bold mb-3 text-center text-white">{currentStory.title}</h3>

      {/* Read-along Story Text with highlight */}
      {!showVocab && !showQuestions && (
        <>
          <p className="text-lg text-white mb-4">
            {wordsArray.map((word, idx) => (
              <span
                key={idx}
                className={idx === highlightIndex ? "bg-yellow-300 text-black px-1" : ""}
              >
                {word + " "}
              </span>
            ))}
          </p>
          <button
            onClick={playStoryAudio}
            className="mb-5 bg-yellow-400 px-6 py-2 rounded-full font-bold shadow hover:bg-yellow-500 transition"
          >
            🔊 Listen to story
          </button>
          <button
            onClick={() => setShowVocab(true)}
            className="mb-8 bg-pink-500 px-6 py-2 rounded-full font-bold shadow hover:bg-pink-600 transition"
          >
            Vocabulary Flashcards
          </button>
        </>
      )}

      {/* Vocabulary Flashcards */}
      {showVocab && (
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-lg text-center">
          <h4 className="text-xl font-extrabold mb-4">Word: {currentVocabWord}</h4>
          <button
            onClick={() => playStoryAudio(currentVocabWord)}
            className="bg-cyan-400 hover:bg-cyan-600 text-white rounded-full px-4 py-2 mb-4 font-bold"
          >
            🔊 Hear Word
          </button>
          <button
            onClick={nextVocab}
            className="bg-purple-500 hover:bg-purple-700 text-white rounded-full px-6 py-2 font-semibold"
          >
            Next Word →
          </button>
        </div>
      )}

      {/* Comprehension Questions */}
      {showQuestions && (
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-lg text-center">
          <h4 className="text-xl font-extrabold mb-4">Question:</h4>
          <p className="mb-4 text-lg font-semibold">{currentQuestion.question}</p>
          <div className="flex flex-col gap-3 mb-4">
            {currentQuestion.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => selectChoice(c)}
                className={`rounded-full px-4 py-2 font-semibold ${
                  selectedChoice === c ? "bg-yellow-400 text-black" : "bg-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={checkAnswer}
            disabled={!selectedChoice}
            className="bg-green-500 hover:bg-green-700 px-6 py-2 text-white rounded-full font-bold disabled:opacity-50"
          >
            Check Answer
          </button>
          <p className="mt-4 text-red-700 font-bold min-h-[1.5em]">{message}</p>
        </div>
      )}

      {/* Sight Word Practice */}
      {!showVocab && !showQuestions && (
        <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg text-center">
          <h4 className="text-xl font-extrabold mb-4">Sight Word Practice</h4>
          <p className="text-lg mb-4">Spell the sight word:</p>
          <p className="text-2xl font-bold mb-4">{sightWords[sightWordIndex]}</p>
          <input
            value={sightWordInput}
            onChange={e => setSightWordInput(e.target.value)}
            className="border-2 border-cyan-500 rounded-xl w-full px-4 py-2 mb-4 text-center text-lg font-semibold"
            placeholder="Type the word here"
            aria-label="Type sight word"
            autoFocus
          />
          <button
            onClick={checkSightWord}
            className="bg-cyan-500 hover:bg-cyan-700 text-white rounded-full px-6 py-2 font-bold"
          >
            Check
          </button>
          <p className="mt-3 min-h-[1.5em] font-bold text-purple-700">{sightWordMsg}</p>
        </div>
      )}

      {/* Navigation Buttons for Stories */}
      <div className="flex justify-between max-w-md mx-auto mt-8">
        <button
          className="bg-gray-400 px-4 py-2 rounded-lg font-bold text-white disabled:opacity-60"
          disabled={currentStoryIndex === 0}
          onClick={() => setCurrentStoryIndex(currentStoryIndex - 1)}
        >
          ← Previous Story
        </button>
        <button
          className="bg-gray-400 px-4 py-2 rounded-lg font-bold text-white disabled:opacity-60"
          disabled={currentStoryIndex === stories.length - 1}
          onClick={() => {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setShowVocab(false);
            setShowQuestions(false);
            setSelectedChoice(null);
            setMessage('');
          }}
        >
          Next Story →
        </button>
      </div>
    </div>
  );
}

export default ReadingModule;
