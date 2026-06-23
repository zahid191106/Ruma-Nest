'use client'

import React, { useState } from 'react';
import { 
  Home, 
  Heart, 
  Plus, 
  Menu, 
  X, 
  MapPin, 
  LogOut, 
  Grid, 
  Settings, 
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Car,
  Calendar,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface CleanListingSummary {
  _id: string;
  title: string;
  location: string;
  monthlyRent?: number;
  propertyType?: string;
  image?: string;
  isActive?: boolean;
  views?: number;
  inquiries?: number;
}

interface CleanCarLiftSummary {
  _id: string;
  fromLocation: string;
  toLocation: string;
  timing?: string;
  price?: number;
  seatsAvailable?: number;
  isActive?: boolean;
}

interface UserProfileData {
  name: string;
  email: string;
  whatsappNumber: string;
  role: string;
  avatar?: string;
  myProperties: CleanListingSummary[];
  myCarLifts: CleanCarLiftSummary[];
  myFavorites: CleanListingSummary[];
}

export default function RumaNestDashboardView({ profileData }: { profileData: UserProfileData }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Component State Matrices
  const [properties, setProperties] = useState(profileData.myProperties || []);
  const [carLifts, setCarLifts] = useState(profileData.myCarLifts || []);
  const [favorites] = useState(profileData.myFavorites || []);
  
  const [userData, setUserData] = useState({
    name: profileData.name || '',
    email: profileData.email || '',
    whatsappNumber: profileData.whatsappNumber || '',
    role: profileData.role || 'user'
  });
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Update State Management Hooks
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    monthlyRent: 0,
    propertyType: 'Room'
  });

  const [editingCarLiftId, setEditingCarLiftId] = useState<string | null>(null);
  const [editCarLiftForm, setEditCarLiftForm] = useState({
    fromLocation: '',
    toLocation: '',
    timing: '',
    price: 0,
    seatsAvailable: 4
  });

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ff0055&color=fff`;

  // 🔄 Consolidated Property Update Handler
  const handleEditPropertySubmit = async (e: React.FormEvent, propertyId: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/property/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) throw new Error();
      setProperties(prev => prev.map(p => p._id === propertyId ? { ...p, ...editForm, monthlyRent: Number(editForm.monthlyRent), isActive: false } : p));
      setEditingPropertyId(null);
      alert('Listing updated safely! Sent for approval review.');
    } catch {
      alert('Error saving property changes.');
    }
  };

  // 🔄 Consolidated Car Lift Update Handler
  const handleEditCarLiftSubmit = async (e: React.FormEvent, liftId: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/carlift/${liftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCarLiftForm)
      });
      if (!response.ok) throw new Error();
      setCarLifts(prev => prev.map(c => c._id === liftId ? { ...c, ...editCarLiftForm, price: Number(editCarLiftForm.price), isActive: false } : c));
      setEditingCarLiftId(null);
      alert('Route parameters updated safely! Sent for approval review.');
    } catch {
      alert('Error updating route information.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Header Navigation bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-10 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 bg-[#ff0055] rounded-xl flex items-center justify-center text-white font-black shadow-sm shadow-pink-200">
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
          <img src={profileData.avatar || fallbackAvatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shadow-xs" />
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar Panel Drawer Layout */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 p-5 justify-between">
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xs">
              <div className="flex items-center space-x-3">
                <img src={profileData.avatar || fallbackAvatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#ff0055]" alt="" />
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
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-[#ff0055] text-white shadow-sm shadow-pink-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
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

        {/* Mobile Navigation Drawers Overlay */}
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

        {/* Dynamic View Panel Grid Matrix Screen Layout */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 lg:pb-10 max-w-7xl mx-auto w-full">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#051329] via-slate-900 to-slate-850 rounded-2xl p-6 md:p-8 text-white shadow-xs relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <h1 className="text-xl md:text-2xl font-black tracking-tight">Welcome Back, {userData.name}</h1>
                  <p className="text-slate-300 text-xs max-w-md">Easily track, update, and manage your real estate spaces and dynamic car-lift routes across your dashboard ecosystem.</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none">
                  <Grid className="w-64 h-64" />
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Properties', count: properties.length, icon: Home, bg: 'bg-pink-50 text-[#ff0055]' },
                  { label: 'Active Car Lifts', count: carLifts.length, icon: Car, bg: 'bg-blue-50 text-blue-600' },
                  { label: 'Saved Bookmarks', count: favorites.length, icon: Heart, bg: 'bg-rose-50 text-rose-500' },
                  { label: 'Account Identity', count: userData.role, icon: User, bg: 'bg-slate-50 text-slate-700', isLabel: true }
                ].map((card, idx) => {
                  const CardIcon = card.icon;
                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3">
                      <div className={`p-2.5 w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}><CardIcon className="w-5 h-5" /></div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.label}</span>
                        <span className={`font-black text-slate-800 tracking-tight block ${card.isLabel ? 'text-xs mt-1 truncate capitalize' : 'text-xl md:text-2xl'}`}>{card.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Posted Properties</h2>
                  <p className="text-slate-400 text-xs">Manage updates or visibility controls for rooms and apartments.</p>
                </div>
                <Link href="/upload-property" className="bg-[#ff0055] hover:bg-pink-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No active property properties posted yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-200/60 transition-all duration-300">
                      <div>
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          <img src={p.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80'} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" alt="" />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#ff0055] text-[9px] font-black px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider">{p.propertyType || 'Room'}</span>
                        </div>
                        <div className="p-5 space-y-1.5">
                          <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-[#ff0055] transition-colors">{p.title}</h3>
                          <p className="text-xs text-slate-400 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-300 shrink-0" /> {p.location}</p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3.5 border-t border-slate-50 flex items-center justify-between bg-slate-50/40">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rent</span>
                          <span className="text-sm font-black text-slate-900">AED {p.monthlyRent}<span className="text-[10px] font-normal text-slate-400">/mo</span></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-bold px-2.5 py-1 border rounded-md flex items-center space-x-1 ${p.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                            {p.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{p.isActive ? 'Active' : 'Pending'}</span>
                          </span>
                          <button onClick={() => { setEditingPropertyId(p._id); setEditForm({ title: p.title, location: p.location, monthlyRent: p.monthlyRent || 0, propertyType: p.propertyType || 'Room' }); }} className="p-2 bg-white border rounded-xl hover:bg-slate-50 text-slate-500 border-slate-200/70 shadow-xs transition"><Edit2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CAR LIFTS ARRANGEMENTS */}
          {activeTab === 'carlifts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Car Lift Services</h2>
                  <p className="text-slate-400 text-xs">Configure and display active carpooling routes or driver lists.</p>
                </div>
                <Link href="/upload-car-lift" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                  <Plus className="w-4 h-4" />
                  <span>Create Route</span>
                </Link>
              </div>

              {carLifts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No car lift listings configured at the moment.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carLifts.map(lift => (
                    <div key={lift._id} className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1"><Car className="w-3 h-3" /> Route Plan</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-md ${lift.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{lift.isActive ? 'Active' : 'Pending'}</span>
                        </div>
                        <div className="space-y-2 relative border-l-2 border-dashed border-slate-100 pl-4 ml-2.5 py-0.5">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Pickup</span>
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">{lift.fromLocation}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Dropoff</span>
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">{lift.toLocation}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {lift.timing || 'Flexible'}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {lift.seatsAvailable || 4} Seats Max</span>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-50 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                          <span className="text-sm font-black text-slate-900">AED {lift.price}</span>
                        </div>
                        <button onClick={() => { setEditingCarLiftId(lift._id); setEditCarLiftForm({ fromLocation: lift.fromLocation, toLocation: lift.toLocation, timing: lift.timing || '', price: lift.price || 0, seatsAvailable: lift.seatsAvailable || 4 }); }} className="p-2 bg-white border border-slate-200/70 rounded-xl text-slate-500 hover:bg-slate-50 shadow-xs transition"><Edit2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BOOKMARKED FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Saved Spaces & Bookmarks</h2>
                <p className="text-slate-400 text-xs">Quick access hub for properties you pinned.</p>
              </div>
              
              {favorites.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No saved spaces in your favorites bucket.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(fav => (
                    <div key={fav._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <span className="text-[9px] font-black bg-rose-50 text-[#ff0055] px-2.5 py-1 rounded-md uppercase tracking-wider">{fav.propertyType || 'Room'}</span>
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
          )}

          {/* TAB 5: COMPREHENSIVE ACCOUNT EDIT MANAGEMENT PANEL */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6 mx-auto">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Account Settings</h2>
                <p className="text-xs text-slate-400 mt-0.5">Keep your standard verification records and metrics fully current.</p>
              </div>

              {saveMessage && <div className="p-3 text-xs font-bold rounded-xl border bg-slate-50">{saveMessage}</div>}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSaveLoading(true);
                setSaveMessage('');

                const submissionPayload = new FormData();
                submissionPayload.append('name', userData.name);
                submissionPayload.append('email', userData.email);
                submissionPayload.append('whatsappNumber', userData.whatsappNumber);
                submissionPayload.append('role', userData.role);
                
                const fileInput = document.getElementById('avatarFileInput') as HTMLInputElement;
                if (fileInput?.files?.[0]) {
                  submissionPayload.append('avatarFile', fileInput.files[0]);
                }

                try {
                  const res = await fetch('/api/user', { method: 'PATCH', body: submissionPayload }); // Updated endpoint target folder
                  if (!res.ok) throw new Error();
                  setSaveMessage('✅ Profiles saved! Status moved to Pending Verification.');
                  setTimeout(() => window.location.reload(), 1500);
                } catch {
                  setSaveMessage('❌ Profile transaction error.');
                } finally {
                  setSaveLoading(false);
                }
              }} className="space-y-4">
                
                <div className="flex items-center space-x-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  <img src={profileData.avatar || fallbackAvatar} alt="" className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#ff0055]" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Profile Picture Asset</h4>
                    <input type="file" id="avatarFileInput" accept="image/*" className="text-xs mt-2 text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[#ff0055]/10 file:text-[#ff0055] hover:file:bg-[#ff0055]/20 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> Full Name</label>
                    <input type="text" required className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-slate-400" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> Email Address</label>
                    <input type="email" required className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-slate-400" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> WhatsApp Contact</label>
                    <input type="text" required placeholder="971501234567" className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-slate-400" value={userData.whatsappNumber} onChange={e => setUserData({...userData, whatsappNumber: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Ecosystem Designation</label>
                    <select className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold bg-white focus:outline-hidden" value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
                      <option value="user">Standard User</option>
                      <option value="driver">Verified Driver</option>
                      <option value="landlord">Landlord / Agent</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                  ⚠️ Updating profile parameters automatically marks your status indicator visibility back to <strong>Pending Admin Review</strong>.
                </div>

                <button type="submit" disabled={saveLoading} className="w-full bg-slate-900 text-white p-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer shadow-xs">
                  {saveLoading ? 'Processing Updates...' : 'Save Configuration Parameters'}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Sticky Footer Layout Bar */}
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

      {/* ================================================================= */}
      {/* INLINE MODAL OVERLAYS (UPDATED URL ENDPOINT ACTIONS)              */}
      {/* ================================================================= */}
      
      {/* Property Edit Modal */}
      {editingPropertyId && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditingPropertyId(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><X className="w-4 h-4" /></button>
            <div>
              <h3 className="text-sm font-black text-slate-900">Modify Property Listing</h3>
              <p className="text-slate-400 text-[11px]">Updating parameters shifts the listing status to pending review.</p>
            </div>
            <form onSubmit={(e) => handleEditPropertySubmit(e, editingPropertyId)} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Property Title</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Rent (AED)</label>
                  <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editForm.monthlyRent} onChange={e => setEditForm({...editForm, monthlyRent: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Property Type</label>
                  <select className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editForm.propertyType} onChange={e => setEditForm({...editForm, propertyType: e.target.value})}>
                    <option value="Room">Room</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white p-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition mt-2">Save Property Updates</button>
            </form>
          </div>
        </div>
      )}

      {/* Car Lift Edit Modal */}
      {editingCarLiftId && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditingCarLiftId(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><X className="w-4 h-4" /></button>
            <div>
              <h3 className="text-sm font-black text-slate-900">Modify Car Lift Route</h3>
              <p className="text-slate-400 text-[11px]">Adjust your carpooling pickup coordinates and times.</p>
            </div>
            <form onSubmit={(e) => handleEditCarLiftSubmit(e, editingCarLiftId)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Pickup Location</label>
                  <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editCarLiftForm.fromLocation} onChange={e => setEditCarLiftForm({...editCarLiftForm, fromLocation: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Dropoff Location</label>
                  <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editCarLiftForm.toLocation} onChange={e => setEditCarLiftForm({...editCarLiftForm, toLocation: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Timing / Schedule</label>
                <input type="text" required placeholder="e.g. 08:00 AM - Daily" className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editCarLiftForm.timing} onChange={e => setEditCarLiftForm({...editCarLiftForm, timing: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Fee (AED)</label>
                  <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editCarLiftForm.price} onChange={e => setEditCarLiftForm({...editCarLiftForm, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Seats Available</label>
                  <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={editCarLiftForm.seatsAvailable} onChange={e => setEditCarLiftForm({...editCarLiftForm, seatsAvailable: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition mt-2">Update Route Parameters</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}