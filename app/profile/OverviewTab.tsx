// app/profile/OverviewTab.tsx
'use client'

import React from 'react';
import { Grid, Home, Car, Heart, User } from 'lucide-react';

interface OverviewTabProps {
  userName: string;
  userRole: string;
  propertiesCount: number;
  carLiftsCount: number;
  favoritesCount: number;
}

export default function OverviewTab({
  userName,
  userRole,
  propertiesCount,
  carLiftsCount,
  favoritesCount
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#051329] via-slate-900 to-slate-850 rounded-2xl p-6 md:p-8 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Welcome Back, {userName}</h1>
          <p className="text-slate-300 text-xs max-w-md">
            Easily track, update, and manage your real estate spaces and dynamic car-lift routes across your dashboard.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none">
          <Grid className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Performance Summary Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Properties', count: propertiesCount, icon: Home, bg: 'bg-pink-50 text-[#ff0055]' },
          { label: 'Active Car Lifts', count: carLiftsCount, icon: Car, bg: 'bg-blue-50 text-blue-600' },
          { label: 'Saved Bookmarks', count: favoritesCount, icon: Heart, bg: 'bg-rose-50 text-rose-500' },
          { label: 'Account Identity', count: userRole, icon: User, bg: 'bg-slate-50 text-slate-700', isLabel: true }
        ].map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3">
              <div className={`p-2.5 w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <CardIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.label}</span>
                <span className={`font-black text-slate-800 tracking-tight block ${card.isLabel ? 'text-xs mt-1 truncate capitalize' : 'text-xl md:text-2xl'}`}>
                  {card.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}