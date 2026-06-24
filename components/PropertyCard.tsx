'use client';
import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ArrowRight, 
  MapPin, 
  Wifi, 
  Users, 
  Car, 
  Utensils, 
  Sparkles, 
  Bed, 
  Bus, 
  Tv,
  HelpCircle,
  Dumbbell,
  Check,
  MessageCircle,
  X
} from 'lucide-react';
import { client } from '@/sanity/lib/client'; // Adjust path based on your setup
import { urlFor } from '@/sanity/lib/image';  // Image builder utility
import Link from 'next/link';

// Map dynamic string labels to Lucide Icon components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Fully Furnished': Bed,
  'WiFi Included': Wifi,
  'Near Bus Stop': Bus,
  'Separate Kitchen': Utensils,
  'Gym & Pool': Dumbbell, // If used in amenities list
  'Neat & Clean': Sparkles,
  'Luggage Space Available': Car,
  'Default': HelpCircle
};

interface SanityProperty {
  _id: string;
  title: string;
  propertyType: string;
  location: string;
  monthlyRent: number;
  mainImage?: any;
  images?: any[];
  includedAmenities: string[];
  status: string;
  isVerified?: boolean;
  description: string;
  occupancy: string;
  nationalityPrefer: string;
  contactDetails?: {
    whatsappPhone?: string;
  };
}

export default function FeaturedProperties() {
  // Selected Property Modal State
  const [selectedProperty, setSelectedProperty] = useState<SanityProperty | null>(null);
  const [activeModalImageIdx, setActiveModalImageIdx] = useState<number>(0);
  const [properties, setProperties] = useState<SanityProperty[]>([]);

  // GROQ Query: Pulls 4 pending/approved properties
  const query = `*[_type == "property" && status == "active"][0...4]{
    _id,
    title,
    propertyType,
    location,
    monthlyRent,
    images,
    mainImage,
    includedAmenities,
    status,
    isVerified,
    contactDetails,
    description,
    occupancy,
    nationalityPrefer
  }`;

  useEffect(() => {
    let mounted = true;
    client.fetch(query)
      .then((docs: SanityProperty[]) => {
        if (!mounted) return;
        setProperties(docs || []);
      })
      .catch((err) => {
        console.error('Failed to fetch featured properties', err);
      });

    return () => { mounted = false };
  }, []);

  // Open Property Modal Helper
  const openModal = (property: SanityProperty) => {
    setSelectedProperty(property);
    setActiveModalImageIdx(0);
  };

  return (
    <div className="w-full container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-6">
        
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ff0066]/10 flex items-center justify-center text-[#ff0066]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider text-[#1e2d42] uppercase">
              Featured Properties
            </h2>
          </div>
          
          <Link 
            href="/properties" 
            className="flex items-center gap-1 text-xs sm:text-sm font-black text-[#ff0066] hover:text-[#e6005c] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none grid sm:grid-cols-2 lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {properties.map((prop) => {
            // Safely parse out features or fall back gracefully
            const tag1Label = prop.includedAmenities?.[0] || 'Verified Nest';
            const tag2Label = prop.includedAmenities?.[1] || 'Neat & Clean';
            
            const Tag1Icon = ICON_MAP[tag1Label] || ICON_MAP['Default'];
            const Tag2Icon = ICON_MAP[tag2Label] || ICON_MAP['Default'];
            
            const fallbackImg = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80";
            const imageSource = prop.images?.[0] || prop.mainImage;
            const computedImageUrl = imageSource ? urlFor(imageSource).width(800).height(600).url() : fallbackImg;

            return (
              <div 
                key={prop._id}
                className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 shrink-0 w-auto snap-start flex flex-col justify-between overflow-hidden group"
                onClick={() => openModal(prop)}
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={computedImageUrl} 
                    alt={`${prop.propertyType} in ${prop.location}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#ff0066] text-white text-xs font-black tracking-wider px-4 py-1 rounded-full uppercase shadow-sm">
                    {prop.propertyType?.replace('_', ' ')}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Location & Pricing */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-800">
                      <span className="text-xs sm:text-base font-bold tracking-tight text-pink-600 truncate block max-w-[200px]">
                        {prop.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-800">
                      <MapPin className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                      <span className="text-xs sm:text-sm tracking-tight text-slate-800 truncate block max-w-[200px]">
                        {prop.location}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium text-xs">
                      <span className="text-base sm:text-lg font-black text-[#0a192f]">
                        AED {prop.monthlyRent?.toLocaleString()}
                      </span>{' '}
                      <span className="text-slate-500 font-semibold text-[11px]">/month</span>
                    </p>
                  </div>

                  {/* Dual Feature Tags */}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 gap-1">
                    <div className="flex items-center gap-1.5 text-slate-600 overflow-hidden w-1/2">
                      <Tag1Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-[12px] font-bold text-slate-600 truncate">{tag1Label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 overflow-hidden w-1/2">
                      <Tag2Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-[12px] font-bold text-slate-600 truncate">{tag2Label}</span>
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border ${
                      prop.isVerified === true 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                      {prop.isVerified === true ? 'VERIFIED' : 'NOT VERIFIED'}
                    </span>

                    {/* WhatsApp Action */}
                    <Link
                      href={`https://wa.me/${prop.contactDetails?.whatsappPhone || '97150000000'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-full transition-transform active:scale-95 shadow-md"
                      title="Contact on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.091-2.868-6.944-1.851-1.852-4.314-2.871-6.937-2.872-5.438 0-9.863 4.413-9.866 9.83-.001 1.745.486 3.453 1.411 4.967l-.962 3.511 3.601-.945zM17.52 14.3c-.3-.149-1.777-.874-2.052-.974-.275-.1-.475-.149-.675.15-.2.299-.775.973-.95 1.173-.175.2-.35.224-.65.074-.3-.149-1.265-.466-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.073-.275.998-1.05 2.196-1.05 2.246 0 .05.15.349.625.874.775.848 1.625 1.123 1.925 1.248.3.125.4.1.55-.075.15-.175.65-.748.8-1.022.15-.274.3-.224.6-.074s1.9.949 2.225 1.124c.325.174.525.249.6.374.075.124.075.723-.225 1.022-.3.299-1.5 1.472-1.5 1.472z"/>
                      </svg>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

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
                              src={
                                (selectedProperty.images?.[activeModalImageIdx] && urlFor(selectedProperty.images[activeModalImageIdx]).width(1200).url())
                                || (selectedProperty.mainImage && urlFor(selectedProperty.mainImage).width(1200).url())
                                || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
                              }
                              alt={selectedProperty.title}
                              className="w-full h-full object-cover"
                          />
                          
                          {/* Category tag Overlay */}
                          <span className="absolute bottom-4 left-4 bg-[#ff0066] text-white text-xs font-black tracking-widest px-3.5 py-1.5 rounded-full uppercase">
                              {selectedProperty.propertyType}
                          </span>

                          {selectedProperty.isVerified == true ? (
                              <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black tracking-widest px-3.5 py-1.5 rounded-lg">
                                  VERIFIED NEST
                              </span>
                          ) : 
                              <span className="absolute top-3 left-3 bg-slate-100 text-slate-700 border-slate-200 text-sm font-black tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                  NOT VERIFIED
                              </span>
                          }
                      </div>

                      {/* Thumbnails list navigation if available */}
                        {selectedProperty.images && selectedProperty.images.length > 1 && (
                          <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                          {selectedProperty.images.map((img, idx) => (
                            <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveModalImageIdx(idx)}
                            className={`w-14 sm:w-16 aspect-4/3 rounded-lg overflow-hidden border-2 shrink-0 transition-all
                              ${idx === activeModalImageIdx ? 'border-[#ff0066] scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                            <img src={urlFor(img).width(200).url()} alt="Thumbnail view" className="w-full h-full object-cover" />
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
                              <span>{selectedProperty.location}</span>
                          </div>
                          <h4 className="text-lg sm:text-2xl font-black text-[#0a192f] leading-snug">
                              {selectedProperty.title}
                          </h4>
                      </div>

                      <div className="flex items-baseline gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-2xl font-black text-[#0a192f]">AED {selectedProperty.monthlyRent.toLocaleString()}</span>
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
                          {selectedProperty.includedAmenities.map((amenity) => (
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
                          href={`https://wa.me/${selectedProperty.contactDetails?.whatsappPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3.5 px-5 bg-[#25d366] hover:bg-[#20ba59] active:scale-98 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                      >
                          <MessageCircle className="w-9 h-9 fill-white" />
                          <span>Chat on WhatsApp</span>
                      </a>

                      <button
                          onClick={() => alert(`Connecting securely with ${selectedProperty.occupancy} manager at +${selectedProperty.contactDetails?.whatsappPhone}`)}
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