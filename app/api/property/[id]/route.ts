import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🟡 UPDATE PROPERTY (PATCH)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    await writeClient
      .patch(id)
      .set({
        ...body,
        status: 'pending', // Re-verify listing if updated
      })
      .commit();

    return NextResponse.json({ success: true, message: 'Property updated cleanly' });
  } catch (error) {
    return NextResponse.json({ error: 'Update lifecycle failed' }, { status: 500 });
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
  } catch (error) {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}