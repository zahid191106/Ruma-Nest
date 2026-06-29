'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef, KeyboardEvent } from 'react';
import TenantForm from '@/components/TanentForm';
import PropertyForm from '@/components/PropertyForm';
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
          HIGH-END MODAL CONTAINER (Matches ActionCard Pattern)
          ========================================================= */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Backdrop click to close */}
          <div 
            onClick={() => setIsTenantModalOpen(false)} 
            className="absolute inset-0 cursor-pointer" 
          />
          
          {/* Form Modal Box Card */}
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800">Post Room Requirement</h3>
                <p className="text-sm text-slate-400 font-medium">Fill out the form below to look for roommates</p>
              </div>
              <button 
                onClick={() => setIsTenantModalOpen(false)}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body Container */}
            <div className="p-6 overflow-y-auto text-left">
              <TenantForm />
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          POPUP MODAL 2: List Property Quick Form Modal
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