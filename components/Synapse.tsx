import React, { useState } from 'react';
import { Network, Award, BookOpen, Heart, MessageSquare, Share2, Sparkles, UserCheck, Stethoscope, Microscope, Brain } from 'lucide-react';

interface Post {
  id: number;
  authorName: string;
  authorRole: 'Educator' | 'Student';
  authorBadge?: string;
  timeAgo: string;
  content: string;
  tags: string[];
  imagePlaceholderColor?: string; // Simulating uploaded notes/images
  imageLabel?: string;
  likes: number;
  comments: number;
  aiInsight?: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    authorName: "Dr. Anjali Verma",
    authorRole: "Educator",
    authorBadge: "Top Physics Faculty",
    timeAgo: "2 hours ago",
    content: "🚀 **Projectile Motion Shortcut**: Many students waste time deriving H-max in the exam. Here is a unified formula sheet I made for inclined plane motion. Remember, in NEET, speed is everything! #Physics #NEET2025",
    tags: ["Physics", "Mechanics", "ShortNotes"],
    imagePlaceholderColor: "bg-indigo-100",
    imageLabel: "Handwritten Formula Sheet: Projectile Motion",
    likes: 1240,
    comments: 89,
    aiInsight: "This note simplifies the range equation on an inclined plane. Key Takeaway: Replace g with g*cos(theta) for the component perpendicular to the plane."
  },
  {
    id: 2,
    authorName: "Rahul Kumar",
    authorRole: "Student",
    authorBadge: "AIR 15 - Mock Test 4",
    timeAgo: "4 hours ago",
    content: "Finally cracked the Krebs Cycle! 🧬 Drew this flowchart to memorize the enzymes involved. If you forget 'Citrate Synthase', just remember the starting material is Citrate! Hope this helps fellow aspirants.",
    tags: ["Biology", "Botany", "Respiration"],
    imagePlaceholderColor: "bg-emerald-100",
    imageLabel: "Student Diagram: Krebs Cycle Flowchart",
    likes: 856,
    comments: 42,
    aiInsight: "The Krebs Cycle (Citric Acid Cycle) occurs in the mitochondrial matrix. It produces NADH, FADH2, and ATP. Rahul's diagram correctly highlights the decarboxylation steps."
  },
  {
    id: 3,
    authorName: "Dr. Sarah Chen (Global)",
    authorRole: "Educator",
    authorBadge: "AI in Medicine Researcher",
    timeAgo: "1 day ago",
    content: "💡 **Future of Medicine**: To all future doctors here, your journey doesn't end at MBBS. We are now using AI to detect brain tumors with higher accuracy than ever before. Study hard, because you will be the ones using these tools to save lives!",
    tags: ["FutureTech", "AIinMedicine", "Motivation"],
    imagePlaceholderColor: "bg-blue-100",
    imageLabel: "MRI Scan Analysis by AI Model",
    likes: 3500,
    comments: 150,
    aiInsight: "AI algorithms, specifically Convolutional Neural Networks (CNNs), are used in radiology to identify anomalies in MRI and CT scans, assisting doctors in early diagnosis."
  },
  {
    id: 4,
    authorName: "Priya Singh",
    authorRole: "Student",
    authorBadge: "Consistency Streak: 50 Days",
    timeAgo: "5 hours ago",
    content: "Organic Chemistry Exception list from NCERT Class 12. These 5 reactions always come in the exam. Don't ignore the boiling point trends of Alcohols vs Ethers!",
    tags: ["Chemistry", "Organic", "NCERT"],
    imagePlaceholderColor: "bg-orange-100",
    imageLabel: "Snapshot of Highlighted NCERT Page 342",
    likes: 420,
    comments: 23,
    aiInsight: "Alcohols have higher boiling points than Ethers of comparable mass due to intermolecular Hydrogen Bonding, which is absent in Ethers."
  }
];

export const Synapse: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Educator' | 'Student'>('All');
  const [showAiInsight, setShowAiInsight] = useState<number | null>(null);

  const filteredPosts = activeFilter === 'All' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(p => p.authorRole === activeFilter);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-400" />
            Synapse Community
          </h2>
          <p className="text-indigo-200 max-w-xl text-lg">
            Where Top Educators and Future Doctors connect. Share notes, clarify concepts, and explore the future of AI in Medicine.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
      </div>

      {/* Input / Create Post Placeholder */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8 flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
           <UserCheck className="w-6 h-6" />
        </div>
        <button className="flex-1 text-left bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 py-3 px-4 rounded-xl border border-slate-200">
           Share a note, diagram, or doubt...
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-200">
           Post
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Educator', 'Student'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
              activeFilter === filter 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter} Posts
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            
            {/* Author Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                  post.authorRole === 'Educator' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}>
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{post.authorName}</h4>
                    {post.authorRole === 'Educator' && <Award className="w-4 h-4 text-indigo-500 fill-indigo-100" />}
                    {post.authorRole === 'Student' && <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-100" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      post.authorRole === 'Educator' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {post.authorRole}
                    </span>
                    <span>• {post.timeAgo}</span>
                    {post.authorBadge && <span className="text-slate-400">• {post.authorBadge}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-slate-800 leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </p>
              
              {/* Image Placeholder Simulation */}
              <div className={`w-full h-48 rounded-xl ${post.imagePlaceholderColor} flex flex-col items-center justify-center text-slate-500 border border-slate-200/50 mb-4 group cursor-pointer relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                 {post.tags.includes('Biology') ? <Microscope className="w-8 h-8 mb-2 opacity-50" /> : 
                  post.tags.includes('FutureTech') ? <Brain className="w-8 h-8 mb-2 opacity-50" /> :
                  <BookOpen className="w-8 h-8 mb-2 opacity-50" />}
                 <span className="font-medium text-sm">{post.imageLabel}</span>
                 <span className="text-xs opacity-70 mt-1">(Tap to view full resolution note)</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Insight Section */}
            {post.aiInsight && (
               <div className="mb-4">
                  <button 
                    onClick={() => setShowAiInsight(showAiInsight === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    {showAiInsight === post.id ? "Hide AI Analysis" : "Analyze this note with AI"}
                  </button>
                  
                  {showAiInsight === post.id && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 animate-in fade-in slide-in-from-top-1">
                       <div className="flex items-start gap-2">
                         <Stethoscope className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                         <div>
                            <span className="text-xs font-bold text-indigo-800 block mb-1">Dr. AI Insight:</span>
                            <p className="text-sm text-indigo-700 leading-relaxed">{post.aiInsight}</p>
                         </div>
                       </div>
                    </div>
                  )}
               </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-500">
               <button className="flex items-center gap-2 hover:text-rose-500 transition-colors">
                 <Heart className="w-5 h-5" />
                 <span className="text-sm font-medium">{post.likes}</span>
               </button>
               <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                 <MessageSquare className="w-5 h-5" />
                 <span className="text-sm font-medium">{post.comments}</span>
               </button>
               <button className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                 <Share2 className="w-5 h-5" />
               </button>
            </div>

          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm pb-8">
        <p>You have reached the end of the feed.</p>
        <p className="text-xs mt-1">Join 2.5 Million+ students globally in the Synapse network.</p>
      </div>
    </div>
  );
};