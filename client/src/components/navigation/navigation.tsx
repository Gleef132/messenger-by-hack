'use client'

import { useAppDispatch } from '@/hooks/redux'
import { settingSlice } from '@/store/reducers/SettingSlice'
import { FC } from 'react'
import { CalendarSvg, CameraSvg, LanguageSvg, MessageSvg, MusicSvg } from '../svgs'
import cl from './navigation.module.scss'

const Navigation: FC = () => {

  const { changeSettingActive } = settingSlice.actions
  const dispatch = useAppDispatch()

  return (
    <nav className={cl.nav}>
      <ul className={cl.nav__list}>
        <li className={`${cl.nav__link}`} onClick={() => dispatch(changeSettingActive(true))}>
          <LanguageSvg />
        </li>
        <li className={`${cl.nav__link} ${cl.active}`}>
          <MessageSvg />
        </li>
        <li className={`${cl.nav__link}`}>
          <CameraSvg />
        </li>
        <li className={`${cl.nav__link}`}>
          <MusicSvg />
        </li>
        <li className={`${cl.nav__link}`}>
          <CalendarSvg />
        </li>
      </ul>
    </nav>
  )
}

export default Navigation