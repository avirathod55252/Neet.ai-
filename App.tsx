import React, { useState } from 'react';
import { QuizMode } from './components/QuizMode';
import { DoubtSolver } from './components/DoubtSolver';
import { CalendarWidget } from './components/CalendarWidget';
import { DailyChallenge } from './components/DailyChallenge';
import { Synapse } from './components/Synapse';
import { BookOpen, MessageCircle, LayoutDashboard, BrainCircuit, Activity, Zap, Globe, Users, Network, Menu, X } from 'lucide-react';
import { APP_NAME } from './constants';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'chat' | 'daily' | 'synapse'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'dashboard' | 'quiz' | 'chat' | 'daily' | 'synapse') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

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
           <CalendarWidget />
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
              {activeTab === 'dashboard' && 'Welcome back, Future Doctor.'}
              {activeTab === 'synapse' && 'Top Educators & Toppers sharing high-yield notes.'}
              {activeTab === 'quiz' && 'Practice strictly according to NTA pattern.'}
              {activeTab === 'chat' && '24/7 Doubt support with Gemini AI.'}
              {activeTab === 'daily' && 'Consistency is key. 3 Questions everyday.'}
            </p>
           </div>
           
           <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600">AI System Online</span>
           </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavClick} />}
        {activeTab === 'synapse' && <Synapse />}
        {activeTab === 'quiz' && <QuizMode />}
        {activeTab === 'chat' && <DoubtSolver />}
        {activeTab === 'daily' && <DailyChallenge />}
      </main>
    </div>
  );
}

const Dashboard = ({ onNavigate }: { onNavigate: (tab: 'quiz' | 'chat' | 'daily' | 'synapse') => void }) => {
  return (
    <div className="space-y-8 pb-10">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded backdrop-blur-sm">Target 720</span>
          </div>
          <div className="text-3xl font-bold mb-1">Physics</div>
          <p className="text-indigo-100 text-sm">Focus: Mechanics & Optics</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200">
           <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">Biology</div>
          <p className="text-emerald-100 text-sm">Focus: Genetics & Ecology</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-200">
           <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">Chemistry</div>
          <p className="text-orange-100 text-sm">Focus: Organic Conversions</p>
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
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
           <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Daily Power Trio</h3>
           <p className="text-slate-500 mb-6 relative z-10 text-sm">
             Solve 3 hand-picked questions daily. One from each subject.
           </p>
           <span className="text-yellow-600 font-semibold flex items-center gap-2 relative z-10 group-hover:gap-3 transition-all">
             Start Daily Challenge <Zap className="w-4 h-4" />
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