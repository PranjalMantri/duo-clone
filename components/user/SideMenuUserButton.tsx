'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export function SideMenuUserButton() {
  const { status, data } = useSession()
  const name = data?.user?.name || 'User'

  return (
    <div className="relative flex h-[60px] items-center sm:max-lg:justify-center">
      {status === 'loading' ? (
        <span className="mx-4 size-10 rounded-full bg-loading sm:max-lg:mx-2" />
      ) : (
        <button
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'w-full h-auto justify-start py-2 px-4 sm:max-lg:w-auto sm:max-lg:px-2'
          )}
          onClick={() => (status === 'authenticated' ? signOut({ callbackUrl: '/' }) : signIn())}
        >
          <span className="size-10 rounded-full bg-secondary mr-3" />
          <span className="font-semibold">{status === 'authenticated' ? name : 'Sign in'}</span>
        </button>
      )}
      <span className="pointer-events-none absolute ml-20 font-bold uppercase text-foreground/85 sm:max-lg:sr-only">
        My Profile
      </span>
    </div>
  )
}
