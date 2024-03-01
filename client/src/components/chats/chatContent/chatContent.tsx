'use client'
import { FC, useState, useEffect, useRef } from 'react'
import { useAppSelector } from '@/hooks/redux'
import ChatMessages from '../chatMessages/chatMessages'
import cl from './chatContent.module.scss'
import { IMessage } from '@/models/IMessage'
import ChatFooter from '../chatFooter/chatFooter'
import ChatHeader from '../chatHeader/chatHeader'

const ChatContent: FC = () => {
  const { messages } = useAppSelector(state => state.chatSlice)
  const [messagesState, setMessagesState] = useState<IMessage[]>(messages)
  const [textAreaHeight, setTextAreaHeight] = useState<number>(44)
  const footerLineRef = useRef<HTMLDivElement>(null)

  const scrollHandle = (condition: boolean) => {
    if (condition && footerLineRef.current) {
      footerLineRef.current.style.opacity = '0'
    } else if (footerLineRef.current) {
      footerLineRef.current.style.opacity = '1'
    }
  }

  useEffect(() => {
    setMessagesState(messages)
  }, [messages])

  return (
    <div className={cl.chat}>
      <div className={cl.chat__container}>
        <ChatHeader messagesState={messagesState} setMessagesState={setMessagesState} />
        <ChatMessages messages={messagesState} footerHeight={textAreaHeight} scrollHandle={scrollHandle} />
        <ChatFooter footerLineRef={footerLineRef} messagesState={messagesState} setMessagesState={setMessagesState} setTextAreaHeight={setTextAreaHeight} />
      </div>
    </div>
  )
}

export default ChatContent