import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './reducers/user.slice'
import { keysSlice } from './reducers/keys.slice'
import { userService } from './services/user.service'
import { appsSlice } from './reducers/apps.slice'
import { workspacesSlice } from './reducers/workspaces.slice'
import { profileSlice } from './reducers/profile.slice'
import { tabSlice } from './reducers/tab.slice'
import { contentWorkSpaceSlice } from './reducers/contentWorkspace'
import { permissionRequestsSlice } from './reducers/permissionRequests.slice'

export const rootReducer = combineReducers({
  userReducer,
  keys: keysSlice.reducer,
  apps: appsSlice.reducer,
  profile: profileSlice.reducer,
  tab: tabSlice.reducer,
  contentWorkSpace: contentWorkSpaceSlice.reducer,
  workspaces: workspacesSlice.reducer,
  permissionRequests: permissionRequestsSlice.reducer,
  [userService.reducerPath]: userService.reducer
})

export const createStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDeafaultMiddleware) =>
      getDeafaultMiddleware({
        serializableCheck: false
      }).concat(userService.middleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof createStore>
export type AppDispatch = AppStore['dispatch']
