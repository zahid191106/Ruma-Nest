// profile/components/Property.tsx
'use client';

import React, { useState, useRef } from 'react';
import { urlFor } from '@/sanity/lib/image';
import { MapPin } from 'lucide-react';
import { PropertyListing, SanityImage } from '@/types/user-dashboard';

interface PropertyProps {
  properties: PropertyListing[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyListing[]>>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

// Converts Sanity asset blobs back to active CDN links securely via your urlFor helper
const renderSanityImage = (imgObject: SanityImage | undefined) => {
  if (!imgObject || !imgObject.asset || !imgObject.asset._ref) {
    return 'https://placehold.co/600x400?text=No+Image+Available';
  }
  try {
    return urlFor(imgObject.asset).url();
  } catch (error) {
    console.error("Image builder conversion failed:", error);
    return 'https://placehold.co/600x400?text=Error+Loading+Image';
  }
};

export default function Property({ properties, setProperties, loading, refreshData }: PropertyProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [viewingDetails, setViewingDetails] = useState<PropertyListing | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core Structured Form Hook
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'room',
    location: '',
    buildingName: '',
    purpose: 'rent' as 'rent' | 'sell',
    status: 'active' as 'active' | 'inactive',
    price: '',
    billingCycle: 'monthly',
    isAllInclusive: true,
    overview: '',
    idealOccupancy: 'Solo / Couple',
    contactName: '',
    whatsappPhone: '',
  });

  // Dynamic Array Handlers for Custom Badging System
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [currentAmenityInput, setCurrentAmenityInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      propertyType: 'room',
      location: '',
      buildingName: '',
      purpose: 'rent',
      status: 'active',
      price: '',
      billingCycle: 'monthly',
      isAllInclusive: true,
      overview: '',
      idealOccupancy: 'Solo / Couple',
      contactName: '',
      whatsappPhone: '',
    });
    setAmenitiesList([]);
    setCurrentAmenityInput('');
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditInit = (property: PropertyListing) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      propertyType: property.propertyType,
      location: property.location,
      buildingName: property.buildingName || '',
      purpose: property.purpose,
      status: (property.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
      price: property.price.toString(),
      billingCycle: property.billingCycle || 'monthly',
      isAllInclusive: property.isAllInclusive,
      overview: property.overview,
      idealOccupancy: property.idealOccupancy,
      contactName: property.contactDetails?.name || '',
      whatsappPhone: property.contactDetails?.whatsappPhone || '',
    });
    setAmenitiesList(property.includedAmenities || []);
    setActiveTab('create');
  };

  const handleAddAmenity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = currentAmenityInput.trim();
    if (trimmed && !amenitiesList.includes(trimmed)) {
      setAmenitiesList([...amenitiesList, trimmed]);
      setCurrentAmenityInput('');
    }
  };

  const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Lock form from submit trigger actions
      handleAddAmenity();
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setAmenitiesList(amenitiesList.filter((_, index) => index !== indexToRemove));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const res = await fetch(`/api/property/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
        if (viewingDetails?._id === id) setViewingDetails(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    if (amenitiesList.length === 0) {
      alert('Please add at least one amenity.');
      return;
    }
    setIsSubmitting(true);

    const bodyData = new FormData();
    bodyData.append('title', formData.title);
    bodyData.append('propertyType', formData.propertyType);
    bodyData.append('location', formData.location);
    bodyData.append('buildingName', formData.buildingName);
    bodyData.append('purpose', formData.purpose);
    bodyData.append('price', formData.price);
    bodyData.append('billingCycle', formData.billingCycle);
    bodyData.append('isAllInclusive', String(formData.isAllInclusive));
    bodyData.append('overview', formData.overview);
    bodyData.append('idealOccupancy', formData.idealOccupancy);
    bodyData.append('contactName', formData.contactName);
    bodyData.append('whatsappPhone', formData.whatsappPhone);

    amenitiesList.forEach((amenity) => bodyData.append('amenities', amenity));
    selectedFiles.forEach((file) => bodyData.append('images', file));

    try {
      const res = await fetch('/api/property', { method: 'POST', body: bodyData });
      const data = await res.json();
      if (data.success) {
        resetForm();
        setActiveTab('view');
        await refreshData();
      } else {
        alert(data.error || 'Failed to create listing');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    if (amenitiesList.length === 0) {
      alert('Please add at least one amenity.');
      return;
    }
    setIsSubmitting(true);

    const updatePayload = {
      title: formData.title,
      propertyType: formData.propertyType,
      location: formData.location,
      buildingName: formData.buildingName,
      purpose: formData.purpose,
      status: formData.status,
      price: Number(formData.price),
      billingCycle: formData.purpose === 'sell' ? null : formData.billingCycle,
      isAllInclusive: formData.purpose === 'sell' ? false : formData.isAllInclusive,
      overview: formData.overview,
      idealOccupancy: formData.idealOccupancy,
      amenities: amenitiesList,
      contactDetails: {
        contactName: formData.contactName,
        whatsappPhone: formData.whatsappPhone,
      },
    };

    try {
      const res = await fetch(`/api/property/${editingProperty._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProperty(null);
        resetForm();
        setActiveTab('view');
        await refreshData();
      } else {
        alert(data.error || 'Failed to update property');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500 animate-pulse text-sm font-medium">Loading listings data matrix...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Tab Select Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex gap-4">
          <button 
            onClick={() => { setActiveTab('view'); setEditingProperty(null); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'view' && !editingProperty ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            My Listings ({properties.length})
          </button>
          <button 
            onClick={() => { setActiveTab('create'); setEditingProperty(null); resetForm(); }}
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {editingProperty ? '🔧 Edit Listing Parameters' : '+ Post New Property'}
          </button>
        </div>
      </div>

      {/* 🟢 VIEW GRID INTERFACE */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.length === 0 ? (
            <p className="text-gray-500 text-sm italic col-span-2 py-4">You haven't posted any properties yet.</p>
          ) : (
            properties.map((property) => {
              // Extract first card image
              const primaryImageUrl = renderSanityImage(property.images?.[0]);

              return (
                <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow transition">
                  <div>
                    {/* Primary Image Cover Preview */}
                    <div className="h-48 w-full bg-gray-100 relative">
                      <img src={primaryImageUrl} alt={property.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase shadow ${property.purpose === 'rent' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                          For {property.purpose}
                        </span>
                        {property.isVerified && <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-1 rounded shadow">VERIFIED</span>}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-center text-xs text-gray-400 capitalize">
                        <span>{property.propertyType}</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${property.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border'}`}>
                          {property.status === 'active' ? 'Live' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" /> {property.location}
                      </p>
                      <p className="text-xl font-extrabold text-gray-900 pt-1">
                        AED {property.price.toLocaleString()}
                        {property.purpose === 'rent' && <span className="text-xs text-gray-500 font-normal">/{property.billingCycle}</span>}
                      </p>
                    </div>

                    {/* Sliced Dynamic Amenities Wrapper Block - Limited explicitly to 5 max items */}
                    <div className='px-5 pb-4'>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {property.includedAmenities?.slice(0, 5).map((amenity, i) => (
                          <span key={i} className="bg-pink-100 text-pink-700 text-xs px-2.5 py-1 rounded-md border border-pink-200 font-medium">{amenity}</span>
                        ))}
                        {property.includedAmenities && property.includedAmenities.length > 5 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-200 font-semibold">
                            +{property.includedAmenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 flex items-center justify-end gap-2 border-t pt-4 bg-gray-50/50">
                    <button onClick={() => setViewingDetails(property)} className="text-xs text-gray-600 hover:bg-gray-100 bg-white border font-medium px-3 py-2 rounded-lg transition">
                      View Details
                    </button>
                    <button onClick={() => handleEditInit(property)} className="text-xs bg-gray-900 hover:bg-black text-white font-medium px-3 py-2 rounded-lg transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(property._id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-2 rounded-lg transition">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 🔵 CREATE & EDIT INPUT FORMS */}
      {activeTab === 'create' && (
        <form onSubmit={editingProperty ? handleUpdateSubmit : handleCreateSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Property Type *</label>
              <select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="room">Room</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
                <option value="bed_space">Bed Space</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Location Address *</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Building Name</label>
              <input type="text" value={formData.buildingName} onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Purpose *</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center text-sm"><input type="radio" checked={formData.purpose === 'rent'} onChange={() => setFormData({ ...formData, purpose: 'rent' })} className="mr-2" /> For Rent</label>
                <label className="flex items-center text-sm"><input type="radio" checked={formData.purpose === 'sell'} onChange={() => setFormData({ ...formData, purpose: 'sell' })} className="mr-2" /> For Sale</label>
              </div>
            </div>

            {/* Status Selector Switch - Locks explicitly inside Edit operations */}
            {editingProperty && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Operational Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 border rounded-lg text-sm bg-amber-50/50 border-amber-200 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none">
                  <option value="active">🟢 Active / Available</option>
                  <option value="inactive">🔴 Inactive / Rented / Sold</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (AED) *</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            {formData.purpose === 'rent' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Billing Cycle</label>
                  <select value={formData.billingCycle} onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="flex items-center mt-6">
                  <input type="checkbox" id="isAllInclusive" checked={formData.isAllInclusive} onChange={(e) => setFormData({ ...formData, isAllInclusive: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                  <label htmlFor="isAllInclusive" className="ml-2 text-sm font-medium text-gray-700">All-Inclusive (DEWA & WiFi)</label>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Ideal Occupancy</label>
              <input type="text" value={formData.idealOccupancy} onChange={(e) => setFormData({ ...formData, idealOccupancy: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>

            {/* Interactive Array Tags input configuration */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amenities ({amenitiesList.length} Added) *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={currentAmenityInput} 
                  onChange={(e) => setCurrentAmenityInput(e.target.value)}
                  onKeyDown={handleAmenityKeyDown}
                  placeholder="Type an amenity and press Enter or Click Add" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                />
                <button type="button" onClick={() => handleAddAmenity()} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap">
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {amenitiesList.map((amenity, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium pl-2.5 pr-1.5 py-1 rounded-md border">
                    {amenity}
                    <button type="button" onClick={() => handleRemoveAmenity(index)} className="text-gray-400 hover:text-red-500 font-bold text-sm px-0.5">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!editingProperty && (
            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gallery Images *</label>
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} className="text-sm cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Overview Description *</label>
            <textarea rows={3} required value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Contact Name *</label>
              <input type="text" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">WhatsApp Number *</label>
              <input type="text" required value={formData.whatsappPhone} placeholder="971501234567" onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={() => { setActiveTab('view'); setEditingProperty(null); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50">
              {isSubmitting ? 'Processing...' : editingProperty ? 'Update Listing' : 'Publish Property'}
            </button>
          </div>
        </form>
      )}

      {/* 🔍 MODAL INFO GALLERY OVERLAY */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-2xl max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{viewingDetails.title}</h3>
              <button onClick={() => setViewingDetails(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              
              {/* Renders complete gallery layout inside detailed view */}
              {viewingDetails.images && viewingDetails.images.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-semibold mb-2">Uploaded Gallery Photos ({viewingDetails.images.length})</span>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingDetails.images.map((img) => (
                      <div key={img._key} className="h-24 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={renderSanityImage(img)} alt="Gallery Item" className="w-full h-full object-cover hover:scale-105 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Pricing Scheme</span>
                  <p className="text-lg font-bold text-gray-900">
                    AED {viewingDetails.price.toLocaleString()} {viewingDetails.purpose === 'rent' ? `/ ${viewingDetails.billingCycle}` : '(For Sale)'}
                  </p>
                  {viewingDetails.isAllInclusive && <span className="text-xs text-blue-600 font-medium">All-Inclusive (DEWA & WiFi)</span>}
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Listing Status</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${viewingDetails.isActive ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {viewingDetails.isActive ? 'Approved by Admin' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">Location Specification</span>
                <p className="text-gray-900 font-medium">{viewingDetails.location} {viewingDetails.buildingName && `— ${viewingDetails.buildingName}`}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">Overview Description</span>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1">{viewingDetails.overview}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Ideal Occupancy</span>
                  <p className="text-gray-900 font-medium mt-0.5">{viewingDetails.idealOccupancy}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Type Categorization</span>
                  <p className="text-gray-900 capitalize font-medium mt-0.5">{viewingDetails.propertyType.replace('_', ' ')}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium mb-1">Included Listing Amenities</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {viewingDetails.includedAmenities?.map((amenity, i) => (
                    <span key={i} className="bg-pink-100 text-pink-700 text-xs px-2.5 py-1 rounded-md border border-pink-200 font-semibold">{amenity}</span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-blue-700/70 block uppercase font-medium">Point of Contact</span>
                  <p className="text-gray-900 font-bold mt-0.5">{viewingDetails.contactDetails?.name || 'Not Provided'}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-700/70 block uppercase font-medium">WhatsApp Digits Link</span>
                  <p className="text-blue-600 font-mono font-medium mt-0.5">+{viewingDetails.contactDetails?.whatsappPhone}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
              <button onClick={() => { setViewingDetails(null); handleEditInit(viewingDetails); }} className="px-4 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-lg transition">
                Modify Listing Setup
              </button>
              <button onClick={() => setViewingDetails(null)} className="px-4 py-2 text-xs font-semibold bg-white border text-gray-700 rounded-lg hover:bg-gray-100 transition">
                Dismiss View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}