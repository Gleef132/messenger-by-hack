'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useDebounce } from '@/hooks/useDebounce'
import { ILanguageData } from '@/models/ILanguage'
import { IUser } from '@/models/IUser'
import { searchSlice } from '@/store/reducers/SearchSlice'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { ArrowSvg, SearchSvg } from '../svgs'
import cl from './search.module.scss'

const Search: FC<ILanguageData> = (language) => {

  const [value, setValue] = useState<string>('')
  const { searchFocus, searchUsers, searchValue } = searchSlice.actions
  const { isSearchFocus } = useAppSelector(state => state.searchSlice)
  const dispatch = useAppDispatch()
  const debounceValue = useDebounce(value, 200)
  const { languageData } = useAppSelector(state => state.languageSlice)

  const changeSearchQuery = (text: string) => {
    if (!text.trim()) {
      setValue('')
      dispatch(searchValue(false))
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
    dispatch(searchUsers(response.data))
  }

  useEffect(() => {
    if (value.trim()) {
      getSearchUsers(encodeURI(value))
    } else {
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