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

export const getFeedbackInfoThunk = createAsyncThunk('feedbackInfo/getFeedbackInfo', async (_, { dispatch }) => {
  try {
    dispatch(setHideNPSWidget())
    //await dbi.setFlag('', 'nextFeedbackTime', Date.now())
    const feedbackTime = await dbi.getNextFeedbackTime()

    if (!feedbackTime) {
      // don't show feedback request to new users
      await dbi.advanceFeedbackTime()
      return
    }

    if (feedbackTime < Date.now()) {
      return dispatch(setShowNPSWidget())
    }
  } catch (error) {
    console.log(error)
  }
})

export const { setShowNPSWidget, setHideNPSWidget } = feedbackInfoSlice.actions
