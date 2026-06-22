import type { Metadata } from 'next';
import "../globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Register | Ruma Nest',
  description: 'Create a new account on Ruma Nest',
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
        <RegisterForm />
      </main>

      <Footer />
    </div>
  );
}
