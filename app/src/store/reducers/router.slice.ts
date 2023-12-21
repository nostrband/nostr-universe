import { createSlice } from '@reduxjs/toolkit'

export interface IRouterState {
  slugs: string[]
  historySlugs: string[]
}

const initialState: IRouterState = {
  slugs: ['?page=apps'],
  historySlugs: ['?page=apps']
}

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    navigate: (state, action) => {
      const options = action.payload.options
      const search = action.payload.to.search

      // start screens
      if (search.includes('?page=')) {
        state.slugs = state.slugs.map((slug) => {
          if (slug.includes('?page=')) {
            return search
          }

          return slug
        })

        state.historySlugs = state.historySlugs.map((slug) => {
          if (slug.includes('?page=')) {
            return search
          }

          return slug
        })

        return
      }

      // modal screens
      if (!state.slugs.some((str: string) => str.includes(search))) {
        if (options.append) {
          state.slugs = [...state.slugs, `&${search}&append=true`]

          state.historySlugs = [...state.historySlugs, `&${search}&append=true`]
          return
        }

        if (options.replace) {
          state.slugs = [state.slugs[0], `&${search}&replace=true`]

          state.historySlugs = [...state.historySlugs, `&${search}&replace=true`]
          return
        }

        state.slugs = [state.slugs[0], `&${search}`]
        state.historySlugs = [...state.historySlugs, `&${search}`]
      }
    },
    forwardBack: (state) => {
      const historySlugs = state.historySlugs
      let slugs = state.slugs

      if (historySlugs.length > 1) {
        const lastSlug = historySlugs[historySlugs.length - 1] as string

        if (lastSlug.includes('replace=true')) {
          state.slugs = [slugs[0]]
          state.historySlugs = [historySlugs[0]]
          return
        }

        const prevLastSlug = historySlugs[historySlugs.length - 2]

        const indexSlug = slugs.lastIndexOf(lastSlug)

        slugs.splice(indexSlug, 1)
        historySlugs.splice(-1)

        if (slugs.length === 1 && historySlugs.length > 1) {
          slugs = [...slugs, prevLastSlug]
        }

        state.slugs = slugs

        state.historySlugs = historySlugs
      }
    }
  }
})

export const { navigate, forwardBack } = routerSlice.actions
