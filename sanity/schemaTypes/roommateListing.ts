import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'roommateListing',
  title: 'Roommate & Bedspace Listings',
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

    // --- CORE DETAILS ---
    defineField({
      name: 'title',
      title: 'Listing Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(80),
      description: 'e.g., Luxury Master Bedroom Bedspace near Metro',
    }),

    defineField({
      name: 'location',
      title: 'Location / Area',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., Dubai Marina, Al Barsha, Deira',
    }),

    defineField({
      name: 'gender',
      title: 'Gender Preference',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Men Only', value: 'men' },
          { title: 'Females Only', value: 'female' },
          { title: 'Couples Allowed', value: 'couple' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'freeSpace',
      title: 'Free Space Available',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(4),
      options: {
        list: [
          { title: '1 Person', value: 1 },
          { title: '2 Persons', value: 2 },
          { title: '3 Persons', value: 3 },
          { title: '4 Persons', value: 4 },
        ],
      },
    }),

    // --- PRICING OBJECT ---
    defineField({
      name: 'price',
      title: 'Price Configuration',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'amount',
          title: 'Price Amount (AED)',
          type: 'number',
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'billingCycle',
          title: 'Billing Cycle',
          type: 'string',
          validation: (Rule) => Rule.required(),
          options: {
            list: [
              { title: 'Weekly', value: 'weekly' },
              { title: 'Monthly', value: 'monthly' },
            ],
          },
        }),
      ],
    }),

    // --- MOVE-IN TIMELINE ---
    defineField({
      name: 'moveIn',
      title: 'Move-in Availability',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Immediately', value: 'immediately' },
          { title: 'Within 1 Week', value: '1_week' },
          { title: 'Within 2 Weeks', value: '2_weeks' },
          { title: 'Next Month', value: 'next_month' },
        ],
      },
    }),

    // --- MEDIA ---
    defineField({
      name: 'images',
      title: 'Room / Property Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1).error('Please upload at least one image.'),
    }),

    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      description: 'Type an amenity (e.g., Balcony, Washing Machine) and press Enter to add it to the list.',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1).error('Please add at least one amenity.'),
    }),

    // --- CONTACT & STATUS ---
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Contact Number',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^\+?[1-9]\d{1,14}$/, {
          name: 'phone',
          invert: false,
        }),
      description: 'Include country code (e.g., +971500000000).',
    }),

    defineField({
      name: 'status',
      title: 'Availability Status',
      type: 'string',
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Rented / Filled', value: 'rented' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      priceAmount: 'price.amount',
      cycle: 'price.billingCycle',
      media: 'images.0',
    },
    prepare({ title, subtitle, priceAmount, cycle, media }) {
      // Build the base string
      const baseSubtitle = `${subtitle || ''}`;
      
      // Truncate to 25 characters if it's too long
      const truncatedLocation = baseSubtitle.length > 20 
        ? `${baseSubtitle.slice(0, 20)}...` 
        : baseSubtitle;

      return {
        title,
        subtitle: `${truncatedLocation} | AED ${priceAmount || 0}/${cycle || ''}`,
        media,
      }
    },
  },
})