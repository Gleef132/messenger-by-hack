'use client'
import { FC, useEffect, useRef, useState } from 'react'
import { ArrowSvg, SearchSvg } from '../svgs'
import { IUser } from '@/models/IUser'
import { useDebounce } from '@/hooks/useDebounce'
import Loader from '../ui/loader/loader'
import axios from 'axios'
import { chatSlice } from '@/store/reducers/ChatSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import cl from './search.module.scss'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { ILanguageData } from '@/models/ILanguage'

const Search: FC<ILanguageData> = (language) => {

  const [value, setValue] = useState<string>('')
  const [users, setUsers] = useState<IUser[]>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFinded, setIsFinded] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const { userChatContent, userChatActive } = chatSlice.actions
  const { searchFocus, searchUsers, searchValue } = searchSlice.actions
  const { isSearchFocus } = useAppSelector(state => state.searchSlice)
  const dispatch = useAppDispatch()
  const debounceValue = useDebounce(value, 200)
  const { languageData } = useAppSelector(state => state.languageSlice)

  const changeSearchQuery = (text: string) => {
    if (!text.trim()) {
      setValue('')
      dispatch(searchValue(false))
      // setUsers([])
      // setIsLoading(false)
      setIsFinded(false)
      return;
    }
    setValue(text)
    dispatch(searchValue(true))
  }

  const getSearchUsers = async (query: string) => {
    const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
    const options = {
      headers: {
        search: query,
        authorization: token
      }
    }
    const response = await axios.get<IUser[]>(`${process.env.NEXT_PUBLIC_SERVER_API}api/search`, options)
    setUsers(response.data)
    dispatch(searchUsers(response.data))
    setIsFinded(response.data.length ? false : true)
  }

  const onClickUser = (user: IUser) => {
    dispatch(userChatContent(user))
    dispatch(userChatActive(true))
  }

  useEffect(() => {
    if (value.trim()) {
      getSearchUsers(encodeURI(value))
    } else {
      setUsers([])
      dispatch(searchUsers([]))
    }
  }, [debounceValue])

  return (
    <div className={cl.search}>
      <label className={cl.search__body} htmlFor='search'>
        <div className={isSearchFocus ? `${cl.search__svgs} ${cl.active}` : cl.search__svgs}>
          <div className={cl.search__svg}>
            <SearchSvg />
          </div>
          <div className={cl.search__svg} onClick={(e) => {
            dispatch(searchFocus(false))
            setValue('')
            dispatch(searchValue(false))
            setIsFinded(false)
            if (!isSearchFocus) return;
            e.preventDefault()
          }}>
            <ArrowSvg />
          </div>
        </div>
        <input type="text" id='search' value={value} autoComplete='off' placeholder={languageData ? languageData.search.inputPlaceholder : language.search.inputPlaceholder} onChange={(e) => changeSearchQuery(e.target.value)} onFocus={() => dispatch(searchFocus(true))} />
      </label>
    </div>
  )
}

export default Search