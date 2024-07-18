import { auth, clerkClient } from '@clerk/nextjs/server'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { prisma } from '@/lib/db'

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  )


  const { userId } = auth()
  if(!userId) return NextResponse.json({message: 'Unauthorized'}, {status: 401})

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_google'
  )

  const accessToken = clerkResponse.data[0].token
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  })

  const channelId = v4()

  const startPageTokenRes = await drive.changes.getStartPageToken({})
  const startPageToken = startPageTokenRes.data.startPageToken
  if(!startPageToken){
    throw new Error('No start page token found')
  }

  const listener = await drive.changes.watch({
    pageToken: startPageToken,
    supportsAllDrives: true,
    supportsTeamDrives: true,
    requestBody: {
      id: channelId,
      type: 'web_hook',
      address: `${process.env.NGROK_URI}/api/drive-activity/notification`,
      kind: 'api#channel',
    },
  })

  if(listener.status == 200){
    //if listener created store its channel id in db
    const channelStored = await prisma.user.update({
      where: {
        clerkId: userId
      },
      data: {
        googleResourceId: listener.data.resourceId
      }
    })

    if (channelStored) {
      return new NextResponse('Listening to changes...')
    }
  }

  return new NextResponse('Oops! something went wrong, try again')
}
