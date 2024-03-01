import { IUser } from '@/models/IUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  users: IUser[] | null;
}

const initialState: IState = {
  users: [],
}

export const chatUsersSlice = createSlice({
  name: 'chatUsers',
  initialState,
  reducers: {
    changeChatUsers(state, {payload}: PayloadAction<IState>){
      state.users = payload.users
    }
  }
})

export default chatUsersSlice.reducer