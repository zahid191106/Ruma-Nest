import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import ActionCard from "@/components/ActionCard";
import PropertyCard from "@/components/PropertyCard";
import CarLift from "@/components/CarLift";
import ChooseUs from "@/components/ChooseUs";
import StatsBanner from "@/components/StatsBanner";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Ruma Nest | Verified Properties, Roommates & Car Lifts in UAE",
  description: "The premier verified listing platform in Dubai & Abu Dhabi. Connect directly with property owners, find roommates, share bedspaces, and discover daily car lift routes safely.",
  alternates: {
    canonical: "https://www.rumanest.com",
  },
  openGraph: {
    title: "Ruma Nest | Premium Properties, Roommates & Car Lifts in UAE",
    description: "Find verified apartments, flatmates, bedspaces, and daily car lift routes across Dubai, Abu Dhabi, and Sharjah.",
    type: "website",
    locale: "en_AE",
    images: ["/logo.png"],
  },
};


export default function Page() {
  return(
    <div className="xl:min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />
      <HomePage />
      <ActionCard />
      <PropertyCard />
      <CarLift />
      <ChooseUs />
      <StatsBanner />
      <Footer />
    </div>
  )
}
