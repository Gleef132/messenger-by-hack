'use client'

import ChatLink from '@/components/chats/chatLink/chatLink'
import { useAppSelector } from '@/hooks/redux'
import { FC, Fragment, useEffect, useState } from 'react'
import cl from './searchList.module.scss'

interface ISearchListProps {
  username: string;
}

const SearchList: FC<ISearchListProps> = ({ username }) => {
  const { searchedUsers, isSearchFocus, chatUsers, isSearchValue } = useAppSelector(state => state.searchSlice)
  const [usersId, setUsersId] = useState<Set<string>>(new Set())
  const { username: currentUsername } = useAppSelector(state => state.userSlice)

  const myChats = searchedUsers.filter(user => usersId.has(user._id))
  const globalChats = searchedUsers.filter(user => !usersId.has(user._id))

  useEffect(() => {
    chatUsers.map(user => {
      setUsersId(prev => new Set(prev).add(user._id));
    })
  }, [chatUsers])

  return (
    <div className={isSearchFocus ? `${cl.list} ${cl.active}` : cl.list}>
      {!isSearchValue && <div className={cl.my__users}>
        {chatUsers?.map(user => {
          return (
            <ChatLink username={currentUsername ? currentUsername : username} user={user} key={user._id} variant='secondary' />
          )
        })}
      </div>
      }
      {!!myChats.length && isSearchValue && <div className={cl.search__users}>
        {(() => {
          let count = 0;
          return myChats.map((user) => {
            if (count > 5) return;
            const isFirst = count === 0;
            count += 1;
            for (let i = 0; i < chatUsers.length; i++) {
              const myUser = chatUsers[i];
              if (myUser._id === user._id) {
                return (
                  <Fragment key={myUser._id}>
                    {isFirst && <h1 className={cl.search__users__title}>Chats</h1>}
                    <ChatLink username={currentUsername ? currentUsername : username} user={myUser} key={myUser._id} variant='primary' />
                  </Fragment>
                );
              }
            }
          });
        })()}
      </div>}
      {!!globalChats.length && isSearchValue && <div className={cl.search__users}>
        {(() => {
          let count = 0;
          return globalChats.map((user) => {
            if (count > 5) return;
            const isFirst = count === 0;
            count += 1;
            return (
              <Fragment key={user._id}>
                {isFirst && <h1 className={cl.search__users__title}>Global Search</h1>}
                <ChatLink username={currentUsername ? currentUsername : username} user={user} key={user._id} variant='primary' />
              </Fragment>
            );
          });
        })()}
      </div>}
    </div>
  )
}

export default SearchList