'use client'

import { useSocket } from '@/api/use-socket'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { ISocketOnline } from '@/models/ISocket'
import { IUser } from '@/models/IUser'
import { chatUsersSlice } from '@/store/reducers/ChatUsersSlice'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { FC, useEffect, useRef, useState } from 'react'
import ChatLink from '../chatLink/chatLink'
import cl from './chatList.module.scss'

interface IChatListProps {
  chatUsers: IUser[];
  username: string;
}

const ChatList: FC<IChatListProps> = ({ chatUsers, username }) => {

  const { isOnline } = useAppSelector(state => state.chatSlice)
  const { isSearchFocus } = useAppSelector(state => state.searchSlice)
  const { user } = useAppSelector(state => state.userSlice)
  const { users } = useAppSelector(state => state.chatUsersSlice)
  const { chathUsers } = searchSlice.actions
  const { changeChatUsers } = chatUsersSlice.actions
  const dispatch = useAppDispatch()
  const { socket, sendMessage } = useSocket()
  const [chatUsersCurrent, setChatUsersCurrent] = useState<IUser[]>(users === null ? [] : users.length ? users : chatUsers)
  const activeChatRef = useRef<string>('')

  useEffect(() => {
    dispatch(chathUsers(chatUsersCurrent))
    dispatch(changeChatUsers({ users: chatUsersCurrent }))
  }, [])

  useEffect(() => {
    setChatUsersCurrent(users?.length ? users : chatUsersCurrent)
    dispatch(chathUsers(users?.length ? users : chatUsersCurrent))
  }, [users])

  useEffect(() => {
    if (socket === null) return;
    if (!chatUsersCurrent.length) return;
    if (isOnline) return;
    const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`
    const message: ISocketOnline = {
      event: 'online',
      isOnline: true,
      chatUsersIds: chatUsersCurrent.map(user => user._id),
      token
    }
    if (socket.readyState === WebSocket.OPEN) {
      sendMessage(message);
    } else {
      socket.addEventListener('open', () => {
        sendMessage(message);
      });
    }
    const unloadHandler = () => {
      message.isOnline = false
      sendMessage(message)
    }
    socket.close = () => unloadHandler()
    window.addEventListener('unload', unloadHandler)
    return () => window.removeEventListener('unload', unloadHandler)
  }, [socket, users])

  const changeChatActive = (id: string) => {
    activeChatRef.current = id
  }

  return (
    <div className={!isSearchFocus ? `${cl.list} ${cl.active}` : cl.list}>
      {chatUsersCurrent.map(item => <ChatLink key={item?._id} user={item} variant='default' username={user.username ? user.username : username} chatActive={activeChatRef} changeChatActive={changeChatActive} />)}
    </div>
  )
}

export default ChatList