'use client'

import { useSocket } from '@/api/use-socket'
import { TrashSvg } from '@/components/svgs'
import FileIcon from '@/components/ui/fileIcon/fileIcon'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useAutoResizeTextArea } from '@/hooks/useAutoResizeTextArea'
import { IFile, IMessage } from '@/models/IMessage'
import { ISocketMessage } from '@/models/ISocket'
import { fileSlice } from '@/store/reducers/FileSlice'
import { popupSlice } from '@/store/reducers/PopupSlice'
import { addZero } from '@/utils/add-zero'
import { formatBytes } from '@/utils/formatBytes'
import axios from 'axios'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import cl from './chatPopupContent.module.scss'

interface IChatPopupContentProps {
  type: 'image' | 'file';
  files: File[];
  prevValue: string;
  setMessage: (message: IMessage) => void;
  clearFiles: () => void;
  clearPrevValue: () => void;
}

type SendMessageType = {
  event: 'key'
  e: React.KeyboardEvent<HTMLTextAreaElement>
} | {
  event: 'click'
  e: React.MouseEvent<HTMLButtonElement>
}

const ChatPopupContent: FC<IChatPopupContentProps> = ({ files, type, prevValue, setMessage, clearFiles, clearPrevValue }) => {

  const [value, setValue] = useState<string>(prevValue)
  const [active, setActive] = useState<boolean>(false)
  const [filesState, setFilesState] = useState<File[]>(files)
  const [filesPaths, setFilesPaths] = useState<string[]>(files.map(file => URL.createObjectURL(file)))

  const dispatch = useAppDispatch()
  const { hiddenPopup } = popupSlice.actions
  const { changeProgress, changeFilesCount } = fileSlice.actions
  const { username } = useAppSelector(state => state.userSlice)
  const { isOnline, _id, setLastMessage } = useAppSelector(state => state.chatSlice)
  const { languageData } = useAppSelector(state => state.languageSlice)

  const imageTitle = filesState.length > 1 ? languageData?.chat.sendPhotos.replace('count', filesState.length.toString()) : languageData?.chat.sendPhoto
  const fileTitle = filesState.length > 1 ? filesState.length < 5 ? languageData?.chat.sendSmallAmountFiles.replace('count', filesState.length.toString()) : languageData?.chat.sendFiles.replace('count', filesState.length.toString()) : languageData?.chat.sendFile

  const socket = useSocket()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useAutoResizeTextArea(textAreaRef.current, value, 100)

  const closeHandle = () => {
    setActive(true)
    setTimeout(() => {
      dispatch(hiddenPopup())
      clearFiles()
    }, 80);
  }

  const addFile = (e: ChangeEvent<HTMLInputElement>) => {
    const filesStateNames = filesState.map(file => file.name)
    const filesArray = Array.from(e.target.files ? e.target.files : new FileList())
      .filter(file => !filesStateNames.includes(file.name))
    const filesPaths = filesArray.map(file => URL.createObjectURL(file))
    if (type === 'image' && filesArray.length + filesStateNames.length > 4) return;
    setFilesState(prev => [...prev, ...filesArray])
    setFilesPaths(prev => [...prev, ...filesPaths])
  }

  const deleteFile = (index: number) => {
    if (filesState.length === 1) return closeHandle()
    setFilesState(prev => prev.filter((file, i) => index !== i))
    setFilesPaths(prev => prev.filter((file, i) => index !== i))
  }

  const sendMessage = async ({ e, event }: SendMessageType) => {
    dispatch(changeFilesCount(filesState.map(file => ({ progress: 0, status: 'success' }))))
    const date = new Date()
    const fullDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    const time = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
    const token = `Bearar ${JSON.parse(localStorage.getItem('token') as string)}`
    const messageValue = value.trim() ? value : ''

    const files: IFile[] = filesState.map(file => ({ _id: URL.createObjectURL(file), name: file.name, size: formatBytes(file.size) }))

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
      // message: imagePaths.join(''),
      message: messageValue,
      token,
      type,
      files,
    }
    const newMessage: IMessage = {
      _id: '' + _id + Date.now() + date + Math.random(),
      // message: imagePaths.join(''),
      message: messageValue,
      date: {
        fullDate,
        time,
      },
      from: username,
      isRead: false,
      isSend: true,
      type,
      files
    }

    if (event === 'key') {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        setValue('')
        setMessage(newMessage)
        setLastMessage(newMessage)
        closeHandle()
        clearPrevValue()
      } else {
        return;
      }
    } else {
      setMessage(newMessage)
      setLastMessage(newMessage)
      closeHandle()
      clearPrevValue()
    }


    await Promise.all(filesState.map(async (file, index) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await axios.post<{ id: string }>(`${process.env.NEXT_PUBLIC_SERVER_API}api/upload`, formData, {
          onUploadProgress: progressEvent => {
            const totalLength = progressEvent.event.lengthComputable ? progressEvent.event.total : progressEvent.event.target.getResponseHeader('content-length') || progressEvent.event.target.getResponseHeader('x-decompressed-content-length');
            if (progressEvent.event.lengthComputable) {
              const progress = Math.round((progressEvent.loaded * 100) / totalLength);
              dispatch(changeProgress({ index, progress, status: 'loading' }))
            }
          }
        })
        dispatch(changeProgress({ index, progress: 0, status: 'success' }))
        files[index] = { ...files[index], _id: res.data.id }

      } catch (e) {
        console.log(e)
      }
    }))
    socket.sendMessage(message)
  }

  useEffect(() => {
    if (!textAreaRef.current) return;
    const textArea = textAreaRef.current
    textArea.setSelectionRange(prevValue.length, prevValue.length)
    textArea.style.height = textArea.scrollHeight + "px";
    textArea.scrollTop = textArea.scrollHeight
  }, [prevValue])

  return (
    <div style={{ animationName: cl.animate }} className={active ? `${cl.content} ${cl.active}` : cl.content} onClick={(e) => e.stopPropagation()}>
      <div className={cl.content__header}>
        <div className={cl.content__close} onClick={closeHandle}></div>
        <div className={cl.content__title}>{type === 'file' ? fileTitle : `${imageTitle}`} {type === 'image' && <span className='text'>max(4)</span>}</div>
        <label htmlFor="inputFileAdd">
          <div className={cl.content__add}></div>
        </label>
        <input style={{ display: 'none' }} type="file" id='inputFileAdd' multiple accept={type === 'image' ? 'image/*' : ''} onChange={addFile} />
      </div>
      <div className={cl.content__items}>
        {type === 'image' && filesState.map((file, index) => {
          return <div className={cl.content__item} key={file.name}>
            <img src={filesPaths[index]} alt="image" />
            <div className={cl.content__item__delete} onClick={() => deleteFile(index)}>
              <TrashSvg />
            </div>
          </div>
        })}
        {type === 'file' && filesState.map((file, index) => {
          return <div className={`${cl.content__item} ${cl.content__item__file}`} key={file.name}>
            <FileIcon isMyMessage={false} isDefault={true} name={file.name} text={formatBytes(file.size)} />
            <div className={`${cl.content__item__delete} ${cl.file}`} onClick={() => deleteFile(index)}>
              <TrashSvg />
            </div>
          </div>
        })}
      </div>
      <div className={cl.content__footer}>
        <div className={cl.content__input}>
          <textarea ref={textAreaRef} value={value} autoFocus placeholder={languageData?.chat.sendInputPlaceholder} onKeyDown={(e) => sendMessage({ e, event: 'key' })} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button className={cl.content__btn} onClick={(e) => sendMessage({ e, event: 'click' })}>{languageData?.chat.send.toUpperCase()}</button>
      </div>
    </div>
  )
}

export default ChatPopupContent