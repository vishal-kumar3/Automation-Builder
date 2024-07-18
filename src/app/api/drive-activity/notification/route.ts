import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connections";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connections";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connections";
import axios from "axios";

export async function POST(req: NextRequest){
  const headerList = headers()
  let channelResourceId

  headerList.forEach((value, key) => {
    if (key === 'x-goog-resource-id') {
      channelResourceId = value
    }
  })

  if(channelResourceId){
    const user = await prisma?.user.findFirst({
      where: {
        googleResourceId: channelResourceId,
      },
      select: { clerkId: true, credits: true }
    })

    if( (user && parseInt(user.credits!) > 0) ||user?.credits == 'Unlimited' ){
      const workflow = await prisma.workflows.findMany({
        where: {
          userId: user?.clerkId
        },
      })

      if(workflow){
        workflow.map(async(flow) => {
          if(!flow.flowPath) return

          const flowPath = JSON.parse(flow.flowPath!)
          let current = 0

          while (current < flowPath.length){
            if( flowPath[current] == 'Discord'){
              const discordMessage = await prisma.discordWebhook.findFirst({
                where: {
                  userId: flow.userId,
                },
                select: {
                  url: true,
                }
              })

              if(discordMessage){
                await postContentToWebHook(
                  flow.discordTemplate!,
                  discordMessage.url,
                )

                flowPath.splice(flowPath[current], 1)
              }
            }

            if(flowPath[current] == 'Slack'){
              const channels = flow.slackChannels.map((channel) => {
                return {
                  label: '',
                  value: channel,
                }
              })

              if(flow.slackAccessToken && flow.slackTemplate){
                await postMessageToSlack(
                  flow.slackAccessToken!,
                  channels,
                  flow.slackTemplate!,
                )
              }

              flowPath.splice(flowPath[current], 1)
            }

            if(flowPath[current] == 'Notion'){
              if(flow.notionDbId && flow.notionAccessToken && flow.notionTemplate){
                await onCreateNewPageInDatabase(
                  flow.notionDbId!,
                  flow.notionAccessToken!,
                  JSON.parse(flow.notionTemplate!),
                )
              }
              flowPath.splice(flowPath[current], 1)
            }

            if(flowPath[current] == 'Wait'){
              const res = await axios.put(
                'https://api.cron-job.org/jobs',
                {
                  job: {
                    url: `${process.env.NGROK_URI}/flow_id=${flow.id}`,
                    enabled: true,
                    schedule: {
                      timezone: 'Indian',
                      expiresAt: 0,
                      hours: [-1],
                      mdays: [-1],
                      minutes: ['*****'],
                      months: [-1],
                      wdays: [-1],
                    },
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${process.env.CRONJOB_API_KEY!}`,
                    "Content-Type": 'application/json',
                  }
                }
              )

              if(res){
                flowPath.splice(flowPath[current], 1)
                const cronPath = await prisma.workflows.update({
                  where: {
                    id: flow.id,
                  },
                  data: {
                    cronPath: JSON.stringify(flowPath),
                  },
                })

                if(cronPath) break
              }
              break
            }
            current++
          }

          await prisma.user.update({
            where: {
              clerkId: flow.userId,
            },
            data: {
              credits: `${parseInt(user?.credits!) - 1}`,
            }
          })

          return Response.json(
            {
              message: 'Flow Completed',
            },
            {
              status: 200,
            }
          )
        })
      }
    }
  }

  return Response.json(
    {
      message: 'Success',
    },
    {
      status: 200,
    }
  )
}