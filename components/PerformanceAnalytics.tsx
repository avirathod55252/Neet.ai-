import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, Target, BarChart3, ArrowUpRight, Zap } from 'lucide-react';
import { UserData, Subject } from '../types';

interface PerformanceAnalyticsProps {
  user: UserData;
}

interface SubjectStat {
  subject: string;
  score: number;
  color: string;
  label: string;
  count: number;
}

interface DailyStat {
  date: string;
  day: string;
  score: number; // 0-3
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ user }) => {
  const [subjectData, setSubjectData] = useState<SubjectStat[]>([]);
  const [trendPoints, setTrendPoints] = useState<number[]>([]);
  const [hasData, setHasData] = useState(false);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);

  useEffect(() => {
    // 1. Fetch Mock Test Data
    const mockStorageKey = `neet_progress_${user.email}`;
    const mockStoredData = localStorage.getItem(mockStorageKey);
    let mockHistory = [];
    
    if (mockStoredData) {
      mockHistory = JSON.parse(mockStoredData);
      if (mockHistory.length > 0) {
        setHasData(true);
        processHistory(mockHistory);
      }
    }

    // 2. Fetch Daily Challenge Data
    const dailyKey = `neet_daily_progress_${user.email}`;
    const dailyDataStr = localStorage.getItem(dailyKey);
    if (dailyDataStr) {
      const dailyHistory = JSON.parse(dailyDataStr);
      processDailyStats(dailyHistory);
      // If we have daily data but no mock data, we should still show the dashboard partially?
      // For now, hasData logic remains tied to mock tests for the main view, 
      // but we can ensure daily stats are available if mock tests aren't.
      if (!hasData && dailyHistory.length > 0) setHasData(true);
    } else {
      // Initialize empty last 7 days if no data
      processDailyStats([]); 
    }

  }, [user.email]);

  const processDailyStats = (history: any[]) => {
    // Generate last 7 days including today
    const last7Days: DailyStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const found = history.find((h: any) => h.date === dateStr);
      last7Days.push({
        date: dateStr,
        day: dayName,
        score: found ? found.score : 0
      });
    }
    setDailyStats(last7Days);
  };

  const processHistory = (history: any[]) => {
    // 1. Process Trend (Last 10 scores normalized to %)
    const trends = history.slice(-10).map((record: any) => {
        // Normalize score to percentage for trend line (0-100)
        return record.total > 0 ? (Math.max(0, record.score) / record.total) * 100 : 0;
    });
    setTrendPoints(trends);

    // 2. Process Subject Mastery
    const mastery: Record<string, { totalScore: number, maxScore: number, count: number }> = {
      [Subject.PHYSICS]: { totalScore: 0, maxScore: 0, count: 0 },
      [Subject.CHEMISTRY]: { totalScore: 0, maxScore: 0, count: 0 },
      [Subject.BIOLOGY]: { totalScore: 0, maxScore: 0, count: 0 },
    };

    history.forEach((rec: any) => {
      if (mastery[rec.subject]) {
        mastery[rec.subject].totalScore += Math.max(0, rec.score);
        mastery[rec.subject].maxScore += rec.total;
        mastery[rec.subject].count += 1;
      }
    });

    // Transform to view model
    const newSubjectData: SubjectStat[] = [
      { 
        subject: 'Physics', 
        score: calculatePercentage(mastery[Subject.PHYSICS]), 
        color: 'bg-indigo-500', 
        label: getStrengthLabel(calculatePercentage(mastery[Subject.PHYSICS])),
        count: mastery[Subject.PHYSICS].count
      },
      { 
        subject: 'Chemistry', 
        score: calculatePercentage(mastery[Subject.CHEMISTRY]), 
        color: 'bg-orange-500', 
        label: getStrengthLabel(calculatePercentage(mastery[Subject.CHEMISTRY])),
        count: mastery[Subject.CHEMISTRY].count
      },
      { 
        subject: 'Biology', 
        score: calculatePercentage(mastery[Subject.BIOLOGY]), 
        color: 'bg-emerald-500', 
        label: getStrengthLabel(calculatePercentage(mastery[Subject.BIOLOGY])),
        count: mastery[Subject.BIOLOGY].count
      },
    ];

    setSubjectData(newSubjectData);

    // Calculate average accuracy
    const avg = trends.length > 0 ? trends.reduce((a: number, b: number) => a + b, 0) / trends.length : 0;
    setAverageAccuracy(Math.round(avg));
  };

  const calculatePercentage = (data: { totalScore: number, maxScore: number }) => {
    if (data.maxScore === 0) return 0;
    return Math.round((data.totalScore / data.maxScore) * 100);
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return 'No Data';
    if (score < 40) return 'Needs Improvement';
    if (score < 70) return 'Building Concepts';
    return 'Exam Ready';
  };
  
  const generateTrendPath = (data: number[], width: number, height: number) => {
    if (data.length < 2) return `M 0,${height} L ${width},${height}`; 
    const stepX = width / (data.length - 1);
    const points = data.map((val, idx) => {
      const x = idx * stepX;
      const y = height - (val / 100) * height; 
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  if (!hasData && dailyStats.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
         </div>
         <h3 className="text-xl font-bold text-slate-800 mb-2">No Data Available Yet</h3>
         <p className="text-slate-500 max-w-md mb-6">
           Welcome, {user.name}! Take your first Mock Test or Daily Challenge to generate personalized analytics.
         </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Daily Consistency Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3">
         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Daily Power Trio Consistency
         </h3>
         <div className="flex items-end justify-between gap-2 h-32">
            {dailyStats.map((stat) => (
               <div key={stat.date} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="relative w-full flex justify-center">
                     {/* Tooltip */}
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                        {stat.score}/3 Correct
                     </div>
                     <div 
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out relative ${
                           stat.score === 3 ? 'bg-emerald-500' : 
                           stat.score === 2 ? 'bg-emerald-400' : 
                           stat.score === 1 ? 'bg-emerald-300' : 'bg-slate-100'
                        }`}
                        style={{ height: `${Math.max(10, (stat.score / 3) * 128)}px` }}
                     >
                        {/* Inner glowing effect for perfect score */}
                        {stat.score === 3 && (
                           <div className="absolute inset-0 bg-white/20 blur-sm rounded-t-lg"></div>
                        )}
                     </div>
                  </div>
                  <span className={`text-xs font-semibold ${stat.score > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                     {stat.day}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {/* Subject Performance Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Subject Mastery
            </h3>
            <p className="text-sm text-slate-500">Proficiency based on your recent tests</p>
          </div>
          {averageAccuracy > 80 && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4" /> Top 5%
            </div>
          )}
        </div>

        <div className="space-y-6">
          {subjectData.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">{item.subject}</span>
                <span className="text-slate-500">{item.score}% ({item.count} tests)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.max(5, item.score)}%` }} // Min width 5% for visibility
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Status: {item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column Metrics */}
      <div className="space-y-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Score Trend
          </h3>
          <div className="h-32 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="0" x2="300" y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Trend Line */}
              <path 
                d={generateTrendPath(trendPoints, 300, 100)} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {/* Area under curve */}
               <path 
                d={`${generateTrendPath(trendPoints, 300, 100)} L 300,100 L 0,100 Z`} 
                fill="url(#gradient)" 
                opacity="0.2"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>First Test</span>
            <span>Latest</span>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" /> Tests Taken
              </div>
              <div className="text-2xl font-bold text-slate-800">{trendPoints.length}</div>
              <div className="text-xs text-indigo-600">Total Attempts</div>
           </div>
           <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <div className="flex items-center gap-2 mb-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4" /> Avg Score
              </div>
              <div className="text-2xl font-bold text-slate-800">{averageAccuracy}%</div>
              <div className="text-xs text-rose-600">Last 10 Tests</div>
           </div>
        </div>
      </div>
    </div>
  );
};