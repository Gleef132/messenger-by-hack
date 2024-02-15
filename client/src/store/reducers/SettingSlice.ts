import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
  isSettingActive: boolean;
}

const initialState: IState = {
  isSettingActive: false,
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    changeSettingActive(state, { payload }: PayloadAction<boolean>) {
      state.isSettingActive = payload
    },
  }
})

export default settingSlice.reducer