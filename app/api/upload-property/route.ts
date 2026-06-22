import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { writeClient } from '@/sanity/lib/sanity.write'

export async function POST(request: Request) {
  try {
    // 1. Authenticate the active user session
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!session || !userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const formData = await request.formData()

    // Extract basic fields
    const title = formData.get('title') as string
    const propertyType = formData.get('propertyType') as string
    const location = formData.get('location') as string
    const monthlyRent = Number(formData.get('monthlyRent'))
    const overview = formData.get('overview') as string
    const idealOccupancy = formData.get('idealOccupancy') as string
    const preference = formData.get('preference') as string
    const isAllInclusive = formData.get('isAllInclusive') === 'true'
    
    // Extract arrays and objects
    const includedAmenities = formData.getAll('includedAmenities') as string[]
    const contactName = formData.get('contactName') as string
    const whatsappPhone = formData.get('whatsappPhone') as string
    const displayPhone = formData.get('displayPhone') as string

    // Get files from file buffer list
    const imageFiles = formData.getAll('images') as File[]

    if (!title || !propertyType || !location || isNaN(monthlyRent) || !overview || imageFiles.length === 0) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 })
    }

    // 2. Stream asset binary streams to Sanity Asset Repository
    const uploadedImagesReferences = await Promise.all(
      imageFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const asset = await writeClient.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        })
        
        return {
          _type: 'image',
          _key: Math.random().toString(36).substring(2, 11), // Unique key required in arrays
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        }
      })
    )

    // 3. Build document payload matching your Sanity Schema completely
    const newPropertyDocument = {
      _type: 'property',
      title,
      propertyType,
      location,
      monthlyRent,
      isAllInclusive,
      overview,
      idealOccupancy,
      preference,
      includedAmenities,
      status: 'active',
      isVerified: false, // Security: Users cannot verify their own posts
      author: {
        _type: 'reference',
        _ref: userId, // Direct link back to the logged in user
      },
      contactDetails: {
        _type: 'object',
        name: contactName,
        whatsappPhone,
        displayPhone,
      },
      images: uploadedImagesReferences,
    }

    // 4. Inject document straight into Sanity
    const result = await writeClient.create(newPropertyDocument)

    return NextResponse.json({ message: 'Property uploaded!', id: result._id }, { status: 201 })
  } catch (error: any) {
    console.error('Property creation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}