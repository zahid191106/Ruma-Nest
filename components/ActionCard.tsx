'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Users, 
  Grid as GridIcon, 
  Globe, 
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
  Building
} from 'lucide-react';

// Type declarations for State & Options
interface RequirementForm {
  location: string;
  occupancy: string;
  type: string;
  nationality: string;
  budget: string;
  moveIn: string;
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
  // --- Left Card State: Post Requirement Form ---
  const [requirement, setRequirement] = useState<RequirementForm>({
    location: '',
    occupancy: '',
    type: '',
    nationality: '',
    budget: '',
    moveIn: ''
  });

  // Active dropdown identifiers
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- Right Card State: Property Listing Modal ---
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false);
  const [propertyForm, setPropertyForm] = useState<PropertyListingForm>({
    title: '',
    type: 'Room',
    location: '',
    price: '',
    whatsapp: '',
    description: ''
  });

    // Autocomplete state for modal Location field (Geoapify)
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const dubaiBoundingBox = "54.85,24.75,55.55,25.35";
    const [searchSelectedAt, setSearchSelectedAt] = useState<number | null>(null);

  // Success Feedback Messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock Dropdown Options
  const locations: string[] = ['Khalidiya', 'Al Reem Island', 'Al Muroor', 'Yas Island', 'Hamdan Street', 'Mussafah'];
  const occupancies: string[] = ['Solo Male', 'Solo Female', 'Couple', '2 Shared', '3+ Shared'];
  const propertyTypes: string[] = ['Room', 'Studio', 'Bed Space', 'Apartment'];
  const nationalities: string[] = ['Any Nationality', 'Arab', 'Asian', 'European', 'Indian / Pakistani', 'African'];
  const budgets: string[] = ['AED 500 - 1,000', 'AED 1,000 - 2,000', 'AED 2,000 - 3,500', 'AED 3,500 - 5,000', 'AED 5,000+'];
  const moveInTimes: string[] = ['Immediately', 'Within 1 Week', 'Within 2 Weeks', 'Next Month'];

  const handleDropdownSelect = (field: keyof RequirementForm, value: string) => {
    setRequirement(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleRequirementSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!requirement.location || !requirement.type) {
      alert('Please fill out at least Location and Property Type fields!');
      return;
    }
    setSuccessMessage(`Success! Your requirement for a ${requirement.type} in ${requirement.location} has been posted.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handlePropertySubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Thank you! Your property "${propertyForm.title}" has been listed successfully!`);
    setIsListingModalOpen(false);
    setPropertyForm({ title: '', type: 'Room', location: '', price: '', whatsapp: '', description: '' });
    setTimeout(() => setSuccessMessage(null), 5000);
  };

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

    useEffect(() => {
        if (!searchQuery || searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        // Skip immediate fetch if user just selected a suggestion
        if (searchSelectedAt && Date.now() - searchSelectedAt < 500) {
            return;
        }

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

  const toggleDropdown = (id: string) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

    // Left-card (requirement) autocomplete state
    const [leftQuery, setLeftQuery] = useState('');
    const [leftSuggestions, setLeftSuggestions] = useState<Suggestion[]>([]);
    const [leftIsLoading, setLeftIsLoading] = useState(false);
    const [leftIsLocationOpen, setLeftIsLocationOpen] = useState(false);
    const leftDebounce = useRef<NodeJS.Timeout | null>(null);
    const [leftSelectedAt, setLeftSelectedAt] = useState<number | null>(null);

    useEffect(() => {
        if (!leftQuery || leftQuery.length < 3) {
            setLeftSuggestions([]);
            return;
        }
        // Skip immediate fetch if user just selected a suggestion
        if (leftSelectedAt && Date.now() - leftSelectedAt < 500) {
            return;
        }
        if (leftDebounce.current) clearTimeout(leftDebounce.current);
        leftDebounce.current = setTimeout(async () => {
            setLeftIsLoading(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(leftQuery)}&filter=rect:${dubaiBoundingBox}&bias=countrycode:ae&limit=5&apiKey=${apiKey}`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.features) {
                    const mapped = data.features.map((f: any) => ({ formatted: f.properties.formatted, place_id: f.properties.place_id }));
                    setLeftSuggestions(mapped);
                    setLeftIsLocationOpen(true);
                }
            } catch (err) {
                console.error('Error fetching left locations:', err);
            } finally {
                setLeftIsLoading(false);
            }
        }, 350);

        return () => {
            if (leftDebounce.current) clearTimeout(leftDebounce.current);
        };
    }, [leftQuery]);

    const selectLeftLocation = (loc: string) => {
        setRequirement(prev => ({ ...prev, location: loc }));
        setLeftQuery(loc);
        setLeftIsLocationOpen(false);
        setLeftSuggestions([]);
        setLeftSelectedAt(Date.now());
    };

    const clearLeftInput = () => {
        setRequirement(prev => ({ ...prev, location: '' }));
        setLeftQuery('');
        setLeftSuggestions([]);
        setLeftIsLocationOpen(false);
    };

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
                    <button onClick={()=> setSuccessMessage(null)} className="ml-auto hover:bg-white/10 p-1 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* SECTION CONTAINER Grid: Stacks on mobile, dual side-by-side cards on lg monitors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
                {/* =========================================================
                    CARD 1: I NEED A ROOM (Pink & Red Theme)
                    ========================================================= */}
                <div className="bg-white rounded-[2.5rem] border border-pink-400 shadow-[0_15px_45px_rgba(255,0,102,0.05)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start h-full">
                    
                        {/* Left Column: Responsive Vector Character & Travel Suitcase */}
                        <div className="w-full md:w-1/4 flex flex-col items-center justify-center self-stretch">
                            <div className="absolute hidden lg:w-full h-auto md:flex flex-col items-center">
                                {/* Custom Styled SVG Character to replace image and avoid external asset breaks */}
                                <img src="/images/action-image-1.avif" alt="i need a room | Ruma Nest Dubai" className='w-84 h-full object-contain' />
                                <p className="text-[10px] text-slate-400 font-bold mt-2 text-center">Looking in Abu Dhabi</p>
                            </div>
                        </div>

                        {/* Right Column: Title & Input Selector Grid */}
                        <div className="flex-1 w-full space-y-5">
                            <div className="text-left">
                            <h3 className="text-3xl font-extrabold text-[#ff0066] tracking-tight">I NEED A ROOM</h3>
                            <p className="text-base font-semibold text-slate-500 mt-1">Tell us what you need, we will match for you!</p>
                            </div>

                            {/* Form Selection Grid (Matches 6 categories in layout) */}
                            <form onSubmit={handleRequirementSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    
                                    {/* Dropdown 1: Location (autocomplete) */}
                                    <div className="relative">
                                        <div className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5">
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0 flex-1">
                                                <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Location</p>
                                                <input
                                                    type="text"
                                                    placeholder="Where?"
                                                    value={leftQuery}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLeftQuery(e.target.value)}
                                                    onFocus={() => leftQuery.length >= 3 && setLeftIsLocationOpen(true)}
                                                    className="text-sm font-bold text-slate-400 mt-1 block truncate bg-transparent focus:outline-none w-full"
                                                />
                                            </div>
                                            {leftIsLoading && <Loader2 className="w-5 h-5 text-[#ff0066] animate-spin shrink-0" />}
                                            {leftQuery && !leftIsLoading && (
                                                <button type="button" onClick={clearLeftInput} className="ml-2 p-1 rounded hover:bg-slate-100">
                                                    <X className="w-4 h-4 text-slate-500" />
                                                </button>
                                            )}
                                        </div>

                                        {leftIsLocationOpen && leftSuggestions.length > 0 && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                                                {leftSuggestions.map(s => (
                                                    <button
                                                        key={s.place_id}
                                                        type="button"
                                                        onClick={() => selectLeftLocation(s.formatted)}
                                                        className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-[#ff0066] transition-colors"
                                                    >
                                                        {s.formatted}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {leftIsLocationOpen && leftQuery.length >= 3 && leftSuggestions.length === 0 && !leftIsLoading && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 p-3 text-center text-xs font-medium text-slate-400">
                                                No locations found inside Dubai
                                            </div>
                                        )}
                                    </div>

                                    {/* Dropdown 2: Solo / Couple */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown('occupancy')}
                                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                                        >
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0">
                                            <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Solo / Couple</p>
                                            <span className="text-sm font-bold text-slate-400 mt-1 block truncate">
                                                {requirement.occupancy || 'Who?'}
                                            </span>
                                            </div>
                                        </button>

                                        {activeDropdown === 'occupancy' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                                                {occupancies.map(occ => (
                                                    <button
                                                        key={occ}
                                                        type="button"
                                                        onClick={() => handleDropdownSelect('occupancy', occ)}
                                                        className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-[#ff0066] transition-colors"
                                                    >
                                                        {occ}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Dropdown 3: Room Type */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown('type')}
                                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                                        >
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <GridIcon className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0">
                                                <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Type</p>
                                                <span className="text-sm font-bold text-slate-400 mt-1 block truncate">
                                                    {requirement.type || 'Room / Studio'}
                                                </span>
                                            </div>
                                        </button>

                                        {activeDropdown === 'type' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                                                {propertyTypes.map(pt => (
                                                    <button
                                                        key={pt}
                                                        type="button"
                                                        onClick={() => handleDropdownSelect('type', pt)}
                                                        className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-[#ff0066] transition-colors"
                                                    >
                                                        {pt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Dropdown 4: Nationality */}
                                    <div className="relative">
                                        <div className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5">
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <Globe className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0 flex-1">
                                                <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Nationality</p>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Any Nationality, Arab, Asian..."
                                                    value={requirement.nationality}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequirement(prev => ({ ...prev, nationality: e.target.value }))}
                                                    className="text-sm font-bold text-slate-400 mt-1 block truncate bg-transparent focus:outline-none w-full"
                                                />
                                            </div>
                                            {requirement.nationality && (
                                                <button type="button" onClick={() => setRequirement(prev => ({ ...prev, nationality: '' }))} className="ml-2 p-1 rounded hover:bg-slate-100">
                                                    <X className="w-4 h-4 text-slate-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dropdown 5: Budget */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown('budget')}
                                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                                        >
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <DollarSign className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0">
                                                <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Budget</p>
                                                <span className="text-sm font-bold text-slate-400 mt-1 block truncate">
                                                    {requirement.budget || 'AED 500 - 5000+'}
                                                </span>
                                            </div>
                                        </button>

                                        {activeDropdown === 'budget' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                                                {budgets.map(bud => (
                                                    <button
                                                        key={bud}
                                                        type="button"
                                                        onClick={() => handleDropdownSelect('budget', bud)}
                                                        className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-[#ff0066] transition-colors"
                                                    >
                                                        {bud}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Dropdown 6: Move In Date */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown('moveIn')}
                                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                                        >
                                            <div className="px-1 bg-pink-50 rounded-lg text-[#ff0066]">
                                                <Calendar className="w-8 h-8" />
                                            </div>
                                            <div className="truncate min-w-0">
                                                <p className="text-sm font-black tracking-wider text-slate-800 uppercase leading-none">Move In</p>
                                                <span className="text-sm font-bold text-slate-400 mt-1 block truncate">
                                                    {requirement.moveIn || 'When?'}
                                                </span>
                                            </div>
                                        </button>

                                        {activeDropdown === 'moveIn' && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                                                {moveInTimes.map(mit => (
                                                    <button
                                                        key={mit}
                                                        type="button"
                                                        onClick={() => handleDropdownSelect('moveIn', mit)}
                                                        className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-[#ff0066] transition-colors"
                                                    >
                                                        {mit}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Submit Call to Action Button */}
                                <div className="space-y-2 text-center pt-2">
                                    <button
                                        type="submit"
                                        className="relative w-full py-4 px-6 rounded-2xl bg-[#ff0066] hover:bg-[#e6005c] text-white font-extrabold text-sm sm:text-base tracking-wider cursor-pointer uppercase shadow-lg shadow-pink-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Post My Requirement</span>
                                        <Send className="w-4 h-4" />
                                    </button>
                                    <p className="text-sm text-slate-400 font-bold tracking-tight">It's FREE &amp; Easy</p>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

                {/* =========================================================
                    CARD 2: LIST YOUR PROPERTY (Navy Blue & White Theme)
                    ========================================================= */}
                <div className="bg-[#0a192f] rounded-[2.5rem] border border-slate-800 shadow-[0_15px_45px_rgba(10,25,47,0.3)] overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

                    <div className="flex flex-col md:flex-row gap-6 items-start h-full">
                    
                        {/* Left Column Content / Actions */}
                        <div className="flex-1 w-full space-y-6 text-left">
                            
                            {/* Header Information */}
                            <div>
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">LIST YOUR PROPERTY</h3>
                                <p className="text-base font-semibold text-slate-300 mt-1">
                                    List once &amp; get verified tenants directly!
                                </p>
                            </div>

                            {/* Benefits / Circular Badges matching design */}
                            <div className="grid grid-cols-3 gap-2 py-4">
                            
                                {/* Benefit 1 */}
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
                                        <Shield className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                                    </div>
                                    <div>
                                        <h4 className="lg:sm xl:text-base font-extrabold text-white">Free Listing</h4>
                                        <p className="text-sm font-bold text-slate-400 mt-0.5">100% Free</p>
                                    </div>
                                </div>

                                {/* Benefit 2 */}
                                <div className="flex flex-col items-center text-center gap-2 shadow-2xl">
                                    <div className="lg:w-20 lg:h-20 xl:w-32 xl:h-32 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
                                        <Users className="lg:w-10 lg:h-10 xl:w-16 xl:h-16" />
                                    </div>
                                    <div>
                                        <h4 className="lg:sm xl:text-base font-extrabold text-white">Verified Tenants</h4>
                                        <p className="text-sm font-bold text-slate-400 mt-0.5">Trusted People</p>
                                    </div>
                                </div>

                                {/* Benefit 3 */}
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

                            {/* Launch Listing Button */}
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

                        {/* Right Column: Arab Landlord Character Illustration */}
                        <div className="w-full md:w-1/4 flex flex-col items-center justify-center self-stretch">
                            <div className="absolute hidden lg:w-full h-auto md:flex flex-col items-center">
                                <img src="/images/action-image-2.avif" alt="upload your property | Ruma Nest Property Dubai" className='w-84 h-full object-contain' />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

      {/* =========================================================
          POPUP MODAL: List Property Quick Form
         ========================================================= */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl pointer-events-none -z-10" />
            
            {/* Modal Header */}
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

            {/* Modal Form */}
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

                                    {isLocationOpen && searchQuery.length >= 3 && suggestions.length === 0 && !isApiLoading && (
                                        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 text-center text-xs font-medium text-slate-400">
                                            No locations found inside Dubai
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description</label>
                <textarea 
                  rows={2}
                  placeholder="Tell tenants about utilities, flatmates, or key details..."
                  value={propertyForm.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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