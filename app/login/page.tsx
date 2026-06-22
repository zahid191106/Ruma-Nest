import type { Metadata } from 'next';
import "../globals.css";
import Navbar from '@/components/Navbar';
import Login from '@/components/Login';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Login | Ruma Nest',
  description: 'Sign in to your Ruma Nest account',

};

export default function Page() {
  return (
    <div className="min-h-screen bg-background-rumanest-light font-sans text-gray-900 overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle 1450px at 20% 20%, #f984e5, transparent),
          radial-gradient(circle 1450px at 70% 70%, #f984e5, transparent)
        `,
       
      }}
    
    >
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Login />
      </main>

      <Footer />
    </div>
  );
}
