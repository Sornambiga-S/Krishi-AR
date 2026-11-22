import React, { useState } from 'react';
import { ActiveTab, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight
} from 'lucide-react';
import { playClick, playSuccessChime, playCelebrationFanfare } from '../utils/audio';

interface AiQuizProps {
  setActiveTab: (tab: ActiveTab) => void;
  onQuizComplete: (score: number, total: number) => void;
}

export const AiQuiz: React.FC<AiQuizProps> = ({ setActiveTab, onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      playSuccessChime();
    }
  };

  const handleNextQuestion = () => {
    playClick();
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      playCelebrationFanfare();
      onQuizComplete(score + (selectedOption === currentQ.correctIndex ? 0 : 0), QUIZ_QUESTIONS.length);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const handleRestartQuiz = () => {
    playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <Award className="w-3.5 h-3.5 text-lime-400" />
          <span>KNOWLEDGE EVALUATION ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          "Test Your Knowledge"
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80">
          Reinforce your understanding of plant pathology, fungal life cycles, and agricultural management.
        </p>
      </div>

      {!isFinished ? (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 text-left">
          
          {/* Top Question Progress Counter */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 text-xs font-mono">
            <span className="text-emerald-400 uppercase font-semibold">
              Topic: {currentQ.topic}
            </span>
            <span className="text-emerald-300 font-bold">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/20">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-lime-300 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              
              let btnStyle = 'glass-card border-emerald-500/20 text-emerald-100 hover:border-emerald-400/50';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/30 border-emerald-400 text-white font-bold shadow-md shadow-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500/25 border-rose-400 text-rose-200';
                } else {
                  btnStyle = 'opacity-40 border-emerald-500/10 text-emerald-300/60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct!</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Score'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Final Score Card */
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/40 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 text-black mx-auto flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/30">
            🏆
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Knowledge Test Complete
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              "Your Learning Score"
            </h3>
          </div>

          {/* Big Score Meter */}
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 max-w-sm mx-auto space-y-2">
            <div className="text-5xl font-extrabold font-mono text-emerald-300">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <p className="text-xs text-emerald-200/80">
              {score === QUIZ_QUESTIONS.length
                ? '🌟 Perfect Score! Outstanding agronomic mastery.'
                : score >= 3
                ? '🌿 Great work! You understand fundamental plant pathology.'
                : '🌱 Good effort! Review the AR lesson to brush up on symptoms.'}
            </p>
          </div>

          {/* Unlocked Badge Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-400/40 max-w-md mx-auto flex items-center space-x-3 text-left">
            <span className="text-3xl">🔬</span>
            <div>
              <div className="text-xs font-mono font-bold text-lime-300 uppercase">
                Achievement Awarded!
              </div>
              <div className="text-sm font-bold text-white">
                "Disease Detective" Badge Unlocked (+100 XP)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl glass-card border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:text-white flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveTab('progress');
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              View My Progress Dashboard →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
