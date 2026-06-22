import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/sanity.write'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, whatsappNumber } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: cleanEmail }
    )

    if (existingUser) {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 400 })
    }

    // Securely hash the password string
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save user to Sanity with the hashed password
    const result = await writeClient.create({
      _type: 'user',
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      whatsappNumber: whatsappNumber || '',
      role: 'user',
    })

    return NextResponse.json(
      { message: 'Success', userId: result._id, email: cleanEmail }, 
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}