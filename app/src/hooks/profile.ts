import { useCallback } from 'react'
import { fetchFollowedHighlights, subscribeContactList, subscribeProfiles } from '@/modules/nostr'
import { useAppDispatch } from '@/store/hooks/redux'
import { setCurrentProfile, setProfiles } from '@/store/reducers/profile.slice'
import { ReturnProfileType } from '@/types/profile'
import { setContactList } from '@/store/reducers/contentWorkspace'
import { ReturnTypeContactList } from '@/types/contentWorkSpace'
import { dbi } from '@/modules/db'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()

  const setContacts = useCallback(
    async (contactList: ReturnTypeContactList) => {
      if (contactList?.contactEvents) {
        const lastContacts = await dbi.listLastContacts(contactList.pubkey)
        console.log('lastContacts', lastContacts)
        // lastContacts.forEach((lc) => {
        //   const c = contactList.contactEvents.find((ce) => ce.pubkey === lc.contactPubkey)
        //   if (c) {
        //     c.order = lc.tm
        //     console.log('lastContact', lc.contactPubkey, 'tm', lc.tm)
        //   }
        // })

        // contactList.contactEvents.sort((a, b) => b.order - a.order)
      }

      dispatch(setContactList({ contactList }))
    },
    [dispatch]
  )

  return useCallback(
    async (keys: string[], currentPubKey?: string) => {
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
          console.log('new highlights', { highlights })
        }
        // updateWorkspace((ws) => {
        //   return { ...ws, highlights };
        // }, pubkey);

        //   //     const bigZaps = await fetchFollowedZaps(lastCL.contactPubkeys, MIN_ZAP_AMOUNT);
        //   //     console.log("new zaps", bigZaps);
        //   //     updateWorkspace((ws) => {
        //   //       return { ...ws, bigZaps };
        //   //     }, pubkey);

        //   //     const longNotes = await fetchFollowedLongNotes(lastCL.contactPubkeys);
        //   //     console.log("new long notes", longNotes);
        //   //     updateWorkspace((ws) => {
        //   //       return { ...ws, longNotes };
        //   //     }, pubkey);

        //   //     const liveEvents = await fetchFollowedLiveEvents(lastCL.contactPubkeys);
        //   //     console.log("new live events", liveEvents);
        //   //     updateWorkspace((ws) => {
        //   //       return { ...ws, liveEvents };
        //   //     }, pubkey);

        //   //     const communities = await fetchFollowedCommunities(lastCL.contactPubkeys);
        //   //     console.log("new communities", communities);
        //   //     updateWorkspace((ws) => {
        //   //       return { ...ws, communities };
        //   //     }, pubkey);

        //   //   }

        //   //   return;
        //   // }

        //   if (cl.pubkey === currentPubKey) {
        //     setContacts(cl);
        //   }
      })
    },
    [dispatch, setContacts]
  )
}
