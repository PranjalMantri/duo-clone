'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Loader } from 'lucide-react'

import { cn } from '@/lib/utils'

import { SidebarItem } from './sidebar-item'

type Props = {
  className?: string
}

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        'left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]',
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">Lingo</h1>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem label="Leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg" />
        <SidebarItem label="quests" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg" />
      </div>
      <div className="p-4">
        <AuthControls />
      </div>
    </div>
  )
}

function AuthControls() {
  const { status } = useSession()
  if (status === 'loading') {
    return <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
  }
  if (status === 'authenticated') {
    return (
      <button className="text-sm underline" onClick={() => signOut({ callbackUrl: '/' })}>
        Sign out
      </button>
    )
  }
  return (
    <button className="text-sm underline" onClick={() => signIn()}>
      Sign in
    </button>
  )
}
