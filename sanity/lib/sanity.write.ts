import { createClient } from '@sanity/client'

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20', // Matches your current API standard
  useCdn: false,           // Must be false to bypass cache and write data immediately
  token: process.env.SANITY_WRITE_TOKEN, // Uses your secure Editor token
})