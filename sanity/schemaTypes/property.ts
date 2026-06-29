import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property Listing',
  type: 'document',
  fields: [
    // --- ADMIN CONTROLS ---
    defineField({
      name: 'isActive',
      title: 'Is Active Listing',
      type: 'boolean',
      initialValue: false,
      description: 'Admin toggle to show/hide this shared accommodation post on the public website.',
    }),
    defineField({
      name: 'author',
      title: 'Posted By',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
      description: 'The user profile that owns and manages this listing',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., Premium Master Room with Attached Bath',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Generates clean URLs automatically from the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Property Images Gallery',
      type: 'array',
      description: 'Upload multiple photos. The first photo will act as the primary card image.',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Nest Badge',
      type: 'boolean',
      description: 'Displays the green "VERIFIED NEST" badge if checked',
      initialValue: false,
    }),
    defineField({
      name: 'propertyType',
      title: 'Property Type Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Room', value: 'room' },
          { title: 'Studio', value: 'studio' },
          { title: 'Apartment', value: 'apartment' },
          { title: 'Bed Space', value: 'bed_space' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Full Address / Location line',
      type: 'string',
      description: 'e.g., Hazza Bin Zayed Street, Al Wahda, Abu Dhabi',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buildingName',
      title: 'Building / Tower Name',
      type: 'string',
      description: 'e.g., Marina Gate, Diamond Views 3',
    }),
    // 4. FINANCIALS & LISTING TYPE
    defineField({
      name: 'purpose',
      title: 'Listing Purpose',
      type: 'string',
      options: {
        list: [
          { title: 'For Rent', value: 'rent' },
          { title: 'For Sell', value: 'sell' },
        ],
        layout: 'radio',
      },
      initialValue: 'rent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (AED)',
      type: 'number',
      description: 'Enter the total selling price or the recurring rental amount',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'billingCycle',
      title: 'Billing Cycle',
      type: 'string',
      description: 'How frequently is the rent paid? (Hidden if listing is For Sell)',
      // Automatically hides this selector inside Sanity Studio if the property is for sale
      hidden: ({ document }) => document?.purpose === 'sell',
      options: {
        list: [
          { title: 'Daily', value: 'daily' },
          { title: 'Weekly', value: 'weekly' },
          { title: 'Monthly', value: 'monthly' },
          { title: 'Yearly', value: 'yearly' },
        ],
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // Only make billing cycle mandatory if it's a rental property
          if (context.document?.purpose === 'rent' && !value) {
            return 'Billing cycle is required for rental properties'
          }
          return true
        }),
    }),
    defineField({
      name: 'isAllInclusive',
      title: 'Is All-Inclusive?',
      type: 'boolean',
      description: 'Appends "(All-Inclusive DEWA & WiFi)" text next to the price if checked',
      initialValue: true,
    }),
    defineField({
      name: 'overview',
      title: 'Overview Details / Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10),
    }),
    // Overview Specifications
    defineField({
      name: 'idealOccupancy',
      title: 'Ideal Occupancy',
      type: 'string',
      description: 'e.g., Solo / Couple, Bachelors, Females Only',
      initialValue: 'Solo / Couple',
    }),
    // 5. PROPERTY SPECS & ROOM DETAILS
    defineField({
      name: 'bedrooms',
      title: 'Total Bedrooms in Flat',
      type: 'number',
      description: 'How many total rooms are in the whole apartment (e.g., 1, 2, 3 BHK)',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'totalBedsInRoom',
      title: 'Total Beds in this Specific Room',
      type: 'number',
      description: 'Crucial for Bed Space listings (e.g., 2 beds, 4 beds sharing). Set to 1 if it is a private room.',
      initialValue: 1,
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Number of Bathrooms',
      type: 'number',
      description: 'Number of bathrooms available (or shared) for this listing',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'isEnsuite',
      title: 'Attached / Ensuite Bathroom?',
      type: 'boolean',
      description: 'Check this if the bathroom is private/attached inside the room',
      initialValue: false,
    }),
    defineField({
      name: 'floorNumber',
      title: 'Floor Number',
      type: 'number',
      description: 'e.g., 14th Floor (Great info for high-rise Dubai buildings)',
    }),
    defineField({
      name: 'sizeSqFt',
      title: 'Size (Sq. Ft.)',
      type: 'number',
      description: 'Standard local measurement unit',
    }),
    // Expanded details amenities
    defineField({
      name: 'includedAmenities',
      title: 'Amenities',
      type: 'array',
      description: 'Type an amenity (e.g., Balcony, Washing Machine) and press Enter to add it to the list.',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1).error('Please add at least one amenity.'),
    }),
    defineField({
      name: 'status',
      title: 'Listing Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active Listing', value: 'active' },
          { title: 'Inactive / Rented', value: 'inactive' },
        ],
      },
    }),
    defineField({
      name: 'contactDetails',
      title: 'Contact Details (Action Buttons)',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Contact Name',
          type: 'string',
        }),
        defineField({
          name: 'whatsappPhone',
          title: 'WhatsApp Number (Pure digits)',
          type: 'string',
          description: 'Used for chat button redirect link. Format: 971501234567',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'displayPhone',
          title: 'Display Phone Number',
          type: 'string',
          description: 'The number shown when "Show Phone Number" is clicked (e.g., +971 50 123 4567)',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
})