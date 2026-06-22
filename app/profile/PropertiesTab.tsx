'use client'

import React, { useState } from 'react';
import { Plus, MapPin, CheckCircle2, Clock, Edit2, X } from 'lucide-react';
import Link from 'next/link';

interface CleanListingSummary {
  _id: string;
  title: string;
  location: string;
  monthlyRent?: number;
  propertyType?: string;
  image?: string;
  isActive?: boolean;
}

interface PropertiesTabProps {
  properties: CleanListingSummary[];
  setProperties: React.Dispatch<React.SetStateAction<CleanListingSummary[]>>;
}

export default function PropertiesTab({ properties, setProperties }: PropertiesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', location: '', monthlyRent: 0, propertyType: 'Room' });

  const startEditing = (p: CleanListingSummary) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      location: p.location,
      monthlyRent: p.monthlyRent || 0,
      propertyType: p.propertyType || 'Room'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await fetch('/api/edit-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: editingId, ...form })
      });
      if (!response.ok) throw new Error();

      setProperties(prev => prev.map(p => p._id === editingId ? { ...p, ...form, monthlyRent: Number(form.monthlyRent), isActive: false } : p));
      setEditingId(null);
      alert('Listing updated safely! Status changed to Pending Review.');
    } catch {
      alert('Failed to save listing details.');
    }
  };

  return (
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
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-slate-400 text-xs">No properties posted yet.</div>
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
                  <button onClick={() => startEditing(p)} className="p-2 bg-white border rounded-xl hover:bg-slate-50 text-slate-500 border-slate-200/70 shadow-xs transition"><Edit2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border animate-in fade-in-50 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-900">Modify Listing Information</h3>
              <button onClick={() => setEditingId(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Property Title</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Property Location Area</label>
                <input type="text" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Monthly Rent (AED)</label>
                  <input type="number" required className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.monthlyRent} onChange={e => setForm({...form, monthlyRent: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Property Type</label>
                  <select className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                    <option value="Room">Room</option>
                    <option value="Bedspace">Bedspace</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[10px] text-amber-800">
                ⚠️ Saving changes shifts listing status visibility back to <strong>Pending Review</strong>.
              </div>
              <button type="submit" className="w-full bg-[#ff0055] text-white p-3 rounded-xl text-xs font-bold shadow-md hover:bg-pink-600 transition">Update Listing Attributes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}