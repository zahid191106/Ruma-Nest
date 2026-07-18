import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Keep titles catchy and rich with targeted local keywords (e.g., Dubai, Abu Dhabi).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Meta Description / Excerpt',
      type: 'text',
      description: 'Summarize the post for Google search results snippets. Keep it under 160 characters.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Featured Image',
      type: 'image',
      options: {
        hotspot: true, // Enables visual cropping coordinates in Sanity UI
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text (Alt Tags)',
          description: 'Crucial for Image SEO. Describe what is visible in the photo.',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text Content',
      type: 'array',
      of: [{ type: 'block' }] // Out-of-the-box Portable Text editor supporting headings, lists, links
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})