import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/sanity.write';

// 🟢 UPDATE PROFILE (PATCH) - Combines update-profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const role = formData.get('role') as string;
    const avatarFile = formData.get('avatarFile') as File | null;

    const updateData: any = { name, email, whatsappNumber, role };

    // Handle avatar upload if a new file is attached
    if (avatarFile && avatarFile.size > 0) {
      const asset = await writeClient.assets.upload('image', avatarFile, {
        filename: avatarFile.name,
      });
      updateData.avatar = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      };
    }

    await writeClient.patch(userId).set(updateData).commit();

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}

// 🔵 READ PROFILE (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!session || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await writeClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}