import { createSlice } from '@reduxjs/toolkit'

export interface IRouterState {
  url: string
  historySlugs: string[]
}

const initialState: IRouterState = {
  url: 'page=apps',
  historySlugs: ['page=apps']
}
const findLastStringWithSubstring = (arr: string[], substring: string) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].includes(substring)) {
      return { slug: arr[i], index: i + 1 }
    }
  }

  return { slug: null, index: null }
}

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    navigate: (state, action) => {
      const options = action.payload?.options
      const search = action.payload.to.search
      let initialPath = ''

      if (options?.append) {
        initialPath = state.url
      }

      const url = new URLSearchParams(initialPath)

      const searchParams = new URLSearchParams(search)

      const { slug, index } = findLastStringWithSubstring(state.historySlugs, 'page=')
      const startScreen = slug || initialState.url
      const startScreenUrl = new URLSearchParams(startScreen)

      for (const key of startScreenUrl.keys()) {
        const value = startScreenUrl.get(key) as string
        url.set(key, value)
      }

      for (const key of searchParams.keys()) {
        const value = searchParams.get(key) as string
        url.set(key, value)
      }

      state.url = url.toString()

      if (options?.replace && index) {
        const history = state.historySlugs.slice(0, index)

        state.historySlugs = [...history, searchParams.toString()]

        return
      }

      state.historySlugs = [...state.historySlugs, searchParams.toString()]
    },
    forwardBack: (state) => {
      const historySlugs = state.historySlugs

      if (historySlugs.length > 1) {
        const rmSlug = historySlugs[historySlugs.length - 1] as string

        const url = new URLSearchParams(state.url)
        const rmSlugUrl = new URLSearchParams(rmSlug)

        for (const key of rmSlugUrl.keys()) {
          url.delete(key)
        }

        historySlugs.splice(-1)

        const lastSlug = historySlugs[historySlugs.length - 1] as string
        const lastSlugUrl = new URLSearchParams(lastSlug)

        for (const key of lastSlugUrl.keys()) {
          const value = lastSlugUrl.get(key) as string
          url.set(key, value)
        }

        state.url = url.toString()

        state.historySlugs = historySlugs
      }
    }
  }
})

export const { navigate, forwardBack } = routerSlice.actions
