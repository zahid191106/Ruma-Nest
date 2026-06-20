'use client';
import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Columns, 
  Grid as GridIcon, 
  Bed, 
  Building2, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  X, 
  Check, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Wifi, 
  Utensils, 
  Car, 
  Dumbbell, 
  Sparkles, 
  Bus, 
  Users, 
  ArrowUpDown,
  Flame,
  Clock,
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

// Interfaces for full TypeScript safety
interface Property {
  id: string;
  title: string;
  category: 'Room' | 'Partition' | 'Studio' | 'Bed Space' | 'Apartment';
  location: string;
  address: string;
  price: number;
  imageUrl: string;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  occupancy: string;
  nationalityPrefer: string;
  whatsappNumber: string;
  postedDate: string;
  description: string;
}

export default function App() {
  // State variables for Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Selected Property Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeModalImageIdx, setActiveModalImageIdx] = useState<number>(0);

  // Lists of options
  const categories = ['Room', 'Partition', 'Studio', 'Bed Space', 'Apartment'];
  const locations = [
    'Al Wahda', 
    'Mussafah', 
    'Khalifa City', 
    'Tourist Club Area', 
    'Mohammed Bin Zayed City', 
    'Al Reem Island',
    'Al Muroor',
    'Hamdan Street',
    'Yas Island'
  ];
  const amenitiesList = [
    'WiFi Included', 
    'Fully Furnished', 
    'Separate Kitchen', 
    'Gym & Pool', 
    'Neat & Clean', 
    'Near Bus Stop',
    'Family Allowed',
    'AC Included'
  ];

  // Raw Mock Data matching website flow
  const propertiesData: Property[] = [
    {
      id: 'prop-1',
      title: 'Premium Master Room with Attached Bath',
      category: 'Room',
      location: 'Al Wahda',
      address: 'Hazza Bin Zayed Street, Al Wahda, Abu Dhabi',
      price: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Fully Furnished', 'WiFi Included', 'Near Bus Stop', 'AC Included', 'Neat & Clean'],
      isVerified: true,
      occupancy: 'Solo / Couple',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971501234567',
      postedDate: '2026-06-14',
      description: 'Super clean master room located right next to Al Wahda Mall. High-speed internet is fully complimentary. Ideal for professional individuals or couples looking for clean, peaceful living.'
    },
    {
      id: 'prop-2',
      title: 'Affordable Closed Partition Room with Window',
      category: 'Partition',
      location: 'Mussafah',
      address: 'Shabiya 12, Mussafah, Abu Dhabi',
      price: 800,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['WiFi Included', 'Family Allowed', 'Neat & Clean', 'AC Included'],
      isVerified: true,
      occupancy: 'Solo Male / Female',
      nationalityPrefer: 'Asian / Indian',
      whatsappNumber: '971509876543',
      postedDate: '2026-06-15',
      description: 'Spacious gypsum partition room with individual key lock door and a proper window. Rent includes water, electricity, high-speed WiFi, and daily common area cleaning.'
    },
    {
      id: 'prop-3',
      title: 'Chic Studio Apartment with Sea View',
      category: 'Studio',
      location: 'Al Reem Island',
      address: 'Marina Heights, Al Reem Island, Abu Dhabi',
      price: 3200,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Separate Kitchen', 'Gym & Pool', 'Fully Furnished', 'Neat & Clean', 'AC Included'],
      isVerified: true,
      occupancy: 'Solo / Couple',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971504445555',
      postedDate: '2026-06-12',
      description: 'A beautiful luxury studio apartment located in Al Reem Island. Stunning direct view of the marina, central air conditioning, fully fitted kitchen appliances, and complete access to top-tier health club facilities.'
    },
    {
      id: 'prop-4',
      title: 'Luxury Bed Space in Shared Room',
      category: 'Bed Space',
      location: 'Tourist Club Area',
      address: 'Al Zahiyah Street, Tourist Club Area, Abu Dhabi',
      price: 600,
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['WiFi Included', 'Neat & Clean', 'Near Bus Stop'],
      isVerified: true,
      occupancy: 'Male Shared',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971501112222',
      postedDate: '2026-06-13',
      description: 'Extremely clean and non-crowded executive bed space. Only 3 people in a huge master room. High-speed internet, premium medical mattress, and fully automatic washing machine provided.'
    },
    {
      id: 'prop-5',
      title: 'Spacious 2BHK Premium Family Apartment',
      category: 'Apartment',
      location: 'Mohammed Bin Zayed City',
      address: 'Zone 5, MBZ City, Abu Dhabi',
      price: 4500,
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Separate Kitchen', 'Gym & Pool', 'Family Allowed', 'AC Included'],
      isVerified: true,
      occupancy: 'Family Only',
      nationalityPrefer: 'Arab / Western',
      whatsappNumber: '971503337777',
      postedDate: '2026-06-10',
      description: 'Ground floor spacious 2BHK with separate entrance, massive living hall, and private parking yard. Conveniently located near Mazyad Mall, schools, and essential facilities.'
    },
    {
      id: 'prop-6',
      title: 'Cozy Cozy Single Partition with High Ceiling',
      category: 'Partition',
      location: 'Hamdan Street',
      address: 'Electra Back Street, Hamdan, Abu Dhabi',
      price: 950,
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['WiFi Included', 'Fully Furnished', 'Neat & Clean'],
      isVerified: false,
      occupancy: 'Solo Female',
      nationalityPrefer: 'Filipino / Asian',
      whatsappNumber: '971505556666',
      postedDate: '2026-06-14',
      description: 'Fully furnished compact partition room with comfortable bed, cupboard, and side-table. Shared kitchen facilities available. Home features high-speed internet and quiet, peaceful flatmates.'
    },
    {
      id: 'prop-7',
      title: 'Bright Studio Apartment near Zayed University',
      category: 'Studio',
      location: 'Khalifa City',
      address: 'Street 15, Sector 12, Khalifa City A, Abu Dhabi',
      price: 2100,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Separate Kitchen', 'AC Included', 'Neat & Clean', 'WiFi Included'],
      isVerified: true,
      occupancy: 'Solo / Couple',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971508889999',
      postedDate: '2026-06-11',
      description: 'Beautiful, newly constructed studio on the first floor. Rent includes top quality split AC maintenance, water/electricity bills, and private paved street parking.'
    },
    {
      id: 'prop-8',
      title: 'Spacious Shared Room Bed Space for Females',
      category: 'Bed Space',
      location: 'Al Muroor',
      address: 'Muroor Road Near Bus Station, Abu Dhabi',
      price: 550,
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['WiFi Included', 'Near Bus Stop', 'Neat & Clean'],
      isVerified: true,
      occupancy: 'Female Shared',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971502223333',
      postedDate: '2026-06-09',
      description: 'Quiet, peaceful executive female bed space in a spacious room. Rent is completely inclusive of unlimited high-speed WiFi, cooking facilities, gas, and electricity bills.'
    },
    {
      id: 'prop-9',
      title: 'Modern 1BHK Apartment in High Floor',
      category: 'Apartment',
      location: 'Yas Island',
      address: 'Water Edge Building 3, Yas Island, Abu Dhabi',
      price: 5200,
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Gym & Pool', 'Separate Kitchen', 'AC Included', 'Neat & Clean'],
      isVerified: true,
      occupancy: 'Solo / Couple',
      nationalityPrefer: 'Any Nationality',
      whatsappNumber: '971507778888',
      postedDate: '2026-06-15',
      description: 'Stunning 1BHK unit at Water Edge Yas Island. Enjoys built-in wardrobes, state-of-the-art gym access, infinity pool, secure car parking, and beautiful canal views from the private balcony.'
    }
  ];

  // Handle Amenity selections
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  // Reset Filters logic
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setMinPrice(0);
    setMaxPrice(6000);
    setSelectedAmenities([]);
    setSortBy('default');
  };

  // Filter & Sort Logic using useMemo for top performance
  const filteredProperties = useMemo(() => {
    let result = [...propertiesData];

    // Search Query (title, location, address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Location Filter
    if (selectedLocation !== 'All') {
      result = result.filter(item => item.location === selectedLocation);
    }

    // Price Bounds
    result = result.filter(item => item.price >= minPrice && item.price <= maxPrice);

    // Selected Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(item => 
        selectedAmenities.every(amenity => item.amenities.includes(amenity))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return result;
  }, [searchQuery, selectedCategory, selectedLocation, minPrice, maxPrice, selectedAmenities, sortBy]);

  // Open Property Modal Helper
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setActiveModalImageIdx(0);
  };

    return (
        <div className="min-h-screen text-slate-800 font-sans">
            {/* ==========================================
                SEARCH BAR & PAGE BRIEF
                ========================================== */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-[#ff0066]/10 to-[#ff0066]/10"
                
            >
                {/* <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0066]/10 rounded-full blur-3xl pointer-events-none"/> */}
                
                <div className="container mx-auto space-y-6 relative z-10 text-center md:text-left">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-white bg-[#ff0066]/15 border border-[#ff0066]/20">
                        <Flame className="w-3.5 h-3.5 fill-red-500" /> Live Verified Accommodations
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
                        Explore Spaces In <span className="text-[#ff0066]">Abu Dhabi</span>
                        </h2>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base font-semibold max-w-2xl">
                            Filter through professional rooms, custom partition enclosures, luxury studios, cost-friendly shared spaces, or full family suites with active direct WhatsApp connects.
                        </p>
                    </div>

                    {/* Fast Search input wrapper */}
                    <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-2xl border border-slate-300 max-w-3xl flex flex-col sm:flex-row gap-2 items-center">
                        <div className="flex items-center gap-2 flex-1 w-full px-2">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <input 
                                type="text" 
                                placeholder="Search area, landmark, keywords (e.g. Marina Heights, Muroor Road)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-slate-800 font-bold text-sm focus:outline-none placeholder-slate-400 py-2"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                                <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button 
                        onClick={() => {}} 
                        className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] text-white text-xs font-black tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5"
                        >
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ==========================================
                MAIN EXPLORER GRID: Left Filters / Right Grid
                ========================================== */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Results Info Bar */}
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2 order-2 sm:order-1">
                        <p className="text-base font-bold text-slate-700">
                        Showing <span className="text-slate-800 font-black">{filteredProperties.length}</span> verified spaces
                        </p>
                        {selectedCategory !== 'All' && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black text-[#ff0066] bg-pink-50 rounded-full border border-pink-100">
                            {selectedCategory.toUpperCase()}
                        </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 order-1 sm:order-2">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
                            <ArrowUpDown className="w-4 h-4 text-slate-500" />
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-sm sm:text-base font-bold text-slate-700 focus:outline-none cursor-pointer"
                            >
                                <option value="default">Default Sort</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="latest">Latest Listed</option>
                            </select>
                        </div>

                        {/* Layout Toggle View Mode (Only visible above mobile) */}
                        <div className="hidden sm:flex items-center bg-slate-200/50 p-1 rounded-xl">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#ff0066]' : 'text-slate-400 hover:text-slate-700'}`}
                                title="Grid view"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg cursor-pointer transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#ff0066]' : 'text-slate-400 hover:text-slate-700'}`}
                                title="List view"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Filter Toggle Button */}
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-1 bg-[#0a192f] text-white px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                    {/* ==========================================
                        SIDEBAR FILTERS (Visible on desktop screens)
                        ========================================== */}
                    <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#ff0066]" /> Filters
                            </h3>
                            <button 
                                onClick={clearAllFilters}
                                className="text-xs sm:text-sm font-bold text-slate-400 hover:text-[#ff0066] transition-colors"
                            >
                                Reset All
                            </button>
                        </div>

                        {/* Category selection */}
                        <div className="space-y-2.5">
                            <label className="block text-xs sm:text-base font-black text-slate-500 uppercase tracking-widest">Property Category</label>
                            <div className="flex flex-col gap-1.5">
                                <button
                                type="button"
                                onClick={() => setSelectedCategory('All')}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-base font-extrabold flex items-center justify-between transition-all
                                    ${selectedCategory === 'All' ? 'bg-pink-50 text-[#ff0066]' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                <span>All Accommodations</span>
                                {selectedCategory === 'All' && <Check className="w-4 h-4 text-[#ff0066]" />}
                                </button>
                                {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-base font-extrabold flex items-center justify-between transition-all
                                    ${selectedCategory === cat ? 'bg-pink-50 text-[#ff0066]' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <span>{cat}</span>
                                    {selectedCategory === cat && <Check className="w-4 h-4 text-[#ff0066]" />}
                                </button>
                                ))}
                            </div>
                        </div>

                        {/* Location selector dropdown */}
                        <div className="space-y-2.5">
                            <label className="block text-xs sm:text-base font-black text-slate-500 uppercase tracking-widest">Select Location</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#ff0066] cursor-pointer bg-white"
                            >
                                <option value="All">All Abu Dhabi Areas</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        {/* Price limits (Min and Max range) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs sm:text-base font-black text-slate-500 uppercase tracking-wide">Monthly Rent (AED)</label>
                                <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2 py-0.5 rounded-md">
                                    {minPrice} - {maxPrice}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="6000" 
                                    step="100"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Min price</label>
                                        <input 
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Max price</label>
                                        <input 
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities filters Checklist */}
                        <div className="space-y-2.5">
                            <label className="block text-xs sm:text-base font-black text-slate-500 uppercase tracking-wide">Amenities &amp; Features</label>
                            <div className="flex flex-col gap-2">
                                {amenitiesList.map((amenity) => {
                                    const isChecked = selectedAmenities.includes(amenity);
                                    return (
                                        <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity)}
                                        className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 text-left hover:text-[#ff0066] transition-colors"
                                        >
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all
                                            ${isChecked ? 'bg-[#ff0066] border-[#ff0066] text-white' : 'border-slate-300 bg-white'}`}
                                        >
                                            {isChecked && <Check className="w-3 h-3 stroke-3" />}
                                        </div>
                                        <span>{amenity}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </aside>

                    {/* ==========================================
                        PROPERTY ITEMS GRID SECTION (9 Cols)
                        ========================================== */}
                    <section className="lg:col-span-9 space-y-6">
                        
                        {filteredProperties.length === 0 ? (
                            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                                    <HelpCircle className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base md:text-2xl font-extrabold text-slate-800">No properties match your current filters</h4>
                                    <p className="text-sm md:text-base text-slate-500">Try loosening your price caps, changing categories, or clearing keyword search terms.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="px-5 py-2.5 rounded-xl bg-[#0a192f] text-white text-xs md:text-base cursor-pointer font-bold hover:bg-[#ff0066] transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
                                : "flex flex-col gap-4"
                            }>
                                {filteredProperties.map((prop) => (
                                    <div 
                                        key={prop.id}
                                        className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex overflow-hidden group cursor-pointer
                                        ${viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'}`}
                                        onClick={() => openModal(prop)}
                                    >
                                        
                                        {/* Media Thumbnail */}
                                        <div className={`relative overflow-hidden bg-slate-100 shrink-0
                                            ${viewMode === 'grid' ? 'aspect-4/3 w-full' : 'aspect-4/3 w-full sm:w-60'}`}
                                        >
                                            <img 
                                                src={prop.imageUrl} 
                                                alt={prop.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Pink Category Tag Overlaid */}
                                            <span className="absolute bottom-3 left-3 bg-[#ff0066] text-white text-sm font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                                                {prop.category}
                                            </span>

                                            {/* Top Overlay Badge for Verified items */}
                                            {prop.isVerified && (
                                                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-sm font-black tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                    VERIFIED
                                                </span>
                                            )}
                                        </div>

                                        {/* Meta Info & Features */}
                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                        
                                            <div className="space-y-1.5">
                                                {/* Location Header */}
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                                                    <span className="text-xs sm:text-sm font-bold text-slate-600 truncate">{prop.location}</span>
                                                </div>

                                                {/* Title text */}
                                                <h3 className="text-xs sm:text-base font-black text-[#0a192f] group-hover:text-[#ff0066] transition-colors leading-snug line-clamp-2">
                                                    {prop.title}
                                                </h3>

                                                {/* Monthly Cost */}
                                                <p className="text-[#ff0066] font-medium text-xs">
                                                    <span className="text-base sm:text-lg font-black">
                                                        AED {prop.price.toLocaleString()}
                                                    </span>{' '}
                                                    <span className="font-bold text-xs">/month</span>
                                                </p>
                                            </div>

                                        {/* Display 2 active amenities for preview */}
                                        <div className="pt-2 border-t border-slate-50 grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-600 font-semibold">
                                            <div className="flex items-center gap-1 truncate">
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="truncate">{prop.amenities[0] || 'Clean Area'}</span>
                                            </div>
                                            <div className="flex items-center gap-1 truncate">
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="truncate">{prop.amenities[1] || 'AC Provided'}</span>
                                            </div>
                                        </div>

                                        {/* Detail Footer Button & WhatsApp triggers */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-slate-400 font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>Active Listing</span>
                                            </span>

                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <a
                                                    href={`https://wa.me/${prop.whatsappNumber}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg transition-colors shadow-sm flex items-center justify-center"
                                                    title="Direct WhatsApp"
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.091-2.868-6.944-1.851-1.852-4.314-2.871-6.937-2.872-5.438 0-9.863 4.413-9.866 9.83-.001 1.745.486 3.453 1.411 4.967l-.962 3.511 3.601-.945zM17.52 14.3c-.3-.149-1.777-.874-2.052-.974-.275-.1-.475-.149-.675.15-.2.299-.775.973-.95 1.173-.175.2-.35.224-.65.074-.3-.149-1.265-.466-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.073-.275.998-1.05 2.196-1.05 2.246 0 .05.15.349.625.874.775.848 1.625 1.123 1.925 1.248.3.125.4.1.55-.075.15-.175.65-.748.8-1.022.15-.274.3-.224.6-.074s1.9.949 2.225 1.124c.325.174.525.249.6.374.075.124.075.723-.225 1.022-.3.299-1.5 1.472-1.5 1.472z" />
                                                    </svg>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => openModal(prop)}
                                                    className="text-xs sm:text-[13px] font-black text-white px-3 py-1.5 rounded-lg bg-[#0a192f] hover:bg-[#ff0066] transition-colors uppercase tracking-wider"
                                                >
                                                    Details
                                                </button>
                                            </div>
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
                MOBILE FILTERS SLIDEOVER PANEL
                ========================================== */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-250">
                        
                        <div className="space-y-6">
                            {/* Header inside mobile sidebar */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <h3 className="text-base font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-[#ff0066]" /> Filters
                                </h3>
                                <button 
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Property Category options */}
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('All')}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border
                                        ${selectedCategory === 'All' ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                    >
                                        All Types
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border
                                            ${selectedCategory === cat ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                        >
                                        {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Abu Dhabi Area</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-700 bg-white focus:outline-none"
                                >
                                    <option value="All">All Areas</option>
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>

                            {/* Price limits range */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Monthly Rent</label>
                                    <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2.5 py-0.5 rounded-md">
                                        AED {maxPrice} max
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="6000" 
                                    step="100"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                            </div>

                            {/* Amenities list checklist */}
                            <div className="space-y-2.5">
                                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Amenities</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {amenitiesList.map((amenity) => {
                                        const isChecked = selectedAmenities.includes(amenity);
                                        return (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => toggleAmenity(amenity)}
                                            className={`px-3 py-2 rounded-xl text-sm font-bold text-center border transition-all truncate
                                            ${isChecked ? 'bg-[#ff0066]/10 border-[#ff0066] text-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                        >
                                            {amenity}
                                        </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Bottom Actions inside Mobile Drawer */}
                        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 mt-6">
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Clear Filters
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full py-3 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] text-white text-sm font-black uppercase tracking-wider transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ==========================================
                PROPERTY DETAIL DETAIL LIGHTBOX MODAL
                ========================================== */}
            {selectedProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
                        
                        {/* Left Box: Gallery / Visual assets */}
                        <div className="w-full md:w-1/2 bg-slate-900/5 p-4 flex flex-col justify-between md:sticky md:top-0 h-full min-h-75 md:min-h-120">
                            {/* Main Active Image Display */}
                            <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-sm flex-1">
                                <img 
                                    src={selectedProperty.images[activeModalImageIdx]} 
                                    alt={selectedProperty.title} 
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Category tag Overlay */}
                                <span className="absolute bottom-4 left-4 bg-[#ff0066] text-white text-xs font-black tracking-widest px-3.5 py-1.5 rounded-full uppercase">
                                    {selectedProperty.category}
                                </span>

                                {selectedProperty.isVerified && (
                                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black tracking-widest px-3.5 py-1.5 rounded-lg">
                                    VERIFIED NEST
                                </span>
                                )}
                            </div>

                            {/* Thumbnails list navigation if available */}
                            {selectedProperty.images.length > 1 && (
                                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                                {selectedProperty.images.map((img, idx) => (
                                    <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveModalImageIdx(idx)}
                                    className={`w-14 sm:w-16 aspect-4/3 rounded-lg overflow-hidden border-2 shrink-0 transition-all
                                        ${idx === activeModalImageIdx ? 'border-[#ff0066] scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                    <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                </div>
                            )}
                        </div>

                        {/* Right Box: Specifications & Interactive Actions */}
                        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedProperty(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                        {/* Title, Address & Cost */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-sm text-slate-500 font-bold">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{selectedProperty.address}</span>
                                </div>
                                <h4 className="text-lg sm:text-2xl font-black text-[#0a192f] leading-snug">
                                    {selectedProperty.title}
                                </h4>
                            </div>

                            <div className="flex items-baseline gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <span className="text-2xl font-black text-[#0a192f]">AED {selectedProperty.price.toLocaleString()}</span>
                                <span className="text-slate-500 text-sm font-bold">/ month (All-Inclusive)</span>
                            </div>
                        </div>

                        {/* Description Body */}
                        <div className="space-y-2">
                            <p className="text-sm sm:text-base font-black text-slate-400 uppercase tracking-widest">Overview Details</p>
                            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-semibold">
                                {selectedProperty.description}
                            </p>
                        </div>

                        {/* Key preferences / specifications */}
                        <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-slate-100">
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Ideal Occupancy</p>
                                <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.occupancy}</p>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Preference</p>
                                <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.nationalityPrefer}</p>
                            </div>
                        </div>

                        {/* Amenities specifications Checklist */}
                        <div className="space-y-2.5">
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Included Amenities</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedProperty.amenities.map((amenity) => (
                                    <span 
                                    key={amenity}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200/50"
                                    >
                                        <Check className="w-3.5 h-3.5 text-[#ff0066] stroke-3" />
                                        <span>{amenity}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons: WhatsApp chat & simulated calling */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            <a 
                                href={`https://wa.me/${selectedProperty.whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3.5 px-5 bg-[#25d366] hover:bg-[#20ba59] active:scale-98 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                            >
                                <MessageCircle className="w-9 h-9 fill-white" />
                                <span>Chat on WhatsApp</span>
                            </a>

                            <button
                                onClick={() => alert(`Connecting securely with ${selectedProperty.occupancy} manager at +${selectedProperty.whatsappNumber}`)}
                                className="py-3.5 px-6 rounded-2xl border-2 border-[#0a192f] text-[#0a192f] hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-black uppercase tracking-wider transition-all"
                            >
                                Show Phone Number
                            </button>
                        </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}