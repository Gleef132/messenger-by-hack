'use client'

import Aside from '@/components/aside/aside'
import ChatContent from '@/components/chats/chatContent/chatContent'
import ChatList from '@/components/chats/chatsList/chatList'
import SearchList from '@/components/search/searchList/searchList'
import UserInfo from '@/components/userInfo/userInfo'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useRedirect } from '@/hooks/useRedirect'
import { ILanguageData } from '@/models/ILanguage'
import { ISocketConnection } from '@/models/ISocket'
import { IUser } from '@/models/IUser'
import { languageSlice } from '@/store/reducers/LanguageSlice'
import { settingSlice } from '@/store/reducers/SettingSlice'
import { socketSlice } from '@/store/reducers/SocketSlice'
import { waitForConnection } from '@/utils/waitForConnection'

import dynamic from 'next/dynamic'
import { FC, useEffect, useRef } from 'react'
import Search from '../../search/search'

import cl from './home.module.scss'

interface IHomePage {
  language: ILanguageData;
  user: IUser;
  chatUsers: IUser[];
}

const Settings = dynamic(() => import('@/components/settings/settings'), { ssr: false })

const HomePage: FC<IHomePage> = ({ language, user, chatUsers }) => {

  const socket = useRef<WebSocket | null>(null)
  const dispatch = useAppDispatch()
  const { setSocket } = socketSlice.actions
  const { changeSettingActive } = settingSlice.actions
  const { changeLanguage } = languageSlice.actions
  const { isChatActive } = useAppSelector(state => state.chatSlice)
  const { isSettingActive } = useAppSelector(state => state.settingSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)

  useEffect(() => {
    dispatch(changeLanguage(language))

    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_API}`)
    dispatch(setSocket({ socket: socket.current, isConnected: false }))

    waitForConnection(socket.current, () => {
      dispatch(setSocket({ socket: socket.current, isConnected: true }))
      const message: ISocketConnection = {
        event: 'connection',
        token: `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`
      }
      socket.current?.send(JSON.stringify(message))
    }, 100)
  }, [])

  useRedirect()

  return (
    <>
      <section className={isSettingActive ? `${cl.home} ${cl.active}` : cl.home}>
        <div className={cl.home__bg}></div>
        <div className={cl.home__content}>
          <div className={isSettingActive ? `${cl.home__setting__wrapper} ${cl.active}` : cl.home__setting__wrapper}>
            <div className={cl.home__setting__content}>
              <Aside user={user} />
              <div className={cl.home__item}>
                <h1 className={`${cl.home__title} title`}>{languageData ? languageData.title : language.title}</h1>
                <Search {...language} />
                <div className={cl.home__item__content}>
                  <ChatList chatUsers={chatUsers} username={user.username} />
                  <SearchList username={user.username} />
                </div>
              </div>
            </div>
            <Settings isActive={isSettingActive} closeSettings={() => dispatch(changeSettingActive(false))} />
          </div>
          <div className={cl.home__item}>
            {isChatActive ? <ChatContent /> :
              <div className={cl.home__item__hello}>
                <img src="/robot.gif" alt="Hello Gif" />
                Welcome {user.name}
              </div>
            }
          </div>
          <UserInfo />
        </div>
      </section>
    </>
  )
}

export default HomePage










