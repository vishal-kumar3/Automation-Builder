import { create } from "zustand"

export interface Option {
  value: string
  label: string
  disabled?: boolean
  // fixed option that can't be removed
  fixed?: boolean
  // group the options by providing key
  [key: string] : string | boolean | undefined
}

type ChannelStore = {
  googleFile: any
  setGoogleFile: (googleFile: any) => void
  slackChannels: Option[]
  setSlackChannels: (slackChannels: Option[]) => void
  selectedSlackChannels: Option[]
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void
}

export const useChannelStore = create<ChannelStore>()((set) => ({
  googleFile: {},
  setGoogleFile: (googleFile: any) => set({ googleFile }),
  slackChannels: [],
  setSlackChannels: (slackChannels: Option[]) => set({ slackChannels }),
  selectedSlackChannels: [],
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => set({ selectedSlackChannels })
}))