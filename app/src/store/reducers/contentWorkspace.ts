import { AuthoredEvent } from '@/types/authored-event'
import { ExtendedCommunityEvent } from '@/types/communities'
import { ContactListEvent } from '@/types/contact-list-event'
import { HighlightEvent } from '@/types/highlight-event'
import { LiveEvent } from '@/types/live-events'
import { LongNoteEvent } from '@/types/long-note-event'
import { MetaEvent } from '@/types/meta-event'
import { SuggestedProfile } from '@/types/suggested-profiles'
import { ZapEvent } from '@/types/zap-event'
import { createSlice } from '@reduxjs/toolkit'

export interface IContentWorkSpace {
  contactList: ContactListEvent | null
  highlights: HighlightEvent[] | null
  bigZaps: ZapEvent[] | null
  longPosts: LongNoteEvent[] | null
  communities: ExtendedCommunityEvent[] | null
  liveEvents: LiveEvent[] | null
  suggestedProfiles: SuggestedProfile[] | null
  trendingNotes: AuthoredEvent[] | null
  trendingProfiles: MetaEvent[] | null
}

const initialState: IContentWorkSpace = {
  contactList: null,
  highlights: null,
  bigZaps: null,
  longPosts: null,
  communities: null,
  liveEvents: null,
  suggestedProfiles: null,
  trendingNotes: null,
  trendingProfiles: null
}

export const contentWorkSpaceSlice = createSlice({
  name: 'contentWorkSpace',
  initialState,
  reducers: {
    setContactList: (state, action) => {
      state.contactList = action.payload.contactList
    },

    setHighlights: (state, action) => {
      state.highlights = action.payload.highlights
    },

    setBigZaps: (state, action) => {
      state.bigZaps = action.payload.bigZaps
    },

    setLongPosts: (state, action) => {
      state.longPosts = action.payload.longPosts
    },

    setCommunities: (state, action) => {
      state.communities = action.payload.communities
    },

    setLiveEvents: (state, action) => {
      state.liveEvents = action.payload.liveEvents
    },

    setSuggestedProfiles: (state, action) => {
      state.suggestedProfiles = action.payload.suggestedProfiles
    },

    setTrendingNotes: (state, action) => {
      state.trendingNotes = action.payload.trendingNotes
    },

    setTrendingProfiles: (state, action) => {
      state.trendingProfiles = action.payload.trendingProfiles
    }
  }
})

export const {
  setContactList,
  setHighlights,
  setBigZaps,
  setLongPosts,
  setCommunities,
  setLiveEvents,
  setSuggestedProfiles,
  setTrendingNotes,
  setTrendingProfiles
} = contentWorkSpaceSlice.actions
