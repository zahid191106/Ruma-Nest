// profile/components/UserSetting.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Camera, Edit2, Check, X, Loader2 } from 'lucide-react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { UserProfileData } from '@/types/user-dashboard';

// Initialize the official Sanity image helper builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface UserSettingProps {
  profile: UserProfileData | null;
  loading: boolean;
  refreshData: () => Promise<void>;
}

export default function UserSetting({ profile, loading, refreshData }: UserSettingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [role, setRole] = useState('user');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Sync state values when the parent component updates or populates data arrays
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setWhatsappNumber(profile.whatsappNumber || '');
      setRole(profile.role || 'user');
      if (profile.avatar?.asset?._ref) {
        setAvatarPreview(urlFor(profile.avatar).width(400).height(400).url());
      } else {
        setAvatarPreview(null);
      }
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setWhatsappNumber(profile.whatsappNumber || '');
      setRole(profile.role || 'user');
      setAvatarPreview(profile.avatar?.asset?._ref ? urlFor(profile.avatar).width(400).height(400).url() : null);
    }
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('whatsappNumber', whatsappNumber);
      formData.append('role', role);
      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      const res = await fetch('/api/user', {
        method: 'PATCH',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');

      setIsEditing(false);
      setAvatarFile(null);
      await refreshData(); // Triggers global parent reload context update hook execution
    } catch (err: any) {
      alert(err.message || 'Failed to sync update profiles.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm font-medium text-gray-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        Synchronizing profile metadata directory...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-32 bg-linear-to-r from-pink-600 to-purple-700 relative" />

      <form onSubmit={handleSubmit} className="p-6 md:p-8 relative pt-0">
        <div className="relative -mt-25 mb-6 inline-block group">
          <div className="w-60 h-40 rounded-2xl bg-white p-1 shadow-md border border-gray-100 overflow-hidden">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="Profile Avatar" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
                <User className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </div>
          
          {isEditing && (
            <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200">
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Upload</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="mb-6 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-pink-600">{profile?.name || 'User Account'}</h2>
            <p className="text-xs text-white font-semibold uppercase tracking-wider mt-0.5 px-2 py-0.5 bg-purple-500 rounded inline-block">
              {profile?.role || 'Standard User'}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-semibold px-4 py-2 rounded-xl transition"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-pink-600" />
              <input
                type="text"
                required
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-pink-400 rounded-xl text-base focus:ring-1 focus:ring-pink-600 focus:outline-none disabled:bg-pink-50 disabled:text-pink-600 disabled:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-pink-600" />
              <input
                type="email"
                required
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-pink-400 rounded-xl text-base focus:ring-1 focus:ring-pink-600 focus:outline-none disabled:bg-pink-50 disabled:text-pink-600 disabled:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-pink-600" />
              <input
                type="text"
                disabled={!isEditing}
                placeholder="e.g., 971501234567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-pink-400 rounded-xl text-base focus:ring-1 focus:ring-pink-600 focus:outline-none disabled:bg-pink-50 disabled:text-pink-600 disabled:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Account Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 h-5 w-5 text-pink-600" />
              <select
                disabled={!isEditing}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-pink-400 rounded-xl text-base focus:ring-1 focus:ring-pink-600 focus:outline-none disabled:bg-pink-50 disabled:text-pink-600 disabled:border-transparent font-medium appearance-none"
              >
                <option value="user">Standard User</option>
                <option value="driver">Verified Driver</option>
                <option value="landlord">Landlord / Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 mt-6 animate-fadeIn">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-semibold px-5 py-2 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}