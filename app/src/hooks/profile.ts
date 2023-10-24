import { useCallback } from 'react'
import {
  fetchFollowedCommunities,
  fetchFollowedHighlights,
  fetchFollowedLiveEvents,
  fetchFollowedLongNotes,
  fetchFollowedZaps,
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
import { dbi } from '@/modules/db'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { MetaEvent } from '@/types/meta-event'
import { ContactListEvent } from '@/types/contact-list-event'
import { fetchBestLongNotesThunk, fetchBestNotesThunk } from '@/store/reducers/bookmarks.slice'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()
  const { profiles } = useAppSelector((state) => state.profile)

  const setContacts = useCallback(
    async (contactList: ContactListEvent) => {
      if (contactList?.contactEvents) {
        const lastContacts = await dbi.listLastContacts(contactList.pubkey)
        console.log('lastContacts', lastContacts)
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

  return useCallback(
    async (keys: string[], currentPubKey: string) => {
      const currentProfile = getProfile(currentPubKey)

      if (currentProfile) {
        dispatch(setCurrentProfile({ profile: currentProfile }))
      } else {
        dispatch(setCurrentProfile({ profile: null }))
      }
      // Reset previous events state for showing loaders
      dispatch(setHighlights({ highlights: null }))
      dispatch(setBigZaps({ bigZaps: null }))
      dispatch(setLongPosts({ longPosts: null }))
      dispatch(setCommunities({ communities: null }))
      dispatch(setLiveEvents({ liveEvents: null }))

      dispatch(fetchBestNotesThunk(currentPubKey))
      dispatch(fetchBestLongNotesThunk(currentPubKey))

      subscribeProfiles(keys, async (profile: MetaEvent) => {
        if (profile) {
          if (profile.pubkey === currentPubKey) {
            dispatch(setCurrentProfile({ profile }))
          }

          if (keys.find((key) => profile.pubkey === key)) {
            dispatch(setProfiles({ profiles: [profile] }))
          }
        }
      })

      subscribeContactList(currentPubKey, async (contactList: ContactListEvent) => {
        console.log('contact list update', contactList)

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
      })
    },
    [dispatch, setContacts, getProfile]
  )
}
