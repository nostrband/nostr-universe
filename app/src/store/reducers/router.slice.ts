import { createSlice } from '@reduxjs/toolkit'

export interface IRouterState {
  slugs: string[]
}

const initialState: IRouterState = {
  slugs: ['?page=apps']
}

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    navigate: (state, action) => {
      // const pathname = action.payload.navigateOptions.pathname
      const search = action.payload.navigateOptions.search

      if (search.includes('?page')) {
        state.slugs = state.slugs.map((slug) => {
          if (slug.includes('?page=')) {
            return search
          }

          return slug
        })
      }
    }
  }
})

export const { navigate } = routerSlice.actions

//   dispatch(navigate({slug}))

// navigate({
//     pathname: '/'
//   })
//   dispatch(setPage({ page: '/' }))
// } else {
//   navigate({
//     pathname: '/',
//     search: `?page=${path}`
//   })
//   dispatch(setPage({ page: path }))
// }
