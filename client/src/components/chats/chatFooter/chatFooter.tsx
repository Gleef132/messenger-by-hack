'use client'

import { FC, useEffect, useRef, useState } from 'react';
import { useSocket } from '@/api/use-socket';
import { ClipSvg, FileSvg, ImageSvg, MicroOnSvg, SendSvg, TrashSvg } from '@/components/svgs';
import Timer from '@/components/timer/timer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAutoResizeTextArea } from '@/hooks/useAutoResizeTextArea';
import { IMessage } from '@/models/IMessage';
import { ISocketTyping } from '@/models/ISocket';
import { chatUsersSlice } from '@/store/reducers/ChatUsersSlice';
import { popupSlice } from '@/store/reducers/PopupSlice';
import { createMessages } from '@/utils/createMessages';
import axios from 'axios';
import ChatPopupContent from '../chatPopupContent/chatPopupContent';
import cl from './chatFooter.module.scss';

type SendMessage = {
  event: 'key'
  e: React.KeyboardEvent<HTMLTextAreaElement>
} | {
  event: 'click'
  e: React.MouseEvent<HTMLDivElement>
}

interface IChatFooterProps {
  footerLineRef: React.RefObject<HTMLDivElement>;
  messagesState: IMessage[];
  setMessagesState: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setTextAreaHeight: (height: number) => void;
}

const ChatFooter: FC<IChatFooterProps> = ({ footerLineRef, messagesState, setMessagesState, setTextAreaHeight }) => {

  const { isOnline, isTyping, path, name, _id, setLastMessage } = useAppSelector(state => state.chatSlice)
  const { username } = useAppSelector(state => state.userSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)
  const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const isTrySendingRecordRef = useRef<boolean>(false)
  const { users: chatUsers } = useAppSelector(state => state.chatUsersSlice)
  const { changeChatUsers } = chatUsersSlice.actions
  const { showPopup } = popupSlice.actions
  const [value, setValue] = useState<string>('')
  const [isTypingState, setIsTypingState] = useState<boolean>(false)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useAutoResizeTextArea(textAreaRef.current, value, 290)

  const dispatch = useAppDispatch()

  const socket = useSocket({})

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
          if (isTrySendingRecordRef.current) {
            sendRecord(audioChunks)
          }
        });
        mediaRecorder.current?.start()
        setIsRecording(true)
      })
      .catch(e => {
        alert('Пожалуйста, предоставьте разрешение на использование микрофона');
      })
  }

  const endRecording = (isTrySending: boolean) => {
    isTrySendingRecordRef.current = isTrySending
    setIsRecording(false)
    mediaRecorder.current?.stop()
  }

  const sendRecord = async (audioChunks: Blob[]) => {
    const audioBlob = new Blob(audioChunks);
    const file: File = new File([audioBlob], "audio.mp3", {
      type: 'audio/mpeg',
    });
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}api/upload`, formData)
    const { message, newMessage } = createMessages({
      clientId: _id,
      clientIsOnline: isOnline,
      event: 'message',
      from: username,
      messageValue: response.data.id,
      type: 'audio'
    })
    socket.sendMessage(message)
    if (messagesState.length === 0) {
      dispatch(changeChatUsers({
        users: [{
          _id: Date.now().toString(),
          messages: [newMessage],
          name,
          chats: [],
          isOnline,
          isTyping,
          path,
          password: '',
          username: name,
        },
        ...chatUsers || []
        ]
      }))
    }
    setMessagesState(prev => [...prev, newMessage])
    setLastMessage(newMessage)
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

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const filesArray = Array.from(e.target.files ? e.target.files : new FileList());
    if (!filesArray.length) return;
    showFileModal(filesArray, type, () => e.target.value = '')
  }

  const sendMessage = ({ e, event }: SendMessage) => {
    if (!value.trim()) {
      if (event === 'key' && e.code === 'Enter' && !e.shiftKey) {
        return e.preventDefault()
      }
      return
    };
    if (event === 'key') {
      if (e.code !== 'Enter') return;
      if (e.shiftKey) return;
    }
    const { message, newMessage } = createMessages({
      clientId: _id,
      clientIsOnline: isOnline,
      event: 'message',
      from: username,
      messageValue: value,
      type: 'text'
    })
    if (event === 'key') {
      if (e.code === 'Enter' && !e.shiftKey) {
        // if ()
        e.preventDefault()
        setValue('')
        textAreaRef.current?.focus()
        socket.sendMessage(message)
        if (messagesState.length === 0) {
          dispatch(changeChatUsers({
            users: [{
              _id: Date.now().toString(),
              messages: [newMessage],
              name,
              chats: [],
              isOnline,
              isTyping,
              path,
              password: '',
              username: name,
            },
            ...chatUsers || []
            ]
          }))
        }
        setMessagesState(prev => [...prev, newMessage])
        typingMessage(false)
        setLastMessage(newMessage)
      }
      return;
    }
    setValue('')
    textAreaRef.current?.focus()
    socket.sendMessage(message)
    if (messagesState.length === 0) {
      dispatch(changeChatUsers({
        users: [{
          _id: Date.now().toString(),
          messages: [newMessage],
          name,
          chats: [],
          isOnline,
          isTyping,
          path,
          password: '',
          username: name,
        },
        ...chatUsers || []
        ]
      }))
    }
    setMessagesState(prev => [...prev, newMessage])
    setLastMessage(newMessage)
    typingMessage(false)
  }

  const typingMessage = (isTyping: boolean) => {
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

  useEffect(() => {
    if (!value) return;
    typingMessage(false)
    setValue('')
  }, [name])

  useEffect(() => {
    setTextAreaHeight(textAreaRef.current?.clientHeight || 44)
  }, [textAreaRef.current])

  return (
    <div className={cl.footer}>
      <div ref={footerLineRef} className={cl.footer__line}></div>
      <div className={cl.footer__input}>
        <div className={cl.footer__emoji}>
          <ClipSvg />
          <div className={cl.footer__options}>
            <label htmlFor="inputImages">
              <div className={cl.footer__option}><ImageSvg /> {languageData?.chat.photo}</div>
              <input style={{ display: 'none' }} multiple id="inputImages" type='file' accept='image/*' onChange={(e) => uploadFile(e, 'image')} />
            </label>
            <label htmlFor="inputFiles">
              <div className={cl.footer__option}><FileSvg /> {languageData?.chat.file}</div>
              <input style={{ display: 'none' }} multiple id="inputFiles" type='file' onChange={(e) => uploadFile(e, 'file')} />
            </label>
          </div>
        </div>
        <textarea ref={textAreaRef} disabled={isRecording} onKeyDown={(e) => sendMessage({ e, event: 'key' })} autoFocus placeholder={languageData?.chat.inputPlaceholder} value={value} onChange={typingHandle} />
        {isRecording && <Timer />}
      </div>
      {isRecording && <div className={cl.footer__delete} onClick={() => endRecording(false)}>
        <TrashSvg />
      </div>}
      <button className={value || isRecording ? `${cl.footer__btn} ${cl.active}` : cl.footer__btn}>
        <div className={cl.footer__svg} onClick={(e) => value ? sendMessage({ e, event: 'click' }) : endRecording(true)}>
          <SendSvg />
        </div>
        <div className={cl.footer__svg} onClick={startRecording}>
          <MicroOnSvg />
        </div>
      </button>
    </div>
  )
}

export default ChatFooter