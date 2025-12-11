import React, { useState, useEffect } from 'react';
import { QuizMode } from './components/QuizMode';
import { DoubtSolver } from './components/DoubtSolver';
import { CalendarWidget } from './components/CalendarWidget';
import { DailyChallenge } from './components/DailyChallenge';
import { Synapse } from './components/Synapse';
import { ThumbnailCard } from './components/ThumbnailCard';
import { AuthPage } from './components/AuthPage';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { BookOpen, MessageCircle, LayoutDashboard, BrainCircuit, Activity, Zap, Globe, Users, Network, Menu, X, Image as ImageIcon, Bot, Sparkles, Bell, Settings, User, LogOut, CheckCircle2 } from 'lucide-react';
import { APP_NAME } from './constants';
import { UserData } from './types';

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'chat' | 'daily' | 'synapse'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavClick = (tab: 'dashboard' | 'quiz' | 'chat' | 'daily' | 'synapse') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">{APP_NAME}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Thumbnail Modal */}
      {showThumbnail && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="relative">
             <button 
               onClick={() => setShowThumbnail(false)}
               className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-2"
             >
               Close <X className="w-6 h-6" />
             </button>
             <ThumbnailCard />
             <p className="text-center text-slate-400 mt-4 text-sm">Screenshot this card for your submission (560x280)</p>
           </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0 overflow-y-auto flex-shrink-0 shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
              <p className="text-xs text-slate-400">Future Doctor's AI</p>
            </div>
          </div>
          {/* Close button visible only on mobile inside drawer */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('synapse')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'synapse' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Network className="w-5 h-5" />
            <span className="font-medium">Synapse Community</span>
          </button>

          <button
            onClick={() => handleNavClick('quiz')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'quiz' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Mock Test</span>
          </button>

          <button
            onClick={() => handleNavClick('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'chat' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">AI Doubt Solver</span>
          </button>

          <button
            onClick={() => handleNavClick('daily')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'daily' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Daily Power Trio</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
           <CalendarWidget user={user} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
           <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Overview'}
              {activeTab === 'synapse' && 'Synapse Community'}
              {activeTab === 'quiz' && 'Mock Tests'}
              {activeTab === 'chat' && 'AI Tutor'}
              {activeTab === 'daily' && 'Daily Power Trio'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'dashboard' && `Welcome back, ${user.name}.`}
              {activeTab === 'synapse' && 'Top Educators & Toppers sharing high-yield notes.'}
              {activeTab === 'quiz' && 'Practice strictly according to NTA pattern.'}
              {activeTab === 'chat' && '24/7 Doubt support with Gemini AI.'}
              {activeTab === 'daily' && 'Consistency is key. 3 Questions everyday.'}
            </p>
           </div>
           
           <div className="flex items-center gap-3 self-start md:self-auto">
              <button 
                 onClick={() => setShowThumbnail(true)}
                 className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all"
                 title="View Project Card"
              >
                 <ImageIcon className="w-5 h-5" />
              </button>

              {/* Notification Bell */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              </button>

              {/* Settings */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all">
                <Settings className="w-5 h-5" />
              </button>

               {/* Profile & Logout */}
               <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.role}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
               </div>

              <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm ml-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-slate-600">AI System Online</span>
              </div>
           </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavClick} user={user} />}
        {activeTab === 'synapse' && <Synapse />}
        {activeTab === 'quiz' && <QuizMode user={user} />}
        {activeTab === 'chat' && <DoubtSolver />}
        {activeTab === 'daily' && <DailyChallenge user={user} />}
      </main>
    </div>
  );
}

const Dashboard = ({ onNavigate, user }: { onNavigate: (tab: 'quiz' | 'chat' | 'daily' | 'synapse') => void; user: UserData }) => {
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    // Check if daily challenge is done for today
    const checkDailyStatus = () => {
      const key = `neet_daily_progress_${user.email}`;
      const data = localStorage.getItem(key);
      if (data) {
        const history = JSON.parse(data);
        const today = new Date().toISOString().split('T')[0];
        // Check if there is an entry for today (assuming if it exists, they attempted it)
        // Ideally we check if score is present, but existence implies attempt.
        const isDone = history.some((h: any) => h.date === today);
        setDailyDone(isDone);
      }
    };
    checkDailyStatus();
  }, [user]);

  return (
    <div className="space-y-8 pb-10">

      {/* AI Virtual Assistant Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-1 relative overflow-hidden shadow-xl shadow-indigo-200 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse"></div>
        <div className="bg-slate-900/10 backdrop-blur-[2px] rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl relative z-10">
                        <Bot className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    {/* Glowing effect behind logo */}
                    <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-50"></div>
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-indigo-600 z-20" title="Online"></div>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                       Hello, {user.name.split(' ')[0]}!
                    </h2>
                    <p className="text-indigo-100 text-sm md:text-base max-w-md leading-relaxed">
                        I'm your AI Tutor. Ready to crush some Physics numericals or revise Biology diagrams today?
                    </p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                 <button 
                    onClick={() => onNavigate('chat')}
                    className="flex-1 md:flex-none bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                >
                    <Sparkles className="w-5 h-5 text-amber-500 group-hover/btn:rotate-12 transition-transform" />
                    Ask AI Tutor
                </button>
            </div>
        </div>
      </div>

      {/* Analytics & About Section Grid */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Performance Analytics */}
        <div className="bg-slate-50/50 rounded-2xl">
           <PerformanceAnalytics user={user} />
        </div>

        {/* Project Context / About Section */}
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden relative">
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3" /> India's Medical Entrance
                    </span>
                    <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" /> 25 Lakh+ Aspirants
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                    About the NEET Exam & Our Vision
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    The <strong>NEET (National Eligibility cum Entrance Test)</strong> is the sole gateway for millions of students in India to enter medical schools. It requires mastery of Physics, Chemistry, and Biology from the NCERT curriculum.
                  </p>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-900 leading-relaxed">
                    <strong className="block mb-1 text-indigo-700">🚀 Our Massive Goal:</strong>
                    While currently optimizing for India's May 4th exam, our core mission is to build a <strong>Global Medical AI Agent</strong>. 
                    We are laying the foundation to serve the <strong>entire medical student community worldwide</strong>—scaling to support international standards (like USMLE, PLAB) in the future.
                  </div>
              </div>
              <div className="hidden md:block w-px bg-slate-100 self-stretch"></div>
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Impact Goal</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Precision Learning</div>
                      <div className="text-xs text-slate-500">AI-tailored questions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Global Vision</div>
                      <div className="text-xs text-slate-500">Serving Medicos Worldwide</div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-white rounded-bl-full -mr-10 -mt-10 -z-0 opacity-50"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate('synapse')}
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
           <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Synapse</h3>
           <p className="text-slate-500 mb-6 relative z-10 text-sm">
             Join Top Educators and Future Doctors sharing notes & insights.
           </p>
           <span className="text-indigo-600 font-semibold flex items-center gap-2 relative z-10 group-hover:gap-3 transition-all">
             Explore Community <Network className="w-4 h-4" />
           </span>
        </div>

        <div 
          onClick={() => onNavigate('quiz')}
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Mock Test</h3>
          <p className="text-slate-500 mb-6 relative z-10 text-sm">
            Topic-wise tests with negative marking logic (-1/+4).
          </p>
          <span className="text-emerald-600 font-semibold flex items-center gap-2 relative z-10 group-hover:gap-3 transition-all">
            Start Practice <Activity className="w-4 h-4" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('daily')}
          className={`group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden border ${
             dailyDone 
               ? 'bg-emerald-50 border-emerald-200' 
               : 'bg-white border-slate-100'
          }`}
        >
           {/* Dynamic Background */}
           <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 ${
              dailyDone ? 'bg-emerald-100' : 'bg-yellow-50'
           }`}></div>
           
           <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Daily Power Trio</h3>
              {dailyDone && (
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
           </div>

           <p className="text-slate-500 mb-6 relative z-10 text-sm">
             {dailyDone 
               ? "Great job! You've maintained your streak today." 
               : "Solve 3 hand-picked questions daily. One from each subject."
             }
           </p>
           <span className={`${dailyDone ? 'text-emerald-700' : 'text-yellow-600'} font-semibold flex items-center gap-2 relative z-10 group-hover:gap-3 transition-all`}>
             {dailyDone ? 'View Results' : 'Start Daily Challenge'} <Zap className="w-4 h-4" />
           </span>
        </div>

        <div 
          onClick={() => onNavigate('chat')}
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Doubt Solver</h3>
          <p className="text-slate-500 mb-6 relative z-10 text-sm">
            Upload questions or type doubts. AI explains solutions.
          </p>
          <span className="text-blue-600 font-semibold flex items-center gap-2 relative z-10 group-hover:gap-3 transition-all">
            Ask AI Tutor <MessageCircle className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl text-center">
        <p className="text-lg font-serif italic mb-2">"The only way to do great work is to love what you do."</p>
        <p className="text-sm font-medium text-emerald-500">- Steve Jobs</p>
      </div>
    </div>
  );
};

export default App;