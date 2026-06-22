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
          id: user._id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
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