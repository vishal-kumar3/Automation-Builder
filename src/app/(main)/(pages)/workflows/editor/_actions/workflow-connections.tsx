'use server'
import { Option } from '@/components/ui/multiple-selector'
import { prisma } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs/server'

export const getGoogleListener = async () => {
  const { userId } = auth()

  if (userId) {
    const listener = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        googleResourceId: true,
      },
    })

    if (listener) return listener
  }
}

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  const flow = await prisma.workflows.update({
    where: {
      id: flowId,
    },
    data: {
      nodes,
      edges,
      flowPath: flowPath,
    },
  })

  if (flow) return { message: 'flow saved' }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state)
  const published = await prisma.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  })

  if (published.publish) return 'Workflow published'
  return 'Workflow unpublished'
}

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === 'Discord') {
    const response = await prisma.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        discordTemplate: content,
      },
    })

    if (response) {
      return 'Discord template saved'
    }
  }

  if (type === 'Slack') {
    const response = await prisma.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        slackTemplate: content,
        slackAccessToken: accessToken,
      },
    })

    if (response) {
      const channelList = await prisma.workflows.findUnique({
        where: {
          id: workflowId,
        },
        select: {
          slackChannels: true,
        },
      })

      if (channelList) {
        //remove duplicates before insert
        const NonDuplicated = channelList.slackChannels.filter(
          (channel) => channel !== channels![0].value
        )

        NonDuplicated!
          .map((channel) => channel)
          .forEach(async (channel) => {
            await prisma.workflows.update({
              where: {
                id: workflowId,
              },
              data: {
                slackChannels: {
                  push: channel,
                },
              },
            })
          })

        return 'Slack template saved'
      }
      channels!
        .map((channel) => channel.value)
        .forEach(async (channel) => {
          await prisma.workflows.update({
            where: {
              id: workflowId,
            },
            data: {
              slackChannels: {
                push: channel,
              },
            },
          })
        })
      return 'Slack template saved'
    }
  }

  if (type === 'Notion') {
    const response = await prisma.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId: notionDbId,
      },
    })

    if (response) return 'Notion template saved'
  }
}

export const onGetWorkflows = async () => {
  const user = await currentUser()
  if (user) {
    const workflow = await prisma.workflows.findMany({
      where: {
        userId: user.id,
      },
    })

    if (workflow) return workflow
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await currentUser()

  if (user) {
    //create new workflow
    const workflow = await prisma.workflows.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    })

    if (workflow) return { message: 'workflow created' }
    return { message: 'Oops! try again' }
  }
}

export const onGetNodesEdges = async (flowId: string) => {
  const nodesEdges = await prisma.workflows.findUnique({
    where: {
      id: flowId,
    },
    select: {
      nodes: true,
      edges: true,
    },
  })
  if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
}