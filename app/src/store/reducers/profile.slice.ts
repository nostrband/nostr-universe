import { ReturnProfileType } from '@/types/profile'
import { createSlice } from '@reduxjs/toolkit'

interface IProfileState {
  currentProfile: ReturnProfileType | null
  profiles: ReturnProfileType[] | []
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
      //   setProfiles((prev) => [profile, ...prev.filter((p) => p.pubkey != profile.pubkey)])
      state.profiles = [...state.profiles, ...action.payload.profiles]
    }
  }
})

export const { setCurrentProfile, setProfiles } = profileSlice.actions
