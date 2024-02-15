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

interface IAsideProps {
  user: IUser;
}

const Aside: FC<IAsideProps> = ({ user }) => {

  // const [avatar, setAvatar] = useState<string>(path)
  // const { path } = useAppSelector(state => state.userSlice)
  const { changeSettingActive } = settingSlice.actions
  const dispatch = useAppDispatch()
  const isImage = user.path.includes('http')
  const gradient = user.path.split(' ').join(',')
  // useEffect(() => {
  //   setAvatar(path)
  // }, [path])

  return (
    <aside className={cl.sidebar}>
      <div className={cl.sidebar__content}>
        <div className={cl.sidebar__item}>
          <div className={cl.sidebar__logo}>
            <LogoSvg />
          </div>
          <div className={cl.sidebar__avatar}>
            {isImage ?
              <img src={user.path} alt="Avatar" /> :
              <div className={cl.sidebar__avatar__gradient} style={{ background: `linear-gradient(${gradient})` }}>{user.name}</div>
            }
          </div>
        </div>
        <Navigation />
        <div className={cl.sidebar__item}>
          <div className={cl.sidebar__setting} onClick={() => dispatch(changeSettingActive(true))}>
            <SettingSvg />
          </div>
          <Link href={'/auth'} className={cl.sidebar__setting} onClick={() => document.cookie = `token="";expires=Thu, 01 Jan 1970 00:00:01 GMT";`}>
            <ExitSvg />
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Aside