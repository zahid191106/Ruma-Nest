import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🟡 UPDATE CAR LIFT (PATCH)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    await writeClient
      .patch(id)
      .set({
        pickupLocation: body.fromLocation,
        dropoffLocation: body.toLocation,
        startTime: body.timing,
        monthlyFee: Number(body.price),
        seatsLeft: Number(body.seatsAvailable),
        isActive: false,
      })
      .commit();

    return NextResponse.json({ success: true, message: 'Route parameters updated safely' });
  } catch (error) {
    return NextResponse.json({ error: 'Route update failed' }, { status: 500 });
  }
}

// 🔴 DELETE CAR LIFT (DELETE)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await writeClient.delete(id);

    return NextResponse.json({ success: true, message: 'Route removed permanently' });
  } catch (error) {
    return NextResponse.json({ error: 'Route deletion failed' }, { status: 500 });
  }
}