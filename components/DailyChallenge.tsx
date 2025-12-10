import React, { useState, useEffect } from 'react';
import { generateDailyQuestions } from '../services/geminiService';
import { Question } from '../types';
import { Zap, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react';

export const DailyChallenge: React.FC = () => {
  const [questions, setQuestions] = useState<(Question & { subject: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await generateDailyQuestions();
      setQuestions(data);
      setSelectedAnswers({});
      setExpandedId(null);
    } catch (error) {
      console.error("Failed to load daily questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (qId: number, optionIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setExpandedId(qId); // Auto expand to show explanation
  };

  const toggleExpand = (qId: number) => {
    setExpandedId(expandedId === qId ? null : qId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-100">
        <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Curating Today's Challenge</h3>
        <p className="text-slate-500">Generating fresh NEET questions from NCERT...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl shadow-lg text-white flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
             <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
             Daily Power Trio
           </h2>
           <p className="text-slate-300">Complete these 3 questions to maintain your streak!</p>
        </div>
        <button 
          onClick={fetchQuestions}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Load New Set
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCorrect = selectedAnswers[q.id] === q.correctOptionIndex;
          
          const subjectTheme = 
            q.subject.toLowerCase().includes('physics') ? 'indigo' :
            q.subject.toLowerCase().includes('chemistry') ? 'orange' : 'emerald';

          const getThemeClasses = (type: 'bg' | 'text' | 'border') => {
             const map: any = {
               physics: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
               chemistry: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
               biology: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' }
             };
             const key = q.subject.toLowerCase().includes('physics') ? 'physics' : 
                         q.subject.toLowerCase().includes('chemistry') ? 'chemistry' : 'biology';
             return map[key][type];
          };

          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getThemeClasses('bg')} ${getThemeClasses('text')}`}>
                  {q.subject}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {q.topic}
                </span>
              </div>
              
              <h4 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
                {q.questionText}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = "border-slate-200 hover:bg-slate-50 text-slate-600";
                  if (isAnswered) {
                    if (optIdx === q.correctOptionIndex) btnStyle = "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500";
                    else if (optIdx === selectedAnswers[q.id]) btnStyle = "bg-red-50 border-red-500 text-red-700";
                    else btnStyle = "opacity-50 border-slate-100";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(q.id, optIdx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAnswered ? '' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && optIdx === q.correctOptionIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isAnswered && optIdx === selectedAnswers[q.id] && optIdx !== q.correctOptionIndex && <XCircle className="w-5 h-5 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                   <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                      <h5 className={`font-semibold mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                        {isCorrect ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        Explanation
                      </h5>
                      <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                        {q.explanation}
                      </p>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};