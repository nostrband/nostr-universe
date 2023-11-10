import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks/redux'
import { useUpdateProfile } from '@/hooks/profile'
import { setProfiles } from '@/store/reducers/profile.slice'
import { IInitialisationProvider } from './types'
import { connect, isConnected, nostrOnResume } from '../nostr'
import { loadKeys, loadWorkspace, reloadWallets } from './utils'
import { dbi } from '../db'
import { initLocalRelay } from '../relay'
// import { startSync } from '../sync'

export const InitialisationProvider = ({ children }: IInitialisationProvider) => {
  const dispatch = useAppDispatch()
  const { updateProfile, reloadFeeds } = useUpdateProfile()

  const initDevice = useCallback(async () => {
    try {
      document.addEventListener(
        'resume',
        () => {
          if (isConnected()) {
            nostrOnResume()
            reloadFeeds()
          }
        },
        false
      )

      console.log('loading keys...')

      const [keys, currentPubKey] = await loadKeys(dispatch)

      console.log('ndk connecting...')

      await connect()

      console.log('ndk connected')

      // we have to wait until relay is initialized
      // and then sync starts because if user proceeds
      // and switches to another key then we won't know
      // if relay is ready or not and if we can start syncing
      // the new key
      // FIXME rebuild around hooks and state variables so
      // that startSync would wait until local relay is ready
      await initLocalRelay()
      //      await startSync(currentPubKey)
      for (const key of keys) await loadWorkspace(key, dispatch)

      await reloadWallets()

      const profiles = await dbi.listProfiles()
      if (profiles.length > 0) {
        dispatch(setProfiles({ profiles }))
      }

      await updateProfile(keys, currentPubKey)
    } catch (err) {
      console.log('error init app', err)
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
