'use client'

import { IChatMessageProps } from '@/models/IMessage'
import { FC } from 'react'
import MessagePrototype from './messagePrototype/messagePrototype'

const TextMessage: FC<IChatMessageProps> = ({ ...props }) => {
  const { message } = { ...props }
  return <MessagePrototype {...props}>{message}</MessagePrototype>
}

export default TextMessage