import 'server-only'

import { cache } from 'react'

import { db } from '@/db/drizzle'
import { getUserProgress } from '@/db/queries/userProgress'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { challengeProgress, units } from '../schema'

// export const getUnits = cache(async (userId: string | null) => {
//   const { activeCourseId } = (await getUserProgress(userId)) ?? {}

//   if (!activeCourseId || !userId) return []

//   const data = await db.query.units.findMany({
//     where: ({ courseId }, { eq }) => eq(courseId, activeCourseId),
//     with: {
//       lessons: {
//         with: {
//           challenges: {
//             with: {
//               challengeProgress: { where: ({ userId: _userId }, { eq }) => eq(_userId, userId) },
//             },
//           },
//         },
//       },
//     },
//   })
//   const normalizedData = data.map((unit) => ({
//     ...unit,
//     lessons: unit.lessons.map(({ challenges, ...lesson }) => ({
//       ...lesson,
//       challenges,
//       completed:
//         !!challenges.length &&
//         challenges.every(
//           ({ challengeProgress }) =>
//             !!challengeProgress.length && challengeProgress.every(({ completed }) => completed)
//         ),
//     })),
//   }))

//   return normalizedData
// })

export const getUnits = cache(async () => {
  const { userId } = await auth()
  const userProgress = await getUserProgress()

  if (!userId || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  })

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false }
      }

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        )
      })

      return { ...lesson, completed: allCompletedChallenges }
    })

    return { ...unit, lessons: lessonsWithCompletedStatus }
  })

  return normalizedData
})

// export const getCourseProgress = cache(async (userId: string | null) => {
//   const { activeCourseId } = (await getUserProgress(userId)) ?? {}

//   console.log('getting course progress with id: ', activeCourseId)
//   if (!activeCourseId || !userId) return null

//   const unitsInActiveCourse = await db.query.units.findMany({
//     where: ({ courseId }, { eq }) => eq(courseId, activeCourseId),
//     orderBy: ({ order }, { asc }) => [asc(order)],
//     with: {
//       lessons: {
//         orderBy: ({ order }, { asc }) => [asc(order)],
//         with: {
//           unit: true,
//           challenges: {
//             with: {
//               challengeProgress: {
//                 where: ({ userId: _userId }, { eq }) => eq(_userId, userId),
//               },
//             },
//           },
//         },
//       },
//     },
//   })

//   const firstUncompletedLesson = unitsInActiveCourse
//     .flatMap((unit) => unit.lessons)
//     .find((lesson) =>
//       lesson.challenges.some(
//         ({ challengeProgress }) =>
//           !challengeProgress ||
//           challengeProgress.length === 0 ||
//           challengeProgress.some(({ completed }) => !completed)
//       )
//     )

//   return {
//     activeLesson: firstUncompletedLesson,
//     activeLessonId: firstUncompletedLesson?.id,
//   }
// })

export const getCourseProgress = cache(async () => {
  const { userId } = await auth()
  const userProgress = await getUserProgress()

  if (!userId || !userProgress?.activeCourseId) {
    return null
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  })

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => progress.completed === false)
        )
      })
    })

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  }
})
