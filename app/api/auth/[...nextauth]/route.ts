// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { writeClient } from '@/sanity/lib/sanity.write'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Secure Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Fetch user including the hidden password string
        const user = await writeClient.fetch(
          `*[_type == "user" && email == $email][0]{_id, name, email, password}`,
          { email: credentials.email.toLowerCase().trim() }
        )

        // Stop if user doesn't exist or doesn't have a password saved
        if (!user || !user.password) return null

        // Compare plain text input password with the encrypted database string
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordCorrect) return null

        // Return session object if verification passes
        return {
          id: user._id, // This is your Sanity document _id
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    // 🟢 STEP 1: Intercept the user object upon login and persist it inside the encrypted JWT cookie payload
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.sub = user.id // Forces NextAuth's default identity subject to match your Sanity ID
      }
      return token
    },

    // 🟢 STEP 2: Read that precise ID straight out from the token payload and expose it to client-side session hooks
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }