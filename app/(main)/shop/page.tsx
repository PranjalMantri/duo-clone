import Image from 'next/image'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

import { Promo } from '@/components/promo'
import { FeedWrapper } from '@/components/feed-wrapper'
import { UserProgress } from '@/components/user-progress'
import { StickyWrapper } from '@/components/sticky-wrapper'
// import { getUserProgress, getUserSubscription } from "@/db/queries";
import { getUserProgress } from '@/db/queries/userProgress'

import { Items } from './items'
import { Quests } from '@/components/quests'

const ShopPage = async () => {
  const userProgressData = getUserProgress()

  const [userProgress] = await Promise.all([userProgressData])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Promo />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/shop.svg" alt="Shop" height={90} width={90} />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">Shop</h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Spend your points on cool stuff.
          </p>
          <Items hearts={userProgress.hearts} points={userProgress.points} />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default ShopPage
