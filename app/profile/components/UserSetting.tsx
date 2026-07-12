import React, { useState } from 'react';

interface UserSettingProps {
  userProfile: any;
  onUpdateProfile: (updated: any) => void;
}

export default function UserSetting({ userProfile, onUpdateProfile }: UserSettingProps) {
  const [form, setForm] = useState({ ...userProfile });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(form);
    alert('Profile layout updated successfully!');
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Profile Settings</h2>
        <p className="text-xs text-slate-400">Update account visibility data info parameters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
          <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full bg-slate-50 border px-4 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-[#F42A63] outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Mobile</label>
          <input type="text" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} className="w-full bg-slate-50 border px-4 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-[#F42A63] outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
          <input type="email" value={form.emailAddress} onChange={e => setForm({...form, emailAddress: e.target.value})} className="w-full bg-slate-50 border px-4 py-2.5 text-xs rounded-xl focus:ring-1 focus:ring-[#F42A63] outline-none" />
        </div>
        <button type="submit" className="w-full bg-[#F42A63] hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">Save Changes</button>
      </form>
    </div>
  );
}