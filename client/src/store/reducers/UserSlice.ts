import { IUser } from "@/models/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
  path: string;
  username: string;
  name: string;
  isUserInfoActive: boolean;
  user: IUser;
}

const initialState: IState = {
  path: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('path') as string) : '',
  username: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('username') as string) : '',
  name: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('name') as string) : '',
  user: {} as IUser,
  isUserInfoActive: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserData(state, { payload }: PayloadAction<Omit<IState, 'isUserInfoActive'>>) {
      state.user = payload.user
      state.path = payload.path
      state.username = payload.username
      state.name = payload.name
    },
    changeUser(state, { payload }: PayloadAction<IUser>) {
      state.user = payload
    },
    changeUserInfoActive(state, { payload }: PayloadAction<boolean>) {
      state.isUserInfoActive = payload
    }
  }
})

export default userSlice.reducer