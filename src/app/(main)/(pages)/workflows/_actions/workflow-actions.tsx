'use server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'


export const onGetWorkflows = async () => {
  const user = await currentUser()
  if(user){
    const workflows = await prisma.workflows.findMany(
      {
        where: {
          userId: user?.id
        }
      }
    )

    if(workflows.length === 0){
      return []
    }
    
    return workflows
  }
}

export const onCreateWorkflow = async (title: string, description: string) => {
  const user = await currentUser()

  if(!user) return

  const workflow = await prisma.workflows.create({
    data: {
      name:title,
      description,
      userId: user.id
    }
  })

  if(workflow) return { message: 'Workflow created successfully' }
  return { message: 'Oops! try again!'}

}