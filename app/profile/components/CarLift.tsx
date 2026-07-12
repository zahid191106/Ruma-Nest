// profile/components/CarLift.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Car, Wallet, Briefcase } from 'lucide-react';
import { CarLiftService } from '@/types/user-dashboard';

interface CarLiftProps {
  carLifts: CarLiftService[];
  setCarLifts: React.Dispatch<React.SetStateAction<CarLiftService[]>>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

export default function CarLift({ carLifts, setCarLifts, loading, refreshData }: CarLiftProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [editingLift, setEditingLift] = useState<CarLiftService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core Structured Form State
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    requestedTime: '',
    preferredCar: '',
    purpose: '',
    amount: '',
    guestName: '',
    guestPhone: '',
  });

  const resetForm = () => {
    setFormData({
      pickupLocation: '',
      dropoffLocation: '',
      requestedTime: '',
      preferredCar: '',
      purpose: '',
      amount: '',
      guestName: '',
      guestPhone: '',
    });
  };

  const handleEditInit = (lift: CarLiftService) => {
    setEditingLift(lift);
    
    // Format input parameter compatibility securely (YYYY-MM-DDTHH:mm)
    let formattedTime = '';
    if (lift.requestedTime) {
      formattedTime = lift.requestedTime.substring(0, 16);
    }

    setFormData({
      pickupLocation: lift.pickupLocation,
      dropoffLocation: lift.dropoffLocation,
      requestedTime: formattedTime,
      preferredCar: lift.preferredCar,
      purpose: lift.purpose,
      amount: lift.amount.toString(),
      guestName: lift.guestUserDetails?.name || '',
      guestPhone: lift.guestUserDetails?.phoneNumber || '',
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this car lift request?')) return;
    try {
      const res = await fetch(`/api/carlift/${id}`, { method: 'DELETE' });
      
      const rawText = await res.text();
      if (!rawText || rawText.trim() === '') {
        setCarLifts((prev) => prev.filter((l) => l._id !== id));
        await refreshData();
        return;
      }

      const data = JSON.parse(rawText);
      if (data.success) {
        setCarLifts((prev) => prev.filter((l) => l._id !== id));
        await refreshData();
      }
    } catch (err) {
      console.error('Delete execution flow error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      requestedTime: new Date(formData.requestedTime).toISOString(),
      preferredCar: formData.preferredCar || 'Any Car',
      purpose: formData.purpose || 'General Commute',
      amount: Number(formData.amount),
      guestName: formData.guestName || undefined,
      guestPhone: formData.guestPhone || undefined,
    };

    try {
      const url = editingLift ? `/api/carlift/${editingLift._id}` : '/api/carlift';
      const method = editingLift ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      const data = rawText && rawText.trim() !== '' ? JSON.parse(rawText) : { success: true };

      if (data.success) {
        // 🚀 Optimistically update UI array state directly to reflect changes instantenously
        if (editingLift) {
          setCarLifts((prevLifts) =>
            prevLifts.map((lift) =>
              lift._id === editingLift._id
                ? {
                    ...lift,
                    pickupLocation: payload.pickupLocation,
                    dropoffLocation: payload.dropoffLocation,
                    requestedTime: payload.requestedTime,
                    preferredCar: payload.preferredCar,
                    purpose: payload.purpose,
                    amount: payload.amount,
                    isActive: false, // Reset view flag to pending approval state locally
                  }
                : lift
            )
          );
        }

        setEditingLift(null);
        resetForm();
        setActiveTab('view');
        
        // Background sync checks
        await refreshData();
      } else {
        alert(data.error || 'Operation failed execution.');
      }
    } catch (err) {
      console.error('Submission processing failure:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500 animate-pulse text-sm font-medium">Loading car-lift logs matrix...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Navigation Tabs Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => { setActiveTab('view'); setEditingLift(null); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'view' && !editingLift ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            My Commute Requests ({carLifts.length})
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('create'); setEditingLift(null); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {editingLift ? '🔧 Edit Request Parameters' : '+ Request Car Lift'}
          </button>
        </div>
      </div>

      {/* 🟢 VIEW GRID MODE */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carLifts.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border p-8 text-center text-gray-500 text-sm italic">
              No active car lift route requests found under your profile.
            </div>
          ) : (
            carLifts.map((lift) => (
              <div key={lift._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-wide">
                      AED {lift.amount.toLocaleString()} Offered
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${lift.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                      {lift.isActive ? 'Live' : 'Pending Review'}
                    </span>
                  </div>

                  {/* Route information segments */}
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium flex items-center gap-2 text-gray-800">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs text-gray-400 font-normal w-12">From:</span> {lift.pickupLocation}
                    </div>
                    <div className="text-sm font-medium flex items-center gap-2 text-gray-800">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs text-gray-400 font-normal w-12">To:</span> {lift.dropoffLocation}
                    </div>
                  </div>

                  {/* Parameters Metadata Layout Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate">{lift.requestedTime ? new Date(lift.requestedTime).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'}) : 'Flexible'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded">
                      <Car className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate font-medium">{lift.preferredCar}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded col-span-2">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate font-medium">Purpose: {lift.purpose}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-4">
                  <button type="button" onClick={() => handleEditInit(lift)} className="text-xs bg-gray-900 hover:bg-black text-white font-semibold px-3 py-1.5 rounded-lg transition">
                    Edit Parameters
                  </button>
                  <button type="button" onClick={() => handleDelete(lift._id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔵 FORM INPUT MODE */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-sm">
          <h3 className="text-md font-bold text-gray-900">{editingLift ? 'Update Route Parameters' : 'Post New Lift Request'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">Pickup Point Location Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required placeholder="e.g., Mussafah, City Sector" value={formData.pickupLocation} onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">Drop-off Destination Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required placeholder="e.g., Al Reem Island, Sky Towers" value={formData.dropoffLocation} onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">Requested Departure Time & Date *</label>
              <input type="datetime-local" required value={formData.requestedTime} onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">Offered Fare Amount (AED) *</label>
              <div className="relative">
                <Wallet className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="number" required placeholder="e.g., 600" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">Purpose of Commute Journey</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="e.g., Shifting Sofa and 3 boxes" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={() => { setActiveTab('view'); setEditingLift(null); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50">
              {isSubmitting ? 'Processing...' : editingLift ? 'Update Parameters' : 'Publish Request'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}