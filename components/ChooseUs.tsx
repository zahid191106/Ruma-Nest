'use client';
import React from 'react';
import { 
  SiFacebook, 
  SiX, 
  SiInstagram, 
  SiWhatsapp,
  SiTiktok,
  SiYoutube 
} from '@icons-pack/react-simple-icons';
import {ShieldCheck, BadgeCheck, Zap, Map, Handshake, Coins} from 'lucide-react'

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
          <ShieldCheck className="w-14 h-14 text-emerald-600 drop-shadow-sm" />
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
          <SiWhatsapp className="w-14 h-14 text-emerald-400 drop-shadow-sm" />
        </div>
      )
    },
    {
      id: 'fast-easy',
      title: 'FAST & EASY',
      description: 'List or find in just a few steps',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Pink circle with white lightning bolt */}
          <Zap className="w-14 h-14 text-amber-500 drop-shadow-sm" />
        </div>
      )
    },
    {
      id: 'areas-covered',
      title: 'ALL AREAS COVERED',
      description: 'Every popular area in Abu Dhabi',
      icon: (
        <div className="relative w-14 h-14 shrink-0">
          {/* Navy blue circle, pink pin with white center dot */}
          <Map className="w-14 h-14 text-blue-600 drop-shadow-sm" />
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
          <Handshake className="w-14 h-14 text-purple-600 drop-shadow-sm" />
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
          <Coins className="w-14 h-14 text-red-500 drop-shadow-sm" />
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
            
            <h2 className="mx-6 text-center text-base sm:text-lg md:text-xl font-black tracking-wider uppercase text-slate-800 shrink-0">
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