import Image from 'next/image'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

import { FeedWrapper } from '@/components/feed-wrapper'
import { UserProgress } from '@/components/user-progress'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { Promo } from '@/components/promo'
import { Quests } from '@/components/quests'
import { getUserProgress } from '@/db/queries/userProgress'

const LearderboardPage = async () => {
  const userProgressData = getUserProgress()

  const [userProgress] = await Promise.all([userProgressData])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }

  const isPro = false

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/leaderboard.svg" alt="Leaderboard" height={90} width={90} />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">Leaderboard</h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            See where you stand among other learners in the community.
          </p>
          <div className="mb-4 h-0.5 w-full rounded-full bg-gray-200" />
          <p className="text-muted-foreground">Leaderboard data is not available.</p>
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LearderboardPage
