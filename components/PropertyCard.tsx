'use client';
import React from 'react';
import { 
  Flame, 
  ArrowRight, 
  MapPin, 
  Wifi, 
  Users, 
  Car, 
  Utensils, 
  Sparkles, 
  Home, 
  Dumbbell,
  Bed,
  Bus,
  Tv
} from 'lucide-react';

// Define TS Interfaces for properties
interface Property {
  id: string;
  category: 'ROOM' | 'PARTITION' | 'STUDIO' | 'BED SPACE' | 'APARTMENT';
  location: string;
  price: number;
  imageUrl: string;
  tag1: { label: string; icon: React.ComponentType<{ className?: string }> };
  tag2: { label: string; icon: React.ComponentType<{ className?: string }> };
  isVerified: boolean;
  whatsappNumber: string;
}

export default function App() {
  // Mock data matching the screenshot exactly
  const featuredProperties: Property[] = [
    {
      id: '1',
      category: 'ROOM',
      location: 'Al Wahda',
      price: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
      tag1: { label: 'Fully Furnished', icon: Bed },
      tag2: { label: 'Near Bus Stop', icon: Bus },
      isVerified: true,
      whatsappNumber: '971500000000'
    },
    {
      id: '2',
      category: 'PARTITION',
      location: 'Mussafah',
      price: 800,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
      tag1: { label: 'WiFi Included', icon: Wifi },
      tag2: { label: 'Family Allowed', icon: Users },
      isVerified: true,
      whatsappNumber: '971500000000'
    },
    {
      id: '3',
      category: 'STUDIO',
      location: 'Khalifa City',
      price: 2300,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
      tag1: { label: 'Separate Kitchen', icon: Utensils },
      tag2: { label: 'Parking Free', icon: Car },
      isVerified: true,
      whatsappNumber: '971500000000'
    },
    {
      id: '4',
      category: 'BED SPACE',
      location: 'Tourist Club Area',
      price: 600,
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
      tag1: { label: 'With Laundry', icon: Tv }, // Using generic TV / alternative appliance tag representation
      tag2: { label: 'Neat & Clean', icon: Sparkles },
      isVerified: true,
      whatsappNumber: '971500000000'
    }
  ];

  return (
    <div className="w-full container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="space-y-6">
        
        {/* ==========================================
            HEADER row: title & navigation
           ========================================== */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            {/* Pink fire circle icon */}
            <div className="w-7 h-7 rounded-full bg-[#ff0066]/10 flex items-center justify-center text-[#ff0066]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider text-[#1e2d42] uppercase">
              Featured Properties
            </h2>
          </div>
          
          <a 
            href="#all-properties" 
            className="flex items-center gap-1 text-xs sm:text-sm font-black text-[#ff0066] hover:text-[#e6005c] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* ==========================================
            PROPERTIES CONTAINER: Horizontal scroll on mobile, 5 col grid on desktop
           ========================================== */}
        <div className="gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none grid  sm:grid-cols-2 lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {featuredProperties.map((prop) => {
            const Tag1Icon = prop.tag1.icon;
            const Tag2Icon = prop.tag2.icon;

            return (
              <div 
                key={prop.id}
                className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 shrink-0 w-auto snap-start flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={prop.imageUrl} 
                    alt={`${prop.category} in ${prop.location}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category overlay label */}
                  <span className="absolute bottom-3 left-3 bg-[#ff0066] text-white text-xs font-black tracking-wider px-4 py-1 rounded-full uppercase shadow-sm">
                    {prop.category}
                  </span>
                </div>

                {/* Content / Info Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Location & Pricing */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-800">
                      <MapPin className="w-5 h-5 text-slate-700 stroke-[2.5]" />
                      <span className="text-xs sm:text-base font-bold tracking-tight text-slate-800">
                        {prop.location}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium text-xs">
                      <span className="text-base sm:text-lg font-black text-[#0a192f]">
                        AED {prop.price.toLocaleString()}
                      </span>{' '}
                      <span className="text-slate-500 font-semibold text-[11px]">/month</span>
                    </p>
                  </div>

                    {/* Dual Feature Tags */}
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        {/* Tag 1 */}
                        <div className="flex items-center gap-2 text-slate-600">
                            <Tag1Icon className="w-4.5 h-4.5 text-slate-500 stroke-2" />
                            <span className="text-[13px] font-bold text-slate-600 truncate">{prop.tag1.label}</span>
                        </div>
                        {/* Tag 2 */}
                        <div className="flex items-center gap-2 text-slate-600">
                            <Tag2Icon className="w-4.5 h-4.5 text-slate-500 stroke-2" />
                            <span className="text-[13px] font-bold text-slate-600 truncate">{prop.tag2.label}</span>
                        </div>
                    </div>

                  {/* Footer Badge & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {/* VERIFIED tag */}
                    {prop.isVerified && (
                      <span className="bg-green-300 text-green-700 text-xs font-black tracking-wider px-2.5 py-1 rounded-full border border-emerald-100/50">
                        VERIFIED
                      </span>
                    )}

                    {/* WhatsApp Action Button */}
                    <a
                      href={`https://wa.me/${prop.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-full transition-transform active:scale-95 shadow-md shadow-emerald-500/10 hover:shadow-lg"
                      title="Contact on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.091-2.868-6.944-1.851-1.852-4.314-2.871-6.937-2.872-5.438 0-9.863 4.413-9.866 9.83-.001 1.745.486 3.453 1.411 4.967l-.962 3.511 3.601-.945zM17.52 14.3c-.3-.149-1.777-.874-2.052-.974-.275-.1-.475-.149-.675.15-.2.299-.775.973-.95 1.173-.175.2-.35.224-.65.074-.3-.149-1.265-.466-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.073-.275.998-1.05 2.196-1.05 2.246 0 .05.15.349.625.874.775.848 1.625 1.123 1.925 1.248.3.125.4.1.55-.075.15-.175.65-.748.8-1.022.15-.274.3-.224.6-.074s1.9.949 2.225 1.124c.325.174.525.249.6.374.075.124.075.723-.225 1.022-.3.299-1.5 1.472-1.5 1.472z"/>
                      </svg>
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}