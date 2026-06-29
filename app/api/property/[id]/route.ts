// app/api/properties/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🟡 UPDATE PROPERTY (PATCH) - Completely mapped to your exact schema configuration
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Extract fields explicitly to match your exact schema layout rules
    const {
      title,
      propertyType,
      location,
      buildingName,
      purpose,
      price,
      billingCycle,
      isAllInclusive,
      overview,
      idealOccupancy,
      bedrooms,
      totalBedsInRoom,
      bathrooms,
      isEnsuite,
      floorNumber,
      sizeSqFt,
      amenities, // Incoming frontend string array mapping to 'includedAmenities'
      contactDetails,
      isActive,
      isVerified,
      status
    } = body;

    // Build the sanitized patch object
    const updateFields: Record<string, any> = {};

    // Base properties text & categorization adjustments
    if (title !== undefined) updateFields.title = title;
    if (propertyType !== undefined) updateFields.propertyType = propertyType;
    if (location !== undefined) updateFields.location = location;
    if (buildingName !== undefined) updateFields.buildingName = buildingName || null;
    if (purpose !== undefined) updateFields.purpose = purpose;
    if (price !== undefined) updateFields.price = Number(price);
    if (overview !== undefined) updateFields.overview = overview;
    if (idealOccupancy !== undefined) updateFields.idealOccupancy = idealOccupancy;
    if (amenities !== undefined) updateFields.includedAmenities = amenities; // Schema key mapping

    // Dynamic state resets matching conditional rent vs sell controls
    if (purpose === 'sell') {
      updateFields.billingCycle = null;
      updateFields.isAllInclusive = false;
    } else {
      if (billingCycle !== undefined) updateFields.billingCycle = billingCycle;
      if (isAllInclusive !== undefined) updateFields.isAllInclusive = Boolean(isAllInclusive);
    }

    // Quantitative metrics safeguards
    if (bedrooms !== undefined) updateFields.bedrooms = Number(bedrooms || 1);
    if (totalBedsInRoom !== undefined) updateFields.totalBedsInRoom = Number(totalBedsInRoom || 1);
    if (bathrooms !== undefined) updateFields.bathrooms = Number(bathrooms || 1);
    if (isEnsuite !== undefined) updateFields.isEnsuite = Boolean(isEnsuite);
    if (floorNumber !== undefined) updateFields.floorNumber = floorNumber ? Number(floorNumber) : null;
    if (sizeSqFt !== undefined) updateFields.sizeSqFt = sizeSqFt ? Number(sizeSqFt) : null;

    // Lifecycle states management mapping
    if (status !== undefined) updateFields.status = status;
    if (isActive !== undefined) updateFields.isActive = Boolean(isActive);
    if (isVerified !== undefined) updateFields.isVerified = Boolean(isVerified);

    // Deep merge contact structured objects matching exact nested schema field names
    if (contactDetails !== undefined) {
      updateFields.contactDetails = {
        name: contactDetails.contactName || contactDetails.name, // Gracefully maps frontend field naming variations
        whatsappPhone: contactDetails.whatsappPhone,
        displayPhone: contactDetails.displayPhone,
      };
    }

    // Execute dataset modification down to Sanity lake
    await writeClient
      .patch(id)
      .set(updateFields)
      .commit();

    return NextResponse.json({ success: true, message: 'Property updated cleanly' });
  } catch (error: any) {
    console.error('CRITICAL PROPERTY PATCH ERROR:', error);
    return NextResponse.json({ error: 'Update lifecycle failed', details: error?.message }, { status: 500 });
  }
}

// 🔴 DELETE PROPERTY (DELETE)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await writeClient.delete(id);

    return NextResponse.json({ success: true, message: 'Property listing removed permanently' });
  } catch (error: any) {
    console.error('CRITICAL PROPERTY DELETE ERROR:', error);
    return NextResponse.json({ error: 'Deletion failed', details: error?.message }, { status: 500 });
  }
}