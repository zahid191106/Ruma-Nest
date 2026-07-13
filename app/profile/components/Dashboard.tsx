// profile/components/Dashboard.tsx
'use client';

import React from 'react';
import { Building, Car, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { PropertyListing, CarLiftService, RoommateProfile, UserProfileData } from '@/types/user-dashboard';

// Initialize the official Sanity image helper builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface DashboardProps {
  user: UserProfileData | null;
  properties: PropertyListing[];
  carLifts: CarLiftService[];
  roommates: RoommateProfile[];
  onOpenTab: (tab: 'dashboard' | 'property' | 'carlift' | 'roommate' | 'setting') => void;
}

export default function Dashboard({ 
  user,
  properties = [], 
  carLifts = [], 
  roommates = [],
  onOpenTab 
}: DashboardProps) {

  // Resolve dynamic top banner credentials safely
  const userName = user?.name || "User";
  const userRole = user?.role || "user";
  
  const userAvatar = user?.avatar?.asset?._ref 
    ? urlFor(user.avatar).width(150).height(150).url() 
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

  // Dynamic image selectors matching each schema framework context
  const getPropertyImage = (item: PropertyListing) => {
    if (item.images && item.images.length > 0 && item.images[0].asset?._ref) {
      return urlFor(item.images[0]).width(200).height(160).url();
    }
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200";
  };

  const getRoommateImage = (item: RoommateProfile) => {
    if (item.images && item.images.length > 0 && item.images[0]?.asset?._ref) {
      return urlFor(item.images[0]).width(200).height(160).url();
    }
    return "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=200";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 👤 Dynamic User Header Banner */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={userAvatar} 
            alt={userName} 
            className="w-16 h-16 rounded-full object-cover border-2 border-rose-100 shrink-0 shadow-sm" 
          />
          <div>
            <h1 className="text-xl font-black text-slate-900">Welcome back, {userName}!</h1>
            <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
              Account Role: <span className="text-[#F42A63] font-black">{userRole}</span>
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          RumaNest Platform Control Room
        </div>
      </div>

      {/* 📊 Quantities Counter Metric Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#F42A63]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">My Properties</span>
            <span className="text-2xl font-black text-slate-900">{properties.length}</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Car-Lifts Active</span>
            <span className="text-2xl font-black text-slate-900">{carLifts.length}</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Roommates</span>
            <span className="text-2xl font-black text-slate-900">{roommates.length}</span>
          </div>
        </div>
      </div>

      {/* 📋 Context Modules Mini Lists Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 🟢 DYNAMIC PROPERTIES LIST PANEL (SLICED TO 5) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">My Properties</h2>
              <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded-full">Top 5</span>
            </div>
            
            <div className="space-y-3">
              {properties.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">No properties listed yet.</div>
              ) : (
                properties.slice(0, 5).map((item) => (
                  <div key={item._id} className="border border-slate-50 p-2.5 rounded-xl flex gap-3 bg-white hover:shadow-sm transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getPropertyImage(item)} alt={item.title} className="w-20 h-16 rounded-lg object-cover bg-slate-50 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-slate-800 text-xs truncate">{item.title}</h3>
                          <span className={`text-[8px] shrink-0 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-0.5 ${item.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                            {item.isVerified ? <CheckCircle className="w-2 h-2" /> : <XCircle className="w-2 h-2" />}
                            {item.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center mt-0.5 truncate">
                          <MapPin className="w-3 h-3 mr-0.5 shrink-0" />
                          {item.location}
                        </p>
                      </div>
                      <p className="text-xs font-black text-blue-600 mt-1">
                        AED {item.price?.toLocaleString()}
                        {item.billingCycle && <span className="text-[9px] text-slate-400 font-medium">/{item.billingCycle}</span>}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <button type="button" onClick={() => onOpenTab('property')} className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer font-extrabold text-xs py-2.5 rounded-xl transition mt-5 shadow-sm">
            Manage Properties
          </button>
        </div>

        {/* 🔵 DYNAMIC CAR-LIFTS LIST PANEL (SLICED TO 5) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">My Car-Lifts</h2>
              <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded-full">Top 5</span>
            </div>

            <div className="space-y-3">
              {carLifts.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">No active routes found.</div>
              ) : (
                carLifts.slice(0, 5).map((item) => (
                  <div key={item._id} className="border border-slate-50 p-2.5 rounded-xl flex gap-3 bg-white hover:shadow-sm transition">
                    <div className="w-20 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Car className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-slate-800 text-xs truncate">
                            {item.pickupLocation.split(',')[0]} → {item.dropoffLocation.split(',')[0]}
                          </h3>
                          <span className={`text-[8px] shrink-0 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-0.5 ${item.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                            {item.isActive ? <CheckCircle className="w-2 h-2" /> : <XCircle className="w-2 h-2" />}
                            {item.isActive ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                          Preferred: {item.preferredCar || 'Any Car'}
                        </p>
                      </div>
                      <p className="text-xs font-black text-blue-600 mt-1">
                        AED {item.amount?.toLocaleString()} <span className="text-[9px] text-slate-400 font-medium">/trip</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <button type="button" onClick={() => onOpenTab('carlift')} className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-extrabold text-xs py-2.5 rounded-xl transition mt-5 shadow-sm">
            Manage Car-Lifts
          </button>
        </div>

        {/* 🟡 DYNAMIC ROOMMATE LIST PANEL (SLICED TO 5) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Roommate Cards</h2>
              <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded-full">Top 5</span>
            </div>

            <div className="space-y-3">
              {roommates.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">No roommate profiles logged.</div>
              ) : (
                roommates.slice(0, 5).map((item) => (
                  <div key={item._id} className="border border-slate-50 p-2.5 rounded-xl flex gap-3 bg-white hover:shadow-sm transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getRoommateImage(item)} alt={item.title} className="w-20 h-16 rounded-lg object-cover bg-slate-50 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-slate-800 text-xs truncate">{item.title}</h3>
                          <span className={`text-[8px] shrink-0 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide ${item.status === 'available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center mt-0.5 truncate">
                          <MapPin className="w-3 h-3 mr-0.5 shrink-0" />
                          {item.location}
                        </p>
                      </div>
                      <p className="text-xs font-black text-blue-600 mt-1">
                        AED {item.price?.amount?.toLocaleString()}
                        {item.price?.billingCycle && <span className="text-[9px] text-slate-400 font-medium">/{item.price.billingCycle}</span>}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <button type="button" onClick={() => onOpenTab('roommate')} className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer font-extrabold text-xs py-2.5 rounded-xl transition mt-5 shadow-sm">
            Manage Roommates
          </button>
        </div>

      </div>
    </div>
  );
}