'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { userSlice } from '@/store/reducers/UserSlice'
import { FC, useEffect, useRef } from 'react'
import Avatar from '../ui/avatar/avatar'
import cl from './userInfo.module.scss'

const UserInfo: FC = () => {

  const { isUserInfoActive } = useAppSelector(state => state.userSlice)
  const { name, path, isOnline } = useAppSelector(state => state.chatSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const { changeUserInfoActive } = userSlice.actions
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return;
    if (isUserInfoActive) {
      ref.current.style.marginRight = '0';
    } else {
      ref.current.style.marginRight = `-25vw`
    }
  }, [isUserInfoActive])

  return (
    <div ref={ref} className={cl.user__info}>
      <div className={cl.user__info__header}>
        <div className={cl.user__info__icon} onClick={() => dispatch(changeUserInfoActive(false))}>
          <div></div>
        </div>
        <h1>User Info</h1>
      </div>
      <div className={cl.user__info__content}>
        <div className={cl.user__info__avatar}>
          <Avatar styles={cl.user__info__avatar__gradient} pathProps={path} nameProps={name} isUserNameAvatar={true} />
          <div className={cl.user__info__avatar__text}>
            <h3>{name}</h3>
            <p className='text'>{isOnline ? 'online' : 'last seen recently'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo