import { createSlice } from '@reduxjs/toolkit'

interface ISearchModalState {
  searchValue: ''
}

const initialState: ISearchModalState = {
  searchValue: ''
}

export const searchModalSlice = createSlice({
  name: 'searchModal',
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload.searchValue
    }
  }
})

export const { setSearchValue } = searchModalSlice.actions
