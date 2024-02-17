'use client'

import { FC } from 'react'
import cl from './avatar.module.scss'
import { useAppSelector } from '@/hooks/redux'
import { getInitials } from '@/utils/getInitials';

interface IAvatarProps {
  pathProps?: string;
  nameProps?: string;
  styles: string;
}

const Avatar: FC<IAvatarProps> = ({ styles, pathProps, nameProps }) => {

  const { name, path } = useAppSelector(state => state.userSlice)

  const isImage = pathProps ? pathProps.includes('http') : path.includes('http')
  const gradient = pathProps ? pathProps.split(' ').join(',') : path.split(' ').join(',')
  const avatarText = nameProps ? getInitials(nameProps) : getInitials(name)

  return (
    isImage === true ?
      <img src={path} alt="avatar" /> :
      <div className={`${cl.gradient} ${styles}`} style={{ background: `linear-gradient(${gradient})` }}>{avatarText}</div>
  )
}

export default Avatar