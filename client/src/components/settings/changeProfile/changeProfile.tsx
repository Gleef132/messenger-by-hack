'use client'

import { FC, useState } from 'react'
import cl from './changeProfile.module.scss'
import Avatar from '@/components/ui/avatar/avatar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { ProfileCameraSvg } from '@/components/svgs'
import axios from 'axios'
import { userSlice } from '@/store/reducers/UserSlice'
import Loader from '@/components/ui/loader/loader'

interface IUserNames<T> {
  firstName: T;
  secondaryName: T;
}

type InputErrorType = 'firstName' | 'secondaryName'

const ChangeProfile: FC = () => {

  const { name, path } = useAppSelector(state => state.userSlice)
  const firstName = name ? name.split(' ')[0] : ''
  const secondaryName = name ? name.split(' ').length > 1 ? name.split(' ')[1] : '' : ''
  const [usernames, setUsernames] = useState<IUserNames<string>>({
    firstName,
    secondaryName: secondaryName ? secondaryName : ''
  })
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<IUserNames<boolean>>({
    firstName: false,
    secondaryName: false,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [avatarPath, setAvatarPath] = useState<string>(path)
  const [avatarName, setAvatarName] = useState<string>(name)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`
  const dispatch = useAppDispatch()
  const { changeUserData } = userSlice.actions

  const changeProfile = async (e: React.FormEvent<HTMLButtonElement>) => {
    // if (!file && usernames.firstName === firstName && usernames.secondaryName === secondaryName) return setError(undefined);
    // if (!usernames.firstName) return setError('firstName');
    // if (!usernames.secondaryName) return setError('secondaryName');
    // if (usernames.firstName.split(' ').length > 1) return setError('firstName');
    // if (usernames.secondaryName.split(' ').length > 1) return setError('secondaryName');
    // return console.log('clown')
    // setError(undefined)
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    const fullName = `${usernames.firstName} ${usernames.secondaryName}`
    formData.append('name', fullName)
    formData.append('token', token)
    if (file) {
      formData.append('file', file)
    }
    const resopnse = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}api/change-profile`, formData)
    localStorage.setItem('path', JSON.stringify(resopnse.data.path))
    localStorage.setItem('name', JSON.stringify(fullName))
    localStorage.setItem('username', JSON.stringify(resopnse.data.username))
    dispatch(changeUserData({
      name: fullName,
      path: resopnse.data.path,
      username: resopnse.data.username,
      user: resopnse.data,
    }))
    setAvatarName(fullName)
    setIsButtonDisabled(true)
    setFile(undefined)
    setIsLoading(false)
  }

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setAvatarPath(URL.createObjectURL(e.target.files[0]))
      setIsButtonDisabled(false)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, type: InputErrorType) => {
    const { value } = e.target
    setUsernames(prev => ({ ...prev, [type]: value }))
    switch (type) {
      case 'firstName':
        if (!file && value === firstName && usernames.secondaryName === secondaryName) {
          setError(({ firstName: false, secondaryName: false }))
          setIsButtonDisabled(true)
          console.log('1')
          return;
        };
        if (value.split(' ').length > 1 || !value) {
          setError(prev => ({ ...prev, firstName: true }))
          setIsButtonDisabled(true)
          console.log('2')
          return;
        };
        if (usernames.secondaryName.split(' ').length > 1 || !usernames.secondaryName) return setError(prev => ({ ...prev, firstName: false }));
        console.log('3')
        setError(prev => ({ ...prev, firstName: false }))
        break;
      case 'secondaryName':
        if (!file && value === secondaryName && usernames.firstName === firstName) {
          setError(({ firstName: false, secondaryName: false }))
          setIsButtonDisabled(true)
          return;
        }
        if (value.split(' ').length > 1 || !value) {
          setError(prev => ({ ...prev, secondaryName: true }))
          setIsButtonDisabled(true)
          return;
        }
        if (usernames.firstName.split(' ').length > 1 || !usernames.firstName) return setError(prev => ({ ...prev, secondaryName: false }));
        setError(prev => ({ ...prev, secondaryName: false }))
        break;
    }
    setIsButtonDisabled(false)
  }

  return (
    <form className={cl.profile}>
      {isLoading && <div className={cl.profile__loader}>
        <Loader />
      </div>}
      <label className={cl.profile__avatar} htmlFor="avatar">
        <Avatar styles={cl.profile__avatar__gradient} pathProps={avatarPath} nameProps={avatarName} />
        <div className={cl.profile__avatar__svg}>
          <ProfileCameraSvg />
        </div>
      </label>
      <div className={cl.profile__item}>
        <input
          name='firstName'
          type="text"
          value={usernames.firstName as string}
          placeholder='First name'
          className={error.firstName ? cl.error : ''}
          onChange={(e) => onChange(e, 'firstName')}
        />
        <input
          name='secondaryName'
          type="text"
          value={usernames.secondaryName as string}
          placeholder='Second name'
          className={error.secondaryName ? cl.error : ''}
          onChange={(e) => onChange(e, 'secondaryName')}
        />
        <p className={cl.profile__item__rule}>
          *first and last names should not contain more than one word!
        </p>
        <button className={cl.profile__btn} disabled={isButtonDisabled} onClick={changeProfile}>Save</button>
      </div>
      <input
        type="file"
        name="avatar"
        id="avatar"
        style={{ display: 'none' }}
        accept='image/*'
        onChange={changeFile} />
    </form>
  )
}

export default ChangeProfile