export type ChatMessageTypes = 'text' | 'audio' | 'file' | 'image'
export type IFile = {
  _id: string;
  name: string;
  size: string;
}

export interface IMessage {
  _id: string;
  message: string;
  isRead: boolean;
  isSend: boolean;
  date: {
    fullDate: string;
    time: string;
  };
  from: string;
  type: ChatMessageTypes;
  files?: IFile[];
}

export interface IChatMessageProps {
  isMyMessage: boolean;
  message: string;
  time: string;
  vectorCondition: boolean;
  isRead?: boolean;
  type: ChatMessageTypes;
  files?: IFile[];
}