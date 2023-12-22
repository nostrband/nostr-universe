import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import memoizeOne from 'memoize-one'

export interface IRouterState {
  url: string
}

const initialState: IRouterState = {
  url: '?page=apps',
}

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    onPopState: (state) => {
      // just replace the current url in redux
      const url = new URL(window.location.href)
      state.url = url.toString()
    },
    navigate: (state, action) => {
      const options = action.payload?.options
      const to = action.payload.to

      const location = new URL(state.url, window.location.href)

      const params = new URLSearchParams(to.search)

      const searchString =
        !options?.append || !location.searchParams.size
          ? params.toString()
          : `${location.search}&${params.toString()}`

      location.search = searchString

      state.url = location.toString()
      // @ts-ignore
      window.history[
        options?.replace ? "replaceState" : "pushState"](
          {}, "", state.url)
    }
  }
})

export const { navigate, onPopState } = routerSlice.actions

const returnCached = memoizeOne((_, v) => {
  // console.log("selectSearchParam", key, v)
  return v
})

export const selectSearchParam = (state: RootState, key: string) => {
  const url = state.router.url
  const params = new URL(url, window.location.href).searchParams
  const value = params.get(key) || ''
  return returnCached(key, value)
}

