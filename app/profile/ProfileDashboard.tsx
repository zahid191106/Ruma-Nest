// app/profile/ProfileDashboard.tsx
'use client'

import React, { useState } from 'react';
import { Menu, X, ArrowLeft, Grid, Home, Car, Heart, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

import OverviewTab from './OverviewTab';
import PropertiesTab from './PropertiesTab';
import CarLiftsTab from './CarLiftsTab';
import FavoritesTab from './FavoritesTab';
import SettingsTab from './SettingsTab';

// 1. Matches your property Sanity schema field definitions exactly
interface CleanListingSummary {
  _id: string;
  title: string;
  location: string;
  monthlyRent?: number;
  propertyType?: 'room' | 'studio' | 'apartment' | 'bed_space';
  imageUrl?: string;
  isVerified?: boolean;
  status?: 'active' | 'inactive';
}

// 2. Matches your carLift Sanity schema field definitions exactly
export interface CleanCarLiftSummary {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  shiftType: 'morning' | 'general' | 'evening';
  startTime: string;
  monthlyFee?: number;
  seatsLeft?: number;
  isActive?: boolean;
  driver?: {
    name: string;
    isVerifiedDriver: boolean;
    whatsappNumber: string;
  };
}

// 3. Consolidated user document mapping matching page.tsx profileData structure
export interface SanityUserProfileData {
  name: string;
  email: string;
  whatsappNumber: string;
  role: 'user' | 'driver' | 'landlord' | 'admin';
  avatarUrl?: string;
  isActive?: boolean;
  myProperties?: CleanListingSummary[];
  myCarLifts?: CleanCarLiftSummary[];
  myFavorites?: CleanListingSummary[];
}

export default function ProfileDashboard({ profileData }: { profileData: SanityUserProfileData }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safe default initialization array checks preventing count crashes
  const [properties, setProperties] = useState<CleanListingSummary[]>(profileData?.myProperties || []);
  const [carLifts, setCarLifts] = useState<CleanCarLiftSummary[]>(profileData?.myCarLifts || []);
  const [favorites] = useState<CleanListingSummary[]>(profileData?.myFavorites || []);
  
  const [userData, setUserData] = useState({
    name: profileData?.name || '',
    email: profileData?.email || '',
    whatsappNumber: profileData?.whatsappNumber || '',
    role: profileData?.role || 'user'
  });

  // Dynamically uses extracted avatarUrl from query or provides fallback UI avatar
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ff0055&color=fff`;
  const avatarUrl = profileData?.avatarUrl || fallbackAvatar;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-10 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 bg-[#ff0055] rounded-xl flex items-center justify-center text-white font-black shadow-xs">
              <span>R</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#051329]">
              Ruma<span className="text-[#ff0055]">Nest</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-3.5 py-2 rounded-xl transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <img src={avatarUrl} alt={userData.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 p-5 justify-between">
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <div className="flex items-center space-x-3">
                <img src={avatarUrl} className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#ff0055]" alt={userData.name} />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold truncate">{userData.name}</h4>
                  <span className="inline-block text-[10px] bg-white/10 text-pink-400 font-bold px-1.5 py-0.5 rounded-md mt-0.5 capitalize">{userData.role}</span>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Overview Dashboard', icon: Grid, count: null },
                { id: 'properties', label: 'My Properties', icon: Home, count: properties.length },
                { id: 'carlifts', label: 'My Car Lifts', icon: Car, count: carLifts.length },
                { id: 'favorites', label: 'Saved Bookmarks', icon: Heart, count: favorites.length },
                { id: 'settings', label: 'Account Settings', icon: Settings, count: null },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-[#ff0055] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && <span className={`text-[10px] px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.count}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link href="/api/auth/signout" className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex lg:hidden backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-black text-[#051329]">Ruma<span className="text-[#ff0055]">Nest</span></span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <nav className="space-y-1.5">
                  {[
                    { id: 'dashboard', label: 'Overview Dashboard', icon: Grid },
                    { id: 'properties', label: 'My Properties', icon: Home },
                    { id: 'carlifts', label: 'My Car Lifts', icon: Car },
                    { id: 'favorites', label: 'Saved Bookmarks', icon: Heart },
                    { id: 'settings', label: 'Account Settings', icon: Settings }
                  ].map((tab) => {
                    const IconComp = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold ${activeTab === tab.id ? 'bg-[#ff0055] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <IconComp className="w-4.5 h-4.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Panels Router */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 lg:pb-10 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <OverviewTab 
              userName={userData.name} 
              userRole={userData.role} 
              propertiesCount={properties.length} 
              carLiftsCount={carLifts.length} 
              favoritesCount={favorites.length} 
            />
          )}
          {activeTab === 'properties' && <PropertiesTab properties={properties} setProperties={setProperties} />}
          {activeTab === 'carlifts' && <CarLiftsTab carLifts={carLifts} setCarLifts={setCarLifts} />}
          {activeTab === 'favorites' && <FavoritesTab favorites={favorites} />}
          {activeTab === 'settings' && <SettingsTab userData={userData} setUserData={setUserData} avatarUrl={avatarUrl} />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-2 flex items-center justify-around z-40 shadow-xl">
        {[
          { id: 'dashboard', label: 'Overview', icon: Grid },
          { id: 'properties', label: 'Spaces', icon: Home },
          { id: 'carlifts', label: 'Lifts', icon: Car },
          { id: 'favorites', label: 'Pinned', icon: Heart },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((item) => {
          const ItemIcon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center space-y-1 px-3 py-1.5 rounded-xl transition ${isSelected ? 'text-[#ff0055]' : 'text-slate-400'}`}>
              <ItemIcon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}