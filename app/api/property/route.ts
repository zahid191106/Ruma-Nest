// app/api/property/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE PROPERTY (POST) - Fully optimized for your FormData + Images upload
export async function POST(request: Request) {
  try {
    // 1. Verify Session Authenticity
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Extract Data via Form Data Matrix instead of request.json()
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const propertyType = formData.get('propertyType') as string;
    const location = formData.get('location') as string;
    const monthlyRent = Number(formData.get('monthlyRent'));
    const overview = formData.get('overview') as string;
    const idealOccupancy = formData.get('idealOccupancy') as string;
    const preference = formData.get('preference') as string;
    const isAllInclusive = formData.get('isAllInclusive') === 'true';
    
    // Contact information fields
    const contactName = formData.get('contactName') as string;
    const whatsappPhone = formData.get('whatsappPhone') as string;
    const displayPhone = formData.get('displayPhone') as string;

    // Arrays: Amenities & Images
    const includedAmenities = formData.getAll('includedAmenities') as string[];
    const imageFiles = formData.getAll('images') as File[];

    if (!title || !location || !monthlyRent || imageFiles.length === 0) {
      return NextResponse.json({ error: 'Missing required property details or images' }, { status: 400 });
    }

    // 3. Process image uploads sequentially to Sanity Lake
    const imageAssetReferences = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const asset = await writeClient.assets.upload('image', file, {
          filename: file.name,
        });
        imageAssetReferences.push({
          _key: crypto.randomUUID(), // Sanity arrays require an explicit unique string key
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id }
        });
      }
    }

    // 4. Construct the structured document for Sanity
    const newProperty = await writeClient.create({
      _type: 'property',
      status: 'pending', // Re-verify through admin queues
      author: { _type: 'reference', _ref: userId },
      title,
      propertyType,
      location,
      monthlyRent,
      overview,
      idealOccupancy,
      preference,
      isAllInclusive,
      amenities: includedAmenities,
      // Map main card preview to index 0, map remaining assets into gallery array
      mainImage: imageAssetReferences[0] ? { _type: 'image', asset: imageAssetReferences[0].asset } : undefined,
      gallery: imageAssetReferences,
      contactDetails: {
        contactName,
        whatsappPhone,
        displayPhone,
      }
    });

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error: any) {
    console.error('CRITICAL PROPERTY POST ERROR:', error);
    return NextResponse.json({ error: 'Failed to create listing', details: error?.message }, { status: 500 });
  }
}

// 🔵 READ ALL PROPERTIES FOR USER (GET) - Keeps your working user profile fetch intact
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listings = await writeClient.fetch(
      `*[_type == "property" && author._ref == $userId]`,
      { userId }
    );
    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}