import { createSlice } from '@reduxjs/toolkit'

interface IPositionScrollPageState {
  position: {
    [key: string]: number
  }
}

const initialState: IPositionScrollPageState = {
  position: {
    '/': 0,
    '/content': 0,
    '/tabs-switcher': 0,
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
    }
  }
})

export const { setPositionScroll } = positionScrollPageSlice.actions
