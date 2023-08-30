import { useCallback } from 'react'
import {
  fetchFollowedCommunities,
  fetchFollowedHighlights,
  fetchFollowedLongNotes,
  fetchFollowedZaps,
  subscribeContactList,
  subscribeProfiles
} from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCurrentProfile, setProfiles } from '@/store/reducers/profile.slice'
import { ReturnProfileType } from '@/types/profile'
import {
  setBigZaps,
  setCommunities,
  setContactList,
  setHighlights,
  setLongPosts
} from '@/store/reducers/contentWorkspace'
import { ReturnTypeContactList } from '@/types/contentWorkSpace'
import { dbi } from '@/modules/db'
import { MIN_ZAP_AMOUNT } from '@/consts'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()
  const { profiles } = useAppSelector((state) => state.profile)

  const setContacts = useCallback(
    async (contactList: ReturnTypeContactList) => {
      if (contactList?.contactEvents) {
        const lastContacts = await dbi.listLastContacts(contactList.pubkey)
        console.log('lastContacts', lastContacts)
      }

      dispatch(setContactList({ contactList }))
    },
    [dispatch]
  )

  return useCallback(
    async (keys: string[], currentPubKey?: string) => {
      const getProfile = profiles.find((profile) => profile.pubkey === currentPubKey)

      if (getProfile) {
        dispatch(setCurrentProfile({ profile: getProfile }))
      } else {
        dispatch(setCurrentProfile({ profile: null }))
      }

      subscribeProfiles(keys, (profile: ReturnProfileType) => {
        if (profile) {
          if (profile.pubkey === currentPubKey) {
            dispatch(setCurrentProfile({ profile }))
          }

          if (keys.find((key) => profile.pubkey === key)) {
            dispatch(setProfiles({ profiles: [profile] }))
          }
        }
      })

      subscribeContactList(currentPubKey, async (contactList: ReturnTypeContactList) => {
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
        }

        //   //     const liveEvents = await fetchFollowedLiveEvents(lastCL.contactPubkeys);
        //   //     console.log("new live events", liveEvents);
        //   //     updateWorkspace((ws) => {
        //   //       return { ...ws, liveEvents };
        //   //     }, pubkey);
      })
    },
    [dispatch, setContacts, profiles]
  )
}
