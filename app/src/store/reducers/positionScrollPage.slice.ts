import { createSlice } from '@reduxjs/toolkit'

interface IPositionScrollPageState {
  page: string
  position: {
    [key: string]: number
  }
}

const initialState: IPositionScrollPageState = {
  page: '/',
  position: {
    '/': 0,
    '/content': 0,
    '/tabs-switcher': 0,
    '/bookmarks': 0,
    '/search': 0
  }
}

export const positionScrollPageSlice = createSlice({
  name: 'positionScrollPage',
  initialState,
  reducers: {
    setPositionScroll: (state, action) => {
      state.position = {
        ...state.position,
        [action.payload.page]: action.payload.value
      }
    },
    setPage: (state, action) => {
      state.page = action.payload.page
    }
  }
})

export const { setPositionScroll, setPage } = positionScrollPageSlice.actions
