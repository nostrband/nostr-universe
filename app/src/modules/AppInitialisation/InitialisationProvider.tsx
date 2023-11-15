import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks/redux'
import { useUpdateProfile } from '@/hooks/profile'
import { setProfiles } from '@/store/reducers/profile.slice'
import { IInitialisationProvider } from './types'
import { connect, isConnected, nostrOnResume } from '../nostr'
import { loadKeys, loadWorkspace, reloadWallets } from './utils'
import { dbi } from '../db'
import { initLocalRelay } from '../relay'

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
            // eslint-disable-next-line
            // @ts-ignore
            if (window.cordova) {
              // eslint-disable-next-line
              // @ts-ignore
              const clickedNotification = window.cordova.plugins.notification.local.launchDetails
              console.log('clickedNotification', clickedNotification)
            }
          }
        },
        false
      )

      console.log('loading keys...')

      const [keys, currentPubKey] = await loadKeys(dispatch)

      console.log('ndk connecting...')

      await connect()

      console.log('ndk connected')

      await initLocalRelay()
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
