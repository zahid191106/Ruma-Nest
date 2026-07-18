import type { Metadata } from 'next';
import "../globals.css";
import Navbar from '@/components/Navbar';
import AllProperties from '@/components/AllProperties';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Properties for Rent & Sale in Dubai & Abu Dhabi | Ruma Nest",
  description: "Explore verified residential listings, apartments, studios, and commercial properties across the UAE. Deal directly with landlords and owners.",
  alternates: {
    canonical: "https://www.rumanest.com/properties",
  },
  openGraph: {
    title: "Properties for Rent & Sale in UAE | Ruma Nest",
    description: "Browse thousands of verified property listings in Dubai, Abu Dhabi, and Sharjah with direct owner contact.",
    type: "website",
    locale: "en_AE",
    images: ["/logo.png"],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background-rumanest-light font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black mb-6">Properties</h1>
        <AllProperties />
      </main>

      <Footer />
    </div>
  );
}
