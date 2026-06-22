import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'carLift',
  title: 'Car Lift Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Is Active Listing (Admin Approved)',
      type: 'boolean',
      initialValue: false,
      description: 'When false, this request is hidden from public view. Can only be approved by an Administrator.',
    }),
    defineField({
      name: 'driverProfile',
      title: 'Driver Profile',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
      description: 'The user offering this shared commute route',
    }),
    defineField({
      name: 'pickupLocation',
      title: 'Main Pickup Area / City',
      type: 'string',
      description: 'e.g., Mussafah, Khalifa City, Hamdan Street',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dropoffLocation',
      title: 'Main Drop-off Area / Island',
      type: 'string',
      description: 'e.g., Al Maryah Island, Al Reem Island, Yas Island',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shiftType',
      title: 'Shift Type Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Morning Shift', value: 'morning' },
          { title: 'General Shift', value: 'general' },
          { title: 'Evening Shift', value: 'evening' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time / Time Slot',
      type: 'string',
      description: 'e.g., 07:30 AM',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'monthlyFee',
      title: 'Monthly Shared Commute Fee (AED)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    
    // Vehicle Information
    defineField({
      name: 'vehicleInfo',
      title: 'Vehicle Details',
      type: 'object',
      fields: [
        defineField({
          name: 'model',
          title: 'Car Model',
          type: 'string',
          description: 'e.g., Honda Accord, Toyota Camry Hybrid',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'color',
          title: 'Car Color Tag',
          type: 'string',
          description: 'e.g., CHARCOAL GREY, WHITE',
        }),
      ],
    }),

    // Capacity & Preferences
    defineField({
      name: 'totalSeats',
      title: 'Total Capacity Seats',
      type: 'number',
      initialValue: 4,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seatsLeft',
      title: 'Seats Remaining',
      type: 'number',
      description: 'Will display as "X seats free" or "X Seats Left"',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'genderPreference',
      title: 'Gender / Group Preference',
      type: 'string',
      options: {
        list: [
          { title: 'Co-Ed', value: 'Co-Ed' },
          { title: 'Males Only', value: 'Males Only' },
          { title: 'Females Only', value: 'Females Only' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // Driver Details
    defineField({
      name: 'driver',
      title: 'Driver Profile',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Driver Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'isVerifiedDriver',
          title: 'Verified Driver Identity Check',
          type: 'boolean',
          description: 'Displays "Verified Driver ✓" on cards and details if true',
          initialValue: false,
        }),
        defineField({
          name: 'whatsappNumber',
          title: 'WhatsApp Number (Pure Digits)',
          type: 'string',
          description: 'Format: 971501234567',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // Overview & Route breakdown
    defineField({
      name: 'routeOverview',
      title: 'Route Overview Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'routeBreakdown',
      title: 'Route Breakdown (Timeline Stops)',
      type: 'array',
      description: 'Add stops in sequential order from departure point to final stop.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'stopType',
              title: 'Stop Label Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Departure Point', value: 'DEPARTURE POINT' },
                  { title: 'Route Station', value: 'ROUTE STATION' },
                  { title: 'Final Stop', value: 'FINAL STOP' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'stationName',
              title: 'Station / Location Name',
              type: 'string',
              description: 'e.g., MBZ City Zone 5 Gate, Tourist Club Abu Dhabi Mall',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),

    // Policies
    defineField({
      name: 'comfortPolicies',
      title: 'Driver Comfort Policies',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Chilled AC', value: 'Chilled AC' },
          { title: 'Daily Newspapers', value: 'Daily Newspapers' },
          { title: 'Bluetooth Audio Shared', value: 'Bluetooth Audio Shared' },
          { title: 'Luggage Space Available', value: 'Luggage Space Available' },
          { title: 'No Smoking', value: 'No Smoking' },
        ],
      },
    }),
  ],
})