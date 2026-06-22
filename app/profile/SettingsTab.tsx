// app/profile/SettingsTab.tsx
'use client'

import React, { useState } from 'react';
import { User, Phone, CheckCircle, ShieldAlert } from 'lucide-react';

interface SanityUserDataState {
  name: string;
  email: string;
  whatsappNumber: string;
  role: string;
  isActive: boolean;
}

interface SettingsTabProps {
  userData: SanityUserDataState;
  setUserData: React.Dispatch<React.SetStateAction<SanityUserDataState>>;
  avatarUrl: string;
}

export default function SettingsTab({ userData, setUserData, avatarUrl }: SettingsTabProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMessage('');

    const payload = new FormData();
    payload.append('name', userData.name);
    payload.append('whatsappNumber', userData.whatsappNumber);
    payload.append('role', userData.role);
    
    const fileInput = document.getElementById('avatarFileInput') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      payload.append('avatarFile', fileInput.files[0]);
    }

    try {
      const res = await fetch('/api/user/update-profile', { method: 'POST', body: payload });
      if (!res.ok) throw new Error();
      setSaveMessage('✅ Profile updated! Verification resets to Pending.');
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setSaveMessage('❌ Profile update failed.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6 mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Account Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Keep your standard verification records and metrics fully current.</p>
        </div>
        <div>
          {userData.isActive ? (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-100">
              <CheckCircle className="w-3 h-3" /> Verified Account
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border border-amber-100">
              <ShieldAlert className="w-3 h-3" /> Unverified
            </span>
          )}
        </div>
      </div>

      {saveMessage && <div className="p-3 text-xs font-bold rounded-xl border bg-slate-50">{saveMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
          <img src={avatarUrl} alt="" className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#ff0055]" />
          <div>
            <h4 className="text-xs font-bold text-slate-700">Profile Picture</h4>
            <input type="file" id="avatarFileInput" accept="image/*" className="text-xs mt-2 text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[#ff0055]/10 file:text-[#ff0055] hover:file:bg-[#ff0055]/20 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> Full Name</label>
            <input type="text" required className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-hidden" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> Email Address (Read-only)</label>
            <input type="email" disabled className="w-full mt-1 p-3 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed focus:outline-hidden" value={userData.email} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> WhatsApp Contact</label>
            <input type="text" required placeholder="971501234567" className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-hidden" value={userData.whatsappNumber} onChange={e => setUserData({...userData, whatsappNumber: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Role</label>
            <select className="w-full mt-1 p-3 bg-slate-50/40 border border-slate-200/80 rounded-xl text-xs font-semibold bg-white focus:outline-hidden" value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
              <option value="user">Standard User</option>
              <option value="driver">Verified Driver</option>
              <option value="landlord">Landlord / Agent</option>
            </select>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-[11px] text-amber-800 leading-relaxed">
          ⚠️ Updating core credentials automatically resets your <code>isActive</code> account verification status status check.
        </div>

        <button type="submit" disabled={saveLoading} className="w-full bg-slate-900 text-white p-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer shadow-xs">
          {saveLoading ? 'Processing Updates...' : 'Save Configuration Parameters'}
        </button>
      </form>
    </div>
  );
}