'use client';
import React from 'react';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function App() {
  const features: FeatureItem[] = [
    {
      id: 'safe-trusted',
      title: 'SAFE & TRUSTED',
      description: 'Verified listings for your peace of mind',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Dark blue outer circle, hot pink shield with white check */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            <circle cx="32" cy="32" r="28" fill="#0a192f" />
            <path 
              d="M32 16c6 0 12-2 12-2v16c0 8-6 14-12 18-6-4-12-10-12-18V14s6 2 12 2z" 
              fill="#ff0066" 
            />
            <path 
              d="M26 31l4 4 8-8" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      )
    },
    {
      id: 'whatsapp',
      title: 'WHATSAPP FIRST',
      description: 'Direct contact with one click',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Green WhatsApp logo */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            <circle cx="32" cy="32" r="28" fill="#25d366" />
            <path 
              d="M32 14c-9.9 0-18 8.1-18 18 0 3.2.8 6.2 2.4 8.9L14 49l8.3-2.2c2.6 1.4 5.5 2.2 8.7 2.2 9.9 0 18-8.1 18-18s-8.1-18-18-18zm10.5 25.5c-.4.6-2.1 1.1-2.9 1.2-.8.1-1.5.2-4.5-.9-3.6-1.4-5.9-5-6.1-5.3-.2-.3-1.6-2.1-1.6-4.1 0-1.9 1-2.9 1.4-3.3.4-.4.8-.5 1.1-.5.3 0 .5 0 .8.1.3 0 .6-.1.9.6.3.8 1.1 2.7 1.2 2.9.1.2.1.4-.1.7-.2.3-.3.5-.5.7-.2.2-.4.5-.2.8.3.5 1.1 1.8 2.4 3 1.7 1.5 3.1 2 3.5 2.2.4.2.7.2.9-.1.3-.3 1.1-1.3 1.4-1.8.3-.5.6-.4 1-.2.4.2 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.2.1 1.1-.3 1.7z" 
              fill="#ffffff" 
            />
          </svg>
        </div>
      )
    },
    {
      id: 'fast-easy',
      title: 'FAST & EASY',
      description: 'List or find in just a few steps',
      icon: (
        <div className="relative w-14 h-14 flex-shrink-0">
          {/* Pink circle with white lightning bolt */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            <circle cx="32" cy="32" r="28" fill="#ff0066" />
            <path 
              d="M35 14L21 34h11v16l14-20H35V14z" 
              fill="#ffffff" 
            />
          </svg>
        </div>
      )
    },
    {
      id: 'areas-covered',
      title: 'ALL AREAS COVERED',
      description: 'Every popular area in Abu Dhabi',
      icon: (
        <div className="relative w-14 h-14 flex-shrink-0">
          {/* Navy blue circle, pink pin with white center dot */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            <circle cx="32" cy="32" r="28" fill="#0a192f" />
            <path 
              d="M32 14c-7.7 0-14 6.3-14 14 0 9.8 14 22 14 22s14-12.2 14-22c0-7.7-6.3-14-14-14zm0 19c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" 
              fill="#ff0066" 
            />
          </svg>
        </div>
      )
    },
    {
      id: 'better-matches',
      title: 'BETTER MATCHES',
      description: 'We match the right tenant / property',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Pink circle with white handshake */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            <circle cx="32" cy="32" r="28" fill="#ff0066" />
            <path 
              d="M20 34c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4zm24 0c1.1 0 2-.9 2-2s-.9-2-2-2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4zm-19-4.8c-.4.4-.4 1 0 1.4l3.1 3.1c.4.4 1 .4 1.4 0s.4-1 0-1.4l-3.1-3.1c-.4-.4-1-.4-1.4 0zm14 0c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.1 3.1c.4.4 1 .4 1.4 0s.4-1 0-1.4l-3.1-3.1zm-8.8 5c-1.2-1.2-3.1-1.2-4.2 0l-1.4 1.4c-1.2 1.2-1.2 3.1 0 4.2s3.1 1.2 4.2 0l1.4-1.4c1.2-1.2 1.2-3.1 0-4.2zm6.3 0c-1.2 1.2-1.2 3.1 0 4.2l1.4 1.4c1.2 1.2 3.1 1.2 4.2 0s1.2-3.1 0-4.2l-1.4-1.4c-1.2-1.2-3.1-1.2-4.2 0z" 
              fill="#ffffff" 
              opacity="0.3" 
            />
            {/* Outline clean Handshake */}
            <path 
              d="M18 36c1.5 1.5 4 1.5 5.5 0l4-4c.8-.8 2-.8 2.8 0l2.5 2.5c.8.8.8 2 0 2.8l-4 4c-1.5 1.5-1.5 4 0 5.5s4 1.5 5.5 0l8.5-8.5c1.5-1.5 1.5-4 0-5.5s-4-1.5-5.5 0l-1.5 1.5m-18-4l4.5-4.5c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5l-1.5 1.5" 
              stroke="#ffffff" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      )
    },
    {
      id: 'free-use',
      title: 'FREE TO USE',
      description: '100% free for everyone',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Pink rosette with ribbon & white check inside */}
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            {/* Ribbons */}
            <path d="M26 38l-4 14 6-2 6 2-2-14" fill="#e6005c" />
            <path d="M38 38l4 14-6-2-6 2 2-14" fill="#e6005c" />
            {/* Rosette Scallops outer */}
            <circle cx="32" cy="28" r="20" fill="#ff0066" />
            {/* Scalloped edge details */}
            <path 
              d="M32 6a22 22 0 100 44 22 22 0 000-44zm0 36a14 14 0 110-28 14 14 0 010 28z" 
              fill="#e6005c" 
              opacity="0.3" 
            />
            <circle cx="32" cy="28" r="15" fill="#ff0066" />
            <path 
              d="M26 28l4 4 7-7" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="w-full container mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-8">
        
        {/* Banner Container */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.03)]">
          
          {/* ==========================================
              HEADER row: "WHY CHOOSE RUMANEST?"
             ========================================== */}
          <div className="flex items-center justify-center w-full mb-10">
            {/* Left Decorative Line */}
            <div className="hidden sm:block flex-1 h-0.5 bg-linear-to-r from-transparent to-slate-500" />
            
            <h2 className="mx-6 text-center text-base sm:text-lg md:text-xl font-black tracking-wider uppercase text-slate-800 flex-shrink-0">
              WHY CHOOSE <span className="text-[#ff0066] ml-1.5">RUMANEST?</span>
            </h2>
            
            {/* Right Decorative Line */}
            <div className="hidden sm:block flex-1 h-0.5 bg-linear-to-l from-transparent to-slate-500" />
          </div>

          {/* ==========================================
              GRID CONTAINER: Fluid 1-col -> 2-col -> 3-col -> 6-col Layout
             ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-0 items-start divide-y divide-slate-100 lg:divide-y-0 lg:divide-x lg:divide-slate-200/80">
            
            {features.map((feat) => (
              <div 
                key={feat.id} 
                className="flex items-center gap-4 lg:flex-col lg:items-center lg:text-center p-3 lg:px-4 lg:py-1 first:pt-0 sm:first:pt-3 lg:first:pt-1"
              >
                {/* Badge Icon Wrapper */}
                <div className="shrink-0 transition-transform duration-300 hover:scale-105">
                  {feat.icon}
                </div>

                {/* Text Block */}
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-black tracking-wide text-slate-800 uppercase">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-normal">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}