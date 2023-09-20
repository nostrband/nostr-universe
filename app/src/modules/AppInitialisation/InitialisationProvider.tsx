import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks/redux'
import { setCurrentPubKey, setKeys, setReadKeys } from '@/store/reducers/keys.slice'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { setCurrentWorkspace, setWorkspaces } from '@/store/reducers/workspaces.slice'
import { useUpdateProfile } from '@/hooks/profile'
import { setProfiles } from '@/store/reducers/profile.slice'
import { DEFAULT_PUBKEY } from '@/consts'
import { getKeys } from '@/utils/keys'
import { IInitialisationProvider } from './types'
import { connect, fetchApps } from '../nostr'
import { createSomeWorkspaces, reloadWallets } from './utils'
import { dbi } from '../db'

export const InitialisationProvider = ({ children }: IInitialisationProvider) => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()

  const initDevice = useCallback(async () => {
    try {
      const [keys, currentPubKey, readKeys] = await getKeys()

      dispatch(setKeys({ keys }))
      dispatch(setReadKeys({ readKeys }))

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

      await reloadWallets()

      const profiles = await dbi.listProfiles()
      if (profiles.length > 0) {
        dispatch(setProfiles({ profiles }))
      }

      await updateProfile(keys, currentPubKey)

      dispatch(setLoading({ isLoading: true }))
      const apps = await fetchApps()
      dispatch(setApps({ apps }))
      dispatch(setLoading({ isLoading: false }))
    } catch (err) {
      console.log('error init app', JSON.stringify(err))
    }
  }, [dispatch, updateProfile])

  useEffect(() => {
    if (import.meta.env.DEV) {
      initDevice()
    } else {
      document.addEventListener('deviceready', initDevice, false)
    }
  }, [initDevice])

  return <>{children}</>
}
