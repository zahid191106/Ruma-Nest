import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { writeClient } from '@/sanity/lib/sanity.write'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!session || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const whatsappNumber = formData.get('whatsappNumber') as string
    const role = formData.get('role') as string
    const file = formData.get('avatarFile') as File | null

    if (!name || !email || !whatsappNumber || !role) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 })
    }

    // Prepare the update object
    const updateData: any = {
      name,
      email,
      whatsappNumber,
      role,
      isActive: false // Automatically resets to pending review whenever ANY data changes
    }

    // If a new avatar file was uploaded, process it first
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const imageAsset = await writeClient.assets.upload('image', buffer, {
        filename: file.name,
        contentType: file.type,
      })

      updateData.avatar = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      }
    }

    // Commit all changes to Sanity at once
    await writeClient
      .patch(userId)
      .set(updateData)
      .commit()

    return NextResponse.json({ message: 'Profile updated successfully! Pending admin verification.' })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}