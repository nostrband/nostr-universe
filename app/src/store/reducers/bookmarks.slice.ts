import { fetchReactionTargetLongNotes, fetchReactionTargetNotes } from '@/modules/nostr'
import { ReactionTargetEvent } from '@/types/reaction-target-event'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface IContentWorkSpace {
  bestNotes: ReactionTargetEvent[]
  isBestNotesLoading: boolean
  bestLongNotes: ReactionTargetEvent[]
  isBestLongNotesLoading: boolean
}

const initialState: IContentWorkSpace = {
  bestNotes: [],
  isBestNotesLoading: false,
  bestLongNotes: [],
  isBestLongNotesLoading: false
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBestNotes: (state, action) => {
      state.bestNotes = action.payload
    },
    setBestLongNotes: (state, action) => {
      state.bestLongNotes = action.payload
    }
  },
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

export const { setBestNotes, setBestLongNotes } = bookmarksSlice.actions
