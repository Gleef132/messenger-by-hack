'use client'
'use client'
import { FC, useState, useEffect } from 'react'
import { ExitSvg, LogoSvg, SettingSvg } from '../svgs'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import Navigation from '../navigation/navigation'
import cl from './aside.module.scss'
import { IUser } from '@/models/IUser'
import Link from 'next/link'
import { settingSlice } from '@/store/reducers/SettingSlice'
import Avatar from '../ui/avatar/avatar'
import { chatSlice } from '@/store/reducers/ChatSlice'

interface IAsideProps {
  user: IUser;
}

const Aside: FC<IAsideProps> = ({ user }) => {

  const dispatch = useAppDispatch()
  const { changeSettingActive } = settingSlice.actions
  const { resetChat } = chatSlice.actions
  const { name, path } = useAppSelector(state => state.userSlice)
  const exitUser = () => {
    localStorage.clear()
    document.cookie = `token="";expires=Thu, 01 Jan 1970 00:00:01 GMT";`
    setTimeout(() => {
      dispatch(resetChat())
    }, 100);
  }

  return (
    <aside className={cl.sidebar}>
      <div className={cl.sidebar__content}>
        <div className={cl.sidebar__item}>
          <div className={cl.sidebar__logo}>
            <LogoSvg />
          </div>
          <div className={cl.sidebar__avatar}>
            <Avatar pathProps={path ? path : user.path} nameProps={name ? name : user.name} styles={cl.sidebar__avatar__gradient} />
          </div>
        </div>
        <Navigation />
        <div className={cl.sidebar__item}>
          <div className={cl.sidebar__setting} onClick={() => dispatch(changeSettingActive(true))}>
            <SettingSvg />
          </div>
          <Link href={'/auth'} className={cl.sidebar__setting} onClick={exitUser}>
            <ExitSvg />
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Aside