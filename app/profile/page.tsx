import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { writeClient } from '@/sanity/lib/sanity.write'
import RumaNestDashboardView from './RumaNestDashboardView'

interface CleanListingSummary {
  _id: string
  title: string
  location: string
  monthlyRent?: number
  propertyType?: string
  image?: string
  views?: number
  inquiries?: number
  isActive?: boolean
}

interface CleanCarLiftSummary {
  _id: string
  fromLocation: string
  toLocation: string
  timing?: string
  price?: number
  seatsAvailable?: number
  isActive?: boolean
}

interface UserProfileData {
  name: string
  email: string
  whatsappNumber: string
  role: string
  avatar?: string
  myProperties: CleanListingSummary[]
  myCarLifts: CleanCarLiftSummary[]
  myFavorites: CleanListingSummary[]
}

async function getUserProfileData(userId: string): Promise<UserProfileData | null> {
  return await writeClient.fetch(
    `*[_type == "user" && _id == $userId][0] {
      name,
      email,
      whatsappNumber,
      role,
      "avatar": avatar.asset->url,
      "myProperties": *[_type == "property" && (contactDetails.whatsappPhone == ^.whatsappNumber || author._ref == ^._id)] {
        _id,
        title,
        location,
        monthlyRent,
        propertyType,
        "image": mainImage.asset->url,
        views,
        inquiries,
        "isActive": status == "active"
      },
      "myCarLifts": *[_type == "carLift" && driverProfile._ref == ^._id] {
        _id,
        "fromLocation": pickupLocation,
        "toLocation": dropoffLocation,
        "timing": startTime,
        "price": monthlyFee,
        "seatsAvailable": seatsLeft,
        isActive
      },
      "myFavorites": favorites[]-> {
        _id,
        title,
        location,
        monthlyRent,
        propertyType,
        "image": mainImage.asset->url
      }
    }`,
    { userId }
  )
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!session || !userId) {
    redirect('/login')
  }

  const profile = await getUserProfileData(userId)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-semibold">Profile sync missing in database.</p>
      </div>
    )
  }

  return <RumaNestDashboardView profileData={profile} />
}