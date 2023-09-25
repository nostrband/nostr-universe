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

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()
  const { profiles } = useAppSelector((state) => state.profile)

  const setContacts = useCallback(
    async (contactList: ContactListEvent) => {
      if (contactList?.contactEvents) {
        const lastContacts = await dbi.listLastContacts(contactList.pubkey)
        console.log('lastContacts', lastContacts)
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

          const highlights = await fetchFollowedHighlights(contactList.contactPubkeys)
          console.log('new highlights', highlights)
          dispatch(setHighlights({ highlights }))

          const bigZaps = await fetchFollowedZaps(contactList.contactPubkeys, MIN_ZAP_AMOUNT)
          console.log('new zaps', bigZaps)
          dispatch(setBigZaps({ bigZaps }))

          const longPosts = await fetchFollowedLongNotes(contactList.contactPubkeys)
          console.log('new long notes', longPosts)
          dispatch(setLongPosts({ longPosts }))

          const communities = await fetchFollowedCommunities(contactList.contactPubkeys)
          console.log('new communities', communities)
          dispatch(setCommunities({ communities }))

          const liveEvents = await fetchFollowedLiveEvents(contactList.contactPubkeys)
          console.log('new live events', liveEvents)
          dispatch(setLiveEvents({ liveEvents }))
        }
      })
    },
    [dispatch, setContacts, getProfile]
  )
}
