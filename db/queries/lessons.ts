import 'server-only'

import { cache } from 'react'

import { db } from '@/db/drizzle'
import { getCourseProgress } from '@/db/queries/units'
import { auth } from '@clerk/nextjs/server'

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth()

  const courseProgress = await getCourseProgress()

  const lessonId = id || courseProgress?.activeLessonId

  if (!lessonId || !userId) return null

  const data = await db.query.lessons.findFirst({
    where: ({ id: _lessonId }, { eq }) => eq(_lessonId, lessonId),
    with: {
      challenges: {
        orderBy: ({ order }, { asc }) => [asc(order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: ({ userId: _userId }, { eq }) => eq(_userId, userId),
          },
        },
      },
    },
  })

  if (!data?.challenges) return null

  return {
    ...data,
    challenges: data.challenges.map(({ challengeProgress, ...challenge }) => ({
      ...challenge,
      challengeProgress,
      completed:
        !!challengeProgress.length && challengeProgress.every(({ completed }) => completed),
    })),
  }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress()

  if (!courseProgress?.activeLessonId) {
    return 0
  }

  const lesson = await getLesson(courseProgress.activeLessonId)

  if (!lesson) {
    return 0
  }

  const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed)
  const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100)

  return percentage
})
