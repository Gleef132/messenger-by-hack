import { IMessage } from "@/models/IMessage";
import { IUser } from "@/models/IUser";


interface IChatUser {
  _id: string;
  isSecured: boolean;
  messages: IMessage[];
}

export const getMessages = (user: IUser, id: string): IChatUser => {
  let result: IChatUser = {
    _id: '',
    isSecured: false,
    messages: []
  };
  user.chats.forEach(chat => {
    if (chat._id === id) {
      result = chat
    }
  })
  return result
}