'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyForm from "@/components/PropertyForm";
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
  Info, 
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
  Ruler,
  ArrowUpDown,
  Flame,
  Clock,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Building
} from 'lucide-react';
import { 
  SiFacebook, 
  SiX, 
  SiInstagram, 
  SiWhatsapp,
  SiTiktok,
  SiYoutube 
} from '@icons-pack/react-simple-icons';

// Interfaces for full TypeScript safety
interface Property {
  id: string;
  title: string;
  category: 'Room' | 'Studio' | 'Bed Space' | 'Apartment';
  location: string;
  address: string;
  price: number;
  purpose: 'rent' | 'sell';
  billingCycle?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isAllInclusive?: boolean;
  imageUrl: string;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  idealOccupancy?: string;
  whatsappNumber: string;
  contactName?: string;
  postedDate: string;
  overview: string;
  bedrooms?: number;
  bathrooms?: number;
  totalBedsInRoom?: number;
  isEnsuite?: boolean;
  floorNumber?: number;
  sizeSqFt?: number;
  buildingName?: string;
  isActive?: boolean;
  status?: string;
}

export default function App() {
  // State variables for Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('All');
  const [minRent, setMinRent] = useState<number>(0);
  const [maxRent, setMaxRent] = useState<number>(60000);
  const [minSale, setMinSale] = useState<number>(0);
  const [maxSale, setMaxSale] = useState<number>(10000000);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('All');
  const [selectedBedsInRoom, setSelectedBedsInRoom] = useState<string>('All');
  const [minSize, setMinSize] = useState<number>(0);
  const [maxSize, setMaxSize] = useState<number>(2000);
  const [selectedBathroomType, setSelectedBathroomType] = useState<string>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  
  // Selected Property Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeModalImageIdx, setActiveModalImageIdx] = useState<number>(0);

  // Lists of options
  const categories = ['Room', 'Studio', 'Bed Space', 'Apartment'];
  const defaultLocations = [
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
  const defaultAmenities = [
    'WiFi', 
    'Furnished', 
    'Kitchen', 
    'Gym & Pool', 
    'Neat & Clean', 
    'Near Bus Stop',
    'Family Allowed',
    'AC Included'
  ];

  const normalizeAmenityKey = (amenity: string) => {
    return amenity
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/\b(fully furnished|fully furnished room|furnished room)\b/g, 'furnished')
      .replace(/\b(included|available|provided|with|the|and|plus|space|room|area)\b/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showNotification, setShowNotification] = useState(false);

  // Read the URL query param on mount/change
  const notifParam = searchParams.get('notif');

    useEffect(() => {
        if (notifParam === 'submitted') {
        setShowNotification(true);
        setIsListingModalOpen(false);

        // 1. Set a 4-second timeout to hide the notification banner visually
        const hideTimeout = setTimeout(() => {
            setShowNotification(false);
        }, 4000);

        // 2. Set a 4.5-second timeout to cleanly scrub the query param from the address bar
        const cleanUrlTimeout = setTimeout(() => {
            // router.replace changes the URL without adding a new history entry
            router.replace('/properties'); 
        }, 4500);

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(cleanUrlTimeout);
        };
        }
    }, [notifParam, router]);

  // Live data from Sanity (fetched client-side)
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);

  useEffect(() => {
    let mounted = true;

    const mapDocToProperty = (doc: any): Property => {
      // Safely parse out location parts
      const locParts = (doc.location || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      const shortLocation = locParts.length >= 2 ? locParts[1] : locParts[0] || '';

      // Fallback asset array logic
      const images: string[] = doc.images && doc.images.length > 0
        ? doc.images.map((img: any) => urlFor(img).width(1200).url())
        : ['/images/action-image-1.avif'];

      const primaryImage = images[0] || '/images/action-image-1.avif';

      // Updated mapping to support all variations cleanly
      const typeMap: Record<string, 'Room' | 'Studio' | 'Bed Space' | 'Apartment'> = {
        room: 'Room',
        studio: 'Studio',
        bed_space: 'Bed Space',
        apartment: 'Apartment'
      };

      const rawType = doc.propertyType || '';
      const category = typeMap[rawType] || 'Room';

      return {
        id: doc._id,
        title: doc.title || 'Cozy Nest Space',
        category,
        location: shortLocation || 'Unknown Area',
        address: doc.location || 'Address Details Unavailable',
        price: doc.price || 0,
        purpose: doc.purpose || 'rent',
        billingCycle: doc.billingCycle || 'monthly',
        isAllInclusive: !!doc.isAllInclusive,
        imageUrl: primaryImage,
        images,
        amenities: doc.includedAmenities || [],
        isVerified: !!doc.isVerified,
        idealOccupancy: doc.idealOccupancy || 'Any',
        contactName: doc.contactDetails?.name || 'Property Owner',
        whatsappNumber: doc.contactDetails?.whatsappPhone || '',
        postedDate: doc._createdAt || new Date().toISOString(),
        overview: doc.overview || '',
        bedrooms: doc.bedrooms,
        bathrooms: doc.bathrooms,
        totalBedsInRoom: doc.totalBedsInRoom,
        isEnsuite: doc.isEnsuite,
        floorNumber: doc.floorNumber,
        sizeSqFt: doc.sizeSqFt,
        buildingName: doc.buildingName,
        isActive: !!doc.isActive,
        status: doc.status,
      };
    };

    // Pulling strictly active status values
    client
      .fetch(
        `*[_type == "property" && isActive == true && status == "active"]{
          _id, 
          title, 
          images, 
          isVerified, 
          propertyType, 
          location, 
          price,
          purpose,
          billingCycle,
          isAllInclusive,
          overview, 
          idealOccupancy, 
          includedAmenities, 
          contactDetails,
          bedrooms,
          bathrooms,
          totalBedsInRoom,
          isEnsuite,
          floorNumber,
          sizeSqFt,
          buildingName,
          isActive,
          status,
          _createdAt
        }`
      )
      .then((docs: any[]) => {
        if (!mounted) return;
        const mapped = docs.map(mapDocToProperty);
        setPropertiesData(mapped);
      })
      .catch((err) => {
        console.error('Sanity data pipelines failure error:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
    setSelectedPurpose('All');
    setMinRent(0);
    setMaxRent(60000);
    setMinSale(0);
    setMaxSale(10000000);
    setSelectedBedrooms('All');
    setSelectedBedsInRoom('All');
    setMinSize(0);
    setMaxSize(2000);
    setSelectedBathroomType('All');
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
      result = result.filter(item => item.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    // Purpose Filter (Rent or Sell)
    if (selectedPurpose !== 'All') {
      result = result.filter(item => item.purpose === selectedPurpose);
    }

    // Price Bounds for rent and sale
    result = result.filter(item => {
      if (item.purpose === 'rent') {
        return item.price >= minRent && item.price <= maxRent;
      }
      return item.price >= minSale && item.price <= maxSale;
    });

    // Bedroom filter
    if (selectedBedrooms !== 'All') {
      result = result.filter(item => item.bedrooms && item.bedrooms >= Number(selectedBedrooms));
    }

    // Beds-in-room filter
    if (selectedBedsInRoom !== 'All') {
      result = result.filter(item => item.totalBedsInRoom && item.totalBedsInRoom >= Number(selectedBedsInRoom));
    }

    // Size filter
    result = result.filter(item => {
      const size = item.sizeSqFt || 0;
      return size >= minSize && size <= maxSize;
    });

    // Attached bathroom filter
    if (selectedBathroomType !== 'All') {
      result = result.filter(item => {
        if (selectedBathroomType === 'ensuite') {
          return item.isEnsuite === true;
        }
        return item.isEnsuite === false;
      });
    }

    // Selected Amenities Matrix Check
    if (selectedAmenities.length > 0) {
      result = result.filter(item => 
        selectedAmenities.every((selectedAmenity) => {
          const selectedKey = normalizeAmenityKey(selectedAmenity);
          return item.amenities.some((itemAmenity) => normalizeAmenityKey(itemAmenity) === selectedKey);
        })
      );
    }

    // Sorting Modes Matrix
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return result;
  }, [propertiesData, searchQuery, selectedCategory, selectedLocation, selectedPurpose, minRent, maxRent, minSale, maxSale, selectedBedrooms, selectedBedsInRoom, minSize, maxSize, selectedBathroomType, selectedAmenities, sortBy]);

  const amenitiesOptions = useMemo(() => {
    // Use only the hardcoded amenities list instead of extracting values from Sanity
    return defaultAmenities;
  }, []);

  const locationOptions = useMemo(() => {
    const uniqueLocations = new Map<string, string>();
    propertiesData.map(item => item.location?.trim() || '').forEach((location) => {
      if (!location) return;
      const key = location.toLowerCase();
      if (!uniqueLocations.has(key)) {
        uniqueLocations.set(key, location);
      }
    });
    const options = Array.from(uniqueLocations.values());
    return options.length > 0 ? options : defaultLocations;
  }, [propertiesData]);

  // Open Property Modal Helper
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setActiveModalImageIdx(0);
  };

    return (
        <div className="min-h-screen text-slate-800 font-sans">
            {showNotification && (
                <div className='w-full absolute right-0 top-30 z-50 flex items-end justify-end'>
                    <div className="w-md mb-6 bg-green-400 border-l-4 border-green-700 p-4 rounded-xl flex items-start justify-end  gap-3 text-black animate-fadeIn shadow-sm">
                        <Check className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold text-base">Listing Uploaded Successfully!</p>
                            <p className="text-sm text-amber-900 mt-0.5">Your property details have been saved. Your post will appear publicly on this dashboard once reviewed and verified by an admin.</p>
                        </div>
                    </div>
                </div>
            )}
            {/* ==========================================
                SEARCH BAR & PAGE BRIEF
                ========================================== */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-[#ff0066]/10 to-[#ff0066]/10"
                
            >
                {/* <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0066]/10 rounded-full blur-3xl pointer-events-none"/> */}
                
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/header-image.webp" // Replace with your image URL
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-20" // Adjust opacity here to mix with the dark background
                    />
                </div>
                <div className="container mx-auto space-y-6 relative z-10 text-center md:text-left">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-white bg-[#ff0066]/15 border border-[#ff0066]/20">
                        <Flame className="w-3.5 h-3.5 fill-red-500" /> Live Verified Accommodations
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
                        Explore Spaces In <span className="text-[#ff0066]">Abu Dhabi</span>
                        </h2>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base font-semibold max-w-2xl">
                            Filter through professional rooms, luxury studios, cost-friendly shared spaces, or full family suites with active direct WhatsApp connects.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-start md:justify-flex-start gap-3 pt-2">
                        <button 
                            onClick={() => setIsListingModalOpen(true)}
                            className="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-extrabold text-base uppercase tracking-wider transition-all"
                        >
                            List Your Property
                        </button>
                        <button 
                            onClick={() => {
                                const el = document.getElementById('properties');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="h-11 px-6 bg-[#1a1625] hover:bg-[#252033] text-white border border-slate-800 rounded-xl font-bold text-base uppercase tracking-wider transition-colors"
                        >
                            View Properties
                        </button>
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
            <main id='properties' className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
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
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#ff0066] cursor-pointer bg-white"
                            >
                                <option value="All">All Accommodations</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
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
                                {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        {/* Purpose Filter (Rent or Sell) */}
                        <div className="space-y-2.5">
                            <label className="block text-xs sm:text-base font-black text-slate-500 uppercase tracking-widest">Listing Type</label>
                            <select
                                value={selectedPurpose}
                                onChange={(e) => setSelectedPurpose(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff0066]/10 focus:border-[#ff0066] cursor-pointer bg-white"
                            >
                                <option value="All">All Types</option>
                                <option value="rent">For Rent</option>
                                <option value="sell">For Sale</option>
                            </select>
                        </div>

                        {/* Rent Price limits */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs sm:text-base font-black text-slate-500 uppercase tracking-wide">Rent Price (AED)</label>
                                <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2 py-0.5 rounded-md">
                                    {minRent} - {maxRent}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="6000" 
                                    step="100"
                                    value={maxRent}
                                    onChange={(e) => setMaxRent(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Min Rent</label>
                                        <input 
                                        type="number"
                                        value={minRent}
                                        onChange={(e) => setMinRent(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Max Rent</label>
                                        <input 
                                        type="number"
                                        value={maxRent}
                                        onChange={(e) => setMaxRent(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sale Price limits */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs sm:text-base font-black text-slate-500 uppercase tracking-wide">Sale Price (AED)</label>
                                <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2 py-0.5 rounded-md">
                                    {minSale} - {maxSale}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10000000" 
                                    step="10000"
                                    value={maxSale}
                                    onChange={(e) => setMaxSale(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Min Sale</label>
                                        <input 
                                        type="number"
                                        value={minSale}
                                        onChange={(e) => setMinSale(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase">Max Sale</label>
                                        <input 
                                        type="number"
                                        value={maxSale}
                                        onChange={(e) => setMaxSale(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bedrooms and Beds filters */}
                        {/* <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</label>
                                    <select
                                        value={selectedBedrooms}
                                        onChange={(e) => setSelectedBedrooms(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none bg-white"
                                    >
                                        <option value="All">All</option>
                                        {[1,2,3,4,5,6].map((n) => (
                                          <option key={n} value={n}>{n}+ Beds</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Beds in Room</label>
                                    <select
                                        value={selectedBedsInRoom}
                                        onChange={(e) => setSelectedBedsInRoom(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none bg-white"
                                    >
                                        <option value="All">All</option>
                                        {[1,2,3,4,5,6].map((n) => (
                                          <option key={n} value={n}>{n}+ Beds</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div> */}

                        {/* Size and Attached Bathroom filters */}
                        {/* <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        value={minSize}
                                        onChange={(e) => setMinSize(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        value={maxSize}
                                        onChange={(e) => setMaxSize(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Bathroom Type</label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {['All','ensuite','shared'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setSelectedBathroomType(type)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${selectedBathroomType === type ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                        >
                                            {type === 'ensuite' ? 'Ensuite' : type === 'shared' ? 'Shared' : 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div> */}

                        {/* Amenities filters */}
                        <div className="space-y-2.5">
                            <label className="block text-xs sm:text-base font-black text-slate-500 uppercase tracking-wide">Amenities & Features</label>
                            <div className="grid grid-cols-2 gap-2">
                                {amenitiesOptions.map((amenity) => {
                                    const isActive = selectedAmenities.includes(amenity);
                                    return (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => toggleAmenity(amenity)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${isActive ? 'bg-[#ff0066]/10 border-[#ff0066] text-[#ff0066]' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white ${isActive ? 'bg-[#ff0066]' : 'bg-slate-200'}`}>
                                                    {isActive ? <Check className="w-3 h-3" /> : ''}
                                                </span>
                                                <span>{amenity}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-slate-400">Click to select multiple amenities. Active items appear in pink.</p>
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
                                            {/* {prop.status === "active" ? (
                                                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-sm font-black tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                    Active
                                                </span>
                                            ) : 
                                                <span className="absolute top-3 left-3 bg-slate-100 text-slate-700 border-slate-200 text-sm font-black tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                    Rented
                                                </span>
                                            } */}
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
                                                    <span className="font-bold text-xs">
                                                      {prop.purpose === 'sell' ? '(For Sale)' : `/${prop.billingCycle || 'month'}${prop.isAllInclusive ? ' (Inc.)' : ''}`}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] sm:text-xs text-slate-600 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Home className="w-4 h-4 text-[#ff0066] shrink-0" />
                                                    <span className="truncate">{prop.bedrooms ?? '—'} Rooms</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Bed className="w-4 h-4 text-[#ff0066] shrink-0" />
                                                    <span className="truncate">{prop.totalBedsInRoom ?? '—'} Beds</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Ruler className="w-4 h-4 text-[#ff0066] shrink-0" />
                                                    <span className="truncate">{prop.sizeSqFt ? `${prop.sizeSqFt} Sq Ft` : '—'} Area</span>
                                                </div>
                                            </div> */}

                                        {/* Display 2 active amenities for preview */}
                                        <div className="pt-2 border-t border-slate-50 grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-600 font-semibold">
                                            <div className="flex items-center gap-1 truncate">
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="truncate">{prop.amenities[0] || 'Clean Area'}</span>
                                            </div>
                                            {prop.amenities.length > 1 && (
                                                <div className="flex items-center gap-1 truncate">
                                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="truncate">{prop.amenities[1] || 'AC Provided'}</span>
                                                </div>
                                            )}
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
                                                    <SiWhatsapp className="w-4 h-4" />
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
                                    {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>

                            {/* Listing Type (Rent or Sell) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Listing Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPurpose('All')}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border
                                        ${selectedPurpose === 'All' ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPurpose('rent')}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border
                                        ${selectedPurpose === 'rent' ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                    >
                                        Rent
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPurpose('sell')}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border
                                        ${selectedPurpose === 'sell' ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                    >
                                        Sale
                                    </button>
                                </div>
                            </div>

                            {/* Rent Price limits */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Rent Price</label>
                                    <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2.5 py-0.5 rounded-md">
                                        AED {minRent} - {maxRent}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="6000" 
                                    step="100"
                                    value={maxRent}
                                    onChange={(e) => setMaxRent(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Rent</label>
                                    <input
                                        type="number"
                                        value={minRent}
                                        onChange={(e) => setMinRent(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Rent</label>
                                    <input
                                        type="number"
                                        value={maxRent}
                                        onChange={(e) => setMaxRent(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Sale Price limits */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Sale Price</label>
                                    <span className="text-sm font-black text-[#ff0066] bg-pink-50 px-2.5 py-0.5 rounded-md">
                                        AED {minSale} - {maxSale}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10000000" 
                                    step="10000"
                                    value={maxSale}
                                    onChange={(e) => setMaxSale(Number(e.target.value))}
                                    className="w-full accent-[#ff0066] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Sale</label>
                                    <input
                                        type="number"
                                        value={minSale}
                                        onChange={(e) => setMinSale(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Sale</label>
                                    <input
                                        type="number"
                                        value={maxSale}
                                        onChange={(e) => setMaxSale(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms / Beds / Size / Bathroom */}
                            {/* <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</label>
                                        <select
                                            value={selectedBedrooms}
                                            onChange={(e) => setSelectedBedrooms(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:outline-none"
                                        >
                                            <option value="All">All</option>
                                            {[1,2,3,4,5,6].map(n => (
                                                <option key={n} value={n}>{n}+ Beds</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Beds in Room</label>
                                        <select
                                            value={selectedBedsInRoom}
                                            onChange={(e) => setSelectedBedsInRoom(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:outline-none"
                                        >
                                            <option value="All">All</option>
                                            {[1,2,3,4,5,6].map(n => (
                                                <option key={n} value={n}>{n}+ Beds</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Size</label>
                                        <input
                                            type="number"
                                            value={minSize}
                                            onChange={(e) => setMinSize(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Size</label>
                                        <input
                                            type="number"
                                            value={maxSize}
                                            onChange={(e) => setMaxSize(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Bathroom Type</label>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {['All','ensuite','shared'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setSelectedBathroomType(type)}
                                                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border ${selectedBathroomType === type ? 'bg-pink-50 text-[#ff0066] border-[#ff0066]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                            >
                                                {type === 'ensuite' ? 'Ensuite' : type === 'shared' ? 'Shared' : 'All'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div> */}

                            {/* Amenities list checklist */}
                            <div className="space-y-2.5">
                                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Amenities</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {amenitiesOptions.map((amenity) => {
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
                    <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-7xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
                        
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

                                {/* {selectedProperty.isVerified == true ? (
                                    <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black tracking-widest px-3.5 py-1.5 rounded-lg">
                                        VERIFIED NEST
                                    </span>
                                ) : 
                                    <span className="absolute top-3 left-3 bg-slate-100 text-slate-700 border-slate-200 text-sm font-black tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                        NOT VERIFIED
                                    </span>
                                } */}
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
                                <span className="text-slate-500 text-sm font-bold">
                                  {selectedProperty.purpose === 'sell' ? '(For Sale)' : `/ ${selectedProperty.billingCycle || 'month'}${selectedProperty.isAllInclusive ? ' (All-Inclusive DEWA & WiFi)' : ''}`}
                                </span>
                            </div>
                        </div>

                        {/* Description Body */}
                        <div className="space-y-2">
                            <p className="text-sm sm:text-base font-black text-slate-400 uppercase tracking-widest">Overview Details</p>
                            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-semibold">
                                {selectedProperty.overview}
                            </p>
                        </div>

                        {/* Property Specifications Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            {/* {selectedProperty.bedrooms && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Bedrooms</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.bedrooms} BHK</p>
                              </div>
                            )}
                            {selectedProperty.bathrooms && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Bathrooms</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.bathrooms}</p>
                              </div>
                            )}
                            {selectedProperty.totalBedsInRoom && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Beds in Room</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.totalBedsInRoom}</p>
                              </div>
                            )}
                            {selectedProperty.isEnsuite !== undefined && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Bathroom</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.isEnsuite ? 'Ensuite' : 'Shared'}</p>
                              </div>
                            )}
                            {selectedProperty.sizeSqFt && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Size</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.sizeSqFt} Sq. Ft.</p>
                              </div>
                            )}
                            {selectedProperty.floorNumber && (
                              <div>
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Floor</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">Floor {selectedProperty.floorNumber}</p>
                              </div>
                            )} */}
                            {selectedProperty.buildingName && (
                              <div className="col-span-2">
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Building</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.buildingName}</p>
                              </div>
                            )}
                            {selectedProperty.idealOccupancy && (
                              <div className="col-span-2">
                                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Ideal Occupancy</p>
                                  <p className="text-xs sm:text-base font-bold text-slate-800 mt-0.5">{selectedProperty.idealOccupancy}</p>
                              </div>
                            )}
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
                                <SiWhatsapp className="w-9 h-9 fill-white" />
                                <span>Chat on WhatsApp</span>
                            </a>

                            <button
                                onClick={() => alert(`Connecting with ${selectedProperty.contactName} at +${selectedProperty.whatsappNumber}`)}
                                className="py-3.5 px-6 rounded-2xl border-2 border-[#0a192f] text-[#0a192f] hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-black uppercase tracking-wider transition-all"
                            >
                                Show Phone Number
                            </button>
                        </div>

                        </div>

                    </div>
                </div>
            )}

            {/* =========================================================
                    POPUP MODAL: List Property Quick Form Modal
                    ========================================================= */}
            {isListingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-3xl p-6 sm:p-8 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl pointer-events-none -z-10" />
                    
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-[#0052cc] rounded-xl">
                            <Building className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-lg font-extrabold text-slate-800">Quick Property Listing</h4>
                            <p className="text-xs text-slate-400">Gets published to active tenants instantly</p>
                        </div>
                        </div>
                        <button 
                            onClick={() => setIsListingModalOpen(false)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
        
                    {/* Scrollable Form Body Container */}
                    <div className="overflow-y-auto text-left">
                        <PropertyForm />
                    </div>
        
                    </div>
                </div>
            )}

        </div>
    );
}