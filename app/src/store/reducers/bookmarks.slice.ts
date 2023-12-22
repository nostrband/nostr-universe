import { BookmarkListEvent } from '@/types/bookmark-list-event'
import { ProfileListEvent } from '@/types/profile-list-event'
import { ReactionTargetEvent } from '@/types/reaction-target-event'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface IBookmarksContent {
  bestNotes: ReactionTargetEvent[] | null
  bestLongNotes: ReactionTargetEvent[] | null
  profileLists: ProfileListEvent[] | null
  bookmarkLists: BookmarkListEvent[] | null
}

const initialState: IBookmarksContent = {
  bestNotes: null,
  bestLongNotes: null,
  profileLists: null,
  bookmarkLists: null
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBestNotes: (state, action) => {
      state.bestNotes = action.payload.bestNotes
    },
    setBestLongNotes: (state, action) => {
      state.bestLongNotes = action.payload.bestLongNotes
    },
    setProfileLists: (state, action) => {
      state.profileLists = action.payload.profileLists
    },
    setBookmarkLists: (state, action) => {
      state.bookmarkLists = action.payload.bookmarkLists
    }
  }
})

export const { setBestNotes, setBestLongNotes, setProfileLists, setBookmarkLists } = bookmarksSlice.actions

export const selectBestNotes = (state: RootState): ReactionTargetEvent[] | null => {
  return state.bookmarks.bestNotes
}

export const selectBestLongNotes = (state: RootState): ReactionTargetEvent[] | null => {
  return state.bookmarks.bestLongNotes
}

export const selectProfileLists = (state: RootState): ProfileListEvent[] | null => {
  return state.bookmarks.profileLists
}

export const selectBookmarkLists = (state: RootState): BookmarkListEvent[] | null => {
  return state.bookmarks.bookmarkLists
}
