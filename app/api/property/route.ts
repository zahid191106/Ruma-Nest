import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 CREATE PROPERTY (POST) - Replaces upload-property
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const newProperty = await writeClient.create({
      _type: 'property',
      status: 'pending', // Pending admin review
      author: { _type: 'reference', _ref: userId },
      ...body,
    });

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

// 🔵 READ ALL PROPERTIES FOR USER (GET)
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