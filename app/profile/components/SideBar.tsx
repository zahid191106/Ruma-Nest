// profile/components/SideBar.tsx
'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Building, Car, BedIcon, User, LogOut, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'dashboard' | 'property' | 'carlift' | 'roommate' | 'setting';
  setActiveTab: (tab: 'dashboard' | 'property' | 'carlift' | 'roommate' | 'setting') => void;
}

export default function SideBar({ isOpen, onClose, activeTab, setActiveTab }: SideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mapped cleanly to match lower-case router state tags in parent view controller
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'property', name: 'My Properties', icon: Building },
    { id: 'carlift', name: 'My Car Lifts', icon: Car },
    { id: 'roommate', name: 'Roommate Finder', icon: BedIcon },
    { id: 'setting', name: 'Profile Settings', icon: User },
  ] as const;

  return (
    <>
      {/* 1. Backdrop Overlay for Mobile Screen Views */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* 2. SideBar Main Panel Layout Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-white border-r border-slate-100 shadow-2xl transition-all duration-300 shrink-0
        md:static md:translate-x-0
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-auto'}
      `}>
        
        {/* Collapse Toggle Handle Button for Desktop Viewports */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-slate-700 border border-slate-200 text-white rounded-full p-1 shadow-sm z-50 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close Button Only Visible on Mobile Displays */}
        <div className="flex justify-end p-4 md:hidden">
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const shouldCollapse = isCollapsed;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose(); // Automatically closes slide-out sheet on mobile layout inputs
                  }}
                  className={`w-full flex items-center ${shouldCollapse ? 'md:justify-center md:px-2' : 'px-4'} py-3 rounded-xl transition-all text-sm font-semibold relative group ${
                    isActive ? 'bg-[#F42A63] text-white shadow-md shadow-rose-100' : 'text-slate-600 hover:bg-rose-50 hover:text-[#F42A63]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  
                  <span className={`ml-3 truncate md:block ${shouldCollapse ? 'md:hidden' : 'block'}`}>
                    {item.name}
                  </span>
                  
                  {shouldCollapse && (
                    <span className="absolute left-24 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none hidden md:block">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Shortcut Call To Action Promotion Box */}
          {(!isCollapsed || isOpen) && (
            <div className={`bg-linear-to-br from-rose-50 to-pink-100 p-4 rounded-2xl border border-rose-200/50 relative overflow-hidden ${isCollapsed ? 'md:hidden' : 'block'}`}>
              <h4 className="font-bold text-slate-800 text-sm mb-1">List Your Property</h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">Get more visibility and verified tenants instantly.</p>
              <button 
                type="button"
                onClick={() => {
                  setActiveTab('property'); // Directs to property engine
                  onClose();
                }}
                className="w-full bg-[#F42A63] hover:bg-rose-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>List Property</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Area with Signout Action Binding */}
        <div className="p-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`w-full flex items-center ${isCollapsed ? 'md:justify-center' : 'px-4'} py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-semibold`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`ml-3 md:block ${isCollapsed ? 'md:hidden' : 'block'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}