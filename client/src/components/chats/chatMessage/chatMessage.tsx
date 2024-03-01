import { FC, ReactNode } from 'react'
import TextMessage from './modules/textMessage/textMessage';
import AudioMessage from './modules/audioMessage/audioMessage';
import FileMessage from './modules/fileMessage/fileMessage';
import ImageMessage from './modules/imageMessage/imageMessage';
import { IChatMessageProps } from '@/models/IMessage';

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