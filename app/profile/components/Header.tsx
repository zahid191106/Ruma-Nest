// profile/components/Header.tsx
'use client';

import React from 'react';
import { ArrowBigLeftDashIcon } from 'lucide-react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { UserProfileData } from '@/types/user-dashboard';

// Initialize the official Sanity image helper builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface HeaderProps {
  onToggleSidebar?: () => void;
  userProfile: UserProfileData | null; // Accept lifted parent user profile state
}

export default function Header({ onToggleSidebar, userProfile }: HeaderProps) {
  // Gracefully grab first name token or fallback to Guest safely
  const firstName = (userProfile?.name || 'Guest').split(' ')[0];
  
  // 🚀 Dynamic Avatar Fallback: Resolves via the official builder or applies default placeholder image
  const userAvatar = userProfile?.avatar?.asset?._ref 
    ? urlFor(userProfile.avatar).width(100).height(100).url() 
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-md px-10 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        {/* Sidebar Trigger Button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg md:hidden"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-2">
          {/* Logo fallbacks */}
          <img src="/images/logo.png" alt="Logo" className="h-15 w-full hidden md:block object-contain" />
          <img src="/images/ruma-logo.svg" alt="Logo" className="h-8 w-full md:hidden object-contain" />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <a 
          href="/"
          className="relative p-2 flex items-center gap-2 text-pink-600 hover:text-pink-700 bg-pink-200 hover:bg-pink-300 shadow-sm rounded-lg cursor-pointer transition-colors text-xs font-semibold"
        >
          <ArrowBigLeftDashIcon className="w-4 h-4" />
          Back to Home
        </a>

        <div className="flex items-center space-x-2 border-l pl-4 border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={userAvatar} 
            alt={userProfile?.name || "User Profile"} 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-50"
          />
          <div className="hidden lg:block text-left">
            <span className="text-sm text-purple-700 block -mb-0.5">Welcome back</span>
            <span className="font-bold text-pink-600 text-lg">{firstName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}