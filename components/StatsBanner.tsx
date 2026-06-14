'use client';
import React from 'react';

interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function App() {
  const stats: StatItem[] = [
    {
      id: 'happy-users',
      value: '50K+',
      label: 'Happy Users',
      icon: (
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff0066]" xmlns="http://www.w3.org/2000/svg">
          {/* Left User Silhouette */}
          <circle cx="6.5" cy="11.5" r="3" opacity="0.8" />
          <path d="M6.5 16c-2.2 0-4 1.3-4 3v1h8v-1c0-1.7-1.8-3-4-3z" opacity="0.8" />
          
          {/* Right User Silhouette */}
          <circle cx="17.5" cy="11.5" r="3" opacity="0.8" />
          <path d="M17.5 16c-2.2 0-4 1.3-4 3v1h8v-1c0-1.7-1.8-3-4-3z" opacity="0.8" />
          
          {/* Center User Silhouette (Larger & Layered on top) */}
          <circle cx="12" cy="8.5" r="4" />
          <path d="M12 14c-3 0-5.5 1.8-5.5 4v2h11v-2c0-2.2-2.5-4-5.5-4z" />
        </svg>
      )
    },
    {
      id: 'properties-listed',
      value: '10K+',
      label: 'Properties Listed',
      icon: (
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff0066] text-[#ff0066]" xmlns="http://www.w3.org/2000/svg">
          {/* Dual buildings icon matching the image */}
          <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
        </svg>
      )
    },
    {
      id: 'car-lift',
      value: '5K+',
      label: 'Car Lift Routes',
      icon: (
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff0066] text-[#ff0066]" xmlns="http://www.w3.org/2000/svg">
          {/* Front facing hatchback car matching the image */}
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.27-3.82c.14-.4.51-.68.94-.68h9.56c.43 0 .8.28.94.68L19 11H5z" />
        </svg>
      )
    },
    {
      id: 'verified-trusted',
      value: '100%',
      label: 'Verified & Trusted',
      icon: (
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff0066] text-white" xmlns="http://www.w3.org/2000/svg">
          {/* Shield with checkmark matching the image */}
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l5.59-5.59L17 9l-7 7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-[#fafbfd] font-sans flex items-center justify-center">
      <div className="w-full">
        
        {/* Main Banner Enclosure */}
        <div className="w-full bg-[#030c1b] relative overflow-hidden shadow-2xl py-16 px-4 sm:px-8 md:px-12 flex flex-col md:flex-row items-center justify-between min-h-[160px]">
          
          {/* Ambient light gradient across the banner */}
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-transparent to-rose-500/5 pointer-events-none z-10" />

          {/* ==========================================
              LEFT SKYLINE: Sheikh Zayed Grand Mosque
             ========================================== */}
          <div className="absolute left-0 bottom-0 h-full w-[24%] md:w-[28%] xl:w-[32%] select-none pointer-events-none z-0">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#030c1b]/30 to-[#030c1b] z-10" />
            <img 
              src="/images/status-1.avif" 
              alt="Grand Mosque Abu Dhabi Outline" 
              className="w-full h-full object-cover object-left mix-blend-screen opacity-50 sm:opacity-75 md:opacity-90"
            />
          </div>

          {/* ==========================================
              STATS CONTENT GRID
             ========================================== */}
          <div className="relative z-20 w-full px-2 sm:px-6 md:px-0 lg:max-w-[70%] xl:max-w-[62%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 items-center divide-y-0 divide-x-0 md:divide-x md:divide-slate-800/80">
            {stats.map((stat, idx) => (
                <div 
                    key={stat.id} 
                    className="w-full flex flex-col items-center justify-center text-center px-1 py-2 md:py-1 group"
                >
                    {/* Custom glowing stat Icon */}
                    <div className="mb-2.5 transform transition-transform duration-300 group-hover:scale-110">
                        {stat.icon}
                    </div>

                    {/* Number Value */}
                    <h3 className="text-2xl sm:text-3xl lg:text-6xl font-black text-white tracking-tight leading-none">
                    {stat.value}
                    </h3>
                    
                    {/* Description Label */}
                    <p className="text-sm sm:text-base font-bold text-slate-400 mt-1 tracking-wide uppercase">
                    {stat.label}
                    </p>
                </div>
            ))}
          </div>

          {/* ==========================================
              RIGHT SKYLINE: Abu Dhabi Towers
             ========================================== */}
          <div className="absolute right-0 bottom-0 h-full w-[24%] select-none pointer-events-none z-0">
            <div className="absolute -right-5 inset-0 bg-linear-to-l from-transparent via-[#030c1b]/10 to-[#030c1b] z-10" />
            <img 
              src="/images/status-2.avif" 
              alt="Abu Dhabi Towers Outline" 
              className="w-full h-full object-cover object-right mix-blend-screen opacity-50 sm:opacity-75 md:opacity-90"
            />
          </div>

        </div>

      </div>
    </div>
  );
}