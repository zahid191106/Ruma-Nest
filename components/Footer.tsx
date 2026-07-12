"use client";
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  LockKeyhole, 
  UsersIcon, 
  ChevronRight, 
  X, 
  Send,
  Sparkles,
  Heart,
  Award,
  ArrowRightIcon,
  ArrowDownRightFromCircle,
  User2Icon
} from 'lucide-react';

import { SiWhatsapp, SiFacebook, SiInstagram, SiX, SiTiktok, SiYoutube, SiLinkerd } from '@icons-pack/react-simple-icons';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string): void => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Footer
  const currentYear = new Date().getFullYear();
  const features = [
    {
      icon: (
        <ShieldCheck className='w-12 h-12 text-pink-600'/>
      ),
      title: "100% Verified Listings",
      desc: "Safe. Secure. Trusted."
    },
    {
      icon: (
        <LockKeyhole className='w-12 h-12 text-pink-600'/>
      ),
      title: "Privacy Protected",
      desc: "Your privacy is our priority."
    },
    {
      icon: (
        <UsersIcon className='w-12 h-12 text-pink-600'/>
      ),
      title: "Trusted by Thousands",
      desc: "Join our growing community."
    },
    {
      icon: (
        <Award className='w-12 h-12 text-pink-600'/>
      ),
      title: "Premium Experience",
      desc: "Best listings. Better living."
    }
  ];

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast("Please enter a valid email address!");
      return;
    }
    setSubscribed(true);
    showToast(`Successfully subscribed! ${email} will now receive premium verified listings.`);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleCategoryClick = (cat: string): void => {
    setActiveCategory(cat);
    showToast(`Filtering for listings: "${cat}" in Abu Dhabi.`);
  };

  const handleAreaClick = (area: string): void => {
    setActiveArea(area);
    showToast(`Exploring properties in popular area: "${area}".`);
  };

  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setShowWhatsAppModal(false);
    showToast("Connecting you with a support representative on WhatsApp...");
  };

  return (
    <div className="w-full relative overflow-hidden px-6 xl:px-24 shadow-2xl bg-[#090114] border border-fuchsia-950/40">
      
      {/* ================= TOP WAVE swooshes matching the uploaded image ================= */}
      {}
      <div className="absolute top-0 left-0 right-0 h-28 w-full z-10 pointer-events-none overflow-hidden bg-transparent">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
          {/* White background above the footer curve */}
          <path d="M0 0 H1440 V40 Q1000 65 720 40 T0 50 Z" fill="#ffffff" />
          {/* Magenta Accent Curve */}
          <path d="M0 45 Q360 85 720 50 T1440 55 V60 Q1080 50 720 85 T0 45 Z" fill="url(#pink-gradient)" />
          {/* Definition of top curves gradients */}
          <defs>
            <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#d91d75" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {}
      {/* Dot Matrix Overlays (Watermarks on left/right borders) */}
      <div className="absolute left-6 top-36 w-8 h-20 opacity-20 pointer-events-none hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
          ))}
        </div>
      </div>
      <div className="absolute right-6 bottom-48 w-8 h-20 opacity-20 pointer-events-none hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
          ))}
        </div>
      </div>

      {/* Custom Flower Silhouette Vectors in Background Corners */}
      <div className="absolute top-16 right-0 opacity-[0.04] pointer-events-none">
        <svg className="w-80 h-80 text-white" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50 15 C45 35, 20 40, 20 50 C20 60, 45 65, 50 85 C55 65, 80 60, 80 50 C80 40, 55 35, 50 15 Z" />
        </svg>
      </div>
      <div className="absolute bottom-28 left-0 opacity-[0.03] pointer-events-none">
        <svg className="w-64 h-64 text-pink-500" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50 15 C45 35, 20 40, 20 50 C20 60, 45 65, 50 85 C55 65, 80 60, 80 50 C80 40, 55 35, 50 15 Z" />
        </svg>
      </div>

      {}

      {/* Content Wrapper */}
      <div className="relative z-10 px-6 pt-24 pb-12 xl:px-12 md:pt-28 md:pb-16">
        {/* Abu Dhabi Glowing Pink Skyline (Accurate matches to the uploaded design backdrop) */}
        <div className="absolute left-0 right-0 top-0 h-full overflow-hidden opacity-12 pointer-events-none select-none z-0">
          <img src="/images/status-1.avif" alt="" className='w-full h-full' />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* ================= COLUMN 1: BRAND LOGO & DESCRIPTION ================= */}
          {}
          <div className="lg:col-span-6 xl:col-span-4 flex flex-col space-y-6">
            
            {/* Logo Emblem directly sitting on dark purple background (as in Image) */}
            <div className="flex items-center gap-4">
              <img src="/images/logo.webp" alt="Logo" className="sm:max-w-md rounded-2xl" />
            </div>

            {/* Description Paragraph */}
            <p className="text-slate-300 text-sm md:text-lg leading-relaxed font-normal max-w-md">
              The premier verified listing platform in Abu Dhabi. We connect thousands of property owners, roommates, and car lifters every single day with secure, direct communications.
            </p>

            {}
            {/* Follow Us with Custom Heart Graphic Sweep line */}
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold tracking-wider text-pink-600 uppercase">Follow Us</span>
                <div className="relative grow h-px max-w-40">
                  {/* SVG custom line drawing ending in a beautiful heart */}
                  <svg className="absolute left-0 -top-2 w-full h-6 text-pink-500" viewBox="0 0 150 24" fill="none">
                    <path d="M0 12 H100 Q110 12 115 6 T122 12 Q126 18 132 12" stroke="currentColor" strokeWidth="1" />
                    {/* Heart Vector overlay */}
                    <path d="M128 6 C126 4 123 4 121 6 C119 4 116 4 114 6 C114 9 118 13 121 16 C124 13 128 9 128 6 Z" fill="currentColor" className="animate-pulse" />
                  </svg>
                </div>
              </div>

              {/* Social Circle Buttons */}
              <div className="flex items-center space-x-3">
                {[
                  { id: 'fb', icon: SiFacebook, href: '#facebook', label: 'Facebook' },
                  { id: 'ig', icon: SiInstagram, href: '#instagram', label: 'Instagram' },
                  { id: 'tw', icon: SiX, href: '#twitter', label: 'Twitter' },
                  { id: 'yt', icon: SiYoutube, href: '#youtube', label: 'YouTube' },
                  { id: 'tt', icon: SiTiktok, href: '#tiktok', label: 'TikTok' },
                ].map((social) => {
                  const IconComponent = social.icon;
    
                  return (
                    <button
                      key={social.id}
                      onClick={() => showToast(`${social.label} profile integration coming soon!`)}
                      className="w-12 h-12 rounded-full bg-linear-to-br from-pink-600 to-blue-900 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      {/* Render the component directly and pass your classes */}
                      <IconComponent className="w-6 h-6 fill-current" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ================= COLUMN 2: I'M LOOKING FOR ================= */}
          {}
          <div className="lg:col-span-4 xl:col-span-2 flex flex-col space-y-5 relative">
            
            {/* Header with Search icon inside solid pink gradient circle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Search className="w-5 h-5 stroke-3" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-extrabold text-base tracking-wider uppercase">
                  I'm looking for
                </h3>
                <div className="h-0.5 w-12 bg-pink-500 mt-1"></div>
              </div>
            </div>

            {/* List Items */}
            <ul className="space-y-3.5 text-base z-10">
              {[
                "Room",
                "Studio",
                "Bed Space",
                "Apartment",
                "Car Lift"
              ].map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleCategoryClick(item)}
                    className={`group flex items-center space-x-2 text-left cursor-pointer transition-colors duration-200 w-full py-1 ${
                      activeCategory === item 
                        ? 'text-pink-400 font-bold' 
                        : 'text-slate-300 hover:text-pink-400'
                    }`}
                  >
                    <span className="text-pink-500 font-semibold text-base tracking-wider transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                    <span>{item}</span>
                    {activeCategory === item && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Faint search watermark background */}
            <div className="absolute right-0 bottom-4 opacity-[0.02] pointer-events-none">
              {/* <Search className="w-24 h-24 text-white" /> */}
            </div>
          </div>

          {/* ================= COLUMN 3: POPULAR AREAS ================= */}
          {}
          <div className="lg:col-span-5 xl:col-span-2 flex flex-col space-y-5 relative">
            
            {/* Header with Location pin inside solid pink gradient circle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5 stroke-3" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-extrabold text-base tracking-wider uppercase">
                  Popular Areas
                </h3>
                <div className="h-0.5 w-12 bg-pink-500 mt-1"></div>
              </div>
            </div>

            {/* List Items */}
            <ul className="text-base z-10">
              {[
                "Al Wahda",
                "Mussafah",
                "Khalifa City",
                "Tourist Club Area",
                "Mohammed Bin Zayed",
                "Al Reem Island"
              ].map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleAreaClick(item)}
                    className={`group flex items-center space-x-2 text-left cursor-pointer transition-colors duration-200 w-full py-1 ${
                      activeArea === item 
                        ? 'text-pink-400 font-bold' 
                        : 'text-slate-300 hover:text-pink-400'
                    }`}
                  >
                    <span className="text-pink-500 font-semibold text-xs tracking-wider transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowDownRightFromCircle className='w-5 h-5 mb-3' />
                    </span>
                    <span>{item}</span>
                    {activeArea === item && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Faint paper airplane graphic background */}
            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
              <svg className="w-20 h-20 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          {/* ================= COLUMN 4: KEEP UPDATED & SUPPORT ================= */}
          {}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6">
            
            {/* Header with Bell notification inside solid pink circle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Bell className="w-5 h-5 stroke-3" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-extrabold text-base tracking-wider uppercase">
                  Keep Updated
                </h3>
                <div className="h-0.5 w-12 bg-pink-500 mt-1"></div>
              </div>
            </div>

            {/* Keep Updated details */}
            <p className="text-slate-300 text-base leading-relaxed">
              Subscribe for the latest premium verified listings in Abu Dhabi.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="grow bg-[#0f041d]/70 border border-fuchsia-900/60 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold px-6 py-3 rounded-xl text-base transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-pink-500/20 whitespace-nowrap tracking-wide uppercase"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Divider dotted line matching ChatGPT Image Jun 20, 2026, 04_54_47 PM.png */}
            <div className="border-t-3 border-dashed border-pink-600 my-2 mb-5 "></div>

            {/* Support & WhatsApp segment */}
            <div className="flex flex-col space-y-5">
              
              {/* 24/7 Active Badge (Recreated with matching headset-like icon design) */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                  <User2Icon />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base tracking-wide">24/7 Support Active</span>
                  <span className="text-sm text-slate-400">
                    We're here to help you <span className="text-pink-500 font-semibold">anytime.</span>
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Pill Button */}
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="w-auto bg-[#121b22]/90 hover:bg-emerald-400 border border-emerald-500/40 hover:border-emerald-500 text-emerald-500 hover:text-white cursor-pointer rounded-full px-6 py-3.5 flex items-center justify-between transition-all duration-300 font-semibold text-base shadow-md group"
              >
                <div className="flex items-center space-x-3">
                  {/* SVG WhatsApp Custom Emblem */}
                  <SiWhatsapp />  
                  <span>Direct WhatsApp Chat</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* ================= BOTTOM BAR (DARK WRAPPER WITH PINK HIGHLIGHTS) ================= */}
      {}
      {/* Separating Neon line from footer body to trust icons */}
      <div className="relative w-full h-1.5">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-pink-500 to-transparent opacity-80 shadow-[0_0_8px_#ec4899]"></div>
      </div>
          
      <div className="w-full text-white font-sans z-100">
        {/* Top Neon Border Line */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-pink-500 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-pink-400 blur-sm rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 py-10">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 items-center">
            {features.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-4 lg:px-6 ${
                  index !== features.length - 1 ? 'lg:border-r lg:border-gray-500' : ''
                }`}
              >
                {/* Icon Circle */}
                <div className="shrink-0 w-20 h-20 rounded-full border border-pink-600 bg-pink-900/20 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                  {item.icon}
                </div>
                {/* Text Info */}
                <div className="flex-col">
                  <h4 className="font-bold text-base text-gray-100 tracking-wide">{item.title}</h4>
                  <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Copyright & Location Subfooter */}
          <div className="mt-12 pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-center gap-4 text-base text-gray-400">
            <p>© {currentYear} <span className="font-semibold text-gray-200">RumaNest</span>. All Rights Reserved.</p>
            <span className="hidden sm:inline text-gray-700">|</span>
            <p className="flex items-center gap-1.5">
              Made with 
              <span className="text-pink-500 animate-pulse">❤️</span> 
              in Abu Dhabi
            </p>
          </div>
        </div>
      </div>
      

      {/* ================= INTERACTIVE TOAST & MODAL SYSTEMS ================= */}
      {}
      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b0117] border border-pink-500 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
            {/* <img src="/images/ruma-logo.svg" alt="" /> */}
          </div>
          <div className="grow">
            <p className="text-base font-bold text-pink-400">RumaNest System Update</p>
            <p className="text-sm text-slate-200 mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Simulated Interactive WhatsApp Chat Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121b22] text-[#e9edef] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-emerald-900">
            {/* Header */}
            <div className="bg-[#008069] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#121b22] flex items-center justify-center text-emerald-400 font-bold">
                  RN
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">RumaNest Support</h4>
                  <span className="text-xs text-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                    Online • Typical reply under 1m
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-4 bg-[#0b141a] h-64 overflow-y-auto flex flex-col justify-end">
              <div className="bg-[#202c33] rounded-2xl p-4 text-sm max-w-[85%] self-start relative">
                <p className="text-slate-200">
                  Hello! Welcome to RumaNest Abu Dhabi support. 🇦🇪
                </p>
                <p className="text-slate-200 mt-1">
                  How can we help you find the perfect nest or assist with car lifts today?
                </p>
                <span className="text-[10px] text-slate-400 absolute right-3 bottom-1">11:04 AM</span>
              </div>
            </div>

            {/* Input Footer */}
            <form onSubmit={handleWhatsAppSubmit} className="bg-[#1f2c34] p-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                required
                className="grow bg-[#2a3942] border-none text-white rounded-full px-4 py-2.5 text-sm placeholder-[#8696a0] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-[#00a884] hover:bg-[#008069] text-white p-2.5 rounded-full transition-colors shrink-0"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}