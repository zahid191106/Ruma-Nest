// app/api/carlift/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🟡 UPDATE CAR LIFT REQUEST (PATCH)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // 2. Destructure exactly what can be modified in the passenger request model
    const {
      pickupLocation,
      dropoffLocation,
      requestedTime,
      preferredCar,
      purpose,
      amount,
    } = body;

    // 3. Prepare payload mapping
    const updatePayload: any = {
      isActive: false, // Reset visibility flag until admin re-approves the edits
    };

    if (pickupLocation) updatePayload.pickupLocation = pickupLocation;
    if (dropoffLocation) updatePayload.dropoffLocation = dropoffLocation;
    if (requestedTime) updatePayload.requestedTime = requestedTime;
    if (preferredCar) updatePayload.preferredCar = preferredCar;
    if (purpose) updatePayload.purpose = purpose;
    if (amount !== undefined) updatePayload.amount = Number(amount);

    // 4. Commit patches into your Sanity Content lake
    await writeClient
      .patch(id)
      .set(updatePayload)
      .commit();

    return NextResponse.json({ success: true, message: 'Car lift request parameters updated safely' });
  } catch (error: any) {
    console.error('CAR LIFT PATCH ERROR:', error);
    return NextResponse.json({ error: 'Request update failed', details: error?.message }, { status: 500 });
  }
}

// 🔴 DELETE CAR LIFT REQUEST (DELETE)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await writeClient.delete(id);

    return NextResponse.json({ success: true, message: 'Car lift request removed permanently' });
  } catch (error: any) {
    console.error('CAR LIFT DELETE ERROR:', error);
    return NextResponse.json({ error: 'Request deletion failed', details: error?.message }, { status: 500 });
  }
}