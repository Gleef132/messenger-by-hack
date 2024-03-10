import { ChatMessageTypes, IMessage } from "@/models/IMessage";
import { ISocketMessage } from "@/models/ISocket";
import { addZero } from "./add-zero";

interface IParams {
  clientId: string;
  clientIsOnline: boolean;
  event: 'message' | 'read';
  from: string;
  messageValue: string;
  type: ChatMessageTypes;
}


export const createMessages = ({ clientId, clientIsOnline, event, from, messageValue, type }: IParams): { message: ISocketMessage, newMessage: IMessage } => {
  const date = new Date()
  const fullDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
  const time = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
  const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`

  const message: ISocketMessage = {
    clientId,
    clientIsOnline,
    date: {
      fullDate,
      time,
    },
    event,
    from,
    isRead: false,
    isSend: true,
    message: messageValue,
    token,
    type,
  }
  const newMessage: IMessage = {
    _id: '' + clientId + Date.now() + '' + Math.random(),
    message: messageValue,
    date: {
      fullDate,
      time,
    },
    from,
    isRead: false,
    isSend: true,
    type,
  }
  return { message, newMessage }
}