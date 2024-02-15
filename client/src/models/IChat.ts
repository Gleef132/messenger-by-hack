import { IMessage } from "./IMessage";

export interface IChat {
  _id: string;
  isSecured: boolean;
  messages: IMessage[];
}