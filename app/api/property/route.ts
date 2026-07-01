// app/api/property/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE PROPERTY (POST) - Supports Authenticated Users and "Public Guest" Fallback
export async function POST(request: Request) {
  try {
    // 1. Optional Session Discovery
    const session = await getServerSession(authOptions);
    
    let authorId = "";

    if (session?.user?.email) {
      // 💡 User is logged in: Query Sanity to find their corresponding 'user' document id
      const userDoc = await writeClient.fetch(
        `*[_type == "user" && email == $email][0]._id`,
        { email: session.user.email }
      );
      
      if (userDoc) {
        authorId = userDoc;
      }
    }

    // 💡 2. Fallback if the user is un-registered or not logged in
    if (!authorId) {
      // Uses your designated "Public Guest" profile document ID from Sanity Studio
      authorId = "9ad23d3e-dff9-45d1-91e0-6c3bbbc4f47a"; 
    }

    // 3. Extract Data via Form Data Matrix
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const propertyType = formData.get('propertyType') as string;
    const location = formData.get('location') as string;
    const buildingName = formData.get('buildingName') as string;
    const purpose = formData.get('purpose') as 'rent' | 'sell';
    const price = Number(formData.get('price'));
    const billingCycle = formData.get('billingCycle') as string;
    const isAllInclusive = formData.get('isAllInclusive') === 'true';
    const overview = formData.get('overview') as string;
    const idealOccupancy = formData.get('idealOccupancy') as string;
    
    // Quantitative parameters
    const bedrooms = formData.get('bedrooms') ? Number(formData.get('bedrooms')) : undefined;
    const totalBedsInRoom = formData.get('totalBedsInRoom') ? Number(formData.get('totalBedsInRoom')) : undefined;
    const bathrooms = formData.get('bathrooms') ? Number(formData.get('bathrooms')) : undefined;
    const isEnsuite = formData.get('isEnsuite') === 'true';
    const floorNumber = formData.get('floorNumber') ? Number(formData.get('floorNumber')) : undefined;
    const sizeSqFt = formData.get('sizeSqFt') ? Number(formData.get('sizeSqFt')) : undefined;

    // Contact Object fields
    const contactName = formData.get('contactName') as string;
    const whatsappPhone = formData.get('whatsappPhone') as string;

    // Arrays & Files
    const amenities = formData.getAll('amenities') as string[];
    const imageFiles = formData.getAll('images') as File[];

    // Baseline validation constraints
    if (!title || !location || isNaN(price) || imageFiles.length === 0) {
      return NextResponse.json({ error: 'Missing required layout fields' }, { status: 400 });
    }

    // Double-check contact details are present for safety
    if (!contactName || !whatsappPhone) {
      return NextResponse.json({ error: 'Contact details (Name and WhatsApp) are required.' }, { status: 400 });
    }

    // 4. Process image uploads sequentially to Sanity Asset Store
    const imageAssetReferences = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const asset = await writeClient.assets.upload('image', file, {
          filename: file.name,
        });
        imageAssetReferences.push({
          _key: crypto.randomUUID(),
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id }
        });
      }
    }

    // Generate basic, web-safe slug configuration from the title parameter
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // 5. Construct the structured document payload matching your Sanity schema layout rules
    const newProperty = await writeClient.create({
      _type: 'property',
      isActive: false, // Keep hidden until admin verification
      isVerified: false,
      status: 'active',
      author: { _type: 'reference', _ref: authorId }, // Always references a valid user profile now
      title,
      slug: {
        _type: 'slug',
        current: `${generatedSlug}-${Date.now().toString().slice(-6)}`
      },
      images: imageAssetReferences,
      propertyType,
      location,
      buildingName: buildingName || undefined,
      purpose,
      price,
      billingCycle: purpose === 'sell' ? null : billingCycle,
      isAllInclusive: purpose === 'sell' ? false : isAllInclusive,
      overview,
      idealOccupancy,
      bedrooms,
      totalBedsInRoom,
      bathrooms,
      isEnsuite,
      floorNumber,
      sizeSqFt,
      includedAmenities: amenities,
      contactDetails: {
        name: contactName,
        whatsappPhone,
      }
    });

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error: any) {
    console.error('CRITICAL PROPERTY POST ERROR:', error);
    return NextResponse.json({ error: 'Failed to create listing', details: error?.message }, { status: 500 });
  }
}

// 🔵 READ ALL PROPERTIES FOR USER (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listings = await writeClient.fetch(
      `*[_type == "property" && author._ref == $userId] | order(_createdAt desc)`,
      { userId }
    );
    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}