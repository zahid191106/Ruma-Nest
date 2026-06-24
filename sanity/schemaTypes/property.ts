import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property Listing',
  type: 'document',
  fields: [
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
      name: 'monthlyRent',
      title: 'Monthly Rent (AED)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    // defineField({
    //   name: 'isAllInclusive',
    //   title: 'Is All-Inclusive?',
    //   type: 'boolean',
    //   description: 'Appends "(All-Inclusive)" text next to the price if checked',
    //   initialValue: true,
    // }),
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
    defineField({
      name: 'preference',
      title: 'Preference / Nationality',
      type: 'string',
      description: 'e.g., Any Nationality, Arab, South Asian',
      initialValue: 'Any Nationality',
    }),
    // Expanded details amenities
    defineField({
      name: 'includedAmenities',
      title: 'Included Amenities',
      type: 'array',
      description: 'Select all features that apply to show as checks under Included Amenities',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Fully Furnished', value: 'Fully Furnished' },
          { title: 'WiFi Included', value: 'WiFi Included' },
          { title: 'Near Bus Stop', value: 'Near Bus Stop' },
          { title: 'AC Included', value: 'AC Included' },
          { title: 'Neat & Clean', value: 'Neat & Clean' },
          { title: 'Separate Kitchen', value: 'Separate Kitchen' },
          { title: 'Gym & Pool', value: 'Gym & Pool' },
        ],
      },
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