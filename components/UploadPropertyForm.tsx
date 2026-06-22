'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AMENITY_OPTIONS = [
  'Fully Furnished', 'WiFi Included', 'Near Bus Stop', 
  'AC Included', 'Neat & Clean', 'Separate Kitchen', 'Gym & Pool'
]

export default function UploadPropertyForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [fields, setFields] = useState({
    title: '', propertyType: 'room', location: '', monthlyRent: '', 
    overview: '', idealOccupancy: 'Solo / Couple', preference: 'Any Nationality',
    isAllInclusive: true, contactName: '', whatsappPhone: '', displayPhone: ''
  })
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [images, setImages] = useState<FileList | null>(null)

  const handleCheckboxChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!images || images.length === 0) return setError('Please upload at least 1 image.')
    setLoading(true)
    setError('')

    const formData = new FormData()
    Object.entries(fields).forEach(([key, val]) => formData.append(key, String(val)))
    selectedAmenities.forEach(item => formData.append('includedAmenities', item))
    Array.from(images).forEach(file => formData.append('images', file))

    try {
      const res = await fetch('/api/upload-property', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      router.push('/profile')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-6 my-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">List a Property</h2>
        <p className="text-sm text-gray-500 mt-1">Fill out the specifications below to publish your nest.</p>
      </div>

      {error && <div className="p-3 text-sm font-semibold text-rose-600 bg-rose-50 border rounded-xl">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600">Title</label>
          <input type="text" required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.title} onChange={e => setFields({...fields, title: e.target.value})} placeholder="e.g., Premium Master Room with Attached Bath" />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Property Type</label>
          <select className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.propertyType} onChange={e => setFields({...fields, propertyType: e.target.value})}>
            <option value="room">Room</option>
            <option value="studio">Studio</option>
            <option value="apartment">Apartment</option>
            <option value="bed_space">Bed Space</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Monthly Rent (AED)</label>
          <input type="number" required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.monthlyRent} onChange={e => setFields({...fields, monthlyRent: e.target.value})} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600">Full Address</label>
          <input type="text" required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.location} onChange={e => setFields({...fields, location: e.target.value})} placeholder="e.g., Hazza Bin Zayed Street, Al Wahda, Abu Dhabi" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600">Overview / Description</label>
          <textarea rows={4} required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.overview} onChange={e => setFields({...fields, overview: e.target.value})} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Ideal Occupancy</label>
          <input type="text" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.idealOccupancy} onChange={e => setFields({...fields, idealOccupancy: e.target.value})} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Preference / Nationality</label>
          <input type="text" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.preference} onChange={e => setFields({...fields, preference: e.target.value})} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600 block mb-2">Included Amenities</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-xl border">
            {AMENITY_OPTIONS.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleCheckboxChange(amenity)} className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600 block">Select Property Gallery Images</label>
          <input type="file" multiple accept="image/*" required className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" onChange={e => setImages(e.target.files)} />
        </div>

        <div className="sm:col-span-2 border-t pt-4 mt-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Contact Name</label>
              <input type="text" className="w-full mt-1 p-2 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.contactName} onChange={e => setFields({...fields, contactName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">WhatsApp Link Number</label>
              <input type="text" required placeholder="971501234567" className="w-full mt-1 p-2 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.whatsappPhone} onChange={e => setFields({...fields, whatsappPhone: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Display Phone Number</label>
              <input type="text" required placeholder="+971 50 123 4567" className="w-full mt-1 p-2 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.displayPhone} onChange={e => setFields({...fields, displayPhone: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white p-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 tracking-wide cursor-pointer mt-4">
        {loading ? 'Uploading Assets & Document...' : 'Publish Property Listing'}
      </button>
    </form>
  )
}