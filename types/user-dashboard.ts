export interface SanityImage {
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

// User Profile Model
export interface UserProfileData {
  _id: string;
  _type: 'user';
  name: string;
  email: string;
  whatsappNumber?: string;
  role?: 'user' | 'driver' | 'landlord' | 'admin';
  isActive: boolean;
  avatar?: {
    _type: 'image';
    asset: {
      _type: 'reference';
      _ref: string;
    };
  };
  favorites?: Array<{
    _type: 'reference';
    _ref: string;
  }>;
}

// Property Module Model
export interface PropertyListing {
  _id: string;
  title: string;
  propertyType: string;
  location: string;
  buildingName?: string;
  purpose: 'rent' | 'sell';
  price: number;
  billingCycle?: string;
  isAllInclusive: boolean;
  overview: string;
  idealOccupancy: string;
  includedAmenities: string[];
  status: string;
  isActive: boolean;
  isVerified: boolean;
  images?: SanityImage[];
  contactDetails?: {
    name: string;
    whatsappPhone: string;
  };
}

// Car-Lift Module Model (Ready for next step)
export interface CarLiftService {
  _id: string;
  _type: 'carLift';
  isActive: boolean;
  userVerified: boolean;
  pickupLocation: string;
  dropoffLocation: string;
  requestedTime: string; // ISO DateTime string
  preferredCar: string;
  purpose: string;
  amount: number;
  registeredUser?: {
    _type: 'reference';
    _ref: string;
  };
  guestUserDetails?: {
    name?: string;
    phoneNumber?: string;
  };
}

// Roommate Module Model (Ready for next step)
export interface RoommateProfile {
  _id: string;
  _type: 'roommateListing';
  isActive: boolean;
  title: string;
  location: string;
  gender: 'men' | 'female' | 'couple';
  nationality: string;
  freeSpace: number;
  price: {
    amount: number;
    billingCycle: 'weekly' | 'monthly';
  };
  moveIn: 'immediately' | '1_week' | '2_weeks' | 'next_month';
  images?: any[];
  amenities: string[];
  whatsappNumber: string;
  status: 'available' | 'rented';
  author?: {
    _id: string;
    name?: string;
    email?: string;
  };
}