import { auth } from '@clerk/nextjs/server'

const adminIds = ['user_31XWwxSy0YxerVu4VZv9Fh41NIs']

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
