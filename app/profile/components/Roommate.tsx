// profile/components/Roommate.tsx
'use client';

import React, { useState } from 'react';
import { Home, MapPin, Users, DollarSign, Calendar, MessageSquare, Plus, X, Image as ImageIcon, User2 } from 'lucide-react';
import { RoommateProfile } from '@/types/user-dashboard';

interface RoommateProps {
  roommates: RoommateProfile[];
  setRoommates: React.Dispatch<React.SetStateAction<RoommateProfile[]>>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

export default function Roommate({ roommates, setRoommates, loading, refreshData }: RoommateProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [editingListing, setEditingListing] = useState<RoommateProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State Configurations
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    gender: 'men',
    nationality: '',
    freeSpace: '1',
    priceAmount: '',
    billingCycle: 'monthly',
    moveIn: 'immediately',
    whatsappNumber: '',
    status: 'available',
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      gender: 'men',
      nationality: '',
      freeSpace: '1',
      priceAmount: '',
      billingCycle: 'monthly',
      moveIn: 'immediately',
      whatsappNumber: '',
      status: 'available',
    });
    setAmenitiesList([]);
    setSelectedFiles([]);
    setEditingListing(null);
  };

  const handleEditInit = (listing: RoommateProfile) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      location: listing.location,
      gender: listing.gender,
      nationality: listing.nationality || '',
      freeSpace: listing.freeSpace.toString(),
      priceAmount: listing.price?.amount?.toString() || '',
      billingCycle: listing.price?.billingCycle || 'monthly',
      moveIn: listing.moveIn,
      whatsappNumber: listing.whatsappNumber,
      status: listing.status,
    });
    setAmenitiesList(listing.amenities || []);
    setSelectedFiles([]); 
    setActiveTab('create');
  };

  const handleAddAmenity = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && amenityInput.trim()) {
      e.preventDefault();
      if (!amenitiesList.includes(amenityInput.trim())) {
        setAmenitiesList([...amenitiesList, amenityInput.trim()]);
      }
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setAmenitiesList(amenitiesList.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      const res = await fetch(`/api/roommate/${id}`, { method: 'DELETE' });
      const rawText = await res.text();
      const data = rawText ? JSON.parse(rawText) : { success: true };

      if (data.success) {
        setRoommates((prev) => prev.filter((r) => r._id !== id));
        await refreshData();
      }
    } catch (err) {
      console.error('Deletion error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingListing) {
        // 🟡 EDIT OPERATION (JSON Content Injection)
        const payload = {
          title: formData.title,
          location: formData.location,
          gender: formData.gender as "men" | "female" | "couple", // 👈 Explicit literal cast fix
          freeSpace: Number(formData.freeSpace),
          priceAmount: Number(formData.priceAmount),
          billingCycle: formData.billingCycle,
          moveIn: formData.moveIn,
          whatsappNumber: formData.whatsappNumber,
          nationality: formData.nationality,
          status: formData.status as "available" | "rented",     // 👈 Explicit literal cast fix
          amenities: amenitiesList,
        };

        const res = await fetch(`/api/roommate/${editingListing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          // 🚀 Optimistic update to reflect edits immediately in a strict type-safe environment
          setRoommates((prev) =>
            prev.map((r) =>
              r._id === editingListing._id
                ? ({
                    ...r,
                    title: payload.title,
                    location: payload.location,
                    gender: payload.gender,
                    freeSpace: payload.freeSpace,
                    moveIn: payload.moveIn,
                    whatsappNumber: payload.whatsappNumber,
                    nationality: payload.nationality,
                    status: payload.status,
                    amenities: payload.amenities,
                    price: { 
                      amount: payload.priceAmount, 
                      billingCycle: payload.billingCycle as "monthly" | "weekly" // Explicit literal cast fix
                    },
                    isActive: false, // Reset view flag to pending moderation state locally
                  } as RoommateProfile) // Explicit type assertion fixes structural inheritance check errors
                : r
            )
          );
        }
      } else {
        // 🟢 POST NEW ENTRY OPERATION (Multipart Form Data payload streaming)
        const multiform = new FormData();
        multiform.append('title', formData.title);
        multiform.append('location', formData.location);
        multiform.append('gender', formData.gender);
        multiform.append('freeSpace', formData.freeSpace);
        multiform.append('priceAmount', formData.priceAmount);
        multiform.append('billingCycle', formData.billingCycle);
        multiform.append('moveIn', formData.moveIn);
        multiform.append('whatsappNumber', formData.whatsappNumber);
        multiform.append('nationality', formData.nationality);

        amenitiesList.forEach((amenity) => multiform.append('amenities', amenity));
        selectedFiles.forEach((file) => multiform.append('images', file));

        const res = await fetch('/api/roommate', {
          method: 'POST',
          body: multiform,
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Creation failed');
      }

      resetForm();
      setActiveTab('view');
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Workflow operation failure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500 animate-pulse text-sm font-medium">Synchronizing roommate profiles...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => { setActiveTab('view'); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'view' && !editingListing ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Shared Accommodation Listings ({roommates.length})
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('create'); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {editingListing ? '🔧 Edit Shared Layout' : '+ Post Ad Space'}
          </button>
        </div>
      </div>

      {/* 🟢 VIEW CARDS SECTION */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roommates.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border p-8 text-center text-gray-500 text-sm italic">
              No shared room or bedspace posts found under your cloud directory.
            </div>
          ) : (
            roommates.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-pink-600 text-sm md:text-lg line-clamp-1">{item.title}</h4>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full font-semibold text-xs ${item.status === 'available' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status === 'available' ? 'Available' : 'Filled'}
                    </span>
                  </div>

                  <div className="text-base font-semibold text-purple-600 flex items-center gap-1">
                    AED {item.price?.amount?.toLocaleString()} <span className="text-sm text-gray-600 font-normal">/ {item.price?.billingCycle}</span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-sm text-gray-600 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className='flex items-center gap-2'>
                        <Users className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="capitalize">Preference: {item.gender} Only ({item.freeSpace} slots)</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Users className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="capitalize">Nationality: {item.nationality}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>Move-in: <span className="font-medium text-gray-800">{item.moveIn.replace('_', ' ')}</span></span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.amenities?.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-medium">
                        {amenity}
                      </span>
                    ))}
                    {item.amenities?.length > 4 && (
                      <span className="text-[10px] text-gray-400 self-center pl-1">+{item.amenities.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-4">
                  <button type="button" onClick={() => handleEditInit(item)} className="text-xs bg-gray-900 hover:bg-black text-white font-semibold px-3 py-1.5 rounded-lg transition">
                    Edit Parameters
                  </button>
                  <button type="button" onClick={() => handleDelete(item._id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔵 POST / EDIT FORM MODE */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-sm">
          <h3 className="text-md font-bold text-gray-900">{editingListing ? 'Modify Listing Metrics' : 'Publish Share Listing'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Title *</label>
              <div className="relative">
                <Home className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required minLength={4} maxLength={80} placeholder="e.g., Luxury Bedspace near Metro Terminal" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Location Zone Area *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required placeholder="e.g., Dubai Marina, Al Barsha" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">WhatsApp Contact (With Country Code) *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required placeholder="e.g., +971500000000" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price Value (AED) *</label>
              <input type="number" required min="1" placeholder="Amount" value={formData.priceAmount} onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Billing Cycle Setup *</label>
              <select value={formData.billingCycle} onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Gender Matching Priority *</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="men">Men Only</option>
                <option value="female">Females Only</option>
                <option value="couple">Couples Allowed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Available Free Spaces *</label>
              <select value={formData.freeSpace} onChange={(e) => setFormData({ ...formData, freeSpace: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Move-In Availability Timeline *</label>
              <select value={formData.moveIn} onChange={(e) => setFormData({ ...formData, moveIn: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="immediately">Immediately</option>
                <option value="1_week">Within 1 Week</option>
                <option value="2_weeks">Within 2 Weeks</option>
                <option value="next_month">Next Month</option>
              </select>
            </div>

            {editingListing && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Status *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                  <option value="available">Available</option>
                  <option value="rented">Rented / Filled</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nationality *</label>
              <div className="relative">
                <User2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" required placeholder="Enter Your Nationality" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            {/* Amenities Tag Tokenizer */}
            <div className="">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amenities (Type item & hit Enter) *</label>
              <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={handleAddAmenity} placeholder="e.g., Free Wi-Fi, Balcony, Gym" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {amenitiesList.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 font-medium">
                    {tag}
                    <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-blue-500 hover:text-blue-800"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Media Image Handler (Only enabled during initial creation) */}
            {!editingListing && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Property Media Images *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input type="file" multiple accept="image/*" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                  <p className="text-xs font-medium text-gray-600">Click to upload image asset files</p>
                  {selectedFiles.length > 0 && (
                    <p className="text-xs text-blue-600 font-semibold mt-1">{selectedFiles.length} files staged for upload</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={() => { setActiveTab('view'); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || (!editingListing && selectedFiles.length === 0)} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50">
              {isSubmitting ? 'Processing Content Upload...' : editingListing ? 'Update Parameters' : 'Publish Ad Post'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}