import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email) return null
        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.name || 'User',
          image: credentials.image || '/logo.svg',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      const user = session.user || {}
      const id = typeof token.id === 'string' ? token.id : undefined
      const name = token.name as string | undefined
      const image = token.picture as string | null | undefined
      return {
        ...session,
        user: { ...user, id: id as unknown as string, name, image },
      }
    },
  },
}

export const { auth } = NextAuth(authOptions)
