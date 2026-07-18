"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { 
  Shield, 
  MessageSquare, 
  Zap, 
  Moon, 
  Sun, 
  Heart, 
  Menu, 
  X, 
  Search, 
  MapPin, 
  Phone,
  Building,
  CheckCircle,
    Car,
    User,
  Filter
} from 'lucide-react';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [favorites, setFavorites] = useState([]);
    const { data: session } = useSession()
    const [avatarUrl, setAvatarUrl] = useState('')

    useEffect(() => {
        const email = session?.user?.email
        if (!email) {
            setAvatarUrl('')
            return
        }

        let mounted = true

        const fetchAvatar = async () => {
            try {
                const user = await client.fetch(`*[_type == \"user\" && email == $email][0]{avatar}`, { email })
                if (!mounted) return
                if (user?.avatar) {
                    setAvatarUrl(urlFor(user.avatar).width(200).height(200).url())
                }
            } catch (err) {
                // ignore
            }
        }

        fetchAvatar()

        return () => { mounted = false }
    }, [session?.user?.email])

  return (
    <div className={`font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900' }`}>
        {/* OUTER WRAPPER CONTAINER mimicking the image's rounded black frame context */}
        <div className="max-w-full mx-auto p-0 md:p-3 bg-black">
            <div className="bg-white dark:bg-slate-950 md:rounded-[40px] overflow-hidden flex flex-col justify-between">

                {/* HEADER SECTION */}
                <header className="relative z-50">
                    {/* Dark Header Background */}
                    <div className="bg-[#061329] text-white h-23.75 flex items-center justify-between px-4 sm:px-8 relative overflow-hidden">

                        {/* Perfect Concave Curved White Logo Container */}
                        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center select-none">
                            <svg className="absolute inset-0 h-full w-48 sm:w-115 md:w-125" preserveAspectRatio="none"
                                viewBox="0 0 420 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0H315C335 0 338 45 350 65C362 85 385 95 420 95H0V0Z" fill="white" />
                            </svg>

                            {/* Actual Logo & Slogan Content */}
                            <div className="relative z-20 pl-4 sm:pl-8 flex items-center gap-2 md:gap-3">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-2 border-white">
                                    <img src="/images/ruma-logo.svg" alt="RumaNest Logo" className='w-full h-full object-contain' />
                                </div>
                                <div className="sm:flex flex-col hidden">
                                    <span className="text-2xl md:text-4xl font-black tracking-tight text-[#061329] flex items-center gap-0.5 leading-none">
                                        Ruma<span className="text-[#ff1d6c]">Nest</span>
                                    </span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="h-px w-5 bg-pink-500"></span>
                                        <span className="text-[12px] md:text-[8px] font-extrabold tracking-widest text-[#ff1d6c] uppercase whitespace-nowrap">
                                            Find Your Perfect Nest
                                        </span>
                                        <span className="h-px w-5 bg-pink-500"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spacing alignment for Desktop Navigation links */}
                        <div className="w-50 md:w-87.5 lg:w-102.5 shrink-0 h-10"></div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden xl:flex items-center gap-1.5 text-base font-bold">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Properties', href: '/properties' },
                                { name: 'Roommate Finder', href: '/roommate' },
                                { name: 'Car Lift', href: '/car-lifts' }
                            ].map((item) => (
                                <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 rounded-full transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/10"
                                >
                                {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Utility Tools on Navbar Right */}
                        <div className="flex items-center gap-2.5 sm:gap-4 z-20">
                            {/* Theme toggle */}
                            {/* <button onClick={()=> setDarkMode(!darkMode)}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                                aria-label="Toggle dark mode"
                                >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                            </button> */}

                            {/* Favorites Trigger */}
                            {/* <button onClick={()=> setActiveTab('Favorites')}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-300 relative transition-colors cursor-pointer"
                                >
                                <Heart className={`w-5 h-5 ${favorites.length> 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                                    {favorites.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#ff1d6c] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                                        {favorites.length}
                                    </span>
                                    )}
                            </button> */}

                            {/* Show user avatar when logged in, otherwise show login icon */}
                            {session?.user?.email ? (
                                <Link href="/profile" className="p-0 rounded-full overflow-hidden">
                                    <img
                                        src={avatarUrl || '/images/status-1.avif'}
                                        alt={session?.user?.name ?? 'User'}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                    />
                                </Link>
                            ) : (
                                <Link href="/login" className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors">
                                    <User className="w-6 h-6" />
                                </Link>
                            )}

                            {/* Mobile Drawer Trigger */}
                            <button onClick={()=> setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors block xl:hidden cursor-pointer"
                                >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {/* FIX: Changed from absolute to relative block flow to bypass parent overflow-hidden restrictions completely */}
                    {mobileMenuOpen && (
                    <div className="xl:hidden relative w-full bg-[#061329] border-t border-slate-800 text-white shadow-inner transition-all duration-200 z-50">
                        <div className="flex flex-col p-4 gap-1">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Properties', href: '/properties' },
                                { name: 'Car Lift', href: '/car-lifts' },
                                { name: 'Roommate Finder', href: '/roommate' }
                            ].map((item) => (
                                <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:bg-white/10 text-slate-300 hover:text-white"
                                >
                                {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    )}
                </header>
            </div>
        </div>
    </div>
  );
}