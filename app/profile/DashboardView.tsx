// profile/dashboardview.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SideBar from './components/SideBar';
import Header from './components/Header';
import Property from './components/Property';
import CarLift from './components/CarLift';

// Import our centralized type configurations
import { PropertyListing, CarLiftService, RoommateProfile } from '@/types/user-dashboard';

export default function DashboardView() {
  // Responsive sheet drawer visibility trackers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Navigation tracker across subpanels
  const [activeTab, setActiveTab] = useState<'property' | 'carlift' | 'roommate' | 'setting'>('property');
  
  // --- STATE MANAGEMENT ---
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [carLifts, setCarLifts] = useState<CarLiftService[]>([]);
  const [loadingCarLifts, setLoadingCarLifts] = useState(true);

  // --- ASYNC API HYDRATION FETCHERS ---
  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true);
      const res = await fetch('/api/property');
      const data = await res.json();
      if (data.success) {
        setProperties(data.data || []);
      }
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
      
      if (!res.ok) {
        console.error(`Server returned error status: ${res.status}`);
        return;
      }

      // Guard checking: Read raw text first to guarantee it isn't an empty payload block
      const rawText = await res.text();
      if (!rawText || rawText.trim() === '') {
        console.warn('Server returned an empty body response.');
        setCarLifts([]);
        return;
      }

      const data = JSON.parse(rawText);
      if (data.success) {
        setCarLifts(data.data || []);
      }
    } catch (err) {
      console.error('Error loading car-lift data assets securely:', err);
    } finally {
      setLoadingCarLifts(false);
    }
  }, []);

  // Synchronize data fetching lifecycle hooks on initialization
  useEffect(() => {
    fetchProperties();
    fetchCarLifts();
  }, [fetchProperties, fetchCarLifts]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden text-gray-900 font-sans">
      
      {/* 1. Header spans the entire top row */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      {/* 2. Horizontal layout container under Header */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        
        {/* Sidebar sits under header on the left hand panel */}
        <SideBar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Dynamic Inner Component Screen Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'property' && (
            <Property 
              properties={properties} 
              setProperties={setProperties} 
              loading={loadingProperties} 
              refreshData={fetchProperties} 
            />
          )}

          {activeTab === 'carlift' && (
            <CarLift 
              carLifts={carLifts} 
              setCarLifts={setCarLifts} 
              loading={loadingCarLifts} 
              refreshData={fetchCarLifts} 
            />
          )}

          {activeTab === 'roommate' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">🤝 Roommate Finder Dashboard</h2>
              <p className="text-sm text-gray-500">Connected state data structure initialized. Ready to drop in UI.</p>
            </div>
          )}

          {activeTab === 'setting' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">⚙️ User Account Settings</h2>
              <p className="text-sm text-gray-500">Global account preference modules ready to bind configuration variables.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}