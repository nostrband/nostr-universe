import { ReturnTypeBigZaps } from '@/types/big-zaps'
import { ReturnTypeCommunities } from '@/types/communities'
import { ReturnTypeContactList, ReturnTypeHighlights } from '@/types/contentWorkSpace'
import { ReturnTypeLiveEvents } from '@/types/live-events'
import { ReturnTypeLongPosts } from '@/types/long-notes'
import { createSlice } from '@reduxjs/toolkit'

interface IContentWorkSpace {
  contactList: ReturnTypeContactList
  highlights: ReturnTypeHighlights
  bigZaps: ReturnTypeBigZaps
  longPosts: ReturnTypeLongPosts
  communities: ReturnTypeCommunities
  liveEvents: ReturnTypeLiveEvents
}

const initialState: IContentWorkSpace = {
  contactList: null,
  highlights: null,
  bigZaps: null,
  longPosts: null,
  communities: null,
  liveEvents: null
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
    }
  }
})

export const { setContactList, setHighlights, setBigZaps, setLongPosts, setCommunities, setLiveEvents } =
  contentWorkSpaceSlice.actions
