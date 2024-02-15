import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
  path: string;
  username: string;
  name: string;
  isUserInfoActive: boolean;
}

const initialState: IState = {
  path: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('path') as string) : 'https://www.shutterstock.com/image-vector/anime-style-game-avatar-mascot-600nw-2322112663.jpg',
  username: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('username') as string) : '',
  name: typeof window !== 'undefined'? JSON.parse(localStorage.getItem('name') as string) : '',
  isUserInfoActive: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changePath(state, { payload }: PayloadAction<IState>) {
      state.path = payload.path
    },
    changeUsername(state, { payload }: PayloadAction<IState>) {
      state.username = payload.username
    },
    changeName(state, { payload }: PayloadAction<string>) {
      state.name = payload
    },
    changeUserInfoActive(state, { payload }: PayloadAction<boolean>) {
      state.isUserInfoActive = payload
    }
  }
})

export default userSlice.reducer