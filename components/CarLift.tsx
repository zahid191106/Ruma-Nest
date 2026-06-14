'use client';
import React, { useState } from 'react';
import { 
  Car, 
  ArrowRight, 
  Plus, 
  Search, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  DollarSign,
  UserCheck
} from 'lucide-react';

// Interfaces for our state and data
interface RouteListing {
  id: string;
  from: string;
  to: string;
  time: string;
  price: number;
  driverName: string;
  isVerified: boolean;
  whatsapp: string;
  avatarSeed: string;
}

export default function App() {
  // Modal states for interactive features
  const [isPostRouteOpen, setIsPostRouteOpen] = useState(false);
  const [isFindRouteOpen, setIsFindRouteOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    time: '08:00 AM',
    price: ''
  });

  // Mock list of routes matching the screenshot
  const [routes, setRoutes] = useState<RouteListing[]>([
    {
      id: '1',
      from: 'Mussafah',
      to: 'Al Maryah',
      time: '07:00 AM',
      price: 250,
      driverName: 'Driver',
      isVerified: true,
      whatsapp: '971500000000',
      avatarSeed: 'avatar1'
    },
    {
      id: '2',
      from: 'Khalifa City',
      to: 'Al Reem Island',
      time: '08:00 AM',
      price: 300,
      driverName: 'Driver',
      isVerified: true,
      whatsapp: '971500000000',
      avatarSeed: 'avatar2'
    }
  ]);

  const handlePostRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute.from || !newRoute.to || !newRoute.price) return;

    const route: RouteListing = {
      id: Date.now().toString(),
      from: newRoute.from,
      to: newRoute.to,
      time: newRoute.time,
      price: Number(newRoute.price),
      driverName: 'You (Driver)',
      isVerified: true,
      whatsapp: '971500000000',
      avatarSeed: 'avatar3'
    };

    setRoutes([route, ...routes]);
    setIsPostRouteOpen(false);
    setNewRoute({ from: '', to: '', time: '08:00 AM', price: '' });
    showToast('Your car lift route has been posted successfully!');
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="w-full container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-6">

        {/* Dynamic Action Toasts */}
        {successToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm">Action Successful</p>
              <p className="text-sm text-emerald-100 mt-0.5">{successToast}</p>
            </div>
            <button onClick={() => setSuccessToast(null)} className="ml-auto hover:bg-white/10 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==========================================
            HEADER row: title & navigation
           ========================================== */}
        <div className="flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            {/* Dark Blue Circular Icon */}
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0a3d62]">
              <Car className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider text-[#0a192f] uppercase">
              CAR LIFT <span className="text-slate-400 font-normal mx-1">—</span> <span className="text-slate-600 font-bold">SAVE TIME, SAVE MONEY</span>
            </h2>
          </div>
          
          <button 
            onClick={() => showToast('Redirecting to all Car Lift routes...')}
            className="flex items-center gap-1 text-xs sm:text-sm font-black text-[#ff0066] hover:text-[#e6005c] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ==========================================
            MAIN DUAL SECTION LAYOUT
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
            {/* LEFT CONTAINER: Light Blue Border Enclosure containing 1 Promo & 2 Route Cards */}
            <div className="lg:col-span-9 border-2 border-blue-200 rounded-3xl bg-linear-to-br from-[#ebf4ff]/40 to-[#f0f7ff]/70 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch shadow-sm">
            
                {/* Promo Segment: "I HAVE A CAR" */}
                <div className="md:col-span-4 px-3 py-5 flex flex-col justify-between border border-blue-50/50 min-h-45 md:min-h-auto relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-6 items-start h-full">
                    
                        {/* Left Column Content / Actions */}
                        <div className="flex-1 w-full space-y-6 text-left">
                            <div className="space-y-2 z-10">
                                <h3 className="text-base sm:text-lg font-black text-[#0f52ba] tracking-tight leading-5 uppercase">
                                I HAVE A CAR <span className="text-slate-400 font-medium">—</span> <span className="text-[11px] font-extrabold tracking-wider text-[#0f52ba]/80">OFFER LIFT</span>
                                </h3>
                                <p className="text-sm font-semibold text-slate-500 leading-tight">
                                Earn monthly by offering car lift
                                </p>
                            </div>

                            {/* Action Trigger Button */}
                            <button
                                onClick={() => setIsPostRouteOpen(true)}
                                className="w-full md:w-auto h-11 px-5 mt-6 rounded-xl bg-[#0a192f] hover:bg-[#122540] active:scale-98 transition-all text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 z-10 self-start"
                            >
                                <Plus className="w-4 h-4 stroke-3" />
                                <span>POST MY ROUTE</span>
                            </button>
                        </div>

                        {/* Right Column: Arab Landlord Character Illustration */}
                        <div className="w-full md:w-1/4 flex flex-col items-center justify-center self-stretch">
                            <div className="absolute hidden lg:w-full h-auto md:flex flex-col items-center">
                                <img src="/images/car-1.avif" alt="upload your property | Ruma Nest Property Dubai" className='w-36 h-full object-contain' />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Commuter route list segment */}
                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map((route) => (
                    <div 
                    key={route.id}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
                    >
                    {/* Header: Cities / Path */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 w-full min-w-0">
                        <span className="text-xs sm:text-sm font-extrabold text-[#0a192f] truncate">
                            {route.from}
                        </span>
                        {/* Pink directional indicator matching screenshot */}
                        <span className="flex items-center px-1.5 text-rose-500 font-extrabold text-xs">
                            ➔
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-[#0a192f] truncate">
                            {route.to}
                        </span>
                        </div>
                    </div>

                    {/* Subtitle Details: Timing & Cost */}
                    <div className="flex items-center justify-between mt-3 pb-3 border-b border-slate-50">
                        <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                            {route.time}
                        </span>
                        </div>

                        <div className="text-right">
                        <p className="text-[#0f52ba] font-extrabold text-xs sm:text-sm">
                            AED {route.price} <span className="text-slate-400 font-semibold text-[10px]">/month</span>
                        </p>
                        </div>
                    </div>

                    {/* Bottom Area: Verified Driver Profile & WhatsApp Contact Pin */}
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-2">
                        {/* Minimal avatar graphic */}
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400">
                            <circle cx="12" cy="8" r="4" fill="currentColor" />
                            <path d="M12 14c-4 0-6 2-6 6h12c0-4-2-6-6-6z" fill="currentColor" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-extrabold text-slate-800 leading-tight">
                            {route.driverName}
                            </p>
                            {route.isVerified && (
                            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-0.5 leading-none mt-0.5">
                                Verified <span className="inline-block text-emerald-500 font-extrabold text-[10px]">✓</span>
                            </span>
                            )}
                        </div>
                        </div>

                        {/* Green Chat Button */}
                        <a
                        href={`https://wa.me/${route.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                        title="Connect with Driver"
                        >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.091-2.868-6.944-1.851-1.852-4.314-2.871-6.937-2.872-5.438 0-9.863 4.413-9.866 9.83-.001 1.745.486 3.453 1.411 4.967l-.962 3.511 3.601-.945zM17.52 14.3c-.3-.149-1.777-.874-2.052-.974-.275-.1-.475-.149-.675.15-.2.299-.775.973-.95 1.173-.175.2-.35.224-.65.074-.3-.149-1.265-.466-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.073-.275.998-1.05 2.196-1.05 2.246 0 .05.15.349.625.874.775.848 1.625 1.123 1.925 1.248.3.125.4.1.55-.075.15-.175.65-.748.8-1.022.15-.274.3-.224.6-.074s1.9.949 2.225 1.124c.325.174.525.249.6.374.075.124.075.723-.225 1.022-.3.299-1.5 1.472-1.5 1.472z"/>
                        </svg>
                        </a>
                    </div>

                    </div>
                ))}
                </div>

            </div>

          {/* RIGHT CONTAINER: Pink Border Card "I NEED A CAR LIFT" */}
          <div className="lg:col-span-3 bg-linear-to-br from-[#fff5f8]/50 to-[#fff0f4]/80 border-2 border-pink-100 hover:border-pink-200 rounded-3xl px-5 py-8 flex flex-col justify-between shadow-sm relative overflow-hidden group min-h-45 lg:min-h-auto transition-all">
            <div className="space-y-2 z-10">
              <h3 className="text-base sm:text-lg font-black text-[#ff0066] tracking-normal leading-none uppercase">
                I NEED A CAR LIFT
              </h3>
              <p className="text-base font-semibold text-slate-500 leading-tight">
                Find daily / monthly car lift
              </p>
            </div>

            {/* Red Car Illustration */}
            <div className="absolute right-2 top-8 w-46 h-auto opacity-90 pointer-events-none transition-transform duration-300 group-hover:translate-x-1">
                <img src="/images/car-2.avif" alt="" className='w-full h-full object-contain' />
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={() => setIsFindRouteOpen(true)}
              className="w-full md:w-auto h-11 px-5 mt-6 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] active:scale-98 transition-all text-white text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-pink-500/10 z-10 self-start"
            >
              <Search className="w-4 h-4 stroke-3" />
              <span>FIND CAR LIFT</span>
            </button>
          </div>

        </div>

      </div>

      {/* ==========================================
          POST MY ROUTE MODAL
         ========================================== */}
      {isPostRouteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#0f52ba]" />
                <h3 className="text-base font-extrabold text-slate-800">Post Car Lift Route</h3>
              </div>
              <button 
                onClick={() => setIsPostRouteOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRoute} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Departure Area</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Khalifa City"
                  value={newRoute.from}
                  onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Destination Area</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Al Reem Island"
                  value={newRoute.to}
                  onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Departure Time</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., 08:30 AM"
                    value={newRoute.time}
                    onChange={(e) => setNewRoute({ ...newRoute, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Price (AED/month)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 300"
                    value={newRoute.price}
                    onChange={(e) => setNewRoute({ ...newRoute, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0a192f] hover:bg-[#122540] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors mt-2"
              >
                Submit Route Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          FIND A CAR LIFT MODAL
         ========================================== */}
      {isFindRouteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#ff0066]" />
                <h3 className="text-base font-extrabold text-slate-800">Search Car Lift Routes</h3>
              </div>
              <button 
                onClick={() => setIsFindRouteOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-medium text-slate-500">
                Enter your commute locations to quickly match with available verified drivers:
              </p>

              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Where do you live? (e.g., Mussafah)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Where is your office? (e.g., Al Maryah)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setIsFindRouteOpen(false);
                  showToast('We matched you with 2 active routes! Check list.');
                }}
                className="w-full py-3 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors"
              >
                Find Drivers
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}