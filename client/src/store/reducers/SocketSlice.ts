import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  socket: WebSocket | null;
  isConnected: boolean;
}

const initialState: IState = {
  socket: null,
  isConnected: false,
}

export const socketSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket(state, { payload }: PayloadAction<IState>) {
      state.socket = payload.socket;
      state.isConnected = true;
    },
  }
})

export default socketSlice.reducer