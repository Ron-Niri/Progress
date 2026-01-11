import React, { useState } from 'react';
import { Play, Quote as QuoteIcon, Flame, Zap, ArrowRight, RefreshCw, Volume2, Shield } from 'lucide-react';
import motivationData from '../data/motivation.json';

const MOTIVATIONAL_VIDEOS = motivationData?.videos || [];
const POWER_QUOTES = motivationData?.quotes || [{ text: "Discipline equals freedom.", author: "Jocko Willink" }];

export default function Motivation() {
  const [activeVideo, setActiveVideo] = useState(MOTIVATIONAL_VIDEOS[0]);
  const [randomQuote, setRandomQuote] = useState(POWER_QUOTES[Math.floor(Math.random() * POWER_QUOTES.length)]);

  const refreshQuote = () => {
    if (!POWER_QUOTES?.length) return;
    const others = POWER_QUOTES.filter(q => q.text !== randomQuote?.text);
    if (!others.length) return;
    setRandomQuote(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">Fuel for the Soul</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-primary dark:text-dark-primary leading-tight">
            Force of <span className="text-orange-500">Nature.</span>
          </h1>
          <p className="text-secondary dark:text-dark-secondary text-sm sm:text-lg font-medium opacity-70 max-w-xl">
            Rewire your brain for absolute discipline. Today is the only day that matters.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl group border-4 border-white dark:border-gray-800">
             <iframe 
               width="100%" 
               height="100%" 
               src={`https://www.youtube.com/embed/${activeVideo?.id || ''}?autoplay=0&rel=0&modestbranding=1`}
               title={activeVideo?.title || 'Motivation'}
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
               className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
             ></iframe>
             <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">{activeVideo?.category || 'Fuel'}</p>
                <h2 className="text-xl font-black text-white">{activeVideo?.title || 'Select a Video'}</h2>
                <p className="text-sm text-white/60">— {activeVideo?.author || 'Unknown'}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOTIVATIONAL_VIDEOS.map((vid) => (
              <button 
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                  activeVideo.id === vid.id 
                    ? 'bg-orange-500 text-white border-orange-400' 
                    : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-700 hover:border-orange-500/30 shadow-soft'
                }`}
              >
                <Play size={16} className={`mb-3 ${activeVideo.id === vid.id ? 'text-white' : 'text-orange-500'}`} />
                <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${activeVideo.id === vid.id ? 'text-orange-100' : 'text-secondary'}`}>{vid.author}</p>
                <p className="text-xs font-bold truncate">{vid.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Motivation Sidebar */}
        <div className="space-y-8">
          {/* Quote Card */}
          <div className="p-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
              <QuoteIcon className="absolute -top-4 -right-4 p-12 text-white/10 group-hover:scale-125 transition-transform duration-700" size={160} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Zap size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Power Word</span>
                </div>
                <p className="text-2xl font-heading font-black leading-tight mb-8">
                  "{randomQuote?.text || "Keep moving forward."}"
                </p>
              </div>

              <div className="flex items-center justify-between relative z-10 border-t border-white/20 pt-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">— Author</p>
                  <p className="font-bold">{randomQuote?.author || "Unknown"}</p>
                </div>
                <button 
                  onClick={refreshQuote}
                  className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all active:rotate-180"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
          </div>

          {/* Discipline Card */}
          <div className="p-8 bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 p-20 bg-orange-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-3">
                <Shield size={24} className="text-orange-500" /> Discipline Wall
              </h3>
              <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-secondary leading-relaxed">
                      Motivation gets you started. Habit is what keeps you going.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-secondary leading-relaxed">
                      Do it when you don't feel like it. Especially then.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-secondary leading-relaxed">
                      A year from now, you'll wish you started today.
                    </p>
                  </div>
              </div>
              <button className="mt-10 w-full py-4 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-2xl text-xs font-black uppercase tracking-[2px] hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                Commit to the Grind
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
