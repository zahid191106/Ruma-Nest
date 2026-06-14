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
  title: "Ruma Nest Property | Dubai's Premium Property Dealer",
  description: "The premier verified listing platform in Abu Dhabi. We connect thousands of property owners, roommates, and car lifters every single day with secure, direct communications.",
  keywords: [
    "used cars Dublin",
    "Ireland car dealership",
    "NCT ready cars",
    "Irish car finance",
    "premium used cars",
  ],
  alternates: {
    canonical: "https://www.shahmotors.ie",
  },
  openGraph: {
    title: "ShahMotors | Ireland's Premium Used Car Dealer",
    description: "Shop verified used cars in Dublin and across Ireland with ShahMotors. Transparent pricing, finance support, and NCT-ready vehicles.",
    type: "website",
    locale: "en_IE",
    images: ["/logo-car.png"],
  },
};


export default function Page() {
  return(
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
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
