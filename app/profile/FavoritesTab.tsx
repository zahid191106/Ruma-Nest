// app/profile/FavoritesTab.tsx
'use client'

import React from 'react';
import { MapPin } from 'lucide-react';

interface SanityFavoriteSummary {
  _id: string;
  title: string;
  location: string;
  monthlyRent: number;
  propertyType: string;
}

interface FavoritesTabProps {
  favorites: SanityFavoriteSummary[];
}

export default function FavoritesTab({ favorites }: FavoritesTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Saved Spaces & Bookmarks</h2>
        <p className="text-slate-400 text-xs">Quick access hub for properties you pinned.</p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No saved spaces.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => (
            <div key={fav._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[9px] font-black bg-rose-50 text-[#ff0055] px-2.5 py-1 rounded-md uppercase tracking-wider">{fav.propertyType.replace('_', ' ')}</span>
                <h3 className="font-bold text-slate-800 text-sm mt-3 line-clamp-1">{fav.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-300" /> {fav.location}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Pricing</span>
                  <span className="font-black text-slate-900">AED {fav.monthlyRent}/mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}