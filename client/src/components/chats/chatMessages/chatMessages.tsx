'use client'
import { FC, useEffect, useRef } from 'react'
import cl from './chatMessages.module.scss'
import { IMessage } from '@/models/IMessage';
import ChatMessage from '../chatMessage/chatMessage';

interface IChatMessagesProps {
  messages: IMessage[];
  footerHeight: number;
  // footerTextArea: React.RefObject<HTMLTextAreaElement>;
  scrollHandle: (condition: boolean) => void;
}


const ChatMessages: FC<IChatMessagesProps> = ({ messages, footerHeight, scrollHandle }) => {

  const ref = useRef<HTMLDivElement | null>(null)
  const username = JSON.parse(localStorage.getItem('username') as string)

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight
    ref.current.style.opacity = '1'
    setTimeout(() => {
      if (!ref.current) return;
      ref.current.scrollTop = ref.current.scrollHeight
      ref.current.style.opacity = '1'
    }, 1);
    const handleScroll = () => {
      const messagesHeight = ref.current?.clientHeight || 0
      const scrollHeight = ref.current?.scrollHeight || 0
      const scrollPosition = ref.current?.scrollTop
      const condition = scrollPosition === scrollHeight - messagesHeight
      scrollHandle(condition)
    }

    ref.current.addEventListener('scroll', handleScroll)
    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener('scroll', handleScroll);
    };
  }, [messages, footerHeight])

  return (
    <div className={cl.messages} ref={ref}>
      <div className={cl.messages__container}>
        {messages?.map((item, i) =>
          <ChatMessage
            key={item._id}
            type={item.type}
            message={item.message}
            time={item.date.time}
            isMyMessage={item.from === username}
            isRead={item.isRead}
            vectorCondition={messages[i + 1]?.from !== item.from && !!item.message}
            files={item.files}
          />
        )}
      </div>
    </div>
  )
}

export default ChatMessages