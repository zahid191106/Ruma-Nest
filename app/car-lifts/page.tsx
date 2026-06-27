import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import AllCarLifts from '@/components/AllCarLifts';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Car Lifts | Ruma Nest',
  description: 'Find and post car lift routes on Ruma Nest',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle 1450px at 5% 5%, #f984e5, transparent),
          radial-gradient(circle 1450px at 90% 90%, #f984e5, transparent)
        `,
       
      }}
    >
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-black mb-6">Car Lifts</h1>
        <AllCarLifts />
      </main>

      <Footer />
    </div>
  );
}
