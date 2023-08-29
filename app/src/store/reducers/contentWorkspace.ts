import { ReturnTypeContactList } from '@/types/contentWorkSpace'
import { createSlice } from '@reduxjs/toolkit'

interface IContentWorkSpace {
  contactList: ReturnTypeContactList
}

const initialState: IContentWorkSpace = {
  contactList: null
}

export const contentWorkSpaceSlice = createSlice({
  name: 'contentWorkSpace',
  initialState,
  reducers: {
    setContactList: (state, action) => {
      state.contactList = action.payload.contactList
    }

    // setReadKeys: (state, action) => {
    //   state.readKeys = action.payload.readKeys
    // },

    // setCurrentPubKey: (state, action) => {
    //   state.currentPubKey = action.payload.currentPubKey
    // }
  }
})

export const { setContactList } = contentWorkSpaceSlice.actions
