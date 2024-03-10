'use client'

import { FC, useEffect } from 'react'
import { useSocket } from '@/api/use-socket'
import { CameraSvg, InfoSvg } from '@/components/svgs'
import Avatar from '@/components/ui/avatar/avatar'
import VideoCall from '@/components/videoCall/videoCall'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { IMessage } from '@/models/IMessage'
import { ISocketRead, ISocketResponse } from '@/models/ISocket'
import { chatSlice } from '@/store/reducers/ChatSlice'
import { popupSlice } from '@/store/reducers/PopupSlice'
import { userSlice } from '@/store/reducers/UserSlice'
import cl from './chatHeader.module.scss'

interface ChatHeaderProps {
  messagesState: IMessage[];
  setMessagesState: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const ChatHeader: FC<ChatHeaderProps> = ({ messagesState, setMessagesState }) => {

  const { isOnline, isTyping, path, name, messages, _id, chatId } = useAppSelector(state => state.chatSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const { username } = useAppSelector(state => state.userSlice)
  const { showPopup } = popupSlice.actions
  const { changeUserInfoActive } = userSlice.actions
  const { userOnline, userTyping } = chatSlice.actions

  const dispatch = useAppDispatch()

  const socket = useSocket({
    messageEvent: (message) => acceptMessage(message),
    onlineEvent: (message) => dispatch(userOnline(message?.isOnline)),
    typingEvent: (message) => dispatch(userTyping(message?.isTyping)),
    readEvent: () => setMessagesState(prev => prev.map(message => message.isRead === false ? { ...message, isRead: true } : message)),
  })

  const acceptMessage = ({ clientId, date, from, isRead, isSend, message, type, files }: ISocketResponse) => {
    if (!from) return;
    const newMessage: IMessage = {
      _id: '' + clientId + Date.now() + date + Math.random(),
      date,
      from,
      isRead,
      isSend,
      message,
      type,
      files
    }
    setMessagesState(prev => [...prev, newMessage])
    readMessages()
  }

  const readMessages = () => {
    if (!_id) return;
    const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
    const message: ISocketRead = {
      event: 'read',
      token,
      chatId: chatId || '',
      clientId: _id,
      clientIsOnline: isOnline,
    }
    socket.sendMessage(message)
  }

  const showCallModal = () => {
    const setupMediaAndCall = (videoEnabled: boolean) => {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled,
      })
        .then(stream => {
          // Если пользователь разрешил использование микрофона (и видео, если videoEnabled = true), открываем модальное окно
          dispatch(showPopup({
            children: <VideoCall name={name} path={path} _id={_id} />,
            isCloseShow: false,
          }));
        })
        .catch(() => {
          if (videoEnabled) {
            // Если пользователь не разрешил использование видео, пробуем только аудио
            setupMediaAndCall(false);
          }
        });
    };
    setupMediaAndCall(true); // Сначала пробуем видео и аудио
  };

  useEffect(() => {
    const lastMessage = messagesState[messagesState.length - 1] || messages[messages.length - 1]
    if (!lastMessage?.isRead && lastMessage?.from !== username && lastMessage) {
      readMessages()
    }
  }, [messagesState])

  return (
    <div className={cl.header}>
      <div className={cl.header__content}>
        <div className={cl.header__item}>
          <div className={cl.header__avatar}>
            <Avatar pathProps={path} nameProps={name} styles={cl.header__avatar__gradient} />
          </div>
          <div className={cl.header__name}>
            {name}
            {isOnline || isTyping ?
              <>
                {isTyping ? <span>{languageData?.userState.typing}</span> : <span>{languageData?.userState.online}</span>}
              </> :
              <span>{languageData?.userState.offline}</span>
            }
          </div>
        </div>
        <div className={cl.header__item}>
          <div className={cl.header__svg} onClick={showCallModal}>
            <CameraSvg />
          </div>
          <div className={cl.header__svg} onClick={() => dispatch(changeUserInfoActive(true))}>
            <InfoSvg />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader