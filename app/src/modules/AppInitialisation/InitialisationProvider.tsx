import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks/redux'
import { setCurrentPubKey, setKeys } from '@/store/reducers/keys.slice'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { IInitialisationProvider } from './types'
import { connect, fetchApps } from '../nostr'
import { createSomeWorkspaces, getKeys } from './utils'
import { setCurrentWorkspace, setWorkspaces } from '@/store/reducers/workspaces.slice'
import { useUpdateProfile } from '@/hooks/profile'
import { dbi } from '../db'
import { setProfiles } from '@/store/reducers/profile.slice'

export const InitialisationProvider = ({ children }: IInitialisationProvider) => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const DEFAULT_PUBKEY = 'anon'

  const initDevice = useCallback(async () => {
    try {
      const [keys, currentPubKey] = await getKeys()

      dispatch(setKeys({ keys }))

      if (!currentPubKey) {
        dispatch(setCurrentPubKey({ currentPubKey: DEFAULT_PUBKEY }))
      } else {
        dispatch(setCurrentPubKey({ currentPubKey }))
      }

      const workspaces = await createSomeWorkspaces(keys)
      dispatch(setWorkspaces({ workspaces }))

      dispatch(setCurrentWorkspace({ currentPubKey }))

      console.log('ndk connected')

      await connect()

      dispatch(setLoading({ isLoading: true }))
      const apps = await fetchApps()
      dispatch(setApps({ apps }))
      dispatch(setLoading({ isLoading: false }))

      const profiles = await dbi.listProfiles()

      if (profiles.length > 0) {
        setProfiles(profiles)
      }

      await updateProfile(keys, currentPubKey)
    } catch (err) {
      console.log('error init app')
    }
  }, [dispatch, updateProfile])

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      initDevice()
    } else {
      document.addEventListener('deviceready', initDevice, false)
    }
  }, [initDevice])

  return <>{children}</>
}
