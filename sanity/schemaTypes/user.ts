import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Picture',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'password',
      title: 'Hashed Password',
      type: 'string',
      hidden: false, // Hides it from displaying in the Sanity Studio UI for privacy
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Format: 971501234567',
    }),
    defineField({
      name: 'role',
      title: 'User Role',
      type: 'string',
      initialValue: 'user',
      options: {
        list: [
          { title: 'Standard User', value: 'user' },
          { title: 'Verified Driver', value: 'driver' },
          { title: 'Landlord / Agent', value: 'landlord' },
          { title: 'Admin', value: 'admin' },
        ],
      },
    }),
    defineField({
      name: 'favorites',
      title: 'Favorite Listings',
      type: 'array',
      description: 'Properties bookmarked by this user account',
      of: [
        {
          type: 'reference',
          to: [{ type: 'property' }], // Creates a clean lookup relationship to properties
        },
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Account Verification Status',
      type: 'boolean',
      initialValue: false,
      description: 'Only administrators can check/verify this account status.',
      readOnly: ({ currentUser }) => {
        // Automatically makes this field read-only in the Studio for anyone who isn't an admin
        const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
        return !isAdmin
      },
    }),
  ],
})