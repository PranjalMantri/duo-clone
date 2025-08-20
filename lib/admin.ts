import { auth } from '@/lib/auth'

const adminIds = ['user_31XWwxSy0YxerVu4VZv9Fh41NIs']

export const isAdmin = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
