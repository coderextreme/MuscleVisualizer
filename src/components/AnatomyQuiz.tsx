import React, { useState } from 'react';
import { ANATOMY_QUIZ } from '../data/musclesData';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface AnatomyQuizProps {
  onSelectMuscle: (muscleId: string) => void;
  onApplyTension: (muscleId: string, tension: number) => void;
}

export const AnatomyQuiz: React.FC<AnatomyQuizProps> = ({
  onSelectMuscle,
  onApplyTension,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = ANATOMY_QUIZ[currentIdx];

  const handleSelectOption = (optionId: string, muscleId?: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
    if (muscleId) {
      onSelectMuscle(muscleId);
      onApplyTension(muscleId, 0.9); // Highlight in 3D model
    }
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOptionId === question.correctOptionId) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < ANATOMY_QUIZ.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsSubmitted(false);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 backdrop-blur-md flex flex-col gap-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Biomechanical Quiz Challenge</h3>
            <p className="text-xs text-slate-400">Test your functional anatomy and muscle action knowledge</p>
          </div>
        </div>

        <div className="px-3 py-1 bg-slate-800 text-emerald-400 text-xs font-mono font-bold rounded-lg border border-slate-700">
          Score: {score}/{ANATOMY_QUIZ.length}
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Question {currentIdx + 1} of {ANATOMY_QUIZ.length}</span>
            <span>Select the correct biomechanical answer</span>
          </div>

          {/* Question Text */}
          <p className="text-sm font-semibold text-slate-100 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.id === question.correctOptionId;

              let btnStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';

              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-100';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id, option.muscleId)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{option.text}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isSubmitted && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-emerald-400 block">Explanation:</span>
              <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completion Screen */
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-100">Quiz Challenge Completed!</h4>
            <p className="text-xs text-slate-400 mt-1">
              You scored <span className="text-emerald-400 font-bold text-sm">{score}</span> out of {ANATOMY_QUIZ.length}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Challenge</span>
          </button>
        </div>
      )}
    </div>
  );
};
