import { IUser } from '@/models/IUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  isSearchFocus: boolean;
  isSearchValue: boolean;
  searchedUsers: IUser[];
  chatUsers: IUser[];
}

const initialState: IState = {
  isSearchFocus: false,
  isSearchValue: false,
  searchedUsers: [],
  chatUsers: []
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchFocus(state, { payload }: PayloadAction<boolean>) {
      state.isSearchFocus = payload
    },
    searchUsers(state, { payload }: PayloadAction<IUser[]>) {
      state.searchedUsers = payload
    },
    chathUsers(state, { payload }: PayloadAction<IUser[]>) {
      state.chatUsers = payload
    },
    searchValue(state, { payload }: PayloadAction<boolean>) {
      state.isSearchValue = payload
    }
  }
})

export default searchSlice.reducer