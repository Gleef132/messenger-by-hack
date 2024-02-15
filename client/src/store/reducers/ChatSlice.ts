import { IMessage } from '@/models/IMessage';
import { IUser } from '@/models/IUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState extends IUser, ISetLastMessage {
  messages: IMessage[];
  isChatActive: boolean;
}

interface ISetLastMessage {
  setLastMessage: (message: IMessage) => void;
}

const initialState: IState = {
  _id: '',
  password: '',
  username: '',
  name: '',
  path: '',
  isOnline: false,
  isTyping: false,
  isSecured: false,
  chatId: '',
  chats: [],
  messages: [],
  isChatActive: false,
  setLastMessage: () => null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    userChatContent(state, { payload }: PayloadAction<IUser>) {
      state._id = payload._id
      state.username = payload.username
      state.name = payload.name
      state.path = payload.path
      state.isOnline = payload.isOnline
      state.isTyping = payload.isTyping
      state.isSecured = payload.isSecured
      state.chats = payload.chats
      state.chatId = payload.chatId
    },
    userMessages(state, { payload }: PayloadAction<IMessage[]>) {
      state.messages = payload
    },
    userChatActive(state, { payload }: PayloadAction<boolean>) {
      state.isChatActive = payload
    },
    userOnline(state, { payload }: PayloadAction<boolean>) {
      state.isOnline = payload
    },
    userTyping(state, { payload }: PayloadAction<boolean>) {
      state.isTyping = payload
    },
    userSetLastMessage(state, { payload }: PayloadAction<ISetLastMessage>) {
      state.setLastMessage = payload.setLastMessage
    }
  }
})

export default chatSlice.reducer