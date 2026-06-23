// app/api/carlift/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE CAR LIFT ROUTE (POST)
export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Parse payload from form fields state
    const body = await request.json();

    const {
      pickupLocation,
      dropoffLocation,
      shiftType,
      startTime,
      monthlyFee,
      carModel,
      carColor,
      totalSeats,
      seatsLeft,
      genderPreference,
      driverName,
      whatsappNumber,
      routeOverview,
      routeBreakdown,  // Array of stops
      comfortPolicies  // Array of comfort string values
    } = body;

    // 3. Strict Validation check
    if (!pickupLocation || !dropoffLocation || !monthlyFee || !whatsappNumber) {
      return NextResponse.json({ 
        error: 'Missing required parameters (pickupLocation, dropoffLocation, monthlyFee, or whatsappNumber)' 
      }, { status: 400 });
    }

    // 4. Format the dynamic route Breakdown array to include individual keys required by Sanity arrays
    const formattedStops = (routeBreakdown || []).map((stop: any) => ({
      _key: crypto.randomUUID(),
      stopType: stop.stopType,
      stationName: stop.stationName
    }));

    // 5. Build dynamic schema entry matching Sanity content parameters perfectly
    const newLift = await writeClient.create({
      _type: 'carLift',
      isActive: false, 
      driverProfile: { _type: 'reference', _ref: userId },
      
      pickupLocation,
      dropoffLocation,
      shiftType,
      startTime,
      monthlyFee: Number(monthlyFee),
      genderPreference,
      routeOverview,
      
      // ✅ Corrected nested Vehicle Details object
      vehicleInfo: {
        model: carModel,
        color: carColor || '',
      },

      totalSeats: Number(totalSeats || 4),
      seatsLeft: Number(seatsLeft || 4),
      
      // ✅ Corrected nested Driver Profile object
      driver: {
        name: driverName,
        isVerifiedDriver: false,
        whatsappNumber: whatsappNumber,
      },
      
      // ✅ Accurate matching arrays configurations
      routeBreakdown: formattedStops,
      comfortPolicies: comfortPolicies || []
    });

    return NextResponse.json({ success: true, data: newLift }, { status: 201 });
  } catch (error: any) {
    console.error('CAR LIFT POST ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Route creation failed', details: error?.message }, { status: 500 });
  }
}