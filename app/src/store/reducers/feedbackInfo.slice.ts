import { dbi } from '@/modules/db'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type IFeedbackInfoState = {
  isShowWidget: boolean
}

const initialState: IFeedbackInfoState = {
  isShowWidget: false
}

export const feedbackInfoSlice = createSlice({
  name: 'feedbackInfo',
  initialState,
  reducers: {
    setShowNPSWidget: (state) => {
      state.isShowWidget = true
    },
    setHideNPSWidget: (state) => {
      state.isShowWidget = false
    }
  }
})

const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000

export const getFeedbackInfoThunk = createAsyncThunk(
  'feedbackInfo/getFeedbackInfo',
  async (currentPubkey: string, { dispatch }) => {
    try {
      dispatch(setHideNPSWidget())
      const feedbackExists = await dbi.getFeedbackInfo(currentPubkey || 'GUEST')

      if (!feedbackExists) {
        return dispatch(setShowNPSWidget())
      }

      const currentTime = Date.now()

      const timeDifference = currentTime - feedbackExists.timestamp

      const isLastScoreExpired = timeDifference >= sevenDaysInMillis

      if (isLastScoreExpired) {
        console.log(isLastScoreExpired, 'HISH isLastScoreExpired')

        return dispatch(setShowNPSWidget())
      }
    } catch (error) {
      console.log(error)
    }
  }
)

export const { setShowNPSWidget, setHideNPSWidget } = feedbackInfoSlice.actions
