'use client';
import React, { useState, useMemo } from 'react';
import { 
  Car, 
  ArrowRight, 
  Plus, 
  Search, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  SlidersHorizontal, 
  MessageCircle, 
  ShieldCheck, 
  ChevronDown, 
  Navigation, 
  User, 
  Users, // Added Users to fix the ReferenceError
  ArrowUpDown,
  Compass,
  DollarSign,
  Tv,
  Sparkles,
  Info
} from 'lucide-react';

// Interfaces for TypeScript safety
interface CarLiftRoute {
  id: string;
  from: string;
  to: string;
  price: number;
  time: string;
  shift: 'Morning Shift' | 'Evening Shift' | 'Night Shift' | 'General Shift';
  driverName: string;
  driverPhone: string;
  carModel: string;
  carColor: string;
  seatsTotal: number;
  seatsFilled: number;
  isVerified: boolean;
  whatsappNumber: string;
  postedDate: string;
  genderPrefer: 'Co-Ed' | 'Females Only' | 'Males Only';
  amenities: string[];
  description: string;
  routeStops: string[];
}

export default function App() {
  // --- Modals State ---
  const [isPostRouteOpen, setIsPostRouteOpen] = useState(false);
  const [isFindRouteOpen, setIsFindRouteOpen] = useState(false);
  const [selectedCarLift, setSelectedCarLift] = useState<CarLiftRoute | null>(null);
  
  // --- Toast/Feedback State ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Post Car Lift Form State (Screenshot-matched) ---
  const [postForm, setPostForm] = useState({
    departureArea: '',
    destinationArea: '',
    departureTime: '08:00 AM',
    price: ''
  });

  // --- Search & Filter States ---
  const [filterSearch, setFilterSearch] = useState('');
  const [filterFrom, setFilterFrom] = useState<string>('All');
  const [filterTo, setFilterTo] = useState<string>('All');
  const [filterShift, setFilterShift] = useState<string>('All');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(500);
  const [filterGender, setFilterGender] = useState<string>('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- Mock Filter Dropdown Options ---
  const carLiftFromList = ['Mussafah', 'Khalifa City', 'Mohammed Bin Zayed City', 'Al Muroor', 'Hamdan Street', 'Al Wahda'];
  const carLiftToList = ['Al Maryah Island', 'Al Reem Island', 'Tourist Club Area', 'Yas Island', 'Corniche Street', 'Hamdan Street'];
  const carLiftShifts = ['Morning Shift', 'Evening Shift', 'Night Shift', 'General Shift'];

  // --- Preloaded Commute Route Listings (10+ detailed records) ---
  const [routes, setRoutes] = useState<CarLiftRoute[]>([
    {
      id: 'lift-1',
      from: 'Mussafah',
      to: 'Al Maryah Island',
      price: 250,
      time: '07:00 AM',
      shift: 'Morning Shift',
      driverName: 'Ahmed Al Mansouri',
      driverPhone: '971507771122',
      carModel: 'Toyota Camry Hybrid',
      carColor: 'Sky Blue',
      seatsTotal: 4,
      seatsFilled: 2,
      isVerified: true,
      whatsappNumber: '971507771122',
      postedDate: '2026-06-14',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'No Smoking', 'Daily Commute', 'WIFI On-board', 'Silent Ride'],
      description: 'Regular daily commute route starting from Shabiya, Mussafah directly to Al Maryah Business towers. Very punctual driver with clean record and spacious hybrid sedan.',
      routeStops: ['Mussafah Shabiya 10', 'Mussafah Sector 11', 'Zayed Sports City Bypass', 'Al Maryah Square Towers']
    },
    {
      id: 'lift-2',
      from: 'Khalifa City',
      to: 'Al Reem Island',
      price: 300,
      time: '08:00 AM',
      shift: 'General Shift',
      driverName: 'Sameer Siddique',
      driverPhone: '971509998811',
      carModel: 'Nissan Altima',
      carColor: 'Silver Metallic',
      seatsTotal: 4,
      seatsFilled: 1,
      isVerified: true,
      whatsappNumber: '971509998811',
      postedDate: '2026-06-15',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'Soft Music', 'USB Chargers Available', 'Weekly Payment Accepted'],
      description: 'Commence journey daily from Khalifa City A Pink Shops area to Al Reem Island (Marina Square & Gate Towers). Direct, hassle-free Highway route saving over 40 minutes of public bus travel.',
      routeStops: ['Khalifa City A Pink Shops', 'Khalifa City Market', 'Al Reem Gate Towers', 'Marina Square Tower 1']
    },
    {
      id: 'lift-3',
      from: 'Mohammed Bin Zayed City',
      to: 'Tourist Club Area',
      price: 280,
      time: '07:30 AM',
      shift: 'General Shift',
      driverName: 'Rohan Dev',
      driverPhone: '971504443322',
      carModel: 'Honda Accord',
      carColor: 'Charcoal Grey',
      seatsTotal: 4,
      seatsFilled: 3,
      isVerified: true,
      whatsappNumber: '971504443322',
      postedDate: '2026-06-13',
      genderPrefer: 'Males Only',
      amenities: ['Chilled AC', 'Daily Newspapers', 'Bluetooth Audio Shared', 'Luggage Space Available'],
      description: 'Comfortable executive carpool route. Only professional and reliable male commuters share. Flexible pick-up points within MBZ Zone 5.',
      routeStops: ['MBZ City Zone 5 Gate', 'MBZ Park', 'Tourist Club Abu Dhabi Mall', 'Electra Street Office Center']
    },
    {
      id: 'lift-4',
      from: 'Hamdan Street',
      to: 'Yas Island',
      price: 350,
      time: '09:00 AM',
      shift: 'Morning Shift',
      driverName: 'Maria Santos',
      driverPhone: '971502228899',
      carModel: 'Hyundai Elantra',
      carColor: 'Candy Red',
      seatsTotal: 3,
      seatsFilled: 1,
      isVerified: true,
      whatsappNumber: '971502228899',
      postedDate: '2026-06-14',
      genderPrefer: 'Females Only',
      amenities: ['Chilled AC', 'No Smoking', 'Female Passenger Preference', 'Premium Fragrance On-board'],
      description: 'Exclusive, highly secure female-only car lift. Driving daily from Hamdan central to Yas Mall and Warner Bros corporate offices. Perfect for office professionals.',
      routeStops: ['Hamdan Crowne Plaza', 'Al Zahiyah Street Stop', 'Yas Mall Main Gate', 'Yas Leisure Corporate Offices']
    },
    {
      id: 'lift-5',
      from: 'Al Muroor',
      to: 'Al Reem Island',
      price: 200,
      time: '08:30 AM',
      shift: 'General Shift',
      driverName: 'Khalid Al Ali',
      driverPhone: '971505554433',
      carModel: 'Chevrolet Cruze',
      carColor: 'Ocean Blue',
      seatsTotal: 4,
      seatsFilled: 0,
      isVerified: false,
      whatsappNumber: '971505554433',
      postedDate: '2026-06-12',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'No Eating', 'Daily Runs'],
      description: 'A budget-friendly carpool service starting from Muroor Bus station area straight to Reem Island. Clean environment, strict timing adherence.',
      routeStops: ['Muroor Cooperative Society', 'Muroor Ring Road', 'Al Reem Najmat Area', 'Reem City Center Mall']
    },
    {
      id: 'lift-6',
      from: 'Mussafah',
      to: 'Corniche Street',
      price: 270,
      time: '07:15 AM',
      shift: 'Morning Shift',
      driverName: 'Bilal Khan',
      driverPhone: '971501119900',
      carModel: 'Kia Optima',
      carColor: 'Pearl White',
      seatsTotal: 4,
      seatsFilled: 2,
      isVerified: true,
      whatsappNumber: '971501119900',
      postedDate: '2026-06-15',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'Premium Leather Seats', 'No Eating Allowed'],
      description: 'Daily executive travel option. Travels from Mussafah industrial/commercial offices area directly down the highway to Abu Dhabi Corniche West corporate towers.',
      routeStops: ['Mussafah Shabiya 12', 'Mussafah Police Station', 'Corniche Towers Block A', 'Nation Towers']
    },
    {
      id: 'lift-7',
      from: 'Khalifa City',
      to: 'Corniche Street',
      price: 320,
      time: '08:15 AM',
      shift: 'General Shift',
      driverName: 'Fatima Al Zarooni',
      driverPhone: '971502468135',
      carModel: 'Lexus ES 300h',
      carColor: 'White Pearl',
      seatsTotal: 4,
      seatsFilled: 2,
      isVerified: true,
      whatsappNumber: '971502468135',
      postedDate: '2026-06-15',
      genderPrefer: 'Females Only',
      amenities: ['Chilled AC', 'Super Quiet', 'Luxury Ride', 'WIFI On-board'],
      description: 'Extremely quiet, luxurious female-only carpooling option. From Khalifa City A main community to Corniche offices area.',
      routeStops: ['Khalifa A Community Park', 'Masdar City Exit', 'Hamdan Tower', 'Corniche Plaza']
    },
    {
      id: 'lift-8',
      from: 'Al Wahda',
      to: 'Yas Island',
      price: 400,
      time: '09:30 AM',
      shift: 'Morning Shift',
      driverName: 'Vikram Singh',
      driverPhone: '971509990022',
      carModel: 'Mazda 6',
      carColor: 'Deep Crimson',
      seatsTotal: 4,
      seatsFilled: 1,
      isVerified: true,
      whatsappNumber: '971509990022',
      postedDate: '2026-06-16',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'Upbeat Music', 'WIFI On-board', 'Chargers Provided'],
      description: 'Punctual, friendly ride from Al Wahda Mall area to Yas Marina/Yas Mall corporate offices. Highly reliable daily schedule.',
      routeStops: ['Al Wahda Mall Back Gate', 'Grand Millenium Hotel Stop', 'Yas Marina circuit', 'Yas Mall']
    }
  ]);

  // --- Post Route Form Submit (Screenshot 2026-06-16) ---
  const handlePostRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.departureArea || !postForm.destinationArea || !postForm.price) return;

    const newRoute: CarLiftRoute = {
      id: `lift-${Date.now()}`,
      from: postForm.departureArea,
      to: postForm.destinationArea,
      price: Number(postForm.price),
      time: postForm.departureTime,
      shift: 'Morning Shift',
      driverName: 'You (Driver)',
      driverPhone: '971500000000',
      carModel: 'Personal Vehicle',
      carColor: 'Metallic Blue',
      seatsTotal: 4,
      seatsFilled: 0,
      isVerified: true,
      whatsappNumber: '971500000000',
      postedDate: '2026-06-16',
      genderPrefer: 'Co-Ed',
      amenities: ['Chilled AC', 'Daily Commute', 'No Smoking'],
      description: `Daily commuter route starting from ${postForm.departureArea} directly to ${postForm.destinationArea}. Offered by a safe and verified driver. Join my carpool list now!`,
      routeStops: [postForm.departureArea, 'Midway Bypass Station', postForm.destinationArea]
    };

    setRoutes([newRoute, ...routes]);
    setIsPostRouteOpen(false);
    setPostForm({ departureArea: '', destinationArea: '', departureTime: '08:00 AM', price: '' });
    triggerToast('Your car lift route has been posted successfully!');
  };

  // --- Reset Car Lift Filters ---
  const handleResetFilters = () => {
    setFilterSearch('');
    setFilterFrom('All');
    setFilterTo('All');
    setFilterShift('All');
    setFilterMaxPrice(500);
    setFilterGender('All');
    triggerToast('Filters reset to defaults');
  };

  // --- Trigger Toast Alert ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- Filter and Sort Core Logic ---
  const filteredRoutes = useMemo(() => {
    let result = [...routes];

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      result = result.filter(item => 
        item.driverName.toLowerCase().includes(q) ||
        item.carModel.toLowerCase().includes(q) ||
        item.from.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q)
      );
    }

    if (filterFrom !== 'All') {
      result = result.filter(item => item.from === filterFrom);
    }

    if (filterTo !== 'All') {
      result = result.filter(item => item.to === filterTo);
    }

    if (filterShift !== 'All') {
      result = result.filter(item => item.shift === filterShift);
    }

    if (filterGender !== 'All') {
      result = result.filter(item => item.genderPrefer === filterGender);
    }

    result = result.filter(item => item.price <= filterMaxPrice);

    return result;
  }, [routes, filterSearch, filterFrom, filterTo, filterShift, filterMaxPrice, filterGender]);

  return (
    <div className="min-h-screen  text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base">Action Successful</p>
            <p className="text-xs md:text-sm text-emerald-100 mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-auto hover:bg-white/10 p-1 rounded" aria-label="Dismiss toast">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}


      {/* ==========================================
          SEARCH BAR, SORTING & MOBILE LAYOUT CONTROLS
         ========================================== */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Dynamic Navigation Indicator Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base font-bold text-slate-700">
              Showing <span className="text-slate-800 font-black">{filteredRoutes.length}</span> active ride routes
            </p>
            {filterFrom !== 'All' && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black text-sky-600 bg-sky-50 rounded-full border border-sky-100">
                {filterFrom} Commutes
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search Inputs */}
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search driver/car..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm md:text-base font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 w-48"
              />
              {filterSearch && (
                <button onClick={() => setFilterSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Action Block */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1 bg-[#0a192f] text-white px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* ==========================================
            EXPLORER GRID Layout: Filters Sidebar Left / Cards Right
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm md:text-base font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#ff0066]" /> Ride Filters
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-sm md:text-base font-bold text-slate-400 hover:text-[#ff0066] transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Departure Dropdown Filter */}
            <div className="space-y-2.5">
              <label className="block text-sm md:text-base font-black text-slate-500 uppercase tracking-wide">Departure (From)</label>
              <select
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm md:text-base font-extrabold text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">All Starting Areas</option>
                {carLiftFromList.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            {/* Destination Dropdown Filter */}
            <div className="space-y-2.5">
              <label className="block text-sm md:text-base font-black text-slate-500 uppercase tracking-wide">Destination (To)</label>
              <select
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm md:text-base font-extrabold text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">All Destinations</option>
                {carLiftToList.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            {/* Shift Timings Selector */}
            <div className="space-y-2.5">
              <label className="block text-sm md:text-base font-black text-slate-500 uppercase tracking-wide">Shift Type</label>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterShift('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm md:text-base font-extrabold flex items-center justify-between transition-all
                    ${filterShift === 'All' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>All Shifts</span>
                  {filterShift === 'All' && <Check className="w-4 h-4 text-sky-600" />}
                </button>
                {carLiftShifts.map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => setFilterShift(sh)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm md:text-base font-extrabold flex items-center justify-between transition-all
                      ${filterShift === sh ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>{sh}</span>
                    {filterShift === sh && <Check className="w-4 h-4 text-sky-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price limits slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-500 uppercase">Max Monthly Rent</label>
                <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                  AED {filterMaxPrice} max
                </span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="500" 
                step="20"
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                className="w-full accent-sky-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Passenger policy preferences selection */}
            <div className="space-y-2.5">
              <label className="block text-sm md:text-base font-black text-slate-500 uppercase tracking-wide">Passenger Policy</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm md:text-base font-extrabold text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">All Preferences</option>
                <option value="Co-Ed">Co-Ed Commutes</option>
                <option value="Females Only">Females Only</option>
                <option value="Males Only">Males Only</option>
              </select>
            </div>

          </aside>

          {/* RIGHT MAIN COMMUTER ROUTES GRID */}
          <section className="lg:col-span-9 space-y-6">
            {filteredRoutes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                  <Car className="w-16 h-16 text-pink-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base md:text-3xl font-extrabold text-slate-800">No lift routes found for filters</h4>
                  <p className="text-sm md:text-base text-slate-500">Try broadening your area locations or increasing monthly rent budgets.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#0a192f] text-white text-sm md:text-base font-bold hover:bg-[#ff0066] transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRoutes.map((route) => (
                  <div 
                    key={route.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group cursor-pointer"
                    onClick={() => setSelectedCarLift(route)}
                  >
                    
                    {/* Header line for route shift & verify badge */}
                    <div className="flex items-center justify-between">
                      <span className="bg-sky-50 text-sky-600 text-xs font-black tracking-widest px-2.5 py-1 rounded-md uppercase border border-sky-100/50">
                        {route.shift}
                      </span>
                      {route.isVerified && (
                        <span className="text-xs font-black text-emerald-500 flex items-center gap-0.5 leading-none">
                          Verified Driver <span className="inline-block text-emerald-500 font-extrabold">✓</span>
                        </span>
                      )}
                    </div>

                    {/* Path direction display with directional icon */}
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-sm sm:text-base font-extrabold text-[#0a192f] truncate">
                        {route.from}
                      </span>
                      <span className="flex items-center px-1 text-rose-500 font-extrabold text-sm">
                        ➔
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#0a192f] truncate">
                        {route.to}
                      </span>
                    </div>

                    {/* Specs breakdown grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-50 text-sm text-slate-500 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Starts {route.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{route.seatsTotal - route.seatsFilled} seats free</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{route.carModel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{route.genderPrefer}</span>
                      </div>
                    </div>

                    {/* Bottom area containing monthly costs & messaging triggers */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[#0a192f] font-black text-sm sm:text-base">
                          AED {route.price}{' '}
                          <span className="text-slate-400 text-xs font-bold">/month</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/${route.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                          title="WhatsApp chat"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setSelectedCarLift(route)}
                          className="text-xs font-black text-white px-3 py-1.5 rounded-xl bg-[#0a192f] hover:bg-[#ff0066] transition-all uppercase tracking-wider"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ==========================================
          MOBILE FILTER MODAL OVERLAY
         ========================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-sky-600" /> Lift Filters
                </h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400" aria-label="Close filters">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Departure Area</label>
                <select
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="All">All Starting Areas</option>
                  {carLiftFromList.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Destination Area</label>
                <select
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="All">All Destinations</option>
                  {carLiftToList.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Max Budget</label>
                  <span className="text-[11px] font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md">
                    AED {filterMaxPrice} max
                  </span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="500" 
                  step="20"
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                  className="w-full accent-sky-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Passenger Policy</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="All">All Preferences</option>
                  <option value="Co-Ed">Co-Ed</option>
                  <option value="Females Only">Females Only</option>
                  <option value="Males Only">Males Only</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 mt-6">
              <button onClick={handleResetFilters} className="w-full py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">
                Clear Filters
              </button>
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black uppercase tracking-wider transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          POST CAR LIFT ROUTE MODAL (Exact Screenshot match 2026-06-16)
         ========================================== */}
      {isPostRouteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-125 p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {/* SVG Car Icon inside Header */}
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0f52ba]">
                  <Car className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[#0a192f] text-lg font-bold tracking-tight">
                  Post Car Lift Route
                </h3>
              </div>
              <button 
                onClick={() => setIsPostRouteOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields mapped to Screenshot 2026-06-16 */}
            <form onSubmit={handlePostRouteSubmit} className="space-y-4 pt-5">
              
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  DEPARTURE AREA
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Khalifa City"
                  value={postForm.departureArea}
                  onChange={(e) => setPostForm({ ...postForm, departureArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#0a192f] transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  DESTINATION AREA
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Al Reem Island"
                  value={postForm.destinationArea}
                  onChange={(e) => setPostForm({ ...postForm, destinationArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#0a192f] transition-all bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    DEPARTURE TIME
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="08:00 AM"
                    value={postForm.departureTime}
                    onChange={(e) => setPostForm({ ...postForm, departureTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#0a192f] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    PRICE (AED/MONTH)
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 300"
                    value={postForm.price}
                    onChange={(e) => setPostForm({ ...postForm, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#0a192f] transition-all bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 rounded-xl bg-[#0a192f] hover:bg-[#122540] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md"
              >
                SUBMIT ROUTE OFFER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          FIND CAR LIFT QUICK MODAL
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
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-slate-500">
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
                  triggerToast('We matched you with active routes matching your criteria!');
                }}
                className="w-full py-3 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors"
              >
                Find Drivers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CAR LIFT DETAIL LIGHTBOX MODAL
         ========================================== */}
      {selectedCarLift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
            
            {/* Left Box: Active Route Milestones Illustration */}
            <div className="w-full md:w-1/2 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between md:sticky md:top-0 h-full min-h-85 md:min-h-125 rounded-t-4xl md:rounded-t-none md:rounded-l-4xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900/90 to-[#ff0066]/10 z-0" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="bg-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase border border-sky-500/30">
                    {selectedCarLift.shift}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black mt-2 tracking-tight text-white flex items-center gap-2">
                    <Car className="w-6 h-6 text-sky-400" /> Route Breakdown
                  </h4>
                </div>

                {/* Route stops vertical visualization diagram */}
                <div className="space-y-6 pl-2 relative">
                  <div className="absolute left-3.25 top-2 bottom-2 w-0.5 bg-linear-to-b from-sky-400 to-[#ff0066]" />
                  
                  {selectedCarLift.routeStops?.map((stop, idx) => (
                    <div key={stop} className="flex items-center gap-4 relative animate-in slide-in-from-left duration-150" style={{ animationDelay: `${idx * 80}ms` }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-10 border-2
                        ${idx === 0 
                          ? 'bg-sky-500 border-sky-300 text-white shadow-md' 
                          : idx === selectedCarLift.routeStops.length - 1 
                            ? 'bg-[#ff0066] border-pink-300 text-white' 
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                          {idx === 0 ? 'Departure Point' : idx === selectedCarLift.routeStops.length - 1 ? 'Final Stop' : 'Route Station'}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-white mt-1">
                          {stop}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Car specs summary */}
              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Commute Vehicle</p>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="font-extrabold text-white">{selectedCarLift.carModel}</span>
                  <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                    {selectedCarLift.carColor}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Box: Driver profile & specifications */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <button 
                onClick={() => setSelectedCarLift(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors z-10"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Commuter Route
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#0a192f]">
                    {selectedCarLift.from} ➔ {selectedCarLift.to}
                  </h4>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50">
                  <span className="text-2xl font-black text-[#0a192f]">AED {selectedCarLift.price}</span>
                  <span className="text-slate-500 text-xs font-bold">/ month (Shared Commute Fee)</span>
                </div>
              </div>

              {/* Description Details */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Route Overview</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  {selectedCarLift.description}
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Driver Profile</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">{selectedCarLift.driverName}</p>
                  {selectedCarLift.isVerified && (
                    <span className="text-[9px] font-black text-emerald-500 flex items-center gap-0.5 leading-none mt-1">
                      Verified Identity ✓
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Time Slot</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ff0066]" /> {selectedCarLift.time}
                  </p>
                </div>
              </div>

              {/* Shift Capacity Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Occupancy Capacity</span>
                  <span className="text-slate-800">{selectedCarLift.seatsTotal - selectedCarLift.seatsFilled} Seats Left</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-sky-400 to-[#ff0066] transition-all duration-500" 
                    style={{ width: `${(selectedCarLift.seatsFilled / selectedCarLift.seatsTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Included Amenities badges list */}
              {selectedCarLift.amenities && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Comfort Policies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCarLift.amenities.map(item => (
                      <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-slate-50 border border-slate-200/50 text-slate-600">
                        <Check className="w-3 h-3 text-[#ff0066]" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a 
                  href={`https://wa.me/${selectedCarLift.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 bg-[#25d366] hover:bg-[#20ba59] active:scale-98 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Connect via WhatsApp</span>
                </a>

                <button
                  onClick={() => triggerToast(`Contacting Driver: ${selectedCarLift.driverName}`)}
                  className="py-3.5 px-6 rounded-2xl border-2 border-[#0a192f] text-[#0a192f] hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-black uppercase tracking-wider transition-all"
                >
                  Request Route Match
                </button>
              </div>

            </div>

          </div>
        </div>
      )}



    </div>
  );
}