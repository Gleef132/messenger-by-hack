'use client'

import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import Loader from '@/components/ui/loader/loader'
import { useAppSelector } from '@/hooks/redux'
import { IResponse } from '@/models/IResponse'
import { getCookie } from '@/utils/getCookie'
import cl from './auth.module.scss'
import { useRedirect } from '@/hooks/useRedirect'
import { ILanguageData } from '@/models/ILanguage'
import { useTheme } from '@/hooks/useTheme'
import { createAvatarGradient } from '@/utils/createAvatarGradient'
interface IAuth {
  language: ILanguageData;
}

const Auth: FC<IAuth> = ({ language }) => {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [validateText, setValidateText] = useState<string>('')
  const [isLoding, setIsLoading] = useState<boolean>(false)

  const { languageData } = useAppSelector(state => state.languageSlice)
  // const { auth: authLanguageData } = languageData

  const router = useRouter()

  const loginHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!username) return setValidateText(`${languageData?.auth.login.errorEmpty}`)
    if (!password) return setValidateText(`${languageData?.auth.password.errorEmpty}`)
    setIsLoading(true)
    const data = new FormData()
    data.append('username', username)
    data.append('password', password)
    axios.post<IResponse>(`${process.env.NEXT_PUBLIC_SERVER_API}api/login`, {
      username,
      password
    })
      .then(res => {
        router.push('/')
        document.cookie = `token=${res.data.token}`
        localStorage.setItem('token', JSON.stringify(res.data.token))
        localStorage.setItem('path', JSON.stringify(res.data.user?.path))
        localStorage.setItem('username', JSON.stringify(res.data.user?.username))
      })
      .catch(e => setValidateText(e.response.data.message))
      .finally(() => setIsLoading(false))
  }

  const registerHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!username) return setValidateText(`${languageData?.auth.login.errorEmpty}`)
    if (!password) return setValidateText(`${languageData?.auth.password.errorEmpty}`)
    setIsLoading(true)
    const { colorTop, colorBottom } = createAvatarGradient()
    axios.post<IResponse>(`${process.env.NEXT_PUBLIC_SERVER_API}api/registration`, {
      username,
      password,
      path: `${colorTop} ${colorBottom}`
    })
      .then(res => {
        router.push('/')
        document.cookie = `token=${res.data.token}`
        localStorage.setItem('token', JSON.stringify(res.data.token))
        localStorage.setItem('path', JSON.stringify(res.data.user?.path))
        localStorage.setItem('username', JSON.stringify(res.data.user?.username))
      })
      .catch(e => setValidateText(e.response.data.message))
      .finally(() => setIsLoading(false))
  }

  useRedirect()
  useTheme()
  useEffect(() => {
    const hasLanguageCookie = getCookie('language')
    if (!hasLanguageCookie) {
      document.cookie = `language=en`
    }
  }, [])


  return (
    <section className={cl.auth}>
      <form className={cl.auth__form}>
        <div className={cl.auth__text}>{validateText}</div>
        <label className={cl.auth__form__item}>
          <h1 className={cl.auth__form__title}>
            {languageData ? languageData.auth.login.text : language.auth.login.text}
          </h1>
          <input type="text" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className={cl.auth__form__item}>
          <h1 className={cl.auth__form__title}>
            {languageData ? languageData.auth.password.text : language.auth.password.text}
          </h1>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div className={cl.auth__form__btns}>
          <button className={cl.auth__form__btn} onClick={loginHandle}>{languageData ? languageData.auth.loginButton : language.auth.loginButton}</button>
          <button className={cl.auth__form__btn} onClick={registerHandle}>{languageData ? languageData.auth.registrButton : language.auth.registrButton}</button>
        </div>
        <div className={isLoding ? `${cl.auth__loader} ${cl.active}` : cl.auth__loader}>
          {isLoding && <Loader />}
        </div>
      </form>
    </section>
  )
}

export default Auth