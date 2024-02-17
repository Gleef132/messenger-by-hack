'use client'

import { FC, useEffect, useRef } from 'react'
import Search from '../../search/search'
import ChatList from '@/components/chats/chatsList/chatList'
import ChatContent from '@/components/chats/chatContent/chatContent'
import cl from './home.module.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { socketSlice } from '@/store/reducers/SocketSlice'
import { ISocketConnection, ISocketOnline } from '@/models/ISocket'
import { waitForConnection } from '@/utils/waitForConnection'
import SearchList from '@/components/search/searchList/searchList'
import Aside from '@/components/aside/aside'
import { settingSlice } from '@/store/reducers/SettingSlice'
// import Settings from '@/components/settings/settings'
import UserInfo from '@/components/userInfo/userInfo'
import { useRedirect } from '@/hooks/useRedirect'
import { languageSlice } from '@/store/reducers/LanguageSlice'
import { ILanguageData } from '@/models/ILanguage'
import dynamic from 'next/dynamic'
import { useTheme } from '@/hooks/useTheme'
import { IUser } from '@/models/IUser'
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
  const { isUserInfoActive } = useAppSelector(state => state.userSlice)
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
  useTheme()

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
                  <ChatList chatUsers={chatUsers} />
                  <SearchList />
                </div>
              </div>
            </div>
            <Settings isActive={isSettingActive} closeSettings={() => dispatch(changeSettingActive(false))} />
          </div>
          <div className={cl.home__item}>
            {isChatActive && <ChatContent />}
          </div>
          <UserInfo />
        </div>
      </section>
    </>
  )
}

export default HomePage










