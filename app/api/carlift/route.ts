import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE CAR LIFT ROUTE (POST) - Replaces upload-car-lift
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const newLift = await writeClient.create({
      _type: 'carLift',
      isActive: false,
      driverProfile: { _type: 'reference', _ref: userId },
      pickupLocation: body.fromLocation,
      dropoffLocation: body.toLocation,
      startTime: body.timing,
      monthlyFee: Number(body.price),
      seatsLeft: Number(body.seatsAvailable),
    });

    return NextResponse.json({ success: true, data: newLift }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Route creation failed' }, { status: 500 });
  }
}