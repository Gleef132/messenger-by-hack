"use client"
import { FC, useEffect, useRef, useState } from 'react'
import cl from './chatLink.module.scss'
import { CheckReadSvg, CheckSendSvg, SecuredSvg } from '@/components/svgs'
import { chatSlice } from '@/store/reducers/ChatSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { numberUnreadMessages } from '@/utils/number-unread-messages'
import { IUser } from '@/models/IUser'
import { getMessages } from '@/utils/getMessages'
import { ISocketMessage, ISocketResponse } from '@/models/ISocket'
import { IMessage } from '@/models/IMessage'

interface IChatLinkProps {
  user: IUser;
  active: string;
  changeActiveUser: (value: string) => void;
  variant: 'default' | 'primary' | 'secondary';
}

const ChatLink: FC<IChatLinkProps> = ({ user, active, changeActiveUser, variant }) => {
  // const { name, path, isOnline, isTyping, _id } = user
  let isSecured = false;
  // const { isSecured, messages } = getMessages(user, id)
  const messages = user.messages || []
  const [userState, setUserState] = useState<IUser>(user)
  // const username = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('username') as string) : ''
  const [username, setUsername] = useState<string>('')
  const [amountUnreadMessages, setAmountUnreadMessasges] = useState<number>(numberUnreadMessages(messages, username))
  const [messagesState, setMessagesState] = useState<IMessage[]>(messages)
  const [lastMessage, setLastMessage] = useState<IMessage>(messages[messages.length - 1] || {})
  const [isRead, setIsRead] = useState<boolean>(lastMessage?.isRead)
  const { userChatContent, userMessages, userChatActive, userSetLastMessage } = chatSlice.actions
  const dispatch = useAppDispatch()
  const { socket } = useAppSelector(state => state.socketSlice)
  const { username: chatUserName } = useAppSelector(state => state.chatSlice)
  let imageText = ''
  let fileText = ''
  let lastMessageText = lastMessage.message
  if (lastMessage.files && !lastMessageText) {
    imageText = lastMessage.files.length > 1 ? `${lastMessage.files.length} Photos` : 'Photo'
    fileText = lastMessage.files.length > 1 ? `${lastMessage.files.length} Files` : 'File'
    lastMessageText = lastMessage.type === 'file' ? fileText : imageText
  }

  // let imageTitle = lastMessage.files.length > 1 ? `Send ${lastMessage.files.length} Photos` : 'Send Photo'
  // let fileTitle = lastMessage.files.length > 1 ? `Send ${lastMessage.files.length} Files` : 'Send File'

  const chatUserNameRef = useRef<string>(chatUserName)

  const clickHandle = () => {
    dispatch(userChatContent(userState))
    dispatch(userMessages(messagesState))
    dispatch(userChatActive(true))
    dispatch(userSetLastMessage({ setLastMessage }))
    changeActiveUser(userState._id)
    if (lastMessage?.from !== username) {
      setIsRead(true)
    }
  }

  const acceptMessage = ({ clientId, date, from, isSend, isRead, message, type }: ISocketResponse) => {
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
    // if (isChatActive) {
    //   setIsRead(true)
    // } else {
    //   setIsRead(false)
    // }

    if (userState.username === chatUserNameRef.current) {
      setIsRead(true)
    } else {
      setIsRead(false)
    }
  }

  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem('username') as string))
  }, [])

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener('message', (message) => {
      const parseMessage: ISocketResponse = JSON.parse(message.data)
      switch (parseMessage.event) {
        case 'message':
          acceptMessage(parseMessage)
          break
        case 'read':
          setIsRead(true)
          break
        case 'typing':
          setUserState(prev => ({ ...prev, isTyping: parseMessage.isTyping }))
          break
        case 'online':
          setUserState(prev => ({ ...prev, isOnline: parseMessage.isOnline }))
          break
        default:
          return null
      }
    })
  }, [socket])

  useEffect(() => {
    if (messages.length) {
      setMessagesState(messages)
    }
  }, [messages])

  useEffect(() => {
    chatUserNameRef.current = chatUserName
  }, [chatUserName])

  return (
    variant !== 'secondary' ? <div className={active === userState?._id ? `${cl.user} ${cl.active}` : cl.user} onClick={clickHandle}>
      <div className={cl.user__content}>
        <div className={cl.user__item}>
          <div className={cl.user__avatar}>
            <img src={userState?.path} alt="avatar" />
            {userState?.isOnline && variant === 'default' && <div></div>}
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
          <img src={user.path} alt="avatar" />
          <p>{user.name.split(' ')[0]}</p>
        </div>
      </div>
  )
}

export default ChatLink