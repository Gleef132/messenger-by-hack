'use client'
import { FC, useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { CameraSvg, ClipSvg, FileSvg, ImageSvg, InfoSvg, MicroSvg, SendSvg, TrashSvg } from '@/components/svgs'
import { ISocketMessage, ISocketRead, ISocketResponse, ISocketTyping } from '@/models/ISocket'
import ChatMessages from '../chatMessages/chatMessages'
import cl from './chatContent.module.scss'
import { chatSlice } from '@/store/reducers/ChatSlice'
import { ChatMessageTypes, IFile, IMessage } from '@/models/IMessage'
import { addZero } from '@/utils/add-zero'
import { useAutoResizeTextArea } from '@/hooks/useAutoResizeTextArea'
import { userSlice } from '@/store/reducers/UserSlice'
import Timer from '@/components/timer/timer'
import axios from 'axios'
import { useSocket } from '@/api/use-socket'
import { popupSlice } from '@/store/reducers/PopupSlice'
import ChatPopupContent from '../chatPopupContent/chatPopupContent'
import VideoCall from '@/components/videoCall/videoCall'

type SendMessage = {
  event: 'key'
  e: React.KeyboardEvent<HTMLTextAreaElement>
} | {
  event: 'click'
  e: React.MouseEvent<HTMLButtonElement>
}

const ChatContent: FC = () => {
  const { isOnline, isTyping, path, name, messages, _id, setLastMessage, chatId } = useAppSelector(state => state.chatSlice)
  const { username } = useAppSelector(state => state.userSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const [messagesState, setMessagesState] = useState<IMessage[]>(messages)
  const dispatch = useAppDispatch()
  const { userOnline, userTyping } = chatSlice.actions
  const { changeUserInfoActive } = userSlice.actions
  const { showPopup } = popupSlice.actions
  const [value, setValue] = useState<string>('')
  const [isTypingState, setIsTypingState] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  // const [messageType, setMessageType] = useState<ChatMessageTypes>('text')
  const [files, setFiles] = useState<IFile[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const footerLineRef = useRef<HTMLDivElement>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  useAutoResizeTextArea(textAreaRef.current, value, 290)

  const socket = useSocket({
    messageEvent: (message) => acceptMessage(message),
    onlineEvent: (message) => dispatch(userOnline(message?.isOnline)),
    typingEvent: (message) => dispatch(userTyping(message?.isTyping)),
    readEvent: () => setMessagesState(prev => prev.map(message => message.isRead === false ? { ...message, isRead: true } : message)),
  })

  const sendMessage = ({ e, event }: SendMessage) => {
    if (!value.trim()) {
      if (event === 'key' && e.code === 'Enter' && !e.shiftKey) {
        return e.preventDefault()
      }
      return;
    };
    const date = new Date()
    const fullDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    const time = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
    const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
    const message: ISocketMessage = {
      clientId: _id,
      clientIsOnline: isOnline,
      date: {
        fullDate,
        time,
      },
      event: 'message',
      from: username,
      isRead: false,
      isSend: true,
      message: value,
      token,
      type: 'text',
      files
    }
    const newMessage: IMessage = {
      _id: '' + _id + Date.now() + date + Math.random(),
      message: value,
      date: {
        fullDate,
        time,
      },
      from: username,
      isRead: false,
      isSend: true,
      type: 'text',
      files
    }
    if (event === 'key') {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        setValue('')
        textAreaRef.current?.focus()
        // socket?.send(JSON.stringify(message))
        socket.sendMessage(message)
        setMessagesState(prev => [...prev, newMessage])
        typingMessage(false)
        setLastMessage(newMessage)
      }
      return;
    }
    setValue('')
    textAreaRef.current?.focus()
    socket.sendMessage(message)
    setLastMessage(newMessage)
    typingMessage(false)
  }

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
    // setLastMessage(newMessage)
    readMessages()
  }

  const readMessages = () => {
    // if (!isConnected) return;
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

  const typingMessage = (isTyping: boolean) => {
    const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
    const message: ISocketTyping = {
      event: 'typing',
      clientId: _id,
      isTyping,
      token,
    }
    socket.sendMessage(message)
    setIsTypingState(isTyping)
  }

  const typingHandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setValue(value)
    if (value.trim().length > 0 && !isTypingState) {
      typingMessage(true)
    }
    if (!value.length) {
      typingMessage(false)
    }
  }

  const scrollHandle = (condition: boolean) => {
    if (condition && footerLineRef.current) {
      footerLineRef.current.style.opacity = '0'
    } else if (footerLineRef.current) {
      footerLineRef.current.style.opacity = '1'
    }
  }

  useEffect(() => {
    if (!value) return;
    typingMessage(false)
    setValue('')
  }, [name])

  useEffect(() => {
    const lastMessage = messagesState[messagesState.length - 1] || messages[messages.length - 1]
    if (!lastMessage?.isRead && lastMessage?.from !== username && lastMessage) {
      readMessages()
    }
  }, [messagesState])

  useEffect(() => {
    setMessagesState(messages)
  }, [messages])

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        let audioChunks: Blob[] = [];

        if (!mediaRecorder.current) return;

        mediaRecorder.current.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.current.addEventListener("stop", async () => {
          const audioBlob = new Blob(audioChunks);
          const file: File = new File([audioBlob], "audio.mp3", {
            type: 'audio/mpeg',
          });
          const formData = new FormData();
          formData.append("file", file);
          new Audio(URL.createObjectURL(audioBlob)).play()
          await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}api/upload`, formData)

        });
        mediaRecorder.current?.start()
        setIsRecording(true)
      })
      .catch(e => {
        alert('Пожалуйста, предоставьте разрешение на использование микрофона');
      })
  }
  const endRecording = () => {
    mediaRecorder.current?.stop()
    setIsRecording(false)
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const filesArray = Array.from(e.target.files ? e.target.files : new FileList());
    if (!filesArray.length) return;
    showFileModal(filesArray, type, () => e.target.value = '')
  }

  const showFileModal = (files: File[], type: 'image' | 'file', clearFiles: () => void) => {
    dispatch(showPopup({
      children: <ChatPopupContent
        files={files}
        type={type}
        prevValue={value}
        setMessage={(message) => setMessagesState(prev => [...prev, message])}
        clearFiles={clearFiles}
        clearPrevValue={() => setValue('')}
      />,
      isCloseShow: false
    }))
  }

  const showCallModal = () => {
    dispatch(showPopup({
      children: <VideoCall name={name} path={path} _id={_id} />,
      isCloseShow: false,
    }))
  }

  return (
    <div className={cl.chat}>
      <div className={cl.chat__container}>
        <div className={cl.chat__header}>
          <div className={cl.chat__header__content}>
            <div className={cl.chat__header__item}>
              <div className={cl.chat__avatar}>
                <img src={path} alt="avatar" />
              </div>
              <div className={cl.chat__header__name}>
                {name}
                {isOnline || isTyping ?
                  <>
                    {isTyping ? <span>{languageData?.userState.typing}</span> : <span>{languageData?.userState.online}</span>}
                  </> :
                  <span>{languageData?.userState.offline}</span>
                }
              </div>
            </div>
            <div className={cl.chat__header__item}>
              <div className={cl.chat__header__svg} onClick={showCallModal}>
                <CameraSvg />
              </div>
              <div className={cl.chat__header__svg} onClick={() => dispatch(changeUserInfoActive(true))}>
                <InfoSvg />
              </div>
            </div>
          </div>
        </div>
        <ChatMessages messages={messagesState} footerHeight={textAreaRef.current?.clientHeight} scrollHandle={scrollHandle} />
        <div className={cl.chat__footer}>
          <div ref={footerLineRef} className={cl.chat__footer__line}></div>
          <div className={cl.chat__footer__input}>
            <div className={cl.chat__footer__emoji}>
              <ClipSvg />
              <div className={cl.chat__footer__options}>
                <label htmlFor="inputImages">
                  <div className={cl.chat__footer__option}><ImageSvg /> {languageData?.chat.photo}</div>
                  <input style={{ display: 'none' }} multiple id="inputImages" type='file' accept='image/*' onChange={(e) => uploadFile(e, 'image')} />
                </label>
                <label htmlFor="inputFiles">
                  <div className={cl.chat__footer__option}><FileSvg /> {languageData?.chat.file}</div>
                  <input style={{ display: 'none' }} multiple id="inputFiles" type='file' onChange={(e) => uploadFile(e, 'file')} />
                </label>
              </div>
            </div>
            <textarea ref={textAreaRef} disabled={isRecording} onKeyDown={(e) => sendMessage({ e, event: 'key' })} autoFocus placeholder={languageData?.chat.inputPlaceholder} value={value} onChange={typingHandle} />
            {isRecording && <Timer />}
          </div>
          {isRecording && <div className={cl.chat__footer__delete} onClick={() => endRecording()}>
            <TrashSvg />
          </div>}
          <button className={value || isRecording ? `${cl.chat__footer__btn} ${cl.active}` : cl.chat__footer__btn} onClick={(e) => value || isRecording ? endRecording() : startRecording()}>
            <div className={cl.chat__footer__svg}>
              <SendSvg />
            </div>
            <div className={cl.chat__footer__svg}>
              <MicroSvg />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatContent