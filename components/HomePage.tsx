"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Shield, 
  MessageSquare, 
  Zap, 
  Moon, 
  Sun, 
  Heart, 
  Menu, 
  X, 
  Search, 
  MapPin, 
  Phone,
  Building,
  CheckCircle,
  Car,
  Filter,
  Home,
  Columns,
  Grid,
  Bed,
  Building2,
  Compass,
  ChevronDown,
  Check,
  Loader2
} from 'lucide-react';

interface Suggestion {
    formatted: string;
    place_id: string;
}

export default function HomePage() {
    const [selectedType, setSelectedType] = useState('Room');
  
    // State for search and autocomplete
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResultMsg, setSearchResultMsg] = useState('');

    // State modules for Geoapify Autocomplete API
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const inputContainerRef = useRef<HTMLDivElement | null>(null);
    const [dropdownRect, setDropdownRect] = useState<{ left: number; top: number; width: number } | null>(null);

    // Dubai Geographic Coordinate Boundary Box Limits (lon1,lat1,lon2,lat2)
    const dubaiBoundingBox = "54.85,24.75,55.55,25.35";

    // Categories based on screenshot
    const categories = [
        { id: 'Room', label: 'Room', icon: Home },
        { id: 'Partition', label: 'Partition', icon: Columns },
        { id: 'Studio', label: 'Studio', icon: Grid },
        { id: 'Bed Space', label: 'Bed Space', icon: Bed },
        { id: 'Apartment', label: 'Apartment', icon: Building2 },
        { id: 'Car Lift', label: 'Car Lift', icon: Car },
    ];

    // Fetch bounding box filtered predictions from Geoapify API
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        // Debounce network tracking execution to limit rapid keystroke requests
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async () => {
            setIsApiLoading(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&filter=rect:${dubaiBoundingBox}&bias=countrycode:ae&limit=5&apiKey=${apiKey}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.features) {
                    const mappedPlaces = data.features.map((feature: any) => ({
                        formatted: feature.properties.formatted,
                        place_id: feature.properties.place_id
                    }));
                    setSuggestions(mappedPlaces);
                    setIsLocationOpen(true);
                }
            } catch (error) {
                console.error("Error fetching Dubai locations:", error);
            } finally {
                setIsApiLoading(false);
            }
        }, 400);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchQuery]);

    // Handle Search Submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        
        // Simulate API search response
        setTimeout(() => {
        setIsSearching(false);
        setSearchResultMsg(
            `Found matching listings for "${selectedType}" in ${searchQuery || 'Dubai'}!`
        );
        }, 1200);
    };

    const selectLocationHandler = (loc: string) => {
        setSelectedLocation(loc);
        setSearchQuery(loc);
        setIsLocationOpen(false);
    };

    const clearInputHandler = () => {
        setSelectedLocation('');
        setSearchQuery('');
        setSuggestions([]);
        setIsLocationOpen(false);
    };

    useEffect(() => {
        // Update portal position when dropdown opens or suggestions change
        const updateRect = () => {
            if (inputContainerRef.current) {
                const rect = inputContainerRef.current.getBoundingClientRect();
                setDropdownRect({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY, width: rect.width });
            }
        };

        if (isLocationOpen) {
            updateRect();
            window.addEventListener('resize', updateRect);
            window.addEventListener('scroll', updateRect, true);
        }

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [isLocationOpen, suggestions]);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
        document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="min-h-screen container mx-auto font-sans text-gray-900">
            <main className="relative w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-16">

                {/* Outer grid for Left & Right section mapping */}
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch relative gap-8 lg:gap-0">

                    {/* Left Content Area (Light clean background) */}
                    <div className="lg:col-span-5 py-8 md:py-16 flex flex-col justify-between space-y-8 z-20 bg-white dark:bg-slate-950 relative overflow-hidden">
    
                        {/* Background Image Layer */}
                        <div 
                            className="lg:hidden block absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                            style={{ backgroundImage: `url('/images/header-image.webp')` }}
                        />
                        <div className="hidden sm:block lg:hidden absolute top-4 right-4 md:top-6 md:right-6 z-30 max-w-[140px] sm:max-w-[180px] lg:max-w-[220px]">
                            <img src="/images/header-badge.webp" alt="ALL POPULAR AREAS Badge" className='w-full h-auto' />
                        </div>
                        
                        {/* Optional: Semi-transparent overlay to ensure text readability */}
                        <div className="absolute inset-0  bg-linear-to-r from-white via-white/70 to-transparent dark:bg-slate-950/80 z-10 pointer-events-none" />

                        {/* Main Content Content (Wrapped in z-10 to stay above background) */}
                        <div className="space-y-4 z-10 pl-8 lg:pl-0">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#061329] dark:text-white">
                                FIND YOUR <br />
                                <span className="text-[#ff1d6c] inline-block font-extrabold tracking-tight">PERFECT SPACE</span> <br />
                                IN ABU DHABI
                            </h1>

                            {/* Beautiful signature cursive "Within Minutes!" exactly matching the look */}
                            <div className="pt-1.5 pl-1">
                                <span style={{ fontFamily: 'Caveat, cursive' }}
                                    className="text-4xl sm:text-5xl md:text-6xl text-[#ff1d6c] transform -rotate-3 inline-block font-bold drop-shadow-sm">
                                    Within Minutes!
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg pl-8 lg:pl-0 max-w-md leading-relaxed font-semibold z-10">
                            Rooms, Partitions, Studios, Apartments <br className="hidden sm:inline" />
                            & Car Lift – <span className="text-[#ff1d6c] font-black">All in One Place.</span>
                        </p>

                        {/* Three exact horizontal actions adjusted safely for responsive wrap */}
                        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-3 pt-6 lg:pt-12 px-8 lg:px-0 z-50">

                            {/* Pill 1: Verified Listings */}
                            <div className="bg-[#062453] text-white p-4 sm:p-5 rounded-2xl flex flex-1 items-center gap-3 border border-slate-800 shadow-lg hover:scale-[1.02] transition-transform duration-200 min-w-[200px]">
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0" />
                                <div className="leading-tight">
                                    <h4 className="text-sm font-extrabold text-white">Verified Listings</h4>
                                    <p className="text-xs sm:text-sm text-slate-300">100% Trusted</p>
                                </div>
                            </div>

                            {/* Pill 2: Direct Contact WhatsApp */}
                            <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer"
                                className="bg-[#ff1d6c] hover:bg-pink-600 text-white p-4 sm:p-5 rounded-2xl flex flex-1 items-center gap-3 shadow-lg hover:scale-[1.02] transition-transform duration-200 min-w-[200px]">
                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0" />
                                <div className="leading-tight">
                                    <h4 className="text-sm font-extrabold text-white">Direct Contact</h4>
                                    <p className="text-xs sm:text-sm text-pink-100">Chat on WhatsApp</p>
                                </div>
                            </a>

                            {/* Pill 3: Quick & Easy Post */}
                            <div className="bg-[#062453] text-white p-4 sm:p-5 rounded-2xl flex flex-1 items-center gap-3 border border-slate-800 shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer min-w-[200px]">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0" />
                                <div className="leading-tight">
                                    <h4 className="text-sm font-extrabold text-white">Quick & Easy</h4>
                                    <p className="text-xs sm:text-sm text-slate-300">List in 60 Seconds</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Skyline Section with Gradient Mask Blending into Left Column */}
                    <div className="hidden lg:block lg:col-span-7 relative overflow-hidden h-[300px] sm:h-[400px] lg:h-auto min-h-[300px] rounded-3xl lg:rounded-none">

                        {/* High Quality Skyline Image */}
                        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%),linear-gradient(to_right,black_90%,transparent_100%)] [mask-composite:intersect]">
                            <img src="/images/header-image.webp"
                                alt="Abu Dhabi Etihad Towers Sunset Skyline"
                                className="w-full h-full object-cover object-center" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent hidden lg:block"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent lg:hidden"></div>
                        </div>

                        {/* ALL POPULAR AREAS Badge */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 max-w-[140px] sm:max-w-[180px] lg:max-w-[220px]">
                            <img src="/images/header-badge.webp" alt="ALL POPULAR AREAS Badge" className='w-full h-auto' />
                        </div>

                    </div>
                </div>

                {/* SEARCH FILTER BOX: Embedded clean layout overlay */}
                <div className="z-50 mt-6 lg:-mt-10 relative">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,26,48,0.12)] p-4 sm:p-6 lg:px-10 border border-slate-200 w-full">
                    
                        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            
                            {/* Left Box: I'M LOOKING FOR */}
                            <div className="flex-1 flex flex-col gap-3 min-w-0">
                                <label className="text-sm font-black tracking-widest text-slate-800 uppercase flex items-center gap-1.5 px-1">
                                    <Compass className="w-5 h-5 text-slate-400" />
                                    I'm looking for
                                </label>
                            
                                {/* Category Selector Track */}
                                <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-200 -mx-2 px-2">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        const isActive = selectedType === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedType(cat.id)}
                                                className={`flex flex-col items-center justify-center cursor-pointer min-w-21.25 sm:min-w-27.5 h-21.25 sm:h-26.25 rounded-xl border transition-all duration-200 shrink-0 group relative
                                                    ${isActive 
                                                    ? 'bg-[#ff0066] border-[#ff0066] text-white shadow-md shadow-pink-500/20 scale-[1.02]' 
                                                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-sm'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 sm:w-7 sm:h-7 mb-1 transition-transform duration-200 group-hover:scale-105
                                                    ${isActive ? 'text-white' : 'text-slate-700'}`} 
                                                />
                                                <span className="text-xs sm:text-sm font-bold tracking-tight text-center truncate w-full px-1">
                                                    {cat.label}
                                                </span>
                                                {isActive && (
                                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Vertical Divider for larger screens */}
                            <div className="hidden lg:block h-20 w-0.5 bg-slate-200 mx-4 align-middle self-center mt-6" />

                            {/* Right Box: Enter Location Input & Action Trigger */}
                            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-end gap-4 lg:min-w-[450px]">
                            
                                {/* Input Location Frame */}
                                <div className="flex-1 flex flex-col gap-3 relative">
                                    <label className="text-sm font-black tracking-widest text-slate-800 uppercase flex items-center gap-1.5 px-1">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        Enter Location
                                    </label>
                                
                                    <div className="relative">
                                        {/* Pure Direct Input Field */}
                                        <div className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:ring-2 focus-within:ring-[#ff0066]/10 focus-within:border-[#ff0066] transition-all flex items-center gap-2.5">
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff0066] shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Type Dubai community (e.g. Marina, JBR)..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => searchQuery.length >= 3 && setIsLocationOpen(true)}
                                                className="w-full bg-transparent h-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                                            />
                                            {isApiLoading && <Loader2 className="w-4 h-4 text-[#ff0066] animate-spin shrink-0" />}
                                            {searchQuery && !isApiLoading && (
                                                <button 
                                                    type="button" 
                                                    onClick={clearInputHandler}
                                                    className="p-0.5 hover:bg-slate-200 rounded-full shrink-0 cursor-pointer"
                                                >
                                                    <X className="w-3.5 h-3.5 text-slate-500" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Floating Autocomplete Predictions Dropdown Menu */}
                                        {isLocationOpen && suggestions.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto p-1">
                                                {suggestions.map((item) => (
                                                    <button
                                                        key={item.place_id}
                                                        type="button"
                                                        onClick={() => selectLocationHandler(item.formatted)}
                                                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium cursor-pointer rounded-xl transition-all flex items-center justify-between
                                                            ${selectedLocation === item.formatted 
                                                            ? 'bg-rose-50 text-[#ff0066] font-semibold' 
                                                            : 'text-slate-700 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span className="truncate pr-2">{item.formatted}</span>
                                                        {selectedLocation === item.formatted && <Check className="w-4 h-4 text-[#ff0066] shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Empty Result Notification Box */}
                                        {isLocationOpen && searchQuery.length >= 3 && suggestions.length === 0 && !isApiLoading && (
                                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 text-center text-xs font-medium text-slate-400">
                                                No locations found inside Dubai
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Search Button */}
                                <div className="shrink-0 sm:w-32">
                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className="w-full h-12 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] active:scale-[0.98] text-white font-bold text-sm cursor-pointer tracking-wide transition-all shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 disabled:opacity-80"
                                    >
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4" />
                                                <span>Search</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>

                {/* Optional Message Toast/Feedback indicator */}
                {searchResultMsg && (
                    <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center font-semibold text-sm max-w-xl mx-auto border border-emerald-100">
                        {searchResultMsg}
                    </div>
                )}

            </main>
        </div>
    );
}