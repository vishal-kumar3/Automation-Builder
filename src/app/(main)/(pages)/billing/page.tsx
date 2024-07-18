import Stripe from 'stripe'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import BillingDashboard from './_components/BillingDashboard'

type props = {
  searchParams: { [key: string]: string | undefined}
}

const page = async(props: props) => {
  const { session_id } = props.searchParams ?? {
    session_id: '',
  }

  if(!session_id) return <div>Invalid session ID</div>

  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    typescript: true,
    apiVersion: '2024-06-20',
  })

  const session = await stripe.checkout.sessions.listLineItems(session_id)
  const user = await currentUser()
  
  if(!user) return <div>Unauthorized user</div>

  await prisma.user.update({
    where: {
      clerkId: user.id,
    },
    data: {
      tier: session.data[0].description,
      credits: 
        session.data[0].description == 'Unlimited'
          ? 'Unlimited'
          : session.data[0].description == 'Pro'
          ? '100'
          : '10'
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Billing</span>
      </h1>
      <BillingDashboard />
    </div>
  )
}

export default page