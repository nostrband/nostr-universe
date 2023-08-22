import { useCallback } from 'react'
import { subscribeProfiles } from '@/modules/nostr'
import { useAppDispatch } from '@/store/hooks/redux'
import { setCurrentProfile, setProfiles } from '@/store/reducers/profile.slice'
import { ReturnProfileType } from '@/types/profile'

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch()

  return useCallback(
    async (keys: string[], currentPubKey?: string) => {
      subscribeProfiles(keys, (profile: ReturnProfileType) => {
        if (profile.pubkey === currentPubKey) {
          dispatch(setCurrentProfile({ profile }))
        }

        if (keys.find((key) => profile.pubkey === key)) {
          dispatch(setProfiles({ profiles: [profile] }))
        }
      })
    },
    [dispatch]
  )
}
