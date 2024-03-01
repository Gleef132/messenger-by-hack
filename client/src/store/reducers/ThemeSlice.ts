import { ThemeType } from '@/models/ThemeType';
import { getCookie } from '@/utils/getCookie';
import { setCookie } from '@/utils/setCookie';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  theme: ThemeType;
}

const initialState: IState = {
  theme: typeof window !== 'undefined' ? (getCookie('theme') as ThemeType || document.documentElement.getAttribute('data-theme') as ThemeType) : 'light'
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme(state, { payload }: PayloadAction<ThemeType>) {
      document.documentElement.setAttribute('data-theme', payload);
      setCookie('theme', payload);
      state.theme = payload
    }
  }
})

export default themeSlice.reducer