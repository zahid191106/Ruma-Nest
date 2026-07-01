'use client';

import React, { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Home, 
  Grid as GridIcon, 
  Calendar, 
  X, 
  Loader2, 
  Phone, 
  Layers, 
  User,
  Info,
  Check,
  FileText
} from 'lucide-react';

interface PropertyPostForm {
  title: string;
  propertyType: string;
  location: string;
  buildingName: string;
  purpose: 'rent' | 'sell';
  price: string;
  billingCycle: string;
  isAllInclusive: boolean;
  bedrooms: number;
  totalBedsInRoom: number;
  bathrooms: number;
  isEnsuite: boolean;
  floorNumber: string;
  sizeSqFt: string;
  idealOccupancy: string;
  amenities: string[];
  contactName: string;
  whatsappPhone: string;
  overview: string;
}

interface Suggestion {
  formatted: string;
  place_id: string;
}

export default function PropertyPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form Field & Array States
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [amenityInput, setAmenityInput] = useState<string>('');
  const [propertyForm, setPropertyForm] = useState<PropertyPostForm>({
    title: '',
    propertyType: 'room',
    location: '',
    buildingName: '',
    purpose: 'rent',
    price: '',
    billingCycle: 'monthly',
    isAllInclusive: true,
    bedrooms: 1,
    totalBedsInRoom: 1,
    bathrooms: 1,
    isEnsuite: false,
    floorNumber: '',
    sizeSqFt: '',
    idealOccupancy: 'Solo / Couple',
    amenities: [],
    contactName: '',
    whatsappPhone: '',
    overview: ''
  });

  // Autocomplete States (Geoapify Dubai Constraint)
  const [propertyQuery, setPropertyQuery] = useState('');
  const [propertySuggestions, setPropertySuggestions] = useState<Suggestion[]>([]);
  const [propertyIsLoading, setPropertyIsLoading] = useState(false);
  const [propertyIsLocationOpen, setPropertyIsLocationOpen] = useState(false);
  const propertyDebounce = useRef<NodeJS.Timeout | null>(null);
  const [propertySelectedAt, setPropertySelectedAt] = useState<number | null>(null);
  const dubaiBoundingBox = "54.85,24.75,55.55,25.35";

  // --- Change Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPropertyForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setPropertyForm(prev => ({ ...prev, [name]: value }));
    }
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
      if (trimmed && !propertyForm.amenities.includes(trimmed)) {
        setPropertyForm(prev => ({
          ...prev,
          amenities: [...prev.amenities, trimmed]
        }));
        setAmenityInput('');
      }
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setPropertyForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // --- Location Selection Handlers ---
  const selectPropertyLocation = (loc: string) => {
    setPropertyForm(prev => ({ ...prev, location: loc }));
    setPropertyQuery(loc);
    setPropertyIsLocationOpen(false);
    setPropertySuggestions([]);
    setPropertySelectedAt(Date.now());
  };

  const clearPropertyInput = () => {
    setPropertyForm(prev => ({ ...prev, location: '' }));
    setPropertyQuery('');
    setPropertySuggestions([]);
    setPropertyIsLocationOpen(false);
  };

  // --- Geoapify Autocomplete Pipeline ---
  useEffect(() => {
    if (!propertyQuery || propertyQuery.length < 3) {
      setPropertySuggestions([]);
      return;
    }
    if (propertySelectedAt && Date.now() - propertySelectedAt < 500) return;
    if (propertyDebounce.current) clearTimeout(propertyDebounce.current);

    propertyDebounce.current = setTimeout(async () => {
      setPropertyIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(propertyQuery)}&filter=rect:${dubaiBoundingBox}&bias=countrycode:ae&limit=5&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features) {
          const mapped = data.features.map((f: any) => ({ formatted: f.properties.formatted, place_id: f.properties.place_id }));
          setPropertySuggestions(mapped);
          setPropertyIsLocationOpen(true);
        }
      } catch (err) {
        console.error('Error fetching property locations:', err);
      } finally {
        setPropertyIsLoading(false);
      }
    }, 350);

    return () => {
      if (propertyDebounce.current) clearTimeout(propertyDebounce.current);
    };
  }, [propertyQuery]);

  // --- Submission Handler ---
  const handlePropertySubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedImages || selectedImages.length === 0) {
      alert('Please upload at least one property image.');
      return;
    }
    if (propertyForm.amenities.length === 0) {
      alert('Please add at least one amenity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', propertyForm.title);
      formData.append('propertyType', propertyForm.propertyType);
      formData.append('location', propertyForm.location);
      formData.append('buildingName', propertyForm.buildingName);
      formData.append('purpose', propertyForm.purpose);
      formData.append('price', propertyForm.price);
      formData.append('billingCycle', propertyForm.purpose === 'sell' ? '' : propertyForm.billingCycle);
      formData.append('isAllInclusive', String(propertyForm.purpose === 'sell' ? false : propertyForm.isAllInclusive));
      formData.append('bedrooms', String(propertyForm.bedrooms));
      formData.append('totalBedsInRoom', String(propertyForm.totalBedsInRoom));
      formData.append('bathrooms', String(propertyForm.bathrooms));
      formData.append('isEnsuite', String(propertyForm.isEnsuite));
      formData.append('floorNumber', propertyForm.floorNumber);
      formData.append('sizeSqFt', propertyForm.sizeSqFt);
      formData.append('idealOccupancy', propertyForm.idealOccupancy);
      formData.append('overview', propertyForm.overview);
      
      formData.append('contactName', propertyForm.contactName);
      formData.append('whatsappPhone', propertyForm.whatsappPhone);
      
      propertyForm.amenities.forEach(amenity => {
        formData.append('amenities', amenity);
      });

      Array.from(selectedImages).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/property', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Something went wrong');
      }

      // Appends query notification message, then flashes standard routing patterns
      router.push('/properties?notif=submitted');
      
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-8 text-white relative">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Home /> RumaNest Property Listing Form
          </h1>
          <p className="text-emerald-100 mt-2 text-sm max-w-xl">
            Complete the system fields below to submit your property post for approval.
          </p>
        </div>

        <form onSubmit={handlePropertySubmit} className="p-6 space-y-6">
          
          {/* Rent or Sell Switch */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Listing Purpose</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPropertyForm(prev => ({ ...prev, purpose: 'rent' }))}
                className={`py-2.5 rounded-lg text-sm font-bold transition ${propertyForm.purpose === 'rent' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'}`}
              >
                For Rent
              </button>
              <button
                type="button"
                onClick={() => setPropertyForm(prev => ({ ...prev, purpose: 'sell' }))}
                className={`py-2.5 rounded-lg text-sm font-bold transition ${propertyForm.purpose === 'sell' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'}`}
              >
                For Sell
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Listing Title *</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText size={18} />
              </div>
              <input
                type="text"
                required
                name="title"
                value={propertyForm.title}
                onChange={handleInputChange}
                placeholder="e.g., Premium Master Room with Attached Bath"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Property Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Type *</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GridIcon size={18} />
                </div>
                <select
                  name="propertyType"
                  value={propertyForm.propertyType}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  <option value="room">Room</option>
                  <option value="bed_space">Bed Space</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
            </div>

            {/* Dubai Location Address Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dubai Location Address *</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Type 3+ letters to search Dubai..."
                  value={propertyQuery}
                  onChange={(e) => {
                    setPropertyQuery(e.target.value);
                    if (!e.target.value) clearPropertyInput();
                  }}
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                {propertyQuery && (
                  <button type="button" onClick={clearPropertyInput} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                    <X size={16} />
                  </button>
                )}
              </div>

              {propertyIsLocationOpen && propertySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {propertySuggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => selectPropertyLocation(suggestion.formatted)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0 text-slate-700 transition flex items-start gap-2"
                    >
                      <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
                      <span>{suggestion.formatted}</span>
                    </button>
                  ))}
                </div>
              )}
              {propertyIsLoading && (
                <div className="absolute right-3 top-9.5 text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Building Name & Ideal Occupancy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Building / Tower Name</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Home size={18} />
                </div>
                <input
                  type="text"
                  name="buildingName"
                  value={propertyForm.buildingName}
                  onChange={handleInputChange}
                  placeholder="e.g., Marina Gate"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ideal Occupancy / Target Tenants</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Info size={18} />
                </div>
                <input
                  type="text"
                  name="idealOccupancy"
                  value={propertyForm.idealOccupancy}
                  onChange={handleInputChange}
                  placeholder="e.g., Solo / Couple, Females Only"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Price Segment */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (AED) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  name="price"
                  value={propertyForm.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {propertyForm.purpose === 'rent' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Billing Cycle *</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <select
                      name="billingCycle"
                      value={propertyForm.billingCycle}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {propertyForm.purpose === 'rent' && (
              <label className="inline-flex items-center gap-2 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  name="isAllInclusive"
                  checked={propertyForm.isAllInclusive}
                  onChange={handleInputChange}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                />
                <span className="text-sm font-medium text-slate-600">Is Rent All-Inclusive? (DEWA & WiFi bills included)</span>
              </label>
            )}
          </div>

          {/* Specifications Panel */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 border-b pb-1 mb-3">Room Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  name="bedrooms"
                  value={propertyForm.bedrooms}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Beds in Room</label>
                <input
                  type="number"
                  min="1"
                  name="totalBedsInRoom"
                  value={propertyForm.totalBedsInRoom}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  name="bathrooms"
                  value={propertyForm.bathrooms}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Size (Sq.Ft.)</label>
                <input
                  type="number"
                  name="sizeSqFt"
                  value={propertyForm.sizeSqFt}
                  onChange={handleInputChange}
                  placeholder="e.g., 850"
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Floor Level</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Layers size={16} />
                  </div>
                  <input
                    type="number"
                    name="floorNumber"
                    value={propertyForm.floorNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center pl-1 pt-4">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isEnsuite"
                    checked={propertyForm.isEnsuite}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                />
                  <span className="text-sm font-medium text-slate-600">Ensuite Attached Bathroom?</span>
                </label>
              </div>
            </div>
          </div>

          {/* Amenities System */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Amenities (Press Enter to Add)</label>
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={handleAddAmenity}
              placeholder="Type e.g., Balcony, Chiller Free, Gym and hit Enter"
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {propertyForm.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 bg-slate-50 p-2 rounded-xl border border-dashed border-slate-200">
                {propertyForm.amenities.map((amenity, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {amenity}
                    <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-emerald-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description Block */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Description / Overview *</label>
            <textarea
              required
              rows={4}
              name="overview"
              value={propertyForm.overview}
              onChange={handleInputChange}
              placeholder="Write structural description layout details..."
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Images Gallery *</label>
            <input
              type="file"
              multiple
              required
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          {/* Contact Methods Metadata Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 border-b pb-1">Contact Action Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Name</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="contactName"
                    value={propertyForm.contactName}
                    onChange={handleInputChange}
                    placeholder="e.g., Ali"
                    className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    name="whatsappPhone"
                    value={propertyForm.whatsappPhone}
                    onChange={handleInputChange}
                    placeholder="971501234567"
                    className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Publishing Space...
              </>
            ) : (
              'Publish Property Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}