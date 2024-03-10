'use client'

import { IChatMessageProps } from '@/models/IMessage';
import { FC, ReactNode } from 'react';
import AudioMessage from './modules/audioMessage/audioMessage';
import FileMessage from './modules/fileMessage/fileMessage';
import ImageMessage from './modules/imageMessage/imageMessage';
import TextMessage from './modules/textMessage';

const ChatMessage: FC<IChatMessageProps> = ({ ...props }) => {
  const { type } = { ...props }
  const messageTypes: { [key: string]: ReactNode } = {
    text: <TextMessage {...props} />,
    audio: <AudioMessage {...props} />,
    file: <FileMessage {...props} />,
    image: <ImageMessage {...props} />
  }
  return messageTypes[type]
}

export default ChatMessage