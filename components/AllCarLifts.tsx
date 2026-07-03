'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { createClient } from '@sanity/client';
import { 
  Car, 
  Search, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  SlidersHorizontal, 
  User, 
  Users,
  Briefcase,
  AlertCircle,
  Menu,
  Plus,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { 
  SiFacebook, 
  SiX, 
  SiInstagram, 
  SiWhatsapp,
  SiTiktok,
  SiYoutube 
} from '@icons-pack/react-simple-icons';

// Read-only public Sanity client for client-side fetching
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-26',
  useCdn: true,
});

interface CarLiftRequest {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  requestedTime: string;
  preferredCar: string;
  purpose: string;
  amount: number;
  userVerified: boolean;
  registeredUser?: { name?: string; whatsappNumber?: string };
  guestUserDetails?: { name?: string; phoneNumber?: string };
}

export default function CarLiftDirectoryPage() {
  const { data: session, status } = useSession();
  const isRegisteredUser = status === 'authenticated';

  // --- Core States ---
  const [requests, setRequests] = useState<CarLiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- UI Controls ---
  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Filter Config State ---
  const [filterPickup, setFilterPickup] = useState('');
  const [filterDropoff, setFilterDropoff] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');

  // --- Request Form State ---
  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    requestedTime: '',
    preferredCar: '',
    purpose: '',
    amount: '',
    guestName: '',
    guestPhone: ''
  });

  // Extract unique purposes dynamically from data for the dropdown filter
  const uniquePurposes = useMemo(() => {
    return Array.from(new Set(requests.map(r => r.purpose || 'Daily Office Commute')));
  }, [requests]);

  const fetchLiveDirectory = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "carLift" && isActive == true] | order(requestedTime asc){
        _id,
        pickupLocation,
        dropoffLocation,
        requestedTime,
        preferredCar,
        purpose,
        amount,
        userVerified,
        registeredUser->{ name, whatsappNumber },
        guestUserDetails
      }`;
      const data = await client.fetch(query);
      setRequests(data);
    } catch (err) {
      console.error('Error refreshing records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDirectory();
  }, []);

  const handlePostRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const registeredName = (session?.user as any)?.name || '';
    const registeredPhone = (session?.user as any)?.whatsappNumber || '';

    const payload = {
      pickupLocation: form.pickupLocation,
      dropoffLocation: form.dropoffLocation,
      requestedTime: new Date(form.requestedTime).toISOString(),
      preferredCar: form.preferredCar || 'Any Car',
      purpose: form.purpose || 'Daily Office Commute',
      amount: Number(form.amount),
      guestName: isRegisteredUser ? registeredName : form.guestName,
      guestPhone: isRegisteredUser ? registeredPhone : form.guestPhone,
    };

    try {
      const response = await fetch('/api/carlift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setIsPostRequestOpen(false);
        setForm({
          pickupLocation: '',
          dropoffLocation: '',
          requestedTime: '',
          preferredCar: '',
          purpose: '',
          amount: '',
          guestName: '',
          guestPhone: ''
        });
        triggerToast('Request posted successfully! Active on board after admin check.');
        fetchLiveDirectory();
      } else {
        alert(resData.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- Dynamic Filtering Logic ---
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesPickup = req.pickupLocation.toLowerCase().includes(filterPickup.toLowerCase());
      const matchesDropoff = req.dropoffLocation.toLowerCase().includes(filterDropoff.toLowerCase());
      const matchesPurpose = filterPurpose === 'All' || (req.purpose || 'Daily Office Commute') === filterPurpose;
      return matchesPickup && matchesDropoff && matchesPurpose;
    });
  }, [requests, filterPickup, filterDropoff, filterPurpose]);

  return (
    <div className="w-full min-h-screen pb-24 font-sans text-left selection:bg-pink-500 selection:text-white">
      
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="relative shadow-xl rounded-3xl text-white overflow-hidden pb-24 pt-12 md:pt-16">
        <img 
          src="/images/car-slide-1.webp" 
          alt="Car Lift Prompt" 
          className='absolute -bottom-28 sm:-bottom-12 w-200 h-87.5 object-contain animate-car-move will-change-transform z-20' 
          style={{ animationDelay: '0s' }} 
        />
        <img 
          src="/images/car-slide-2.webp" 
          alt="Car Lift Prompt" 
          className='absolute -bottom-28 sm:-bottom-12 w-200 h-87.5 object-contain animate-car-move will-change-transform z-20' 
          style={{ animationDelay: '4s' }} 
        />
        <img 
          src="/images/car-slide-3.webp" 
          alt="Car Lift Prompt" 
          className='absolute -bottom-28 sm:-bottom-12 w-200 h-87.5 object-contain animate-car-move will-change-transform z-20' 
          style={{ animationDelay: '8s' }} 
        />
        <img 
          src="/images/car-slide-4.webp" 
          alt="Car Lift Prompt" 
          className='absolute -bottom-28 sm:-bottom-12 w-200 h-87.5 object-contain animate-car-move will-change-transform z-20' 
          style={{ animationDelay: '12s' }} 
        />
        {/* Deep dark radiant light overlay matching reference */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(219,39,119,0.15),transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-sm font-semibold text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                Active Abu Dhabi Routes Live Now
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-slate-700 font-black tracking-tight leading-tight uppercase">
                Save Time & Money With <br />
                <span className="text-pink-500">RumaNest Car-Lift</span>
              </h1>
              
              <p className="text-slate-900 text-xs sm:text-sm md:text-lg max-w-xl font-medium leading-relaxed">
                Find daily office commutes, university travel, and pick-up options across Abu Dhabi. Safe, budget-friendly, and verified profiles for your everyday travel comfort.
              </p>
              
              {/* Action Triggers */}
              <div className="flex flex-wrap items-center justify-center md:justify-flex-start gap-3 pt-2">
                <button 
                  onClick={() => setIsPostRequestOpen(true)}
                  className="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-extrabold text-base uppercase tracking-wider transition-all"
                >
                  Post Your Request
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('routes-matrix');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-11 px-6 bg-[#1a1625] hover:bg-[#252033] text-white border border-slate-800 rounded-xl font-bold text-base uppercase tracking-wider transition-colors"
                >
                  View Daily Commutes
                </button>
              </div>

              {/* Counter Stats Grid Row */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto md:mx-0 border-t border-slate-900/60">
                <div>
                  <p className="text-lg sm:text-4xl font-black text-slate-700">5K+</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Routes Active</p>
                </div>
                <div>
                  <p className="text-lg sm:text-4xl font-black text-slate-700">100%</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Verified Users</p>
                </div>
                <div>
                  <p className="text-lg sm:text-4xl font-black text-slate-700">AED 0</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Commission Fee</p>
                </div>
              </div>
            </div>

            {/* Right Graphics Frame Column */}
            <div className="lg:col-span-6 relative hidden md:block">
              <div className="relative mx-auto w-full lg:max-w-none">
                <div className="rounded-3xl border-4 border-pink-500/10 overflow-hidden shadow-2xl aspect-4/3 ">
                  <img 
                    src="/images/car-lift.webp" 
                    alt="Abu Dhabi Commuting Channels"
                    className="w-full h-full object-cover object-center opacity-90"
                  />
                </div>
                
                {/* Float Over Floating Reliable Badge */}
                <div className="absolute bottom-4 -left-4 bg-white text-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-3 border border-slate-100 max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 stroke-3" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 leading-none">100% Reliable</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">Direct contact via WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- FLOATING CONTROLS & DESK ENGINE --- */}
      <div id="routes-matrix" className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Precise Filter Requirements Header Frame matching Screenshot from 2026-06-26 23-43-40.jpg */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-pink-500 font-extrabold text-base uppercase tracking-wider">
            <SlidersHorizontal className="w-5 h-5 text-pink-500 stroke-[2.5]" />
            <span>Filter Routes & Requirements</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input 1: FROM */}
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase mb-1.5 tracking-wide">FROM (PICKUP)</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={filterPickup}
                  onChange={(e) => setFilterPickup(e.target.value)}
                  placeholder="e.g. Mussafah or Khalifa City" 
                  className="w-full pl-9 pr-3 h-11 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-base font-medium focus:bg-white focus:border-pink-500 outline-none transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Input 2: TO */}
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase mb-1.5 tracking-wide">TO (DROP-OFF)</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-pink-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={filterDropoff}
                  onChange={(e) => setFilterDropoff(e.target.value)}
                  placeholder="e.g. Al Reem Island" 
                  className="w-full pl-9 pr-3 h-11 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-base font-medium focus:bg-white focus:border-pink-500 outline-none transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Selector 3: Purpose Dropdown */}
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase mb-1.5 tracking-wide">COMMUTE PURPOSE</label>
              <select 
                value={filterPurpose} 
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="w-full px-3 h-11 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-base font-medium focus:bg-white focus:border-pink-500 outline-none transition-all text-slate-800 appearance-none"
              >
                <option value="All">All Purposes</option>
                {uniquePurposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-base font-medium text-slate-500 pt-1">
            Showing <strong className="text-slate-800 font-bold">{filteredRequests.length}</strong> active car lift requests
          </div>
        </div>

        {/* --- CARDS DISPLAY TRACK MATRIX --- */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20 text-center text-xs font-black text-slate-400 tracking-widest uppercase animate-pulse">
              Syncing live car-lift matching metrics...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400 text-xs font-bold">
              No matching live traveling demands found across parameters.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map((req) => {
                const isReg = !!req.registeredUser;
                const name = isReg ? req.registeredUser?.name : req.guestUserDetails?.name;
                const dial = isReg ? req.registeredUser?.whatsappNumber : req.guestUserDetails?.phoneNumber;
                const initial = name ? name.charAt(0).toUpperCase() : 'G';

                return (
                  <div key={req._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    
                    {/* Upper Core Specs Frame */}
                    <div className="p-5 space-y-4">
                      {/* Badge Header Row */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-500 font-black text-sm tracking-wider rounded-lg uppercase">
                          <Car className="w-5 h-5" />
                          CAR-LIFT
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-pink-600">AED {req.amount}</span>
                          {/* <span className="text-[10px] text-slate-400 font-medium ml-0.5">/month</span> */}
                        </div>
                      </div>

                      {/* Explicit Route Connection Chain */}
                      <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-px before:border-l before:border-dashed before:border-slate-300">
                        {/* Pickup station point */}
                        <div className="relative">
                          <span className="absolute -left-5.75 top-0.5 w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-400 flex items-center justify-center" />
                          <p className="text-sm font-black text-slate-500 uppercase tracking-wide leading-none">PICKUP FROM</p>
                          <p className="text-base md:text-lg font-black text-slate-800 mt-1">{req.pickupLocation}</p>
                        </div>
                        {/* Dropoff destination point */}
                        <div className="relative">
                          <span className="absolute -left-5.75 top-0.5 w-3 h-3 rounded-full bg-pink-100 border-2 border-pink-500 flex items-center justify-center" />
                          <p className="text-sm font-black text-slate-500 uppercase tracking-wide leading-none">DROPOFF TO</p>
                          <p className="text-base md:text-lg font-black text-slate-800 mt-1">{req.dropoffLocation}</p>
                        </div>
                      </div>

                      {/* Boxes Grid Info Row */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400 font-bold uppercase leading-none">Schedule Time</p>
                            <p className="text-sm font-black text-slate-700 truncate mt-1">
                              {new Date(req.requestedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Jun 28
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                          <Car className="w-5 h-5 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400 font-bold uppercase leading-none">Preferred Vehicle</p>
                            <p className="text-sm font-black text-slate-700 truncate mt-1">{req.preferredCar}</p>
                          </div>
                        </div>
                      </div>

                      {/* Purpose Tag */}
                      <div className="flex items-center gap-1.5 text-base text-slate-500 font-medium">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                        <span>Purpose: <strong className="text-slate-800 font-bold">{req.purpose || 'Daily Office Commute'}</strong></span>
                      </div>
                    </div>

                    {/* Integrated Interactive User Verification Footer matching reference layout */}
                    <div className="bg-slate-50/60 border-t border-slate-100 p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 font-black text-base flex items-center justify-center shrink-0 border border-pink-100">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider leading-none">REQUESTED BY</p>
                          <div className="flex items-center gap-1 mt-1 min-w-0">
                            <p className="text-sm md:text-base font-black text-slate-800 truncate">{name || 'Traveler Account'}</p>
                            <span className="text-xs font-extrabold text-emerald-500 bg-emerald-50 px-1 rounded-sm shrink-0">Verified</span>
                          </div>
                        </div>
                      </div>

                      <a 
                        href={`https://wa.me/${dial}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="h-9 px-4 bg-[#00c767] hover:bg-[#00b05b] text-white rounded-xl flex items-center gap-1.5 text-sm font-black uppercase tracking-wider transition-colors shrink-0 shadow-xs shadow-emerald-500/10"
                      >
                        <SiWhatsapp className="w-4 h-4 fill-white text-transparent" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- STICKY MOBILE ACTIONS MENU BAR --- */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200/80 z-40 px-4 py-3 flex items-center justify-between shadow-2xl md:hidden">
        <button 
          onClick={() => {
            const el = document.getElementById('routes-matrix');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800"
        >
          <SlidersHorizontal className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-bold uppercase tracking-tight">Filters</span>
        </button>

        {/* Dynamic Launch Request modal pipeline action path button */}
        <button 
          onClick={() => setIsPostRequestOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-black tracking-wider uppercase shadow-xl flex items-center gap-1.5 transition-transform active:scale-95 transform -translate-y-2 border-4 border-white"
        >
          <Plus className="w-4 h-4 stroke-3" />
          <span>Car-lift Request</span>
        </button>

        <button 
          onClick={fetchLiveDirectory}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800"
        >
          <RefreshCw className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-bold uppercase tracking-tight">Reload</span>
        </button>
      </div>

      {/* --- POPUP DIALOG FORM MODAL: CREATE TRAVEL PASSENGER DEMAND --- */}
      {isPostRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl p-5 relative text-left animate-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black uppercase text-slate-800 tracking-wide">File Custom Passenger Demand</h3>
              <button onClick={() => setIsPostRequestOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 bg-slate-50">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePostRequestSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black uppercase text-slate-500 mb-1">Pickup Area</label>
                  <input type="text" required placeholder="e.g. Mussafah" value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase text-slate-500 mb-1">Dropoff Destination</label>
                  <input type="text" required placeholder="e.g. Al Maryah Island" value={form.dropoffLocation} onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase text-slate-500 mb-1">Departure Target Schedule</label>
                <input type="datetime-local" required value={form.requestedTime} onChange={(e) => setForm({ ...form, requestedTime: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
              </div>

              <div className="grid gap-3">
                {/* <div>
                  <label className="block text-sm font-black uppercase text-slate-500 mb-1">Preferred Car</label>
                  <input type="text" placeholder="e.g. Sedan (Toyota Camry)" value={form.preferredCar} onChange={(e) => setForm({ ...form, preferredCar: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
                </div> */}
                <div>
                  <label className="block text-sm font-black uppercase text-slate-500 mb-1">Offer Budget (AED)</label>
                  <input type="number" required placeholder="e.g. 250" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase text-slate-500 mb-1">Scope Purpose</label>
                <input type="text" placeholder="e.g. Shifting a sofa & 3 boxes" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-base outline-none focus:border-pink-500" />
              </div>

              {!isRegisteredUser ? (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-2">
                  <span className="text-sm font-black uppercase text-amber-800 flex items-center gap-1">
                    For the best experience and to be able to update, manage, and view your active request anytime, please first register your account.
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" required placeholder="Contact Name" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="w-full px-2.5 py-1.5 border bg-white rounded-lg text-base outline-none focus:border-amber-400" />
                    <input type="text" required placeholder="WhatsApp Contact" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="w-full px-2.5 py-1.5 border bg-white rounded-lg text-base outline-none focus:border-amber-400" />
                  </div>
                </div>
              ) : (
                <div className="text-base font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  ✓ Profile Mapping Active: Link direct to your authenticated account credentials (<span className="font-bold underline">{session?.user?.name}</span>).
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full py-3 mt-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-base uppercase tracking-wider disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? 'Processing Submission...' : 'Submit car-lift request'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}