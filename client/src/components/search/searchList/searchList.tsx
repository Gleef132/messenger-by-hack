'use client'
import { FC, Fragment, useEffect, useState } from 'react'
import cl from './searchList.module.scss'
import { useAppSelector } from '@/hooks/redux'
import ChatLink from '@/components/chats/chatLink/chatLink'

const SearchList: FC = () => {
  const { searchedUsers, isSearchFocus, chatUsers, isSearchValue } = useAppSelector(state => state.searchSlice)
  const [usersId, setUsersId] = useState<Set<string>>(new Set())

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
            <ChatLink active='false' changeActiveUser={() => null} user={user} key={user._id} variant='secondary' />
          )
        })}
      </div>
      }
      {searchedUsers.length > 0 && isSearchValue && <div className={cl.search__users}>
        {(() => {
          let count = 0;
          return searchedUsers?.map((user) => {
            if (!usersId.has(user._id)) return;
            if (count > 5) return;
            const isFirst = count === 0;
            count += 1;
            for (let i = 0; i < chatUsers.length; i++) {
              const myUser = chatUsers[i];
              if (myUser._id === user._id) {
                return (
                  <Fragment key={myUser._id}>
                    {isFirst && <h1 className={cl.search__users__title}>Chats</h1>}
                    <ChatLink active='false' changeActiveUser={() => null} user={myUser} key={myUser._id} variant='primary' />
                  </Fragment>
                );
              }
            }
          });
        })()}
      </div>}
      {searchedUsers.length > 0 && isSearchValue && <div className={cl.search__users}>
        {(() => {
          let count = 0;
          return searchedUsers?.map((user) => {
            if (usersId.has(user._id)) return;
            if (count > 5) return;
            const isFirst = count === 0;
            count += 1;
            return (
              <Fragment key={user._id}>
                {isFirst && <h1 className={cl.search__users__title}>Global Search</h1>}
                <ChatLink active='false' changeActiveUser={() => null} user={user} key={user._id} variant='primary' />
              </Fragment>
            );
          });
        })()}
      </div>}
    </div>
  )
}

export default SearchList