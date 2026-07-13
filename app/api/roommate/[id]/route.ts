// app/api/roommate/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🟡 UPDATE ROOMMATE LISTING PARAMETERS (PATCH)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const { 
      title, 
      location, 
      gender, 
      freeSpace, 
      priceAmount, 
      billingCycle, 
      moveIn, 
      imageAssets, 
      amenities, 
      whatsappNumber,
      nationality,
      status 
    } = body;

    // Initialize update payload object and flag isActive false until admin re-approves layout revisions
    const updatePayload: any = {
      isActive: false 
    };

    if (title) updatePayload.title = title;
    if (location) updatePayload.location = location;
    if (gender) updatePayload.gender = gender;
    if (moveIn) updatePayload.moveIn = moveIn;
    if (whatsappNumber) updatePayload.whatsappNumber = whatsappNumber;
    if (status) updatePayload.status = status;
    if (nationality) updatePayload.nationality = nationality;
    if (amenities) updatePayload.amenities = amenities;
    if (freeSpace !== undefined) updatePayload.freeSpace = Number(freeSpace);

    // Deep nested price properties mutation safety filter checks
    if (priceAmount || billingCycle) {
      updatePayload.price = {};
      if (priceAmount) updatePayload.price.amount = Number(priceAmount);
      if (billingCycle) updatePayload.price.billingCycle = billingCycle;
    }

    // Build replacement structural array assets safely if new array objects mapped
    if (imageAssets && imageAssets.length > 0) {
      updatePayload.images = imageAssets.map((img: any) => ({
        _key: crypto.randomUUID(),
        _type: 'image',
        asset: { _type: 'reference', _ref: img.assetId || img.asset?._ref }
      }));
    }

    const updatedDoc = await writeClient
      .patch(id)
      .set(updatePayload)
      .commit();

    return NextResponse.json({ success: true, message: 'Roommate listing parameters updated safely', data: updatedDoc });
  } catch (error: any) {
    console.error('ROOMMATE PATCH ERROR:', error);
    return NextResponse.json({ error: 'Request update failed', details: error?.message }, { status: 500 });
  }
}

// 🔴 DELETE ROOMMATE LISTING (DELETE)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await writeClient.delete(id);

    return NextResponse.json({ success: true, message: 'Roommate listing removed permanently' });
  } catch (error: any) {
    console.error('ROOMMATE DELETE ERROR:', error);
    return NextResponse.json({ error: 'Listing deletion failed', details: error?.message }, { status: 500 });
  }
}