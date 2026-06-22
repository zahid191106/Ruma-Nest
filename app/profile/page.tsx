// app/profile/page.tsx
import React from 'react';
import { client } from '@/sanity/lib/client'; 
import ProfileDashboard from './ProfileDashboard';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { redirect } from 'next/navigation';

export const revalidate = 0; 

async function getProfileData(userEmail: string) {
  const query = `*[_type == "user" && email == $userEmail][0]{
    name,
    email,
    whatsappNumber,
    role,
    isActive,
    "avatarUrl": avatar.asset->url,
    "myProperties": *[_type == "property" && author._ref == ^._id]{
      _id,
      title,
      location,
      monthlyRent,
      propertyType,
      isVerified,
      status,
      "imageUrl": images[0].asset->url
    },
    "myCarLifts": *[_type == "carLift" && driverProfile._ref == ^._id]{
      _id,
      pickupLocation,
      dropoffLocation,
      shiftType,
      startTime,
      monthlyFee,
      seatsLeft,
      isActive,
      driver
    },
    "myFavorites": favorites[]->{
      _id,
      title,
      location,
      monthlyRent,
      propertyType,
      status,
      "imageUrl": images[0].asset->url
    }
  }`;

  return await client.fetch(query, { userEmail });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  const profileData = await getProfileData(session.user.email);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-semibold text-slate-400">
        Account found in Auth session, but no matching User Document exists in your Sanity dataset.
      </div>
    );
  }

  return <ProfileDashboard profileData={profileData} />;
}