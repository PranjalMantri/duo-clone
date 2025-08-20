import { cache } from 'react'

import { db } from '@/db/drizzle'
import { courses } from '../schema'
import { eq } from 'drizzle-orm'

export const getCourses = cache(async () => await db.query.courses.findMany())

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  })

  return data
})
