import {
  fetchBookmarkLists,
  fetchProfileLists,
  fetchReactionTargetLongNotes,
  fetchReactionTargetNotes
} from '@/modules/nostr'
import { BookmarkListEvent } from '@/types/bookmark-list-event'
import { ProfileListEvent } from '@/types/profile-list-event'
import { ReactionTargetEvent } from '@/types/reaction-target-event'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface IBookmarksContent {
  bestNotes: ReactionTargetEvent[]
  isBestNotesLoading: boolean
  bestLongNotes: ReactionTargetEvent[]
  isBestLongNotesLoading: boolean
  profileLists: ProfileListEvent[]
  isProfileListsLoading: boolean
  bookmarkLists: BookmarkListEvent[]
  isBookmarkListsLoading: boolean
}

const initialState: IBookmarksContent = {
  bestNotes: [],
  isBestNotesLoading: false,
  bestLongNotes: [],
  isBestLongNotesLoading: false,
  profileLists: [],
  isProfileListsLoading: false,
  bookmarkLists: [],
  isBookmarkListsLoading: false
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBestNotesThunk.pending, (state) => {
        state.isBestNotesLoading = true
      })
      .addCase(fetchBestNotesThunk.fulfilled, (state, action) => {
        state.isBestNotesLoading = false
        state.bestNotes = action.payload
      })
      .addCase(fetchBestNotesThunk.rejected, (state) => {
        state.isBestNotesLoading = false
        state.bestNotes = []
      })

      .addCase(fetchBestLongNotesThunk.pending, (state) => {
        state.isBestLongNotesLoading = true
      })
      .addCase(fetchBestLongNotesThunk.fulfilled, (state, action) => {
        state.isBestLongNotesLoading = false
        state.bestLongNotes = action.payload
      })
      .addCase(fetchBestLongNotesThunk.rejected, (state) => {
        state.isBestLongNotesLoading = false
        state.bestLongNotes = []
      })
      .addCase(fetchProfileListsThunk.pending, (state) => {
        state.isProfileListsLoading = true
      })
      .addCase(fetchProfileListsThunk.fulfilled, (state, action) => {
        state.isProfileListsLoading = false
        state.profileLists = action.payload
      })
      .addCase(fetchProfileListsThunk.rejected, (state) => {
        state.isProfileListsLoading = false
        state.profileLists = []
      })
      .addCase(fetchBookmarkListsThunk.pending, (state) => {
        state.isBookmarkListsLoading = true
      })
      .addCase(fetchBookmarkListsThunk.fulfilled, (state, action) => {
        state.isBookmarkListsLoading = false
        state.bookmarkLists = action.payload
      })
      .addCase(fetchBookmarkListsThunk.rejected, (state) => {
        state.isBookmarkListsLoading = false
        state.bookmarkLists = []
      })
  }
})

export const fetchBestNotesThunk = createAsyncThunk<ReactionTargetEvent[], string>(
  'bookmarks/fetchBestNotesThunk',
  async (pubkey) => {
    try {
      const bestNotes = await fetchReactionTargetNotes(pubkey)
      return bestNotes
    } catch (error) {
      console.log(error)
      return []
    }
  }
)

export const fetchBestLongNotesThunk = createAsyncThunk<ReactionTargetEvent[], string>(
  'bookmarks/fetchBestLongNotesThunk',
  async (pubkey) => {
    try {
      const bestLongNotes = await fetchReactionTargetLongNotes(pubkey)
      return bestLongNotes
    } catch (error) {
      console.log(error)
      return []
    }
  }
)

type FetchWithDecryptEventThunkArgs = {
  pubkey: string
  decrypt: (content: string, targetPubkey: string, pubkey?: string) => Promise<string>
}

export const fetchProfileListsThunk = createAsyncThunk<ProfileListEvent[], FetchWithDecryptEventThunkArgs>(
  'bookmarks/fetchProfileListThunk',
  async ({ pubkey, decrypt }) => {
    try {
      const profileLists = await fetchProfileLists(pubkey, decrypt)
      return profileLists
    } catch (error) {
      console.log(error)
      return []
    }
  }
)

export const fetchBookmarkListsThunk = createAsyncThunk<BookmarkListEvent[], FetchWithDecryptEventThunkArgs>(
  'bookmarks/fetchBookmarkListsThunk',
  async ({ pubkey, decrypt }) => {
    try {
      const bookmarkLists = await fetchBookmarkLists(pubkey, decrypt)
      return bookmarkLists
    } catch (error) {
      console.log(error)
      return []
    }
  }
)
