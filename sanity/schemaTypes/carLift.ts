import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'carLift',
  title: 'Car Lift Requests',
  type: 'document',
  fields: [
    // --- ADMIN CONTROLS ---
    defineField({
      name: 'isActive',
      title: 'Is Active Car-Lift',
      type: 'boolean',
      initialValue: false,
      description: 'Admin toggle to show/hide this car-lift request on the public website.',
    }),
    defineField({
      name: 'userVerified',
      title: 'User Verified',
      type: 'boolean',
      initialValue: false,
      description: 'Admin toggle indicating if the poster has verified their identity.',
    }),

    // --- USER ROUTE & TIME ---
    defineField({
      name: 'pickupLocation',
      title: 'Pickup Point',
      type: 'string',
      description: 'e.g., Mussafah, Khalifa City',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dropoffLocation',
      title: 'Drop-off Point',
      type: 'string',
      description: 'e.g., Al Reem Island, Yas Island',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requestedTime',
      title: 'Requested Time & Date',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15, // Allows the user to select time in 15-minute increments
      },
      description: 'Select the exact date and time you need the car-lift.',
      validation: (Rule) => Rule.required(),
    }),
    // --- CAR & PURPOSE DETAILS ---
    defineField({
      name: 'preferredCar',
      title: 'Preferred Car',
      type: 'string',
      description: 'e.g., Sedan, SUV, Toyota Camry, or Any Car',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose of Commute',
      type: 'string',
      description: 'e.g., Daily Office Commute, School Pick-up, Shopping',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Offered Amount (AED)',
      type: 'number',
      description: 'Budget or amount willing to pay',
      validation: (Rule) => Rule.required().min(0),
    }),

    // --- USER PROFILE & UNREGISTERED CONTACTS ---
    defineField({
      name: 'registeredUser',
      title: 'Registered User Profile',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'Link to their account if the user is logged in/registered.',
    }),
    defineField({
      name: 'guestUserDetails',
      title: 'Guest User Info (If Not Registered)',
      type: 'object',
      description: 'Fill this section out only if the user does not have a registered profile.',
      fields: [
        defineField({
          name: 'name',
          title: 'Guest Name',
          type: 'string',
        }),
        defineField({
          name: 'phoneNumber',
          title: 'Guest Contact / WhatsApp Number',
          type: 'string',
          description: 'e.g., 971501234567',
        }),
      ],
    }),
  ],
})