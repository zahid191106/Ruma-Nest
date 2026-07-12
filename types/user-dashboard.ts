export interface SanityImage {
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
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
  preferredLocation: string;
  budgetMax: number;
  genderPreference: 'male' | 'female' | 'any';
  aboutMe: string;
  status: 'active' | 'inactive';
}