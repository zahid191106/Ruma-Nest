import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { writeClient } from '@/sanity/lib/sanity.write'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!session || !userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      pickupLocation, dropoffLocation, shiftType, startTime, monthlyFee,
      carModel, carColor, totalSeats, seatsLeft, genderPreference,
      driverName, whatsappNumber, routeOverview, routeBreakdown, comfortPolicies
    } = body

    // Validation Check
    if (!pickupLocation || !dropoffLocation || !shiftType || !startTime || !monthlyFee || !carModel || !driverName || !whatsappNumber) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Build payload matching your Sanity collection types completely
    const newCarLiftDocument = {
      _type: 'carLift',
      pickupLocation,
      dropoffLocation,
      shiftType,
      startTime,
      monthlyFee: Number(monthlyFee),
      vehicleInfo: {
        _type: 'object',
        model: carModel,
        color: carColor || '',
      },
      totalSeats: Number(totalSeats) || 4,
      seatsLeft: Number(seatsLeft) || 4,
      genderPreference,
      driver: {
        _type: 'object',
        name: driverName,
        isVerifiedDriver: false, // Strict: System verified only
        whatsappNumber,
      },
      routeOverview,
      // Map stops adding explicit random keys required for arrays in Sanity
      routeBreakdown: (routeBreakdown || []).map((stop: any) => ({
        _key: Math.random().toString(36).substring(2, 11),
        stopType: stop.stopType,
        stationName: stop.stationName,
      })),
      comfortPolicies: comfortPolicies || [],
      
      // Relations & Permissions
      driverProfile: {
        _type: 'reference',
        _ref: userId, 
      },
      isActive: false, // Strict: Defaults to false; requires Admin approval via Studio
    }

    const result = await writeClient.create(newCarLiftDocument)
    return NextResponse.json({ message: 'Car lift submitted for approval!', id: result._id }, { status: 201 })
  } catch (error: any) {
    console.error('Car Lift setup error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}