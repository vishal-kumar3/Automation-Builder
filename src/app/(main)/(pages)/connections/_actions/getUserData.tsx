'use server'
import { prisma } from '@/lib/db'

export const getUserData = async (id: string) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      clerkId: id,
    },
    include:{
      connections: true
    }
  })

  return userInfo
}