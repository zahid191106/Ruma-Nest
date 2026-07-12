import React from 'react';
import { Building, Heart, Eye, MessageSquare, MapPin, Edit, Trash2 } from 'lucide-react';

interface DashboardProps {
  properties: any[];
  favorites: any[];
  onToggleStatus: (id: number) => void;
  onDeleteProperty: (id: number) => void;
  onRemoveFavorite: (id: number) => void;
  onOpenAddProperty: () => void;
}

export default function Dashboard({ 
  properties, 
  favorites, 
  onToggleStatus, 
  onDeleteProperty, 
  onRemoveFavorite,
  onOpenAddProperty 
}: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#F42A63]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">My Listings</span>
            <span className="text-2xl font-black text-slate-900">{properties.length}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#F42A63]">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Favorites</span>
            <span className="text-2xl font-black text-slate-900">{favorites.length}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#F42A63]">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Views</span>
            <span className="text-2xl font-black text-slate-900">325</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#F42A63]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Messages</span>
            <span className="text-2xl font-black text-slate-900">12</span>
          </div>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties Mini List */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900">My Properties</h2>
          <div className="space-y-4">
            {properties.slice(0, 3).map((item) => (
              <div key={item.id} className="border border-slate-100 p-3 rounded-2xl flex gap-4">
                <img src={item.image} alt={item.title} className="w-24 h-20 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{item.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center mt-1"><MapPin className="w-3.5 h-3.5 mr-1" />{item.location}</p>
                    <p className="text-xs font-extrabold mt-1">AED {item.price}/month</p>
                  </div>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-slate-50">
                    <button onClick={() => onToggleStatus(item.id)} className="text-xs font-bold text-slate-500 hover:text-emerald-600">Toggle Rent</button>
                    <button onClick={() => onDeleteProperty(item.id)} className="text-xs font-bold text-red-500 ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onOpenAddProperty} className="w-full bg-[#F42A63] hover:bg-rose-600 text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-md">Add Property</button>
        </div>

        {/* Favorites Mini List */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900">Favorites</h2>
          <div className="space-y-4">
            {favorites.slice(0, 3).map((item) => (
              <div key={item.id} className="border border-slate-100 p-3 rounded-2xl flex gap-4">
                <img src={item.image} alt={item.title} className="w-24 h-20 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center mt-1"><MapPin className="w-3.5 h-3.5 mr-1" />{item.location}</p>
                    <p className="text-sm font-black text-slate-900 mt-1">AED {item.price}</p>
                  </div>
                  <button onClick={() => onRemoveFavorite(item.id)} className="text-xs font-bold text-red-500 self-end mt-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}