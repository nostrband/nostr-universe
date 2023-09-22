import { MetaEvent } from '@/types/meta-event'
import { createSlice } from '@reduxjs/toolkit'

interface IProfileState {
  currentProfile: MetaEvent | null
  profiles: MetaEvent[] | []
}

const initialState: IProfileState = {
  currentProfile: null,
  profiles: []
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload.profile
    },

    setProfiles: (state, action) => {
      const mergeProfiles = (stateProfiles: MetaEvent[], payloadProfiles: MetaEvent[]) => {
        // O(n)
        const existingArray = [...stateProfiles]
        const inputArray = [...payloadProfiles]

        const existingObjMap: { [key: string]: MetaEvent } = {}
        existingArray.forEach((obj) => {
          existingObjMap[obj.pubkey] = obj
        })

        inputArray.forEach((obj) => {
          if (!existingObjMap[obj.pubkey]) {
            existingArray.push(obj)
            existingObjMap[obj.pubkey] = obj
          }
        })

        return existingArray
      }
      const profiles = mergeProfiles(state.profiles, action.payload.profiles)

      state.profiles = profiles

      if (state.currentProfile) {
        state.currentProfile = profiles.find((p) => p.pubkey === state.currentProfile?.pubkey) || null
      }
    }
  }
})

export const { setCurrentProfile, setProfiles } = profileSlice.actions
