'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef, KeyboardEvent } from 'react';
import { 
  MapPin, 
  Users, 
  Grid as GridIcon, 
  DollarSign, 
  Calendar, 
  Send, 
  Plus, 
  Check, 
  Shield, 
  MessageSquare, 
  X,
  Loader2,
  Sparkles,
  Building,
  Phone,
  ArrowUpDown,
  Image as ImageIcon
} from 'lucide-react';

// Type declarations for Roommate / Tenant State
interface TenantRequirementForm {
  title: string;
  location: string;
  gender: string;
  freeSpace: number;
  priceAmount: string;
  billingCycle: string;
  moveIn: string;
  amenities: string[];
  whatsappNumber: string;
}

interface PropertyListingForm {
  title: string;
  type: string;
  location: string;
  price: string;
  whatsapp: string;
  description: string;
}

interface Suggestion {
  formatted: string;
  place_id: string;
}

export default function App() {
  // --- Modals Toggle States ---
  const [isTenantModalOpen, setIsTenantModalOpen] = useState<boolean>(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Success Feedback Messages ---
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Image Upload State ---
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [amenityInput, setAmenityInput] = useState<string>('');

  // --- Tenant Requirement State ---
  const [tenantForm, setTenantForm] = useState<TenantRequirementForm>({
    title: '',
    location: '',
    gender: '',
    freeSpace: 1,
    priceAmount: '',
    billingCycle: 'monthly',
    moveIn: '',
    amenities: [],
    whatsappNumber: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
    }
  };

  const handleAddAmenity = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = amenityInput.trim();
      if (trimmed && !tenantForm.amenities.includes(trimmed)) {
        setTenantForm(prev => ({
          ...prev,
          amenities: [...prev.amenities, trimmed]
        }));
        setAmenityInput('');
      }
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setTenantForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // --- Right Card State: Property Listing Form ---
  const [propertyForm, setPropertyForm] = useState<PropertyListingForm>({
    title: '',
    type: 'Room',
    location: '',
    price: '',
    whatsapp: '',
    description: ''
  });

  // --- Autocomplete Location Settings (Geoapify) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dubaiBoundingBox = "54.85,24.75,55.55,25.35";
  const [searchSelectedAt, setSearchSelectedAt] = useState<number | null>(null);

  // Autocomplete state for Tenant Location field
  const [tenantQuery, setTenantQuery] = useState('');
  const [tenantSuggestions, setTenantSuggestions] = useState<Suggestion[]>([]);
  const [tenantIsLoading, setTenantIsLoading] = useState(false);
  const [tenantIsLocationOpen, setTenantIsLocationOpen] = useState(false);
  const tenantDebounce = useRef<NodeJS.Timeout | null>(null);
  const [tenantSelectedAt, setTenantSelectedAt] = useState<number | null>(null);

  const propertyTypes = ['Room', 'Studio', 'Bed Space', 'Apartment'];

  const toggleDropdown = (id: string | null) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  // 🟢 HANDLE TENANT REQUIREMENT FORM SUBMISSION TO SANITY WITH BINARY FILES
  const handleTenantSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedImages || selectedImages.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    if (tenantForm.amenities.length === 0) {
      alert('Please add at least one amenity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', tenantForm.title);
      formData.append('location', tenantForm.location);
      formData.append('gender', tenantForm.gender);
      formData.append('freeSpace', String(tenantForm.freeSpace));
      formData.append('priceAmount', tenantForm.priceAmount);
      formData.append('billingCycle', tenantForm.billingCycle);
      formData.append('moveIn', tenantForm.moveIn);
      formData.append('whatsappNumber', tenantForm.whatsappNumber);
      
      // Append array strings using multiple append declarations for API extraction
      tenantForm.amenities.forEach(amenity => {
        formData.append('amenities', amenity);
      });

      // Append binary images
      Array.from(selectedImages).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/roommate', {
        method: 'POST',
        body: formData, // Browser sets multipart/form-data boundary definitions automatically
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Something went wrong');
      }

      setSuccessMessage(`Success! Your room requirement listing has been posted for admin approval.`);
      setIsTenantModalOpen(false);
      
      // Reset form states completely
      setTenantForm({
        title: '', location: '', gender: '', freeSpace: 1,
        priceAmount: '', billingCycle: 'monthly', moveIn: '', amenities: [], whatsappNumber: ''
      });
      setTenantQuery('');
      setSelectedImages(null);
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // 🔵 HANDLE PROPERTY LISTING FORM SUBMISSION
  const handlePropertySubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Thank you! Your property "${propertyForm.title}" has been listed successfully!`);
    setIsListingModalOpen(false);
    setPropertyForm({ title: '', type: 'Room', location: '', price: '', whatsapp: '', description: '' });
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Property Location handlers
  const selectLocationHandler = (loc: string) => {
    setPropertyForm(prev => ({ ...prev, location: loc }));
    setSearchQuery(loc);
    setIsLocationOpen(false);
    setSuggestions([]);
    setSearchSelectedAt(Date.now());
  };

  const clearInputHandler = () => {
    setPropertyForm(prev => ({ ...prev, location: '' }));
    setSearchQuery('');
    setSuggestions([]);
    setIsLocationOpen(false);
  };

  // Tenant Location handlers
  const selectTenantLocation = (loc: string) => {
    setTenantForm(prev => ({ ...prev, location: loc }));
    setTenantQuery(loc);
    setTenantIsLocationOpen(false);
    setTenantSuggestions([]);
    setTenantSelectedAt(Date.now());
  };

  const clearTenantInput = () => {
    setTenantForm(prev => ({ ...prev, location: '' }));
    setTenantQuery('');
    setTenantSuggestions([]);
    setTenantIsLocationOpen(false);
  };

  // Geoapify effect for Right Modal (Property Listing)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    if (searchSelectedAt && Date.now() - searchSelectedAt < 500) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setIsApiLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&filter=rect:${dubaiBoundingBox}&bias=countrycode:ae&limit=5&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.features) {
          const mapped = data.features.map((f: any) => ({ formatted: f.properties.formatted, place_id: f.properties.place_id }));
          setSuggestions(mapped);
          setIsLocationOpen(true);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setIsApiLoading(false);
      }
    }, 350);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  // Geoapify effect for Left Modal (Tenant Requirement)
  useEffect(() => {
    if (!tenantQuery || tenantQuery.length < 3) {
      setTenantSuggestions([]);
      return;
    }
    if (tenantSelectedAt && Date.now() - tenantSelectedAt < 500) return;
    if (tenantDebounce.current) clearTimeout(tenantDebounce.current);

    tenantDebounce.current = setTimeout(async () => {
      setTenantIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(tenantQuery)}&filter=rect:${dubaiBoundingBox}&bias=countrycode:ae&limit=5&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features) {
          const mapped = data.features.map((f: any) => ({ formatted: f.properties.formatted, place_id: f.properties.place_id }));
          setTenantSuggestions(mapped);
          setTenantIsLocationOpen(true);
        }
      } catch (err) {
        console.error('Error fetching tenant locations:', err);
      } finally {
        setTenantIsLoading(false);
      }
    }, 350);

    return () => {
      if (tenantDebounce.current) clearTimeout(tenantDebounce.current);
    };
  }, [tenantQuery]);

  return (
    <div className="w-full container mx-auto py-0 pb-5 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-8">
        
        {/* Dynamic Success Toast */}
        {successMessage && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 max-w-md animate-bounce">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Action Completed</p>
              <p className="text-xs text-emerald-100 mt-0.5">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="ml-auto hover:bg-white/10 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SECTION CONTAINER Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
          {/* =========================================================
              CARD 1: TENANT REQUIREMENT POST
              ========================================================= */}
          <div className="bg-white rounded-[2.5rem] border border-pink-400 shadow-[0_15px_45px_rgba(255,0,102,0.05)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
            
            <div className="flex flex-col md:flex-row gap-6 items-start h-full">
              <div className="w-full md:w-1/4 flex flex-col items-center justify-center self-stretch">
                <div className="absolute hidden lg:w-full h-auto md:flex flex-col items-center">
                  <img src="/images/action-image-1.avif" alt="i need a room" className='w-84 h-full object-contain' />
                  <p className="text-[10px] text-slate-400 font-bold mt-2 text-center">Looking in Dubai</p>
                </div>
              </div>

              <div className="flex-1 w-full space-y-6 text-left">
                <div>
                  <h3 className="text-3xl font-extrabold text-[#ff0066] tracking-tight">Tenant Post</h3>
                  <p className="text-base font-semibold text-slate-500 mt-1">
                    Tell us what you need, we will match for you!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-pink-50 rounded-full flex items-center justify-center text-[#ff0066] shadow-inner">
                      <Shield className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Quick Post</h4>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">Easy Process</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-pink-50 rounded-full flex items-center justify-center text-[#ff0066] shadow-inner">
                      <Users className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Roommate Match</h4>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">Direct Connect</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-pink-50 rounded-full flex items-center justify-center text-[#ff0066] shadow-inner">
                      <MessageSquare className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Instant Leads</h4>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">Direct Chat</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-center pt-2">
                  <button
                    onClick={() => setIsTenantModalOpen(true)}
                    className="relative w-full py-4 px-6 rounded-2xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-sm sm:text-base tracking-wider cursor-pointer uppercase shadow-lg shadow-pink-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 z-30"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Post Your Requirement Now</span>
                  </button>
                  <p className="text-xs text-slate-400 font-bold tracking-tight">It takes less than 60 seconds!</p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              CARD 2: LIST YOUR PROPERTY
              ========================================================= */}
          <div className="bg-[#0a192f] rounded-[2.5rem] border border-slate-800 shadow-[0_15px_45px_rgba(10,25,47,0.3)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row gap-6 items-start h-full">
              <div className="flex-1 w-full space-y-6 text-left">
                <div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">LIST YOUR PROPERTY</h3>
                  <p className="text-base font-semibold text-slate-300 mt-1">
                    List once &amp; get verified tenants directly!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
                      <Shield className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="lg:sm xl:text-base font-extrabold text-white">Free Listing</h4>
                      <p className="text-sm font-bold text-slate-400 mt-0.5">100% Free</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center gap-2 shadow-2xl">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
                      <Users className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="lg:sm xl:text-base font-extrabold text-white">Verified Tenants</h4>
                      <p className="text-sm font-bold text-slate-400 mt-0.5">Trusted People</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 shadow-inner">
                      <MessageSquare className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                    </div>
                    <div>
                      <h4 className="lg:sm xl:text-base font-extrabold text-white">WhatsApp Leads</h4>
                      <p className="text-sm font-bold text-slate-400 mt-0.5">Direct Chat</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-center pt-2">
                  <button
                    onClick={() => setIsListingModalOpen(true)}
                    className="relative w-full py-4 px-6 rounded-2xl bg-[#0052cc] hover:bg-[#0043b3] text-white font-extrabold text-sm sm:text-base tracking-wider cursor-pointer uppercase shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 z-30"
                  >
                    <Plus className="w-5 h-5" />
                    <span>List Your Property Now</span>
                  </button>
                  <p className="text-xs text-slate-400 font-bold tracking-tight">It takes less than 60 seconds!</p>
                </div>
              </div>

              <div className="w-full md:w-1/4 flex flex-col items-center justify-center self-stretch">
                <div className="absolute hidden lg:w-full h-auto md:flex flex-col items-center">
                  <img src="/images/action-image-2.avif" alt="upload your property" className='w-84 h-full object-contain' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          POPUP MODAL 1: Tenant Form Modal (Updated to match Schema)
         ========================================================= */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl pointer-events-none -z-10" />
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-50 text-[#ff0066] rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-800">Post Roommate Requirement</h4>
                  <p className="text-xs text-slate-400">Find matching flatmates and shared accommodations</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTenantModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTenantSubmit} className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto px-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Listing Title</label>
                <input 
                  type="text" 
                  required
                  minLength={10}
                  maxLength={80}
                  placeholder="e.g., Luxury Master Bedroom Bedspace near Metro"
                  value={tenantForm.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location / Area</label>
                <div className="relative">
                  <div className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-[#ff0066] transition-all flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Type area (e.g., Dubai Marina, Al Barsha)..."
                      value={tenantQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantQuery(e.target.value)}
                      onFocus={() => tenantQuery.length >= 3 && setTenantIsLocationOpen(true)}
                      className="w-full bg-transparent h-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                      required
                    />
                    {tenantIsLoading && <Loader2 className="w-4 h-4 text-[#ff0066] animate-spin shrink-0" />}
                    {tenantQuery && !tenantIsLoading && (
                      <button type="button" onClick={clearTenantInput} className="p-0.5 hover:bg-slate-200 rounded-full shrink-0 cursor-pointer">
                        <X className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    )}
                  </div>

                  {tenantIsLocationOpen && tenantSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto p-1">
                      {tenantSuggestions.map(item => (
                        <button
                          key={item.place_id}
                          type="button"
                          onClick={() => selectTenantLocation(item.formatted)}
                          className={`w-full px-3 py-2 text-left text-sm font-medium cursor-pointer rounded-xl transition-all flex items-center justify-between ${tenantForm.location === item.formatted ? 'bg-pink-50 text-[#ff0066] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <span className="truncate pr-2">{item.formatted}</span>
                          {tenantForm.location === item.formatted && <Check className="w-4 h-4 text-[#ff0066] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Gender Preference</label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('gender')}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
                  >
                    <span>
                      {tenantForm.gender === 'men' ? 'Men Only' : tenantForm.gender === 'female' ? 'Females Only' : tenantForm.gender === 'couple' ? 'Couples Allowed' : 'Select'}
                    </span>
                    <Users className="w-4 h-4 text-slate-400" />
                  </button>
                  {activeDropdown === 'gender' && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {[
                        { title: 'Men Only', value: 'men' },
                        { title: 'Females Only', value: 'female' },
                        { title: 'Couples Allowed', value: 'couple' }
                      ].map(g => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => { setTenantForm(prev => ({ ...prev, gender: g.value })); toggleDropdown(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-pink-50 hover:text-[#ff0066]"
                        >
                          {g.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Spaces Needed</label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('freeSpace')}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
                  >
                    <span>{tenantForm.freeSpace} Person(s)</span>
                    <GridIcon className="w-4 h-4 text-slate-400" />
                  </button>
                  {activeDropdown === 'freeSpace' && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => { setTenantForm(prev => ({ ...prev, freeSpace: num })); toggleDropdown(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-pink-50"
                        >
                          {num} {num === 1 ? 'Person' : 'Persons'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Max Budget (AED)</label>
                  <div className="relative flex items-center">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input 
                      type="number" 
                      required
                      min={1}
                      placeholder="e.g., 1500"
                      value={tenantForm.priceAmount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, priceAmount: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Billing Cycle</label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('billingCycle')}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
                  >
                    <span className="capitalize">{tenantForm.billingCycle || 'Select'}</span>
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {activeDropdown === 'billingCycle' && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {['weekly', 'monthly'].map(cycle => (
                        <button
                          key={cycle}
                          type="button"
                          onClick={() => { setTenantForm(prev => ({ ...prev, billingCycle: cycle })); toggleDropdown(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-pink-50 capitalize"
                        >
                          {cycle}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Move In</label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('moveIn')}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
                  >
                    <span>
                      {tenantForm.moveIn ? tenantForm.moveIn.replace('_', ' ') : 'When?'}
                    </span>
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </button>
                  {activeDropdown === 'moveIn' && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {[
                        { title: 'Immediately', value: 'immediately' },
                        { title: 'Within 1 Week', value: '1_week' },
                        { title: 'Within 2 Weeks', value: '2_weeks' },
                        { title: 'Next Month', value: 'next_month' }
                      ].map(time => (
                        <button
                          key={time.value}
                          type="button"
                          onClick={() => { setTenantForm(prev => ({ ...prev, moveIn: time.value })); toggleDropdown(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-pink-50"
                        >
                          {time.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">WhatsApp Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+971500000000"
                      value={tenantForm.whatsappNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 💡 AMENITIES FIELD (Enter Tagging System Layout) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Amenities</label>
                <p className="text-sm text-slate-400 mb-1.5 font-medium">Type an amenity (e.g. Balcony, Wifi) and press Enter</p>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type amenity here..."
                    value={amenityInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAmenityInput(e.target.value)}
                    onKeyDown={handleAddAmenity}
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
                  />
                  
                  {/* + Button positioned neatly over the right side of the input field */}
                  <button
                    type="button"
                    onClick={() => {
                      // Simulates the exact Enter behavior by passing a fake event to your existing handler
                      const fakeEvent = {
                        key: 'Enter',
                        preventDefault: () => {}
                      } as React.KeyboardEvent<HTMLInputElement>;
                      handleAddAmenity(fakeEvent);
                    }}
                    className="absolute right-2 px-5 py-4 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#ff0066] font-bold text-lg leading-none transition-colors cursor-pointer w-7 h-7 flex items-center justify-center"
                    title="Add Amenity"
                  >
                    +
                  </button>
                </div>
                {tenantForm.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {tenantForm.amenities.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-xs bg-pink-50 text-[#ff0066] px-2.5 py-1 rounded-lg font-bold border border-pink-100">
                        {item}
                        <button type="button" onClick={() => handleRemoveAmenity(idx)} className="hover:bg-pink-100 rounded p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 💡 ROOM PROPERTY IMAGES UPLOAD ACCORDING TO SCHEMA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Room / Property Images</label>
                <div className="mt-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-pink-400 transition-colors relative bg-slate-50/50">
                  <input 
                    type="file" 
                    multiple 
                    required
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Click to upload room images</span>
                    <span className="text-[10px] text-slate-400">Upload at least 1 photo</span>
                  </div>
                </div>
                {selectedImages && selectedImages.length > 0 && (
                  <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selected {selectedImages.length} image(s) ready to upload
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] disabled:bg-slate-300 text-white font-extrabold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Post'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          POPUP MODAL 2: List Property Quick Form Modal
         ========================================================= */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200">
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

            <form onSubmit={handlePropertySubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Listing Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Cozy Master Room with Balcony"
                  value={propertyForm.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Property Type</label>
                  <select
                    value={propertyForm.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPropertyForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none bg-white"
                  >
                    {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Monthly Rent (AED)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 1800"
                    value={propertyForm.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPropertyForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location Area</label>
                <div className="relative">
                  <div className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Type area (e.g., Khalidiya, Yas Island)..."
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.length >= 3 && setIsLocationOpen(true)}
                      className="w-full bg-transparent h-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    {isApiLoading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin shrink-0" />}
                    {searchQuery && !isApiLoading && (
                      <button type="button" onClick={clearInputHandler} className="p-0.5 hover:bg-slate-200 rounded-full shrink-0 cursor-pointer">
                        <X className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    )}
                  </div>

                  {isLocationOpen && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto p-1">
                      {suggestions.map(item => (
                        <button
                          key={item.place_id}
                          type="button"
                          onClick={() => selectLocationHandler(item.formatted)}
                          className={`w-full px-3 py-2 text-left text-sm font-medium cursor-pointer rounded-xl transition-all flex items-center justify-between ${propertyForm.location === item.formatted ? 'bg-rose-50 text-[#ff0066] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <span className="truncate pr-2">{item.formatted}</span>
                          {propertyForm.location === item.formatted && <Check className="w-4 h-4 text-[#ff0066] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">WhatsApp Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+971 50 123 4567"
                  value={propertyForm.whatsapp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPropertyForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description</label>
                <textarea 
                  rows={2}
                  placeholder="Tell tenants about utilities, flatmates, or key details..."
                  value={propertyForm.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-[#0052cc] hover:bg-[#0043b3] text-white font-extrabold text-sm tracking-wide uppercase transition-colors"
              >
                Submit Listing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}