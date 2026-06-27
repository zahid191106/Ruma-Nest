// app/api/roommate/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';
import { client } from '@/sanity/lib/client';

// 🟢 GET ALL ACTIVE AVAILABLE ROOMMATE LISTINGS
export async function GET() {
  try {
    const listingsQuery = `*[_type == "roommateListing" && isActive == true && status == "available"] | order(_createdAt desc){
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
      status,
      author->{ _id, name, email }
    }`;
    
    const data = await client.fetch(listingsQuery, {}, { next: { revalidate: 60 } });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('ROOMMATE GET ALL ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch listings', details: error?.message }, { status: 500 });
  }
}

// 🔵 CREATE A NEW ROOMMATE LISTING (POST)
export async function POST(request: Request) {
  try {
    // 1. Check if a session exists (Optional checking now)
    const session = await getServerSession(authOptions);
    
    let authorId = "";

    if (session?.user?.email) {
      // 💡 User is logged in: Query Sanity to find their corresponding 'user' document id
      const userDoc = await client.fetch(
        `*[_type == "user" && email == $email][0]._id`,
        { email: session.user.email }
      );
      
      if (userDoc) {
        authorId = userDoc;
      }
    }

    // 💡 2. Fallback if the user is un-registered or not logged in
    if (!authorId) {
      // Replace this string with a real 'user' document ID from your Sanity Studio
      // (e.g., Create a user named "Public Guest" inside your studio and paste its _id here)
      authorId = "9ad23d3e-dff9-45d1-91e0-6c3bbbc4f47a"; 
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const gender = formData.get('gender') as string;
    const freeSpace = formData.get('freeSpace');
    const priceAmount = formData.get('priceAmount') as string;
    const billingCycle = formData.get('billingCycle') as string;
    const moveIn = formData.get('moveIn') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    
    const amenities = formData.getAll('amenities') as string[];
    const files = formData.getAll('images') as File[];

    // Core validation validation parameters checking
    if (!title || !location || !gender || !priceAmount || !billingCycle || !whatsappNumber || !files.length || !amenities.length) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Loop through uploaded file arrays & pipe straight to Sanity Asset pipeline
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

    // 3. Build document layout including the required reference mapping
    const newRoommatePost = await writeClient.create({
      _type: 'roommateListing',
      isActive: false, // Default false for moderation safety queue
      title,
      location,
      gender,
      freeSpace: Number(freeSpace || 1),
      price: {
        amount: Number(priceAmount),
        billingCycle: billingCycle
      },
      moveIn,
      images: uploadedImagesReferences,
      amenities: amenities,
      whatsappNumber,
      status: 'available',
      // 💡 Link the reference mapping based on authentication fallback
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