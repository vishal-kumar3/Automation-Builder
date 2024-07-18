'use server'
import {prisma} from '@/lib/db'
import { currentUser } from "@clerk/nextjs/server"

export const onPaymentDetails = async() => {
  const user = await currentUser()
  if(!user) return null

  const connection = await prisma.user.findFirst({
    where: {
      clerkId: user.id
    },
    select: {
      tier: true,
      credits: true
    }
  })

  if(connection) return connection
}
