import { IChat } from "./IChat";
import { IMessage } from "./IMessage";

export interface IUser {
  _id: string;
  username: string;
  name: string;
  password: string;
  path: string;
  isOnline: boolean;
  isTyping: boolean;
  isSecured?: boolean;
  chatId?: string;
  messages?: IMessage[];
  chats: IChat[];
}