import 'server-only'

import { auth } from '@clerk/nextjs/server'

import { db } from '@/db/drizzle'
import { cache } from 'react'
import { userProgress } from '../schema'
import { eq } from 'drizzle-orm'

export const getUserProgress = cache(async () => {
  const { userId } = await auth()

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
