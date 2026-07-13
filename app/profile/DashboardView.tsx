// profile/dashboardview.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SideBar from './components/SideBar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Property from './components/Property';
import CarLift from './components/CarLift';
import Roommate from './components/Roommate'; 
import UserSetting from './components/UserSetting'; 

// Centralized relative interfaces mapping references
import { PropertyListing, CarLiftService, RoommateProfile, UserProfileData } from '@/types/user-dashboard';

export default function DashboardView() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Defaulting activeTab to 'dashboard' to utilize your overview mini-lists
  const [activeTab, setActiveTab] = useState<'dashboard' | 'property' | 'carlift' | 'roommate' | 'setting'>('dashboard');
  
  // --- SUBPANEL CONTEXTUAL HUD STATE ENTRIES ---
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [carLifts, setCarLifts] = useState<CarLiftService[]>([]);
  const [loadingCarLifts, setLoadingCarLifts] = useState(true);

  const [roommates, setRoommates] = useState<RoommateProfile[]>([]);
  const [loadingRoommates, setLoadingRoommates] = useState(true);

  // 🚀 CACHED USER LIFTOUT CONTROLS
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- REFRESH ACTION DATA HYDRATORS ---
  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true);
      const res = await fetch('/api/property');
      const data = await res.json();
      if (data.success) setProperties(data.data || []);
    } catch (err) {
      console.error('Error fetching global property records:', err);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchCarLifts = useCallback(async () => {
    try {
      setLoadingCarLifts(true);
      const res = await fetch('/api/carlift');
      if (!res.ok) return;
      const rawText = await res.text();
      if (!rawText) return;
      const data = JSON.parse(rawText);
      if (data.success) setCarLifts(data.data || []);
    } catch (err) {
      console.error('Error loading car-lift data assets securely:', err);
    } finally {
      setLoadingCarLifts(false);
    }
  }, []);

  const fetchRoommates = useCallback(async () => {
    try {
      setLoadingRoommates(true);
      const res = await fetch('/api/roommate');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setRoommates(data.data || []);
    } catch (err) {
      console.error('Roommate service network mapping failure:', err);
    } finally {
      setLoadingRoommates(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch('/api/user');
      const data = await res.json();
      if (data.success) setProfile(data.data || null);
    } catch (err) {
      console.error('Error loading profile context metadata:', err);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // Sync state maps systematically on viewport loading initialization sequences
  useEffect(() => {
    fetchProperties();
    fetchCarLifts();
    fetchRoommates();
    fetchProfile();
  }, [fetchProperties, fetchCarLifts, fetchRoommates, fetchProfile]);

  // --- ACTIONS HANDLERS FOR THE OVERVIEW DASHBOARD SUBPANEL ---
  const handleTogglePropertyStatus = async (id: string) => {
    try {
      // Optimistic state toggle updates local layout seamlessly
      setProperties(prev => 
        prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p)
      );
      
      // Update Sanity backend configuration node matrix
      await fetch(`/api/property/${id}/toggle`, { method: 'POST' });
    } catch (err) {
      console.error('Failed syncing property toggle stream:', err);
      fetchProperties(); // Revert back state securely on network drops
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      setProperties(prev => prev.filter(p => p._id !== id));
      await fetch(`/api/property/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed listing mutation delete request:', err);
      fetchProperties();
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      // Future framework placeholder vector for profile bookmark collections logic mappings
      console.log('Remove listing target reference from account favorites bundle:', id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* Dynamic Header Hydration */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} userProfile={profile} />

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Navigation Sidebar Drawer Panel */}
        <SideBar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={profile}
              properties={properties} 
              carLifts={carLifts}
              roommates={roommates}
              onOpenTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* Module-Specific Data Streams */}
          {activeTab === 'property' && (
            <Property properties={properties} setProperties={setProperties} loading={loadingProperties} refreshData={fetchProperties} />
          )}

          {activeTab === 'carlift' && (
            <CarLift carLifts={carLifts} setCarLifts={setCarLifts} loading={loadingCarLifts} refreshData={fetchCarLifts} />
          )}

          {activeTab === 'roommate' && (
            <Roommate roommates={roommates} setRoommates={setRoommates} loading={loadingRoommates} refreshData={fetchRoommates} />
          )}

          {/* User Settings Module Instance */}
          {activeTab === 'setting' && (
            <UserSetting profile={profile} loading={loadingProfile} refreshData={fetchProfile} />
          )}
        </main>
      </div>
    </div>
  );
}