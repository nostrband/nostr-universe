import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks/redux'
import { useUpdateProfile } from '@/hooks/profile'
import { setProfiles } from '@/store/reducers/profile.slice'
import { IInitialisationProvider } from './types'
import { connect, isConnected, nostrOnResume } from '../nostr'
import { loadKeys, loadWorkspace, reloadWallets } from './utils'
import { dbi } from '../db'
import { format } from 'date-fns'
import { worker } from '@/workers/client'
import { initCustomNavigate } from '@/hooks/navigate'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { setAppOfTheDay } from '@/store/reducers/notifications.slice'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { formatDate } from '@/consts'

export const InitialisationProvider = ({ children }: IInitialisationProvider) => {
  const dispatch = useAppDispatch()
  const { updateProfile, reloadFeeds } = useUpdateProfile()
  const { handleOpen, handleOpenContextMenu } = useOpenModalSearchParams()

  const onAppOfTheDay = useCallback(async () => {
    console.log('AOTD start load', Date.now())
    let clicked = false
    // @ts-ignore
    if (window.cordova) {
      // @ts-ignore
      const clickedNotification = window.cordova.plugins.notification.local.launchDetails
      clicked = !!clickedNotification
    }

    if (!clicked) return
    const currentDate = format(new Date(), formatDate)
    const existedApp = await dbi.getAOTDByShownDate(currentDate)
    if (!existedApp) return

    dispatch(setAppOfTheDay({ app: existedApp.app }))
    handleOpen(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)
    console.log('AOTD start loaded', Date.now(), existedApp)
  }, [dispatch, handleOpen])

  const onIntent = useCallback(async () => {

    const onIntentHandler = (intent: any) => {
      const data: string = intent.data || ''
      console.log("intent data", data)
      if (data && data.startsWith("nostr:")) {
        handleOpenContextMenu({ bech32: data.substring(6) })
        return true
      }
      return false;
    }

    // First, let's listen to new intents if someone clicks on
    // nostr: link while Spring is running
    // @ts-ignore
    window.plugins?.intentShim.onIntent(onIntentHandler);

    // And now check the intent that launched the app,
    // maybe it has a nostr: payload already
    try {
      const intent = await new Promise((ok, err) => {
        // @ts-ignore
        window.plugins?.intentShim.getIntent(ok, err);
      })

      // True if there is nostr: payload
      return onIntentHandler(intent)

    } catch { }

    // No payload on launch intent
    return false

  }, [handleOpenContextMenu])

  const initDevice = useCallback(async () => {

    initCustomNavigate(dispatch)

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

      worker.relayInitLocal()

      // process the intent ASAP
      const hasIntent = await onIntent()

      for (const key of keys) await loadWorkspace(key, dispatch)

      await reloadWallets()

      const profiles = await dbi.listProfiles()
      if (profiles.length > 0) {
        dispatch(setProfiles({ profiles }))
      }

      // init the workspace
      await updateProfile(keys, currentPubKey)

      if (!hasIntent)
        await onAppOfTheDay()

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
