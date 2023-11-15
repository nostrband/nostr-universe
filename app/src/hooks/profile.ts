import { useCallback, useEffect } from 'react'
import {
  fetchApps,
  fetchFollowedCommunities,
  fetchFollowedHighlights,
  fetchFollowedLiveEvents,
  fetchFollowedLongNotes,
  fetchFollowedZaps,
  isConnected,
  subscribeContactList,
  subscribeProfiles
} from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCurrentProfile, setProfiles } from '@/store/reducers/profile.slice'
import {
  setBigZaps,
  setCommunities,
  setContactList,
  setHighlights,
  setLiveEvents,
  setLongPosts
} from '@/store/reducers/contentWorkspace'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { MetaEvent } from '@/types/meta-event'
import { ContactListEvent } from '@/types/contact-list-event'
import {
  fetchBestLongNotesThunk,
  fetchBestNotesThunk,
  fetchBookmarkListsThunk,
  fetchProfileListsThunk,
  setBestLongNotes,
  setBestNotes,
  setBookmarkLists,
  setProfileLists
} from '@/store/reducers/bookmarks.slice'
import { getFeedbackInfoThunk } from '@/store/reducers/feedbackInfo.slice'
import { useSigner } from './signer'
import { startSync } from '@/modules/sync'
import { isGuest } from '@/utils/helpers/prepare-data'
import { useSync } from './sync'
import { useAsyncThrottle } from './async'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { bootstrapNotifications } from '@/modules/AppInitialisation/utils'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()
  const { profiles } = useAppSelector((state) => state.profile)
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const { decrypt } = useSigner()
  const sync = useSync()
  const asyncThrottle = useAsyncThrottle(10000)

  const setContacts = useCallback(
    async (contactList?: ContactListEvent) => {
      if (contactList?.contactEvents) {
        //const lastContacts = await dbi.listLastContacts(contactList.pubkey)
        //console.log('lastContacts', lastContacts)
        // FIXME sort by lastContacts.tm
      }

      dispatch(setContactList({ contactList }))
    },
    [dispatch]
  )

  const getProfile = useCallback((currentPubKey: string) => {
    const getProfile = profiles.find((profile) => profile.pubkey === currentPubKey)

    return getProfile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reloadFeeds = useCallback(async () => {
    console.log("sync reloadFeeds", Date.now())

    if (!isConnected()) return

    dispatch(setLoading({ isLoading: true }))
    const apps = await fetchApps()
    dispatch(setApps({ apps }))
    dispatch(setLoading({ isLoading: false }))

    bootstrapNotifications(apps, dispatch)

    if (isGuest(currentPubkey)) return

    if (contactList) {
      setContacts(contactList)

      const highlights = await fetchFollowedHighlights(contactList.contactPubkeys).catch(() => {
        dispatch(setHighlights({ highlights: null }))
      })
      console.log('new highlights', highlights)
      dispatch(setHighlights({ highlights }))

      const bigZaps = await fetchFollowedZaps(contactList.contactPubkeys, MIN_ZAP_AMOUNT).catch(() => {
        dispatch(setBigZaps({ bigZaps: null }))
      })
      console.log('new zaps', bigZaps)
      dispatch(setBigZaps({ bigZaps }))

      const longPosts = await fetchFollowedLongNotes(contactList.contactPubkeys).catch(() => {
        dispatch(setLongPosts({ longPosts: null }))
      })
      console.log('new long notes', longPosts)
      dispatch(setLongPosts({ longPosts }))

      const liveEvents = await fetchFollowedLiveEvents(contactList.contactPubkeys).catch(() => {
        dispatch(setLiveEvents({ liveEvents: null }))
      })
      console.log('new live events', liveEvents)
      dispatch(setLiveEvents({ liveEvents }))

      const communities = await fetchFollowedCommunities(contactList.contactPubkeys).catch(() => {
        dispatch(setCommunities({ communities: null }))
      })
      console.log('new communities', communities)
      dispatch(setCommunities({ communities }))
    }

    dispatch(fetchBestNotesThunk(currentPubkey))
    dispatch(fetchBestLongNotesThunk(currentPubkey))
    dispatch(fetchProfileListsThunk({ pubkey: currentPubkey, decrypt }))
    dispatch(fetchBookmarkListsThunk({ pubkey: currentPubkey, decrypt }))
  }, [contactList, dispatch])

  useEffect(() => {
    console.log("force reload", Date.now())
    asyncThrottle(reloadFeeds, true)
  }, [contactList])

  useEffect(() => {
    const reload = sync.reload || (sync.done > 0 && sync.todo === 0)
    console.log("maybe reload", reload, sync)
    if (reload)
      asyncThrottle(reloadFeeds, sync.todo === 0)
  }, [reloadFeeds, sync])

  const updateProfile = useCallback(
    async (keys: string[], currentPubkey: string) => {
      startSync(currentPubkey)

      const currentProfile = getProfile(currentPubkey)

      dispatch(getFeedbackInfoThunk())

      if (currentProfile) {
        dispatch(setCurrentProfile({ profile: currentProfile }))
      } else {
        dispatch(setCurrentProfile({ profile: null }))
      }

      // Reset previous events state for showing loaders
      setContacts()
      dispatch(setHighlights({ highlights: null }))
      dispatch(setBigZaps({ bigZaps: null }))
      dispatch(setLongPosts({ longPosts: null }))
      dispatch(setCommunities({ communities: null }))
      dispatch(setLiveEvents({ liveEvents: null }))

      dispatch(setBestNotes({ bestNotes: [] }))
      dispatch(setBestLongNotes({ bestLongNotes: [] }))
      dispatch(setProfileLists({ profileLists: [] }))
      dispatch(setBookmarkLists({ bookmarkLists: [] }))

      subscribeProfiles(keys, async (profile: MetaEvent) => {
        if (profile) {
          if (profile.pubkey === currentPubkey) {
            dispatch(setCurrentProfile({ profile }))
          }

          if (keys.find((key) => profile.pubkey === key)) {
            dispatch(setProfiles({ profiles: [profile] }))
          }
        }
      })

      subscribeContactList(currentPubkey, async (contactList: ContactListEvent) => {
        console.log('contact list update', Date.now(), contactList)

        if (contactList) setContacts(contactList)
      })
    },
    [dispatch, setContacts, getProfile]
  )

  return {
    updateProfile,
    reloadFeeds
  }
}
