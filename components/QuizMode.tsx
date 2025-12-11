import React, { useState } from 'react';
import { Subject, Difficulty, Question, QuizResult, UserData } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { SUBJECT_TOPICS } from '../constants';
import { AlertCircle, CheckCircle, XCircle, Timer, ArrowRight, BookOpen, Save } from 'lucide-react';

interface QuizModeProps {
  user: UserData;
}

export const QuizMode: React.FC<QuizModeProps> = ({ user }) => {
  const [step, setStep] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [subject, setSubject] = useState<Subject>(Subject.BIOLOGY);
  const [topic, setTopic] = useState<string>(SUBJECT_TOPICS[Subject.BIOLOGY][0]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionIndex -> selectedOptionIndex

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const qs = await generateQuizQuestions(subject, topic, difficulty, 5);
      setQuestions(qs);
      setStep('quiz');
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption(null);
      setShowExplanation(false);
    } catch (e) {
      alert("Failed to generate questions. Please check API Key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(idx);
    setAnswers(prev => ({ ...prev, [currentIndex]: idx }));
    setShowExplanation(true);
  };

  const saveProgress = (result: QuizResult) => {
    try {
      const storageKey = `neet_progress_${user.email}`;
      const existingData = localStorage.getItem(storageKey);
      const history = existingData ? JSON.parse(existingData) : [];
      
      const newRecord = {
        date: new Date().toISOString(),
        subject,
        topic,
        score: result.score,
        total: result.totalQuestions * 4, // Max score possible
        percentage: (result.score / (result.totalQuestions * 4)) * 100
      };
      
      const updatedHistory = [...history, newRecord];
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      const result = calculateResult();
      saveProgress(result);
      setStep('result');
    }
  };

  const calculateResult = (): QuizResult => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns !== undefined) {
        if (userAns === q.correctOptionIndex) correct++;
        else wrong++;
      }
    });
    // NEET Pattern: +4 Correct, -1 Wrong
    const score = (correct * 4) - (wrong * 1);
    return { totalQuestions: questions.length, correctAnswers: correct, wrongAnswers: wrong, score };
  };

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Setup Mock Test
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Subject</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(Subject).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSubject(s);
                    setTopic(SUBJECT_TOPICS[s][0]);
                  }}
                  className={`p-3 rounded-xl border font-medium transition-all ${
                    subject === s 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Topic</label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {SUBJECT_TOPICS[subject].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <div className="flex gap-3">
              {Object.values(Difficulty).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    difficulty === d
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>Start Mock Test <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const currentQ = questions[currentIndex];
    return (
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="font-mono bg-slate-100 px-2 py-1 rounded">Score Rules: +4, -1</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">
            {currentQ.topic}
          </span>
          <h3 className="text-xl font-medium text-slate-900 mb-6 leading-relaxed">
            {currentQ.questionText}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "border-slate-200 hover:bg-slate-50";
              if (selectedOption !== null) {
                if (idx === currentQ.correctOptionIndex) btnClass = "bg-green-50 border-green-500 text-green-700";
                else if (idx === selectedOption) btnClass = "bg-red-50 border-red-500 text-red-700";
                else btnClass = "border-slate-100 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${btnClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-slate-200">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                  {selectedOption !== null && idx === currentQ.correctOptionIndex && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctOptionIndex && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Next */}
        {showExplanation && (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Explanation
            </h4>
            <p className="text-blue-800 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              selectedOption === null
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200'
            }`}
          >
            {currentIndex === questions.length - 1 ? "Finish & Save" : "Next Question"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const result = calculateResult();
    const maxScore = result.totalQuestions * 4;
    
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Timer className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Test Complete!</h2>
        <p className="text-slate-500 mb-8">Your results have been saved to your profile.</p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8">
          <div className="text-4xl font-bold text-slate-900 mb-1">{result.score} <span className="text-lg text-slate-400 font-normal">/ {maxScore}</span></div>
          <div className="text-emerald-600 font-medium">Marks Obtained</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-700">{result.correctAnswers}</div>
            <div className="text-xs text-green-600 uppercase font-bold tracking-wider">Correct</div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="text-2xl font-bold text-red-700">{result.wrongAnswers}</div>
            <div className="text-xs text-red-600 uppercase font-bold tracking-wider">Wrong</div>
          </div>
        </div>

        <button
          onClick={() => setStep('setup')}
          className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return null;
};