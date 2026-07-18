import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import AllCarLifts from '@/components/AllCarLifts';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Car Lift Dubai, Abu Dhabi & Sharjah Routes | Ruma Nest",
  description: "Find safe, affordable, and reliable daily car lift options for your work commute between Sharjah, Dubai, Ajman, and Abu Dhabi. Post your route today.",
  alternates: {
    canonical: "https://www.rumanest.com/car-lifts",
  },
  openGraph: {
    title: "Car Lift & Commute Sharing Routes in UAE | Ruma Nest",
    description: "Save on your daily commute. Find or post car lift routes between Dubai, Sharjah, Abu Dhabi, and other emirates.",
    type: "website",
    locale: "en_AE",
    images: ["/logo.png"],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-black mb-6">Car Lifts</h1>
        <AllCarLifts />
      </main>

      <Footer />
    </div>
  );
}
