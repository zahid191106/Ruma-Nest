'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  // 1. ADDED: Password state tracker variable
  const [password, setPassword] = useState('') 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Trigger secure password verification against Sanity database
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password: password, // 2. FIXED: This will now read your password state variable cleanly
        redirect: false,
        callbackUrl: '/profile',
      })

      if (res?.error) {
        throw new Error('Invalid email or password. Please try again.')
      }

      router.push('/profile')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Sign in to RumaNest
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-500 underline">
            create a brand new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-3 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* 3. ADDED: Password Input Input Field UI block */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center bg-emerald-500 text-white p-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 text-sm tracking-wide cursor-pointer"
              >
                {loading ? 'Verifying Credentials...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}