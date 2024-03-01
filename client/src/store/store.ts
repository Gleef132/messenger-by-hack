import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
import chatSlice from './reducers/ChatSlice'
import userSlice from "./reducers/UserSlice";
import socketSlice from "./reducers/SocketSlice";
import searchSlice from "./reducers/SearchSlice";
import settingSlice from "./reducers/SettingSlice";
import popupSlice from "./reducers/PopupSlice";
import fileSlice from "./reducers/FileSlice";
import languageSlice from "./reducers/LanguageSlice";
import chatUsersSlice from "./reducers/ChatUsersSlice";
import themeSlice from "./reducers/ThemeSlice";

const rootReducer = combineReducers({
  chatSlice,
  userSlice,
  socketSlice,
  searchSlice,
  settingSlice,
  popupSlice,
  fileSlice,
  languageSlice,
  chatUsersSlice,
  themeSlice,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']