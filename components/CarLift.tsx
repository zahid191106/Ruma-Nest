'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createClient } from '@sanity/client';
import { 
  Car, 
  ArrowRight, 
  Plus, 
  Check, 
  X, 
  Clock, 
  User, 
  ShieldCheck, 
  Briefcase, 
  UserMinus, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

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

export default function Carlift() {
  // 1. Hook into NextAuth Client Session
  const { data: session, status } = useSession();
  const isRegisteredUser = status === 'authenticated';

  // 2. Component Layout & Form States
  const [requests, setRequests] = useState<CarLiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // New loader state
  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  // 3. Live Board Data Fetch (Filters: Active & User Verified, max 2 records)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "carLift" && isActive == true && userVerified == true][0...2]{
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
      console.error('Error fetching car lift requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 4. Submit Mutation to Next.js API Route
  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); // Trigger button loading layout
    
    // Extract info dynamically based on current user schema profiles
    const registeredName = (session?.user as any)?.name || '';
    const registeredPhone = (session?.user as any)?.whatsappNumber || '';

    const payload = {
      pickupLocation: form.pickupLocation,
      dropoffLocation: form.dropoffLocation,
      requestedTime: new Date(form.requestedTime).toISOString(),
      preferredCar: form.preferredCar || 'Any Car',
      purpose: form.purpose || 'General Commute',
      amount: form.amount,
      // Pass user attributes if registered, fallback to guest inputs if not
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
        // Clear input states
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
        showToast('Your request has been saved! It will appear publicly once approved by admin.');
        fetchRequests(); // Re-trigger live board sync
      } else {
        alert(resData.error || 'Submission error occurred.');
      }
    } catch (error) {
      console.error('API submission failed:', error);
      alert('An unexpected error occurred while communicating with the backend API.');
    } finally {
      setSubmitting(false); // Stop button loading state
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="w-full container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-6">

        {/* Dynamic Status Toast Notification */}
        {successToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Check className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Dynamic Registration Warning Notice (Shows when user is unregistered) */}
        {!isRegisteredUser && status !== 'loading' && (
          <div className="w-full bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start gap-3 shadow-xs text-left animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm uppercase tracking-wide">Account Experience Notice</p>
              <p className="text-xs sm:text-sm text-amber-800 mt-0.5 font-medium">
                For the best experience and to be able to update, manage, and view your active request anytime, please first register your account.
              </p>
            </div>
          </div>
        )}

        {/* Header Block Row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0a3d62]">
              <Car className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider text-pink-600 uppercase">
              CAR LIFT REQUESTS <span className="text-slate-400 font-normal mx-1">—</span> <span className="text-slate-600 font-bold">PASSENGER DEMAND BOARD</span>
            </h2>
          </div>
          
          <Link 
            href="/car-lifts"
            className="flex items-center gap-1 text-xs sm:text-sm font-black text-[#ff0066] hover:text-[#e6005c] transition-colors"
          >
            <span>View All Needs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main Content Layout Structure */}
        <div className="grid grid-cols-1 gap-5 items-stretch">
          <div className="relative overflow-hidden bg-linear-to-br from-[#fff5f8]/50 to-[#fff0f4]/80 border-2 border-pink-100 rounded-3xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            
            {/* Dynamic Request List Stream Grid */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
              {loading ? (
                <div className="col-span-2 py-12 text-center text-sm font-bold text-slate-400">Syncing live database updates...</div>
              ) : requests.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-sm font-bold text-slate-400">No approved, active user-verified car lifts found.</div>
              ) : (
                requests.map((req) => {
                  const isReg = !!req.registeredUser;
                  const nameToDisplay = isReg ? req.registeredUser?.name : req.guestUserDetails?.name;
                  const phoneToCall = isReg ? req.registeredUser?.whatsappNumber : req.guestUserDetails?.phoneNumber;

                  return (
                    <div key={req._id} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                      <div>
                        {/* Route Mapping Area */}
                        <div className="flex items-center justify-between font-extrabold text-[#0a192f] text-xs sm:text-sm">
                          <span className="truncate text-pink-600">{req.pickupLocation}</span>
                          <span className="text-rose-500 px-1">➔</span>
                          <span className="truncate text-pink-600">{req.dropoffLocation}</span>
                        </div>

                        {/* Specification Badges Container */}
                        <div className="mt-3 space-y-1.5 text-slate-500 text-xs font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{new Date(req.requestedTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Car Type: {req.preferredCar}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Purpose: {req.purpose}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Info Area */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            {isReg ? <User className="w-3.5 h-3.5" /> : <UserMinus className="w-3.5 h-3.5 text-amber-600" />}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 leading-tight truncate max-w-28">{nameToDisplay || 'Guest User'}</p>
                            {req.userVerified && <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5 mt-0.5">Verified Check ✓</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-pink-600 font-black text-xs sm:text-sm">AED {req.amount}</p>
                        </div>
                      </div>

                      {/* Communication CTA action path */}
                      <a 
                        href={`https://wa.me/${phoneToCall}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full h-8 mt-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors"
                      >
                        Fulfill Lift Need
                      </a>
                    </div>
                  );
                })
              )}
            </div>

            {/* Prompt Action Callout Box */}
            <div className="md:col-span-4 px-3 py-5 flex flex-col justify-between border border-blue-50/50 min-h-45 relative overflow-hidden group">
              <div className="space-y-2 z-10 text-left">
                <h3 className="text-base sm:text-lg font-black text-pink-600 uppercase">I Need a Lift</h3>
                <p className="text-sm font-semibold text-slate-500 leading-tight">
                  No vehicle? Broadcast your timing configurations, locations, and desired monthly budget targets straight into our system board.
                </p>
              </div>
              <button 
                onClick={() => setIsPostRequestOpen(true)} 
                className="w-full md:w-auto h-11 px-5 mt-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs cursor-pointer font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-md z-10 self-start transition-transform active:scale-98"
              >
                <Plus className="w-4 h-4 stroke-3" />
                <span>POST A NEED</span>
              </button>

              {/* <img src="/images/car-2.avif" alt="Car Lift Prompt" className='absolute -right-10 -bottom-5' /> */}
            </div>

            <img src="/images/car-3.webp" alt="Car Lift Prompt" className='absolute -bottom-22 sm:-bottom-42 animate-car-move will-change-transform' />
          </div>
        </div>
      </div>

      {/* POPUP USER POSTING MODAL DIALOG CONTAINER */}
      {isPostRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 relative my-8 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800">Request Custom Car Lift</h3>
              <button onClick={() => setIsPostRequestOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Pickup From</label>
                  <input type="text" required placeholder="e.g. Mussafah" value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Dropoff To</label>
                  <input type="text" required placeholder="e.g. Yas Island" value={form.dropoffLocation} onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Requested Departure Date & Time</label>
                <input type="datetime-local" required value={form.requestedTime} onChange={(e) => setForm({ ...form, requestedTime: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Car type</label>
                  <input type="text" placeholder="e.g. Sedan, SUV" value={form.preferredCar} onChange={(e) => setForm({ ...form, preferredCar: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Offer Budget (AED/month)</label>
                  <input type="number" required min="0" placeholder="e.g. 300" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Purpose of Travel</label>
                <input type="text" placeholder="e.g. Daily office commute" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
              </div>

              {/* PROFILE INPUTS HIDDEN AUTOMATICALLY FOR REGISTERED SESSIONS */}
              {!isRegisteredUser ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-3 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Guest Contact Verification</span>
                  <div className="space-y-2">
                    <input type="text" required placeholder="Your Full Name" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs outline-none" />
                    <input type="text" required placeholder="WhatsApp Phone (e.g. 971501234567)" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="w-full px-3 py-1.5 border bg-white rounded-lg text-xs outline-none" />
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl animate-in fade-in duration-200">
                  ✓ Verified: Posting through your profile parameters (<span className="underline">{session?.user?.name || 'Registered Account'}</span>). Your account name and verified number are mapped securely behind the scenes.
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit car-lift request</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}