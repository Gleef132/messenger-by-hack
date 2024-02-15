import { ChatMessageTypes, IFile } from "./IMessage";

type eventsTypes = 'message' | 'read' | 'connection' | 'online' | 'typing' | 'offer' | 'answer' | 'leave' | 'candidate';

export interface ISocketResponse {
  event: eventsTypes;
  clientId: string;
  clientIsOnline: boolean;
  message: string;
  date: {
    fullDate: string;
    time: string;
  }
  from: string;
  isTyping: boolean;
  isOnline: boolean;
  isRead: boolean;
  isSend: boolean;
  type: ChatMessageTypes;
  files?: IFile[];
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  user?: {
    _id: string;
    path: string;
    name: string;
  }
}

export interface ISocketMessage {
  event: 'message' | 'read';
  token: string;
  clientId: string;
  clientIsOnline: boolean;
  message: string;
  date: {
    fullDate: string;
    time: string;
  }
  from: string;
  isRead: boolean;
  isSend: boolean;
  type: ChatMessageTypes;
  files?: IFile[];
}

export interface ISocketRead {
  event: 'read';
  token: string;
  chatId: string;
  clientId: string;
  clientIsOnline: boolean;
}

export interface ISocketConnection {
  event: 'connection';
  token: string;
}

export interface ISocketOnline {
  event: 'online';
  isOnline: boolean;
  chatUsersIds: string[];
  token: string;
}

export interface ISocketTyping {
  event: 'typing';
  isTyping: boolean;
  clientId: string;
  token: string;
}

export interface ISocketOffer {
  event: 'offer';
  clientId: string;
  offer: RTCSessionDescriptionInit;
  user: {
    _id: string;
    path: string;
    name: string;
  }
  token: string;
}

export interface ISocketAnswer {
  event: 'answer';
  clientId: string;
  answer: RTCSessionDescriptionInit;
  token: string;
}

export interface ISocketCandidate {
  event: 'candidate';
  clientId: string;
  candidate: RTCIceCandidateInit;
  token: string;
}

export interface ISocketLeave {
  event: 'leave';
  clientId: string;
  token: string;
}
