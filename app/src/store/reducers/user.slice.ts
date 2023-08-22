import { createSlice } from '@reduxjs/toolkit'

interface IUser {
  name: string
  key: string
}

interface IUserState {
  users: IUser[]
  isLoading: boolean
}

const initialState: IUserState = {
  users: [],
  isLoading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}
})

export default userSlice.reducer
