'use client'

import { FC } from 'react'
import cl from './avatar.module.scss'
import { useAppSelector } from '@/hooks/redux'
import { getInitials } from '@/utils/getInitials';

interface IAvatarProps {
  pathProps?: string;
  nameProps?: string;
  isUserNameAvatar?: boolean;
  styles: string;
}

const Avatar: FC<IAvatarProps> = ({ styles, pathProps, nameProps, isUserNameAvatar }) => {

  const { name, path } = useAppSelector(state => state.userSlice)

  const isImage = isUserNameAvatar ? pathProps?.includes('http') : pathProps ? pathProps.includes('http') : path.includes('http')
  const gradient = isUserNameAvatar ? pathProps?.split(' ').join(',') : pathProps ? pathProps.split(' ').join(',') : path.split(' ').join(',')

  const currentPath = isUserNameAvatar ? pathProps : pathProps ? pathProps : path
  const currentName = isUserNameAvatar ? nameProps : nameProps ? nameProps : name
  const avatarText = isUserNameAvatar ? getInitials(currentName as string) : nameProps ? getInitials(nameProps) : getInitials(name)

  return (
    isImage === true ?
      <img src={currentPath} alt="avatar" /> :
      <div className={`${cl.gradient} ${styles}`} style={{ background: `linear-gradient(${gradient})` }}>{avatarText}</div>
  )
}

export default Avatar