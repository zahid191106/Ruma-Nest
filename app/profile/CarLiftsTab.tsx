// app/profile/CarLiftsTab.tsx
'use client'

import React, { useState } from 'react';
import { Plus, Car, Calendar, Users, Edit2, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
// Import the type we defined in your main dashboard file
import { CleanCarLiftSummary } from './ProfileDashboard';

// Export your props definition cleanly so TypeScript can map it in the parent routing panels
export interface CarLiftsTabProps {
  carLifts: CleanCarLiftSummary[];
  setCarLifts: React.Dispatch<React.SetStateAction<CleanCarLiftSummary[]>>;
}

export default function CarLiftsTab({ carLifts, setCarLifts }: CarLiftsTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ pickupLocation: '', dropoffLocation: '', startTime: '', monthlyFee: 0, seatsLeft: 4 });

  const startEditing = (lift: CleanCarLiftSummary) => {
    setEditingId(lift._id);
    setForm({
      pickupLocation: lift.pickupLocation,
      dropoffLocation: lift.dropoffLocation,
      startTime: lift.startTime,
      monthlyFee: lift.monthlyFee || 0,
      seatsLeft: lift.seatsLeft || 4
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await fetch('/api/carlifts/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liftId: editingId, ...form })
      });
      if (!response.ok) throw new Error();

      setCarLifts(prev => prev.map(c => c._id === editingId ? { ...c, ...form, isActive: false } : c));
      setEditingId(null);
      alert('Route saved! Visibility status returns to Pending Admin Approval.');
    } catch {
      alert('Error saving carLift document patch.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Car Lift Services</h2>
          <p className="text-slate-400 text-xs">Configure and display active carpooling routes or driver lists.</p>
        </div>
        <Link href="/upload-carlift" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
          <Plus className="w-4 h-4" />
          <span>Create Route</span>
        </Link>
      </div>

      {carLifts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No car lift listings configured.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carLifts.map(lift => (
            <div key={lift._id} className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1"><Car className="w-3 h-3" /> {lift.shiftType} Shift</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-md ${lift.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{lift.isActive ? 'Active' : 'Pending'}</span>
                </div>
                <div className="space-y-2 relative border-l-2 border-dashed border-slate-100 pl-4 ml-2.5 py-0.5">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Pickup Location</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{lift.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Dropoff Location</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{lift.dropoffLocation}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {lift.startTime}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {lift.seatsLeft} Seats Left</span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Fee</span>
                  <span className="text-sm font-black text-slate-900">AED {lift.monthlyFee}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {lift.driver?.isVerifiedDriver && (
                    <span title="Verified Driver">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </span>
                  )}
                  <button onClick={() => startEditing(lift)} className="p-2 bg-white border border-slate-200/70 rounded-xl text-slate-500 hover:bg-slate-50 shadow-xs transition"><Edit2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Car Lift Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border animate-in fade-in-50 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-900">Modify Route Information</h3>
              <button onClick={() => setEditingId(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Pickup Area</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Dropoff Area</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.dropoffLocation} onChange={e => setForm({...form, dropoffLocation: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Start Time</label>
                  <input type="text" required placeholder="e.g., 07:30 AM" className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Fee (AED)</label>
                  <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Seats Remaining</label>
                <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.seatsLeft} onChange={e => setForm({...form, seatsLeft: Number(e.target.value)})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Update Lift Parameters</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}