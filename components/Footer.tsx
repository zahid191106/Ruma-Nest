'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#0a192f] text-slate-300 border-t-2 border-[#ff0066]/20 relative overflow-hidden pt-16 pb-8 font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff0066]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Upper Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="RumaNest Logo" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              The premier verified listing platform in Abu Dhabi. We connect thousands of property owners, roommates, and car lifters every single day with secure, direct communications.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-3.5 pt-1">
              <a href="#facebook" aria-label="Facebook" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#ff0066] hover:text-white flex items-center justify-center transition-all text-slate-400 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#ff0066] hover:text-white flex items-center justify-center transition-all text-slate-400 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#ff0066] hover:text-white flex items-center justify-center transition-all text-slate-400 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services / I'm Looking For (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-white tracking-widest uppercase pb-2 border-b border-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0066]" />
              I'm Looking For
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
              <li><a href="#room" className="hover:text-[#ff0066] transition-colors flex items-center gap-1.5"><span>Room</span></a></li>
              <li><a href="#studio" className="hover:text-[#ff0066] transition-colors flex items-center gap-1.5"><span>Studio</span></a></li>
              <li><a href="#bedspace" className="hover:text-[#ff0066] transition-colors flex items-center gap-1.5"><span>Bed Space</span></a></li>
              <li><a href="#apartment" className="hover:text-[#ff0066] transition-colors flex items-center gap-1.5"><span>Apartment</span></a></li>
              <li><a href="#carlift" className="hover:text-[#ff0066] transition-colors flex items-center gap-1.5"><span>Car Lift</span></a></li>
            </ul>
          </div>

          {/* Column 3: Top Areas (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-white tracking-widest uppercase pb-2 border-b border-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0066]" />
              Popular Areas
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-400">
              <li><a href="#alwahda" className="hover:text-[#ff0066] transition-colors">Al Wahda</a></li>
              <li><a href="#mussafah" className="hover:text-[#ff0066] transition-colors">Mussafah</a></li>
              <li><a href="#khalifa" className="hover:text-[#ff0066] transition-colors">Khalifa City</a></li>
              <li><a href="#tourist" className="hover:text-[#ff0066] transition-colors">Tourist Club Area</a></li>
              <li><a href="#mby" className="hover:text-[#ff0066] transition-colors">Mohammed Bin Zayed</a></li>
              <li><a href="#reem" className="hover:text-[#ff0066] transition-colors">Al Reem Island</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Direct Contact (3.5 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Subscription Form */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-white tracking-widest uppercase pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0066]" />
                Keep Updated
              </h3>
              <p className="text-xs text-slate-400">Subscribe for the latest premium verified listings in Abu Dhabi.</p>
              
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff0066]/30 focus:border-[#ff0066] transition-all"
                />
                <button 
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/10"
                >
                  <span>Subscribe</span>
                </button>
              </form>

              {subscribed && (
                <p className="text-xs text-emerald-400 font-bold animate-pulse">✓ Thank you for subscribing!</p>
              )}
            </div>

            {/* Direct Support Details */}
            <div className="pt-3 space-y-2.5 border-t border-slate-800">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25d366] animate-pulse" />
                <span className="font-extrabold text-slate-200">24/7 Support Active</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <a href="https://wa.me/971500000000" className="flex items-center gap-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/30 rounded-xl px-3.5 py-2 text-[#25d366] transition-all text-xs font-bold">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.091-2.868-6.944-1.851-1.852-4.314-2.871-6.937-2.872-5.438 0-9.863 4.413-9.866 9.83-.001 1.745.486 3.453 1.411 4.967l-.962 3.511 3.601-.945z" />
                  </svg>
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Lower Copyright Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-center sm:text-left">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            © 2026 RumaNest. All rights reserved. Designed with premium verified security standards.
          </p>
          
          <div className="flex items-center gap-5 text-xs text-slate-400 font-bold">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-slate-700">•</span>
            <a href="#support" className="hover:text-white transition-colors">Help Support</a>
          </div>
        </div>

      </div>

    </footer>
  );
}