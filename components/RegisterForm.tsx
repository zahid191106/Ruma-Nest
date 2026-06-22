'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', whatsappNumber: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Hit our local registration API route
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      // 2. Automatically sign them into their NextAuth session
      const authRes = await signIn('credentials', {
        email: data.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/profile',
      })

      if (authRes?.error) {
        throw new Error('Profile saved, but session generation failed. Try logging in.')
      }

      // 3. Redirect to their profile page
      router.push('/profile')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-linear-to-br from-[#ff0066]/10 to-[#ff0066]/1 rounded-2xl shadow-xl mt-12">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create RumaNest Account</h2>
          <p className="text-sm text-slate-700 mt-1">Get started instantly with your email address.</p>
        </div>

        {error && (
          <div className="p-3 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Full Name</label>
          <input
            type="text"
            required
            className="w-full mt-1 p-3  border border-pink-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-700 text-sm transition"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Email Address</label>
          <input
            type="email"
            required
            className="w-full mt-1 p-3 border border-pink-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-700 text-sm transition"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">WhatsApp Number</label>
          <input
            type="text"
            placeholder="971501234567"
            className="w-full mt-1 p-3 border border-pink-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-700 text-sm transition"
            value={formData.whatsappNumber}
            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white p-3 rounded-xl font-bold hover:bg-pink-600 transition disabled:opacity-50 text-sm tracking-wide mt-2 cursor-pointer"
        >
          {loading ? 'Creating Profile...' : 'Register & Log In'}
        </button>
      </form>
    </div>
  )
}