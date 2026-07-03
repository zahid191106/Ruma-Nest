'use client';

import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Grid as GridIcon, 
  DollarSign, 
  Calendar, 
  Send, 
  Check, 
  X, 
  Loader2, 
  Phone, 
  ArrowUpDown, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

// Exact state schema matching ActionCard_2.tsx[cite: 2]
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

interface Suggestion {
  formatted: string;
  place_id: string;
}

export default function RoommatesPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form Field & Array States[cite: 2]
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [amenityInput, setAmenityInput] = useState<string>('');
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

  // Autocomplete States (Geoapify Dubai Constraint)[cite: 2]
  const [tenantQuery, setTenantQuery] = useState('');
  const [tenantSuggestions, setTenantSuggestions] = useState<Suggestion[]>([]);
  const [tenantIsLoading, setTenantIsLoading] = useState(false);
  const [tenantIsLocationOpen, setTenantIsLocationOpen] = useState(false);
  const tenantDebounce = useRef<NodeJS.Timeout | null>(null);
  const [tenantSelectedAt, setTenantSelectedAt] = useState<number | null>(null);
  const dubaiBoundingBox = "54.85,24.75,55.55,25.35";

  const toggleDropdown = (id: string | null) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  // --- Image Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
    }
  };

  // --- Amenities Array Handling ---
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

  // --- Location Selection Handlers ---
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

  // --- Geoapify Autocomplete Pipeline[cite: 2] ---
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

  // --- Exact Submission Logic from ActionCard_2[cite: 2] ---
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
      
      // Map arrays correctly into boundary data chunks[cite: 2]
      tenantForm.amenities.forEach(amenity => {
        formData.append('amenities', amenity);
      });

      // Binary asset streams[cite: 2]
      Array.from(selectedImages).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/roommate', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Something went wrong');
      }

      setSuccessMessage(`Success! Your room requirement listing has been posted for admin approval.`);
      
      // Clean Form Context[cite: 2]
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

  return (
    <div className="min-gradient-bg max-w-2xl mx-auto py-2 px-4 font-sans text-left">
      {/* Toast Alert Component */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 max-w-md animate-bounce">
          <div className="bg-white/20 p-1.5 rounded-full"><Check className="w-5 h-5 text-white" /></div>
          <div>
            <p className="font-bold text-sm">Action Completed</p>
            <p className="text-xs text-emerald-100 mt-0.5">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="ml-auto hover:bg-white/10 p-1 rounded"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-100">
          <div className="p-2 bg-pink-50 text-[#ff0066] rounded-xl"><Sparkles className="w-5 h-5" /></div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Post Roommate Requirement</h1>
            <p className="text-sm text-slate-400">Find matching flatmates and shared accommodations</p>
          </div>
        </div>

        <form onSubmit={handleTenantSubmit} className="space-y-4 pt-6">
          {/* Title input */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Listing Title</label>
            <input 
              type="text" required minLength={4} maxLength={80}
              placeholder="e.g., Luxury Master Bedroom Bedspace near Metro"
              value={tenantForm.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
            />
          </div>

          {/* Location Picker with geoapify handling[cite: 2] */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Location / Area</label>
            <div className="relative">
              <div className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-[#ff0066] transition-all flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text" required placeholder="Type area (e.g., Dubai Marina, Al Barsha)..."
                  value={tenantForm.location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-transparent h-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gender & Spaces Need Selectors[cite: 2] */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Gender Preference</label>
              <button
                type="button" onClick={() => toggleDropdown('gender')}
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
              >
                <span>{tenantForm.gender === 'men' ? 'Men Only' : tenantForm.gender === 'female' ? 'Females Only' : tenantForm.gender === 'couple' ? 'Couples Allowed' : 'Select'}</span>
                <Users className="w-4 h-4 text-slate-400" />
              </button>
              {activeDropdown === 'gender' && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {[{ title: 'Men Only', value: 'men' }, { title: 'Females Only', value: 'female' }, { title: 'Couples Allowed', value: 'couple' }].map(g => (
                    <button
                      key={g.value} type="button"
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
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Spaces Needed</label>
              <button
                type="button" onClick={() => toggleDropdown('freeSpace')}
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
              >
                <span>{tenantForm.freeSpace} Person(s)</span>
                <GridIcon className="w-4 h-4 text-slate-400" />
              </button>
              {activeDropdown === 'freeSpace' && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num} type="button"
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

          {/* Pricing Config[cite: 2] */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Max Budget (AED)</label>
              <div className="relative flex items-center">
                <input 
                  type="number" required min={1} placeholder="e.g., 1500" value={tenantForm.priceAmount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, priceAmount: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Billing Cycle</label>
              <button
                type="button" onClick={() => toggleDropdown('billingCycle')}
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
              >
                <span className="capitalize">{tenantForm.billingCycle || 'Select'}</span>
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
              </button>
              {activeDropdown === 'billingCycle' && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {['weekly', 'monthly'].map(cycle => (
                    <button
                      key={cycle} type="button"
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

          {/* Timeline & WhatsApp Connection Details[cite: 2] */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Move In</label>
              <button
                type="button" onClick={() => toggleDropdown('moveIn')}
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-left text-sm font-semibold text-slate-800 bg-white flex items-center justify-between"
              >
                <span>{tenantForm.moveIn ? tenantForm.moveIn.replace('_', ' ') : 'When?'}</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </button>
              {activeDropdown === 'moveIn' && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {[{ title: 'Immediately', value: 'immediately' }, { title: 'Within 1 Week', value: '1_week' }, { title: 'Within 2 Weeks', value: '2_weeks' }, { title: 'Next Month', value: 'next_month' }].map(time => (
                    <button
                      key={time.value} type="button"
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
              <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">WhatsApp Number</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                <input 
                  type="tel" required placeholder="+971500000000" value={tenantForm.whatsappNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTenantForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
                />
              </div>
            </div>
          </div>

          {/* Amenities Field Layout (Enter Tagging Action)[cite: 2] */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Amenities</label>
            <p className="text-xs md:text-sm text-slate-400 mb-1.5 font-medium">Type an amenity (e.g. Balcony, Wifi) and press Enter</p>
            <div className="relative flex items-center">
              <input
                type="text" placeholder="Type amenity here..." value={amenityInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAmenityInput(e.target.value)}
                onKeyDown={handleAddAmenity}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#ff0066]"
              />
              <button
                type="button"
                onClick={() => {
                  const fakeEvent = { key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>;
                  handleAddAmenity(fakeEvent);
                }}
                className="absolute right-2 px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#ff0066] font-bold text-sm transition-colors"
              >
                + Add
              </button>
            </div>
            {tenantForm.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tenantForm.amenities.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-xs bg-pink-50 text-[#ff0066] px-2.5 py-1 rounded-lg font-bold border border-pink-100">
                    {item}
                    <button type="button" onClick={() => handleRemoveAmenity(idx)} className="hover:bg-pink-100 rounded p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Input Pipeline[cite: 2] */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Room / Property Images</label>
            <div className="mt-1 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-pink-400 transition-colors relative bg-slate-50/50">
              <input 
                type="file" multiple required accept="image/*" onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <span className="text-xs md:text-sm font-bold text-slate-600">Click to upload room images</span>
                <span className="text-xs md:text-sm text-slate-400">Upload at least 1 photo</span>
              </div>
            </div>
            {selectedImages && selectedImages.length > 0 && (
              <div className="text-xs md:text-sm text-emerald-600 font-bold mt-2 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Selected {selectedImages.length} image(s) ready to upload
              </div>
            )}
          </div>

          {/* Action Trigger Submit Button[cite: 2] */}
          <button
            type="submit" disabled={isSubmitting}
            className="w-full py-3.5 mt-4 rounded-xl bg-[#ff0066] hover:bg-[#e6005c] disabled:bg-slate-300 text-white font-extrabold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Post'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}