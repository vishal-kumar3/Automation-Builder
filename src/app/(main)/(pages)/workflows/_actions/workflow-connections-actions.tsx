'use server'

import { auth } from "@clerk/nextjs/server"
import { prisma } from '@/lib/db'

export const getGoogleListener = async() => {
  const { userId } = auth()

  if(userId) {
    const listener = await prisma.user.findUnique({
      where: {
        clerkId: userId
      },
      select: {
        googleResourceId: true
      },
    })

    if(listener) return listener
  }
}

