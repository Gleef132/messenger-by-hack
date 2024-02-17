"use client"

import { FC, useState } from 'react'
import cl from './settings.module.scss'
import { ArrowSvg, LanguageSettingSvg, ThemeSvg } from '../svgs';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getCookie } from '@/utils/getCookie';
import { languageSlice } from '@/store/reducers/LanguageSlice';
import { getLanguage } from '@/utils/getLanguage';
import { ILanguageData } from '@/models/ILanguage';
import { useTheme } from '@/hooks/useTheme';
import Avatar from '../ui/avatar/avatar';

interface ISettingsProps {
  closeSettings: () => void;
  isActive: boolean;
}

const Settings: FC<ISettingsProps> = ({ closeSettings, isActive }) => {

  const { name, username, path } = useAppSelector(state => state.userSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const [languageActive, setLanguageActive] = useState<string>(() => getCookie('language') || 'en')
  const [themeActive, setThemeActive] = useState<string>(document.documentElement.getAttribute('data-theme') || '')
  const dispatch = useAppDispatch()
  const { changeLanguage } = languageSlice.actions
  const { setTheme } = useTheme()
  const isImage = path.includes('http')
  const gradient = path.split(' ').join(',')

  const changeLanguageHandle = (language: string) => {
    setLanguageActive(language)
    if (typeof window !== 'undefined') {
      document.cookie = `language=${language}`
    }
    dispatch(changeLanguage(getLanguage()))
  }

  const changeThemeHandle = (theme: 'light' | 'dark') => {
    setThemeActive(theme)
    setTheme(theme)
  }


  return (
    <div className={isActive ? `${cl.settings} ${cl.active}` : cl.settings}>
      <div className={cl.settings__header}>
        <div className={cl.settings__icon} onClick={closeSettings}>
          <ArrowSvg />
        </div>
        <h1>{languageData?.setting.text}</h1>
        <div className={cl.settings__icon}>
        </div>
      </div>
      <div className={cl.settings__content}>
        <div className={cl.settings__avatar}>
          <Avatar styles={cl.settings__avatar__gradient} />
          <div className={cl.settings__avatar__text}>
            <h3>{username}</h3>
            <p className='text'>{languageData?.userState.online}</p>
          </div>
        </div>
      </div>
      <div className={cl.settings__footer}>
        <div className={cl.settings__footer__item}>
          <div className={cl.settings__footer__item__text}>
            <div className={cl.settings__footer__svg}>
              <ThemeSvg />
            </div>
            {languageData?.theme.text}
          </div>
          <div className={cl.settings__footer__item__radios}>
            <div className={cl.settings__footer__item__radio} onClick={() => changeThemeHandle('light')}>
              <div className={themeActive === 'light' ? cl.active : ''} />
              {languageData?.theme.light}
            </div>
            <div className={cl.settings__footer__item__radio} onClick={() => changeThemeHandle('dark')}>
              <div className={themeActive === 'dark' ? cl.active : ''} />
              {languageData?.theme.dark}
            </div>
          </div>
        </div>
        <div className={cl.settings__footer__item}>
          <div className={cl.settings__footer__item__text}>
            <div className={cl.settings__footer__svg}>
              <LanguageSettingSvg />
            </div>
            {languageData?.language.text}
          </div>
          <div className={cl.settings__footer__item__radios}>
            <div className={cl.settings__footer__item__radio} onClick={() => changeLanguageHandle('en')}>
              <div className={languageActive === 'en' ? cl.active : ''} />
              {languageData?.language.english}
            </div>
            <div className={cl.settings__footer__item__radio} onClick={() => changeLanguageHandle('ru')}>
              <div className={languageActive === 'ru' ? cl.active : ''} />
              {languageData?.language.russian}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings