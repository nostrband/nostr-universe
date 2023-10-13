import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './reducers/user.slice'
import { IKeysState, keysSlice } from './reducers/keys.slice'
import { userService } from './services/user.service'
import { appsSlice } from './reducers/apps.slice'
import { workspacesSlice } from './reducers/workspaces.slice'
import { profileSlice } from './reducers/profile.slice'
import { tabSlice } from './reducers/tab.slice'
import { contentWorkSpaceSlice } from './reducers/contentWorkspace'
import { permissionRequestsSlice } from './reducers/permissionRequests.slice'
import { WorkSpace } from '@/types/workspace'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { ITab } from '@/types/tab'
import { positionScrollPageSlice } from './reducers/positionScrollPage.slice'
import { searchModalSlice } from './reducers/searchModal.slice'
import { IContentFeedSetting } from '@/types/content-feed'
import { bookmarksSlice } from './reducers/bookmarks.slice'

export const rootReducer = combineReducers({
  userReducer,
  keys: keysSlice.reducer,
  apps: appsSlice.reducer,
  profile: profileSlice.reducer,
  tab: tabSlice.reducer,
  contentWorkSpace: contentWorkSpaceSlice.reducer,
  workspaces: workspacesSlice.reducer,
  permissionRequests: permissionRequestsSlice.reducer,
  positionScrollPage: positionScrollPageSlice.reducer,
  searchModal: searchModalSlice.reducer,
  [userService.reducerPath]: userService.reducer,
  [bookmarksSlice.name]: bookmarksSlice.reducer
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

export const selectKeys = (state: RootState): IKeysState => {
  return state.keys
}

export const selectCurrentWorkspace = (state: RootState): WorkSpace | undefined => {
  const currentPubKey = state.keys.currentPubkey
  return state.workspaces.workspaces.find((ws) => ws.pubkey === currentPubKey)
}

export const selectCurrentWorkspaceFeedSettings = (state: RootState): IContentFeedSetting[] => {
  const cws = selectCurrentWorkspace(state)
  return cws?.contentFeedSettings || []
}

// FIXME should be memoized
export const selectCurrentWorkspaceTabs = (state: RootState): ITab[] => {
  const currentWorkSpace = selectCurrentWorkspace(state)
  if (!currentWorkSpace) return []
  return state.tab.tabs.filter((t) => currentWorkSpace.tabIds.includes(t.id))
}

export interface ITabGroup {
  id: string
  tabs: ITab[]
}

// FIXME should be memoized
export const selectTabGroups = (state: RootState): ITabGroup[] => {
  const tabs = selectCurrentWorkspaceTabs(state)
  tabs.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0))
  const groups: ITabGroup[] = []
  tabs.forEach((t) => {
    const id = getTabGroupId(t)
    let index = groups.findIndex((g) => g.id === id)
    if (index < 0) {
      index = groups.length
      groups.push({ id, tabs: [] })
    }
    const group = groups[index]
    group.tabs.push(t)
  })
  return groups
}
