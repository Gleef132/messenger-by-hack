"use client"

import { FC, memo, useEffect, useRef, useState } from 'react'
import { useSocket } from '@/api/use-socket'
import { CheckReadSvg, CheckSendSvg, SecuredSvg } from '@/components/svgs'
import Avatar from '@/components/ui/avatar/avatar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { IMessage } from '@/models/IMessage'
import { ISocketResponse } from '@/models/ISocket'
import { IUser } from '@/models/IUser'
import { chatSlice } from '@/store/reducers/ChatSlice'
import { numberUnreadMessages } from '@/utils/number-unread-messages'
import cl from './chatLink.module.scss'

interface IChatLinkProps {
  user: IUser;
  variant: 'default' | 'primary' | 'secondary';
  username: string;
  chatActive?: React.RefObject<string>;
  changeChatActive?: (id: string) => void;
}

const ChatLink: FC<IChatLinkProps> = ({ user, variant, username, chatActive, changeChatActive }) => {
  let isSecured = false;
  const messages = user.messages || []
  const [userState, setUserState] = useState<IUser>(user)
  const [amountUnreadMessages, setAmountUnreadMessasges] = useState<number>(numberUnreadMessages(messages, username))
  const [messagesState, setMessagesState] = useState<IMessage[]>(messages)
  const [lastMessage, setLastMessage] = useState<IMessage>(messages[messages.length - 1] || {})
  const [isRead, setIsRead] = useState<boolean>(lastMessage?.isRead)
  const { userChatContent, userMessages, userChatActive, userSetLastMessage } = chatSlice.actions
  const { _id } = useAppSelector(state => state.chatSlice)
  const dispatch = useAppDispatch()
  useSocket({
    messageEvent: (message) => acceptMessage(message),
    onlineEvent: (message) => acceptOnline(message.clientId, message.isOnline),
    readEvent: (message) => acceptRead(message.clientId),
    typingEvent: (message) => acceptTyping(message.clientId, message.isTyping)
  })

  const { username: chatUserName } = useAppSelector(state => state.chatSlice)
  const chatUserNameRef = useRef<string>(chatUserName)
  let imageText = ''
  let fileText = ''
  let lastMessageText = lastMessage.message
  if (lastMessage.files && !lastMessageText) {
    imageText = lastMessage.files.length > 1 ? `${lastMessage.files.length} Photos` : 'Photo'
    fileText = lastMessage.files.length > 1 ? `${lastMessage.files.length} Files` : 'File'
    lastMessageText = lastMessage.type === 'file' ? fileText : imageText
  }


  const clickHandle = () => {
    if (changeChatActive) {
      changeChatActive(userState._id)
    }
    dispatch(userChatContent(userState))
    dispatch(userMessages(messagesState))
    dispatch(userChatActive(true))
    dispatch(userSetLastMessage({ setLastMessage }))
    if (lastMessage?.from !== username) {
      setIsRead(true)
    }
  }

  const acceptMessage = ({ clientId, date, from, isSend, isRead, message, type }: ISocketResponse) => {
    if (userState._id !== clientId) return;
    const newMessage: IMessage = {
      _id: '' + clientId + Date.now() + date + Math.random(),
      date,
      from,
      isRead,
      isSend,
      message,
      type
    }
    setMessagesState(prev => [...prev, newMessage])
    setLastMessage({ ...newMessage })
    setAmountUnreadMessasges(prev => prev + 1)

    if (userState.username === chatUserNameRef.current) {
      setIsRead(true)
    } else {
      setIsRead(false)
    }
  }

  const acceptOnline = (clientId: string, isOnline: boolean) => {
    if (userState._id === clientId) {
      setUserState(prev => ({ ...prev, isOnline }))
    }
  }

  const acceptRead = (clientId: string) => {
    if (userState._id === clientId) {
      setIsRead(true)
    }
  }

  const acceptTyping = (clientId: string, isTyping: boolean) => {
    if (userState._id === clientId) {
      setUserState(prev => ({ ...prev, isTyping }))
    }
  }

  useEffect(() => {
    if (messages.length) {
      setMessagesState(messages)
    }
  }, [messages])

  useEffect(() => {
    chatUserNameRef.current = chatUserName
  }, [chatUserName])

  const borderRadiusStyles = variant === 'primary' ? cl.border__radius : ''
  const isActive = chatActive?.current === userState._id || userState._id === _id

  return (
    variant !== 'secondary' ? <div className={isActive ? `${cl.user} ${cl.active} ${borderRadiusStyles}` : `${cl.user} ${borderRadiusStyles}`} onClick={clickHandle}>
      <div className={cl.user__content}>
        <div className={cl.user__item}>
          <div className={cl.user__avatar}>
            <Avatar pathProps={user.path} nameProps={user.name} styles={cl.user__avatar__gradient} />
            {userState?.isOnline && variant === 'default' && <div className={cl.user__avatar__online}></div>}
          </div>
        </div>
        <div className={cl.user__item}>
          <div className={cl.user__name}>{isSecured && <SecuredSvg />} {userState?.name}</div>
          {variant === 'default' && <div className={cl.user__date}>{lastMessage?.date?.time}</div>}
        </div>
        <div className={cl.user__item}>
          {variant === 'primary' && <p className='text'>
            {user.isOnline ? 'online' : 'last seen recently'}
          </p>}
          {variant === 'default' &&
            (userState?.isTyping ?
              <div className={cl.user__typing}>... is typing
              </div> :
              <p className='text'>
                {lastMessage.type === 'audio' ? 'Voice message' : lastMessageText}
              </p>)
          }
          {variant === 'default' && <div className={cl.user__info}>
            {lastMessage?.from !== username ?
              !isRead && <span>{amountUnreadMessages > 99 ? 99 : amountUnreadMessages}</span>
              :
              isRead ?
                <CheckReadSvg /> :
                <CheckSendSvg />
            }
          </div>}
        </div>
      </div>
    </div> :
      <div className={cl.user__secondary} onClick={clickHandle} >
        <div className={cl.user__secondary__content}>
          <Avatar pathProps={user.path} nameProps={user.name} styles={cl.user__avatar__gradient} />
          <p>{user.name.split(' ')[0]}</p>
        </div>
      </div>
  )
}

export default memo(ChatLink)