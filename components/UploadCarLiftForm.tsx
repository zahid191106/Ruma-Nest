'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const POLICIES_OPTIONS = ['Chilled AC', 'Daily Newspapers', 'Bluetooth Audio Shared', 'Luggage Space Available', 'No Smoking']

export default function UploadCarLiftForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [fields, setFields] = useState({
    pickupLocation: '', dropoffLocation: '', shiftType: 'morning', startTime: '',
    monthlyFee: '', carModel: '', carColor: '', totalSeats: '4', seatsLeft: '4',
    genderPreference: 'Co-Ed', driverName: '', whatsappNumber: '', routeOverview: ''
  })
  
  const [stops, setStops] = useState<{ stopType: string; stationName: string }[]>([
    { stopType: 'DEPARTURE POINT', stationName: '' },
    { stopType: 'FINAL STOP', stationName: '' }
  ])
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])

  const addStop = () => {
    const updated = [...stops]
    updated.splice(updated.length - 1, 0, { stopType: 'ROUTE STATION', stationName: '' })
    setStops(updated)
  }

  const updateStop = (index: number, value: string) => {
    const updated = [...stops]
    updated[index].stationName = value
    setStops(updated)
  }

  const handlePolicyChange = (policy: string) => {
    setSelectedPolicies(prev => prev.includes(policy) ? prev.filter(p => p !== policy) : [...prev, policy])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/carlift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, routeBreakdown: stops, comfortPolicies: selectedPolicies }),
      })
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
        <h2 className="text-2xl font-bold text-gray-900">Create Car Lift Request</h2>
        <p className="text-sm text-gray-500 mt-1">Submit your commute route. Listings require admin approval before going live.</p>
      </div>

      {error && <div className="p-3 text-sm text-rose-600 bg-rose-50 border rounded-xl">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Pickup Area</label>
          <input type="text" required placeholder="e.g., Mussafah, Abu Dhabi" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.pickupLocation} onChange={e => setFields({...fields, pickupLocation: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Drop-off Area</label>
          <input type="text" required placeholder="e.g., Al Reem Island" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.dropoffLocation} onChange={e => setFields({...fields, dropoffLocation: e.target.value})} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Shift Type</label>
          <select className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.shiftType} onChange={e => setFields({...fields, shiftType: e.target.value})}>
            <option value="morning">Morning Shift</option>
            <option value="general">General Shift</option>
            <option value="evening">Evening Shift</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Start Time Slot</label>
          <input type="text" required placeholder="e.g., 07:30 AM" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.startTime} onChange={e => setFields({...fields, startTime: e.target.value})} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Monthly Fee (AED)</label>
          <input type="number" required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.monthlyFee} onChange={e => setFields({...fields, monthlyFee: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Gender Preference</label>
          <select className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.genderPreference} onChange={e => setFields({...fields, genderPreference: e.target.value})}>
            <option value="Co-Ed">Co-Ed</option>
            <option value="Males Only">Males Only</option>
            <option value="Females Only">Females Only</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Car Model</label>
          <input type="text" required placeholder="Toyota Camry" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.carModel} onChange={e => setFields({...fields, carModel: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Car Color</label>
          <input type="text" placeholder="White" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.carColor} onChange={e => setFields({...fields, carColor: e.target.value})} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Total Seats</label>
          <input type="number" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.totalSeats} onChange={e => setFields({...fields, totalSeats: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-600">Seats Remaining</label>
          <input type="number" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.seatsLeft} onChange={e => setFields({...fields, seatsLeft: e.target.value})} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600">Route Overview Description</label>
          <textarea rows={2} required className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.routeOverview} onChange={e => setFields({...fields, routeOverview: e.target.value})} />
        </div>

        {/* Timeline Stops Breakdown */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase text-gray-600">Route Timeline Stops</label>
            <button type="button" onClick={addStop} className="text-xs font-bold text-blue-600 hover:underline">+ Add Stop Station</button>
          </div>
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl border">
            {stops.map((stop, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="w-1/3 text-xs font-bold text-gray-400">{stop.stopType}</span>
                <input type="text" required placeholder="Station name or landmark" className="w-2/3 p-2 bg-white border rounded-lg text-sm" value={stop.stationName} onChange={e => updateStop(index, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Policies Selector */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-600 block mb-2">Driver Comfort Policies</label>
          <div className="flex flex-wrap gap-2">
            {POLICIES_OPTIONS.map(policy => (
              <button type="button" key={policy} onClick={() => handlePolicyChange(policy)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${selectedPolicies.includes(policy) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                {policy}
              </button>
            ))}
          </div>
        </div>

        {/* Driver Contact Block */}
        <div className="sm:col-span-2 border-t pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Driver Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Driver Display Name</label>
              <input type="text" required className="w-full mt-1 p-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.driverName} onChange={e => setFields({...fields, driverName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">WhatsApp (Pure Digits: 971...)</label>
              <input type="text" required placeholder="971501234567" className="w-full mt-1 p-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-emerald-500" value={fields.whatsappNumber} onChange={e => setFields({...fields, whatsappNumber: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 tracking-wide mt-4 cursor-pointer">
        {loading ? 'Submitting Route...' : 'Submit Car Lift Listing'}
      </button>
    </form>
  )
}