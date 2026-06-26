import "./globals.css";
import Providers from './providers'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import type { Metadata } from "next";

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
  icons: {
    icon: "images/ruma-logo.svg",
    apple: "images/ruma-logo.svg", 
  },
  openGraph: {
    title: "ShahMotors | Ireland's Premium Used Car Dealer",
    description: "Shop verified used cars in Dublin and across Ireland with ShahMotors. Transparent pricing, finance support, and NCT-ready vehicles.",
    type: "website",
    locale: "en_IE",
    images: ["/logo-car.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-rumanest-light">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
