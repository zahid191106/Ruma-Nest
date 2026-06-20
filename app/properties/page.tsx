import type { Metadata } from 'next';
import "../globals.css";
import Navbar from '@/components/Navbar';
import AllProperties from '@/components/AllProperties';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Properties | Ruma Nest',
  description: 'Browse listed properties on Ruma Nest',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background-rumanest-light font-sans text-gray-900 overflow-x-hidden"
    //   style={{
    //   background: `
    //     radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
    //     radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
    //     radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
    //     radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
    //     linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
    //   `,
    // }}

    //   style={{
    //   backgroundImage: `
    //     linear-gradient(45deg, 
    //       rgba(244, 114, 182, 1) 0%, 
    //       rgba(244, 114, 182, 0.7) 30%, 
    //       rgba(244, 114, 182, 0.5) 60%, 
    //       rgba(244, 114, 182, 0.4) 100%
    //     ),
    //     radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
    //     radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.5) 0%, transparent 50%),
    //     radial-gradient(circle at 20% 80%, rgba(244, 114, 182, 0.6) 0%, transparent 45%)
    //   `,
    // }}

    // style={{
    //   background: `linear-gradient(130deg, #E1BEE7 30%, #F3E5F5 40%, #f984e5 100%, #f984e5 100%)`,
    // }}

    style={{
        backgroundImage: `
          radial-gradient(circle 1450px at 20% 20%, #f984e5, transparent),
          radial-gradient(circle 1450px at 70% 70%, #f984e5, transparent)
        `,
       
      }}

    // style={{
    //   backgroundImage: `
    //     linear-gradient(45deg, 
    //       rgba(240,253,250,1) 0%, 
    //       rgba(204,251,241,0.7) 30%, 
    //       rgba(153,246,228,0.5) 60%, 
    //       rgba(94,234,212,0.4) 100%
    //     ),
    //     radial-gradient(circle at 40% 30%, rgba(255,255,255,0.8) 0%, transparent 40%),
    //     radial-gradient(circle at 80% 70%, rgba(167,243,208,0.5) 0%, transparent 50%),
    //     radial-gradient(circle at 20% 80%, rgba(209,250,229,0.6) 0%, transparent 45%)
    //   `,
    // }}
    
    >
      <Navbar />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black mb-6">Properties</h1>
        <AllProperties />
      </main>

      <Footer />
    </div>
  );
}
