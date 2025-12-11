import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Trophy } from 'lucide-react';
import { UserData } from '../types';

interface CalendarWidgetProps {
  user?: UserData; // User might be null initially or passed optionally
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Store study status: 'success' (studied), 'fail' (skipped), or undefined
  const [studyLog, setStudyLog] = useState<Record<string, 'success' | 'fail'>>({});

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Load progress from localStorage on mount or user change
  useEffect(() => {
    if (!user) return;

    const loadProgress = () => {
      const key = `neet_daily_progress_${user.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const history = JSON.parse(saved);
        const newLog: Record<string, 'success' | 'fail'> = {};
        
        history.forEach((entry: any) => {
          // entry.date is YYYY-MM-DD. 
          // Our log keys need to match. The widget uses YYYY-M-D (single digit months/days no pad? let's check renderDays)
          // renderDays uses: `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
          // Let's parse entry.date
          const [y, m, d] = entry.date.split('-').map(Number);
          // Month is 0-indexed in JS Date, but 1-indexed in ISO string usually? 
          // new Date().toISOString() gives 2023-10-05. Month is 10.
          // JS getMonth() for Oct is 9. 
          // So we need to subtract 1 from month.
          const dateKey = `${y}-${m - 1}-${d}`;
          newLog[dateKey] = 'success'; 
        });
        
        setStudyLog(prev => ({ ...prev, ...newLog }));
      }
    };

    loadProgress();
    
    // Listen for storage events to update in real-time if multiple tabs or components update it
    window.addEventListener('storage', loadProgress);
    return () => window.removeEventListener('storage', loadProgress);
  }, [user]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toggleDayStatus = (day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    setStudyLog(prev => {
      const current = prev[dateKey];
      const next = current === 'success' ? 'fail' : current === 'fail' ? undefined : 'success';
      if (next === undefined) {
        const { [dateKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dateKey]: next };
    });
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    const isMay2025 = currentDate.getMonth() === 4 && currentDate.getFullYear() === 2025; // May is month 4 (0-indexed)

    // Empty cells for padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
      const status = studyLog[dateKey];
      const isToday = isCurrentMonth && day === today.getDate();
      const isExamDay = isMay2025 && day === 4;

      days.push(
        <button
          key={day}
          onClick={() => toggleDayStatus(day)}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium transition-all relative
            ${isExamDay 
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30 scale-110 ring-2 ring-rose-400' 
              : status === 'success' 
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50' 
                : status === 'fail' 
                  ? 'bg-slate-700 text-slate-400 opacity-50' 
                  : 'text-slate-300 hover:bg-slate-800'
            }
            ${isToday && !status && !isExamDay ? 'ring-1 ring-emerald-500 text-emerald-400' : ''}
          `}
          title={isExamDay ? "NEET EXAM DAY!" : status === 'success' ? "Goal Achieved" : "Click to toggle"}
        >
          {status === 'success' && <Check className="w-4 h-4" />}
          {status === 'fail' && <X className="w-3 h-3" />}
          {!status && day}
          
          {isExamDay && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[10px] text-slate-500 font-medium">{d}</span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {renderDays()}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
           <Trophy className="w-3 h-3 text-yellow-500" />
           <span className="text-slate-300">Streak: {Object.values(studyLog).filter(s => s === 'success').length} Days</span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-slate-500">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};