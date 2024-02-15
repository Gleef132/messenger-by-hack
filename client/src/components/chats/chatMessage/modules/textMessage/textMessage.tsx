import { FC } from 'react'
import cl from './textMessage.module.scss'
import { IChatMessageProps } from '@/models/IMessage'
import MessagePrototype from '../messagePrototype/messagePrototype'

const TextMessage: FC<IChatMessageProps> = ({ ...props }) => {
  const { message } = { ...props }
  return <MessagePrototype {...props}>{message}</MessagePrototype>
}

export default TextMessage