'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, ArrowRight, Building2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password: password, 
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
    <main className="w-full flex items-center justify-center  p-4 sm:p-6 md:p-8 text-gray-900 font-sans">
      
      {/* Structural Card Container */}
      <div className="w-full max-w-md bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-10 shadow-xl shadow-purple-950/5">
        
        {/* Brand Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <img src="/images/logo.png" alt="" />
          <div>
            <h1 className="text-sm text-gray-500 mt-1">
              Sign in to manage your spaces and preferences
            </h1>
          </div>
        </div>

        {/* Form Workspace Layout */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="p-3 text-xs font-medium text-pink-700 bg-pink-50 border border-pink-100 rounded-xl flex items-start gap-2.5">
              <span className="text-sm leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Address Panel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wide text-gray-700 uppercase">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4 w-4 stroke-[2.25]" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-purple-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-sm transition-all duration-200 placeholder-gray-400 text-gray-900 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input Panel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold tracking-wide text-gray-700 uppercase">
                Password
              </label>
              <Link href="#" className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4 w-4 stroke-[2.25]" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-pink-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 text-sm transition-all duration-200 placeholder-gray-400 text-gray-900 font-sans"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Form Trigger Actions button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:opacity-95 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 text-sm tracking-wide cursor-pointer shadow-md shadow-purple-600/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Account Redirection Link */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-5 border-t border-gray-100">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-700 transition underline underline-offset-4 decoration-2">
            Create account
          </Link>
        </div>

      </div>
    </main>
  )
}