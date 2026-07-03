import type { Metadata } from 'next';
import "../globals.css";
import Navbar from '@/components/Navbar';
import RoomMate from '@/components/RoomMate';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Properties | Ruma Nest',
  description: 'Browse listed properties on Ruma Nest',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background-rumanest-light font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black mb-6">Find Your Perfect Roommate</h1>
        <RoomMate />
      </main>

      <Footer />
    </div>
  );
}
