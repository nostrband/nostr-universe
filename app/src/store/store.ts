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
import { ITabGroup } from '@/types/workspace'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'

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

export const selectCurrentWorkspace = (state: RootState) => {
  const currentPubKey = state.keys.currentPubKey
  return state.workspaces.workspaces.find((ws) => ws.pubkey === currentPubKey)
}

export const selectTabGroups = (state: RootState) => {
  const currentWorkSpace = selectCurrentWorkspace(state)
  const tabs = currentWorkSpace?.tabs || []
  const groups: ITabGroup[] = []
  tabs.forEach((t) => {
    const id = getTabGroupId(t)
    let index = groups.findIndex(g => g.id === id)
    if (index < 0) {
      index = groups.length
      groups.push({ id, tabs: []})
    }
    const group = groups[index]
    group.tabs.push(t)
  })
  return groups
}
