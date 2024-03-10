import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IFile {
  status: 'success' | 'loading' | 'error';
  progress: number;
}
interface IState {
  files: IFile[];
}

const initialState: IState = {
  files: []
}

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    changeProgress(state, { payload }: PayloadAction<IFile & { index: number }>) {
      state.files = state.files.map((file, i) => {
        if (i === payload.index) {
          file.progress = payload.progress
          file.status = payload.status
        }
        return file
      })
    },
    changeFilesCount(state, { payload }: PayloadAction<IFile[]>) {
      state.files = payload
    }
  }
})

export default fileSlice.reducer