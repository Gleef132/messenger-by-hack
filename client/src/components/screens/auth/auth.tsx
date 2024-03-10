'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/ui/loader/loader'
import { getChatUsers } from '@/app/actions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useRedirect } from '@/hooks/useRedirect'
import { ILanguageData } from '@/models/ILanguage'
import { IResponse } from '@/models/IResponse'
import { IUser } from '@/models/IUser'
import { chatUsersSlice } from '@/store/reducers/ChatUsersSlice'
import { userSlice } from '@/store/reducers/UserSlice'
import { createAvatarGradient } from '@/utils/createAvatarGradient'
import { getCookie } from '@/utils/getCookie'
import cl from './auth.module.scss'
interface IAuth {
  language: ILanguageData;
}

const Auth: FC<IAuth> = ({ language }) => {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [validateText, setValidateText] = useState<string>('')
  const [isLoding, setIsLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const { changeUserData } = userSlice.actions
  const { changeChatUsers } = chatUsersSlice.actions
  const { languageData } = useAppSelector(state => state.languageSlice)

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
        const { user } = res.data
        localStorage.setItem('token', JSON.stringify(res.data.token))
        localStorage.setItem('path', JSON.stringify(user?.path))
        localStorage.setItem('username', JSON.stringify(user?.username))
        localStorage.setItem('name', JSON.stringify(user?.name))
        dispatch(changeUserData({
          path: user?.path || '',
          username: user?.username || '',
          name: user?.name || '',
          user: user || {} as IUser,
        }))
        return res.data.token as string
      })
      .then(token => {
        getChatUsers(`Bearer ${token}`).then(res => dispatch(changeChatUsers({ users: res.length ? res : null })))
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
        const { user } = res.data
        localStorage.setItem('token', JSON.stringify(res.data.token))
        localStorage.setItem('path', JSON.stringify(user?.path))
        localStorage.setItem('username', JSON.stringify(user?.username))
        localStorage.setItem('name', JSON.stringify(user?.name))
        dispatch(changeUserData({
          path: user?.path || '',
          username: user?.username || '',
          name: user?.name || '',
          user: user || {} as IUser,
        }))
        return res.data.token as string
      })
      .then(token => {
        getChatUsers(`Bearer ${token}`).then(res => dispatch(changeChatUsers({ users: res.length ? res : null })))
      })
      .catch(e => setValidateText(e.response.data.message))
      .finally(() => setIsLoading(false))
  }

  useRedirect()

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