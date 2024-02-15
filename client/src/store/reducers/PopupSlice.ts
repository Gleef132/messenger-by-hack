import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

interface IState {
  isActive: boolean;
  children: ReactNode;
  isCloseShow: boolean;
}

const initialState: IState = {
  isActive: false,
  children: '',
  isCloseShow: true,
}

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup(state, { payload }: PayloadAction<{ children: ReactNode; isCloseShow: boolean; }>) {
      state.isActive = true
      state.children = payload.children
      state.isCloseShow = payload.isCloseShow
    },
    hiddenPopup(state) {
      state.isActive = false
      state.children = ''
      state.isCloseShow = true
    }
  }
})

export default popupSlice.reducer