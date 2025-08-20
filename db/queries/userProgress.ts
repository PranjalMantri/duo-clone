import 'server-only'

import { auth } from '@/lib/auth'

import { db } from '@/db/drizzle'
import { cache } from 'react'
import { userProgress } from '../schema'
import { eq } from 'drizzle-orm'

export const getUserProgress = cache(async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  })

  return data
})
