'use client'

import VideoCall from '@/components/videoCall/videoCall';
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { IMessage } from "@/models/IMessage";
import { ISocketMessage, ISocketResponse } from "@/models/ISocket";
import { popupSlice } from "@/store/reducers/PopupSlice";
import { createElement, useEffect } from "react";

interface IUseSocket {
  messageEvent?: (message: ISocketResponse) => void;
  readEvent?: (message: ISocketResponse) => void;
  typingEvent?: (message: ISocketResponse) => void;
  onlineEvent?: (message: ISocketResponse) => void;
  offerEvent?: (message: ISocketResponse) => void;
  answerEvent?: (message: ISocketResponse) => void;
  candidateEvent?: (message: ISocketResponse) => void;
  leaveEvent?: () => void;
}

export const useSocket = ({ messageEvent, readEvent, onlineEvent, typingEvent, answerEvent, candidateEvent, leaveEvent, offerEvent }: IUseSocket = {}) => {
  const { isConnected, socket } = useAppSelector(state => state.socketSlice)
  const dispatch = useAppDispatch()
  const { showPopup } = popupSlice.actions

  useEffect(() => {
    if (socket === null) return;

    const messageHandler = (message: { data: string }) => {
      const parseMessage: ISocketResponse = JSON.parse(message.data)
      console.log(parseMessage.event)
      switch (parseMessage.event) {
        case 'message':
          if (!messageEvent) return;
          messageEvent(parseMessage)
          break
        case 'read':
          if (!readEvent) return;
          readEvent(parseMessage)
          break
        case 'typing':
          if (!typingEvent) return;
          typingEvent(parseMessage)
          break
        case 'online':
          if (!onlineEvent) return;
          onlineEvent(parseMessage)
          break
        case 'offer':
          const props = {
            name: parseMessage.user?.name ? parseMessage.user?.name : '',
            path: parseMessage.user?.path ? parseMessage.user?.path : '',
            _id: parseMessage.user?._id ? parseMessage.user?._id : '',
            offer: parseMessage.offer as RTCSessionDescription,
            clientId: parseMessage.clientId
          }
          dispatch(showPopup({
            children: createElement(VideoCall, props),
            isCloseShow: false
          }))
          if (!offerEvent) return;
          offerEvent(parseMessage)
          break
        case 'answer':
          if (!answerEvent) return;
          answerEvent(parseMessage)
          break
        case 'candidate':
          if (!candidateEvent) return;
          candidateEvent(parseMessage)
          break
        case 'leave':
          if (!leaveEvent) return;
          leaveEvent()
          break
        default:
          return null
      }
    }

    socket.addEventListener('message', messageHandler)

    return () => {
      socket.removeEventListener('message', messageHandler);
    };
  }, [socket])

  const sendMessage = <T>(message: T) => {
    if (!isConnected) return;
    socket?.send(JSON.stringify(message))
  }

  return { socket, sendMessage }
}