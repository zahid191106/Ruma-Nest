// app/api/carlift/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';
import { client } from '@/sanity/lib/client';

// 🚀 CRITICAL FIX 1: Tell Next.js to NEVER cache this API response dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🟢 CREATE CAR LIFT PASSENGER REQUEST (POST)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const body = await request.json();

    const {
      pickupLocation,
      dropoffLocation,
      requestedTime,
      preferredCar,
      purpose,
      amount,
      guestName,
      guestPhone
    } = body;

    if (!pickupLocation || !dropoffLocation || !requestedTime || !amount) {
      return NextResponse.json({ 
        error: 'Missing required parameters (pickupLocation, dropoffLocation, requestedTime, or amount)' 
      }, { status: 400 });
    }

    const userProfileData: any = {};

    if (session && userId) {
      userProfileData.registeredUser = {
        _type: 'reference',
        _ref: userId
      };
    } else {
      if (!guestName || !guestPhone) {
        return NextResponse.json({ 
          error: 'Unregistered users must provide a guest name and phone number.' 
        }, { status: 400 });
      }

      userProfileData.guestUserDetails = {
        _type: 'object',
        name: guestName,
        phoneNumber: guestPhone
      };
    }

    const newLiftRequest = await writeClient.create({
      _type: 'carLift',
      isActive: false,       
      userVerified: !!userId, 
      
      pickupLocation,
      dropoffLocation,
      requestedTime,         
      preferredCar: preferredCar || 'Any Car',
      purpose: purpose || 'General Commute',
      amount: Number(amount),

      ...userProfileData
    });

    return NextResponse.json({ success: true, data: newLiftRequest }, { status: 201 });
  } catch (error: any) {
    console.error('CAR LIFT POST ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Request submission failed', details: error?.message }, { status: 500 });
  }
}

// 🔵 FETCH CAR LIFT PASSENGER REQUESTS (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    let query = '';
    let params = {};

    if (session && (session.user as any)?.id) {
      // Fetching all records for this user regardless of whether isActive is true or false
      query = `*[_type == "carLift" && registeredUser._ref == $userId] | order(_createdAt desc)`;
      params = { userId: (session.user as any).id };
    } else {
      return NextResponse.json({ success: true, data: [] });
    }

    // 🚀 CRITICAL FIX 2: Explicitly bypass the Sanity Edge CDN cache to read real-time mutations
    const requests = await client.fetch(query, params, {
      useCdn: false,
      stega: false
    });
    
    return NextResponse.json({ success: true, data: requests || [] });
  } catch (error: any) {
    console.error('CAR LIFT GET ROUTE ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch car lift entries' }, 
      { status: 500 }
    );
  }
}