import React from 'react';

export default function Logo({ className = "", iconOnly = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-primary dark:bg-action rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
        <img src="/favicon.png" alt="Progress Logo" className="w-full h-full object-cover scale-150 relative left-[2px]" />
      </div>
      {!iconOnly && (
        <h1 className="text-2xl font-heading font-black text-primary dark:text-dark-primary tracking-tighter">
          Progress<span className="text-action">.</span>
        </h1>
      )}
    </div>
  );
}
