// app/api/carlift/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE CAR LIFT PASSENGER REQUEST (POST)
export async function POST(request: Request) {
  try {
    // 1. Authenticate user session (Optional check now since unregistered guests can post)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // 2. Parse payload matching the updated passenger form inputs
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

    // 3. Strict Validation check for core request parameters
    if (!pickupLocation || !dropoffLocation || !requestedTime || !amount) {
      return NextResponse.json({ 
        error: 'Missing required parameters (pickupLocation, dropoffLocation, requestedTime, or amount)' 
      }, { status: 400 });
    }

    // 4. Build dynamic payload properties based on authentication state
    const userProfileData: any = {};

    if (session && userId) {
      // If user is registered and logged in
      userProfileData.registeredUser = {
        _type: 'reference',
        _ref: userId
      };
    } else {
      // Validation fallback for unregistered guest users
      if (!guestName || !guestPhone) {
        return NextResponse.json({ 
          error: 'Unregistered users must provide a guest name and phone number.' 
        }, { status: 400 });
      }

      // If user is not registered / guest user
      userProfileData.guestUserDetails = {
        _type: 'object',
        name: guestName,
        phoneNumber: guestPhone
      };
    }

    // 5. Build dynamic schema entry matching your new Sanity schema layout perfectly
    const newLiftRequest = await writeClient.create({
      _type: 'carLift',
      isActive: false,       // Default false: needs admin activation
      userVerified: !!userId, // Auto-verified true if logged in with an account, else false for admin review
      
      pickupLocation,
      dropoffLocation,
      requestedTime,         // ISO DateTime String
      preferredCar: preferredCar || 'Any Car',
      purpose: purpose || 'General Commute',
      amount: Number(amount),

      // Spread out either registeredUser reference or guestUserDetails object safely
      ...userProfileData
    });

    return NextResponse.json({ success: true, data: newLiftRequest }, { status: 201 });
  } catch (error: any) {
    console.error('CAR LIFT POST ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Request submission failed', details: error?.message }, { status: 500 });
  }
}