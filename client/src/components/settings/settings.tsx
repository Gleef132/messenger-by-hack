'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { ThemeType } from '@/models/ThemeType';
import { languageSlice } from '@/store/reducers/LanguageSlice';
import { themeSlice } from '@/store/reducers/ThemeSlice';
import { getCookie } from '@/utils/getCookie';
import { getLanguage } from '@/utils/getLanguage';
import { setCookie } from '@/utils/setCookie';
import { FC, useState } from 'react';
import { ArrowSvg, LanguageSettingSvg, PencilSvg, ThemeSvg } from '../svgs';
import Avatar from '../ui/avatar/avatar';
import ChangeProfile from './changeProfile/changeProfile';
import cl from './settings.module.scss';

interface ISettingsProps {
  closeSettings: () => void;
  isActive: boolean;
}

const Settings: FC<ISettingsProps> = ({ closeSettings, isActive }) => {

  const { name } = useAppSelector(state => state.userSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const [languageActive, setLanguageActive] = useState<string>(() => getCookie('language') || 'en')
  const [isProfileActive, setIsProfileActive] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { changeLanguage } = languageSlice.actions
  const { theme } = useAppSelector(state => state.themeSlice)
  const { changeTheme } = themeSlice.actions

  const changeLanguageHandle = (language: string) => {
    setLanguageActive(language)
    setCookie('language', language)
    dispatch(changeLanguage(getLanguage()))
  }

  const changeThemeHandle = (theme: ThemeType) => {
    dispatch(changeTheme(theme))
  }

  const settingsStyles = isActive ? `${cl.settings} ${cl.active}` : cl.settings
  const settingsHiddeStyles = isProfileActive ? `${cl.hidden}` : ''


  return (
    <>
      <div className={`${settingsStyles} ${settingsHiddeStyles}`}>
        <div className={cl.settings__header}>
          <div className={cl.settings__icon} onClick={closeSettings}>
            <ArrowSvg />
          </div>
          <h1>{languageData?.setting.text}</h1>
          <div className={cl.settings__icon} onClick={() => setIsProfileActive(true)}>
            <PencilSvg />
          </div>
        </div>
        <div className={cl.settings__content}>
          <div className={cl.settings__avatar}>
            <Avatar styles={cl.settings__avatar__gradient} />
            <div className={cl.settings__avatar__text}>
              <h3>{name}</h3>
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
                <div className={theme === 'light' ? cl.active : ''} />
                {languageData?.theme.light}
              </div>
              <div className={cl.settings__footer__item__radio} onClick={() => changeThemeHandle('dark')}>
                <div className={theme === 'dark' ? cl.active : ''} />
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
      <div className={isProfileActive ? `${cl.change__user} ${cl.active}` : cl.change__user}>
        <div className={cl.settings__header}>
          <div className={cl.settings__icon} onClick={() => setIsProfileActive(false)}>
            <ArrowSvg />
          </div>
          <h1>{languageData?.setting.text}</h1>
        </div>
        <ChangeProfile />
      </div>
    </>
  )
}

export default Settings