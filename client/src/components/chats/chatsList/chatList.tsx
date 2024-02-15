'use client'
import { FC, useEffect, useState } from 'react'
import ChatLink from '../chatLink/chatLink'
import axios from 'axios'
import { IUser } from '@/models/IUser'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { waitForConnection } from '@/utils/waitForConnection'
import { ISocketOnline } from '@/models/ISocket'
import cl from './chatList.module.scss'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { useSocket } from '@/api/use-socket'

interface IChatListProps {
  chatUsers: IUser[];
}

const ChatList: FC<IChatListProps> = ({ chatUsers }) => {

  const [acitve, setActive] = useState<string>('')
  const [users, setUsers] = useState<IUser[]>(chatUsers)
  // const { socket } = useAppSelector(state => state.socketSlice)
  const { isOnline } = useAppSelector(state => state.chatSlice)
  const { isSearchFocus } = useAppSelector(state => state.searchSlice)
  const { chathUsers } = searchSlice.actions
  const dispatch = useAppDispatch()
  const { socket, sendMessage } = useSocket()

  // const getUsers = async () => {
  //   const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
  //   const options = {
  //     headers: { authorization: token }
  //   }
  //   const response = await axios.get<IUser[]>('http://localhost:5000/api/chat-users', options)
  //   setUsers(response.data)
  //   dispatch(chathUsers(response.data))
  // }

  useEffect(() => {
    // getUsers()
    dispatch(chathUsers(chatUsers))
  }, [])

  useEffect(() => {
    if (socket === null) return;
    if (!users.length) return;
    if (isOnline) return;
    const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`
    const message: ISocketOnline = {
      event: 'online',
      isOnline: true,
      chatUsersIds: users.map(user => user._id),
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

  const changeActiveUser = (value: string) => {
    setActive(value)
  }

  return (
    <div className={!isSearchFocus ? `${cl.list} ${cl.active}` : cl.list}>
      {users.length > 0 && users?.map(item => <ChatLink key={item?._id} user={item} variant='default' active={acitve} changeActiveUser={changeActiveUser} />)}
    </div>
  )
}

export default ChatList