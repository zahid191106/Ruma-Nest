'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Grid as GridIcon, 
  DollarSign, 
  Calendar, 
  Phone, 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  Loader2,
  Building,
  PlusCircle
} from 'lucide-react';
import TenantForm from '@/components/TanentForm'; // This is your multi-part form container

interface Listing {
  _id: string;
  title: string;
  location: string;
  gender: string;
  freeSpace: number;
  price: {
    amount: number;
    billingCycle: string;
  };
  moveIn: string;
  images?: Array<{
    asset?: {
      _ref: string;
    };
  }>;
  amenities: string[];
  whatsappNumber: string;
  status: string;
  author?: {
    name: string;
  };
}

export default function RoommatesPage() {
  // --- Core Layout & State Controls ---
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // --- Multi-Filter State Elements ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [selectedMoveIn, setSelectedMoveIn] = useState<string>('all');
  const [billingCycle, setBillingCycle] = useState<string>('all');

  // Fetch initial data payload straight from your public GET api endpoint
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/roommate');
      const json = await res.json();
      if (json.success && json.data) {
        setListings(json.data);
        setFilteredListings(json.data);
      }
    } catch (err) {
      console.error('Failed fetching data pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // --- Dynamic Filtering Logic ---
  useEffect(() => {
    let output = [...listings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      output = output.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q)
      );
    }

    if (selectedGender !== 'all') {
      output = output.filter(item => item.gender === selectedGender);
    }

    if (selectedSpace !== 'all') {
      output = output.filter(item => item.freeSpace === Number(selectedSpace));
    }

    if (maxBudget) {
      output = output.filter(item => item.price?.amount <= Number(maxBudget));
    }

    if (selectedMoveIn !== 'all') {
      output = output.filter(item => item.moveIn === selectedMoveIn);
    }

    if (billingCycle !== 'all') {
      output = output.filter(item => item.price?.billingCycle === billingCycle);
    }

    setFilteredListings(output);
  }, [searchQuery, selectedGender, selectedSpace, maxBudget, selectedMoveIn, billingCycle, listings]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGender('all');
    setSelectedSpace('all');
    setMaxBudget('');
    setSelectedMoveIn('all');
    setBillingCycle('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 rounded-3xl">
      
      {/* =========================================================
          HERO BANNER SECTION
         ========================================================= */}
      <section className="relative h-110 md:h-125 flex items-center justify-center bg-[#0a192f] overflow-hidden text-center px-4 rounded-t-3xl">
        {/* Background Layer Container */}
        <div className="absolute inset-0 z-0">
          {/* 1. The Background Image */}
          <img 
            src="/images/header-image.webp" // Replace with your image URL
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20" // Adjust opacity here to mix with the dark background
          />
          
          {/* 2. Your Colored Blur Blends */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="absolute top-12 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
          </div>
        </div>
        
        {/* Gradient Overlay for extra text contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-50/10 z-0" />

        {/* Content Layer */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Find Shared Rooms & Flatmates
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Connect with Your <br />
            <span className="text-[#ff0066]">Perfect Roommate</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto">
            Browse active room requirements or list your own preferences to match directly with vetted accommodation seekers.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setIsTenantModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-pink-500/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Post Your Room Requirement
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN SEARCH AND GRID SECTION
         ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 🔍 TOP LIVE SEARCH AND BAR CONTROLS */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by title, neighborhood or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-[#ff0066] shadow-sm flex items-center justify-center cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* FILTER PANEL BAR (Desktop View Sidebar Layout) */}
          <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#ff0066]" /> Filters
              </h3>
              <button onClick={clearAllFilters} className="text-xs md:text-sm font-bold text-slate-400 hover:text-pink-600 transition-colors cursor-pointer">
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select 
                value={selectedGender} 
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="all">Any Gender</option>
                <option value="men">Men Only</option>
                <option value="female">Females Only</option>
                <option value="couple">Couples Allowed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Spaces Needed</label>
              <select 
                value={selectedSpace} 
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="all">Any Spaces</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3+ Persons</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Max Budget (AED)</label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3" />
                <input 
                  type="number"
                  placeholder="Max Rent..."
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full pl-9 pr-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Billing Cycle</label>
              <select 
                value={billingCycle} 
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="all">All Cycles</option>
                <option value="monthly">Monthly Rent</option>
                <option value="weekly">Weekly Rent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Move In Timeline</label>
              <select 
                value={selectedMoveIn} 
                onChange={(e) => setSelectedMoveIn(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="all">Any Timeline</option>
                <option value="immediately">Immediately</option>
                <option value="1_week">Within 1 Week</option>
                <option value="2_weeks">Within 2 Weeks</option>
                <option value="next_month">Next Month</option>
              </select>
            </div>
          </aside>

          {/* POSTS DISPLAY AREA GRID VIEW */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[#ff0066]" />
                <p className="text-sm font-bold tracking-wide">Syncing available roommate requests...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mx-auto">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">No Requirements Found</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  We couldn't find matches for your active filters. Try broadening your query criteria or post a brand new card.
                </p>
                <button onClick={clearAllFilters} className="text-xs md:text-sm font-bold text-[#ff0066] hover:underline cursor-pointer">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((post) => (
                  <div 
                    key={post._id} 
                    className="bg-white rounded-4xl border border-slate-300/80 overflow-hidden shadow-xl hover:border-pink-400/80 transition-all flex flex-col justify-between text-left group"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs md:text-sm bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-pink-500" /> {post.location.split(',')[0]}
                        </span>
                        
                        <div className="text-right">
                          <p className="text-lg font-black text-pink-600 leading-none">AED {post.price?.amount}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">/{post.price?.billingCycle}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-slate-800 group-hover:text-[#ff0066] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-400 font-bold mt-1">
                          Posted by: {post.author?.name || 'Anonymous Guest'}
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-3 gap-2 py-1">
                        <div className="bg-slate-50/80 p-2 rounded-xl text-center">
                          <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-400 font-bold uppercase">Gender</p>
                          <p className="text-xs md:text-sm font-extrabold text-slate-700 mt-0.5 capitalize">{post.gender === 'couple' ? 'Couples' : post.gender}</p>
                        </div>

                        <div className="bg-slate-50/80 p-2 rounded-xl text-center">
                          <GridIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-400 font-bold uppercase">Spaces</p>
                          <p className="text-xs md:text-sm font-extrabold text-slate-700 mt-0.5">{post.freeSpace} {post.freeSpace === 1 ? 'Person' : 'People'}</p>
                        </div>

                        <div className="bg-slate-50/80 p-2 rounded-xl text-center">
                          <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-400 font-bold uppercase">Move In</p>
                          <p className="text-xs md:text-sm font-extrabold text-slate-700 mt-0.5 capitalize truncate">{post.moveIn.replace('_', ' ')}</p>
                        </div>
                      </div>

                      {post.amenities && post.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {post.amenities.slice(0, 5).map((amenity, idx) => (
                            <span key={idx} className="text-xs md:text-sm bg-pink-50/60 text-[#ff0066] font-extrabold px-2 py-0.5 rounded-md border border-pink-100/40">
                              {amenity}
                            </span>
                          ))}
                          {post.amenities.length > 5 && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-md">
                              +{post.amenities.length - 3} More
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <a 
                        href={`https://wa.me/${post.whatsappNumber.replace(/[+\s]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 transition-all active:scale-98"
                      >
                        <Phone className="w-3.5 h-3.5" /> Direct WhatsApp Chat
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* =========================================================
          MOBILE SLIDEOUT FILTER INTERFACE PANEL DRAWER
         ========================================================= */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#ff0066]" /> Filter Panels
                </h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                <select 
                  value={selectedGender} 
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                >
                  <option value="all">Any Gender</option>
                  <option value="men">Men Only</option>
                  <option value="female">Females Only</option>
                  <option value="couple">Couples Allowed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Spaces Needed</label>
                <select 
                  value={selectedSpace} 
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                >
                  <option value="all">Any Spaces</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3+ Persons</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Max Budget (AED)</label>
                <input 
                  type="number"
                  placeholder="Max Rent..."
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Billing Cycle</label>
                <select 
                  value={billingCycle} 
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                >
                  <option value="all">All Cycles</option>
                  <option value="monthly">Monthly Rent</option>
                  <option value="weekly">Weekly Rent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Move In Timeline</label>
                <select 
                  value={selectedMoveIn} 
                  onChange={(e) => setSelectedMoveIn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                >
                  <option value="all">Any Timeline</option>
                  <option value="immediately">Immediately</option>
                  <option value="1_week">Within 1 Week</option>
                  <option value="2_weeks">Within 2 Weeks</option>
                  <option value="next_month">Next Month</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button 
                onClick={clearAllFilters}
                className="flex-1 py-2.5 text-center text-xs font-bold border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold bg-[#ff0066] text-white rounded-xl hover:bg-[#e6005c]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          HIGH-END MODAL CONTAINER (Matches ActionCard Pattern)
         ========================================================= */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Backdrop click to close */}
          <div 
            onClick={() => setIsTenantModalOpen(false)} 
            className="absolute inset-0 cursor-pointer" 
          />
          
          {/* Form Modal Box Card */}
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800">Post Room Requirement</h3>
                <p className="text-sm text-slate-400 font-medium">Fill out the form below to look for roommates</p>
              </div>
              <button 
                onClick={() => setIsTenantModalOpen(false)}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body Container */}
            <div className="p-6 overflow-y-auto text-left">
              <TenantForm />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}