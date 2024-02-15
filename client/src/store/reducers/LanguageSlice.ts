import { ILanguageData } from "@/models/ILanguage"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState{
  languageData: ILanguageData | null;
}

const initialState:IState = {
  languageData: null
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLanguage(state, {payload}:PayloadAction<ILanguageData>){
      state.languageData = payload
    }
  }
})

export default languageSlice.reducer