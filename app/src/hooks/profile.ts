import { useCallback, useEffect, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCurrentProfile } from '@/store/reducers/profile.slice'
import {
  selectContactList
} from '@/store/reducers/contentWorkspace'
import { getFeedbackInfoThunk } from '@/store/reducers/feedbackInfo.slice'
import { useSync } from './sync'
import { useAsyncThrottle } from './async'
import { worker } from '@/workers/client'
import { useFeeds } from './feeds'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()
  const { profiles } = useAppSelector((state) => state.profile)
  const contactList = useAppSelector(selectContactList)
  const feeds = useFeeds()
  const sync = useSync()
  const asyncThrottle = useAsyncThrottle(10000)

  const getProfile = useCallback((pubkey: string) => {
    const getProfile = profiles.find((profile) => profile.pubkey === pubkey)

    return getProfile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reloadFeeds = useCallback(async (full?: boolean) => {
    console.log(Date.now(), 'sync reloadFeeds full:', full, "cl", contactList)

    feeds.reload(full)
  }, [feeds, contactList])

  const reloadFeedsFull = useCallback(async () => reloadFeeds(true),
    [reloadFeeds]
  )

  useEffect(() => {
    console.log('force reload', Date.now())
    reloadFeedsFull()
    // asyncThrottle(reloadFeedsFull, true)
  }, [contactList])

  useEffect(() => {
    const reload = sync.reload || (sync.done > 0 && sync.todo === 0)
    console.log('maybe reload', reload, sync)
    if (reload) asyncThrottle(reloadFeeds, sync.todo === 0)
  }, [reloadFeeds, sync])

  const updateProfile = useCallback(
    async (keys: string[], pubkey: string) => {
      await worker.syncStart(pubkey)

      const currentProfile = getProfile(pubkey)

      dispatch(getFeedbackInfoThunk())

      if (currentProfile) {
        dispatch(setCurrentProfile({ profile: currentProfile }))
      } else {
        dispatch(setCurrentProfile({ profile: null }))
      }

      // stop feeds and reset state
      feeds.stop()

      // reload
      feeds.reloadProfiles(keys, pubkey)
      feeds.reloadContactList(pubkey)
    },
    [dispatch, getProfile]
  )

  return useMemo(() => ({
    updateProfile,
    reloadFeeds,
  }), [
    updateProfile,
    reloadFeeds,
  ])
}
