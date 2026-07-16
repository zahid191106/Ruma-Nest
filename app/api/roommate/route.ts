// app/api/roommate/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';
import { client } from '@/sanity/lib/client';

// 🔵 CREATE A NEW ROOMMATE LISTING (POST)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let authorId = "";

    if (session?.user?.email) {
      const userDoc = await client.fetch(
        `*[_type == "user" && email == $email][0]._id`,
        { email: session.user.email }
      );
      if (userDoc) authorId = userDoc;
    }

    if (!authorId) {
      authorId = "2cc8a8a3-23f4-420d-8794-e7b1d2d9b0ae"; 
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const gender = formData.get('gender') as string;
    const freeSpace = formData.get('freeSpace');
    const nationality = formData.get('nationality') as string;
    const priceAmount = formData.get('priceAmount') as string;
    const billingCycle = formData.get('billingCycle') as string;
    const moveIn = formData.get('moveIn') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    
    const amenities = formData.getAll('amenities') as string[];
    const files = formData.getAll('images') as File[];

    if (!title || !location || !gender || !nationality || !priceAmount || !billingCycle || !whatsappNumber || !files.length || !amenities.length) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const uploadedImagesReferences = [];
    for (const file of files) {
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await writeClient.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        });

        uploadedImagesReferences.push({
          _type: 'image',
          _key: Math.random().toString(36).substring(2, 9),
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        });
      }
    }

    const newRoommatePost = await writeClient.create({
      _type: 'roommateListing',
      isActive: false, 
      title,
      location,
      gender,
      freeSpace: Number(freeSpace || 1),
      nationality,
      price: {
        amount: Number(priceAmount),
        billingCycle: billingCycle
      },
      moveIn,
      images: uploadedImagesReferences,
      amenities: amenities,
      whatsappNumber,
      status: 'available',
      author: {
        _type: 'reference',
        _ref: authorId
      }
    });

    return NextResponse.json({ success: true, data: newRoommatePost }, { status: 201 });
  } catch (error: any) {
    console.error('ROOMMATE POST ERROR:', error);
    return NextResponse.json({ error: 'Listing creation failed', details: error?.message }, { status: 500 });
  }
}

// 🟢 GET ALL LOGGED-IN USER'S ROOMMATE LISTINGS (Bypassing CDN Cache)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!session || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listingsQuery = `*[_type == "roommateListing" && author._ref == $userId] | order(_createdAt desc){
      _id,
      title,
      location,
      gender,
      freeSpace,
      price,
      moveIn,
      images,
      amenities,
      whatsappNumber,
      nationality,
      status,
      isActive,
      author->{ _id, name, email }
    }`;
    
    // 🚀 FIXED: Changed from 'client' to 'writeClient' to avoid the Sanity Edge CDN replication delay
    const data = await writeClient.fetch(listingsQuery, { userId });
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('ROOMMATE GET USER-SPECIFIC ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch user listings', details: error?.message }, { status: 500 });
  }
}