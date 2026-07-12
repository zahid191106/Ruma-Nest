import React from 'react';
import { UserCheck, MapPin } from 'lucide-react';

export default function Roommate() {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 text-center">
      <div className="w-12 h-12 bg-rose-50 text-[#F42A63] rounded-full flex items-center justify-center mx-auto">
        <UserCheck className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">Roommate Matching Preferences</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Set up your profile timeline, lifestyle preferences, and matching preferences here.</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-dashed">
        Preferences are currently synchronized with dashboard settings.
      </div>
    </div>
  );
}