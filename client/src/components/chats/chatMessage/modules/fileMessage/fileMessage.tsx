'use client'

import { FC, useRef, useState } from 'react'
import { useAppSelector } from '@/hooks/redux'
import axios from 'axios'

import { IChatMessageProps } from '@/models/IMessage'
import MessagePrototype from '../messagePrototype/messagePrototype'
import FileIcon from '@/components/ui/fileIcon/fileIcon'
import cl from './fileMessage.module.scss'

const FileMessage: FC<IChatMessageProps> = ({ ...props }) => {

  const { message, isMyMessage, files } = { ...props }
  const { files: progress } = useAppSelector(state => state.fileSlice)
  const [downloadProgresses, setDownloadProgresses] = useState<number[]>(files?.map(file => 0) || [])
  const [isDownloading, setIsDownloading] = useState<boolean[]>(files?.map(file => false) || [])

  const controllerRef = useRef(new AbortController())

  const downloadFile = async (id: string, name: string, index: number) => {
    if (isDownloading[index]) return;
    controllerRef.current = new AbortController()
    try {
      setIsDownloading(prev => prev.map((item, i) => i === index ? true : item))
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}api/download?id=${id}&name=${name}`, {
        signal: controllerRef.current.signal,
        onDownloadProgress: progressEvent => {
          const totalLength = progressEvent.event.lengthComputable ? progressEvent.event.total : progressEvent.event.target.getResponseHeader('content-length') || progressEvent.event.target.getResponseHeader('x-decompressed-content-length')
          if (progressEvent.event.lengthComputable) {
            const progress = Math.round((progressEvent.loaded * 100) / totalLength)
            setDownloadProgresses(prev => prev.map((item, i) => i === index ? progress : item))
          }
        }
      })
      if (response.status === 200) {
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = name
        document.body.appendChild(link)
        link.click()
        link.remove()
        setIsDownloading(prev => prev.map((item, i) => i === index ? false : item))
        setDownloadProgresses(prev => prev.map((item, i) => i === index ? 0 : item))
      }
    } catch (error) {
      // console.log(error)
      setIsDownloading(prev => prev.map((item, i) => i === index ? false : item))
    }
  }

  const abortHandle = (index: number) => {
    if (!isDownloading[index]) return;
    setDownloadProgresses(prev => [...prev, prev[index] = 0])
    controllerRef.current.abort()
  }

  return (
    <MessagePrototype {...props}>
      <div className={cl.files}>
        {files?.map((file, index) =>
          <FileIcon
            key={file._id}
            downloadHandle={() => downloadFile(file._id, file.name, index)}
            abortHandle={() => abortHandle(index)}
            isDownloading={!!downloadProgresses[index]}
            isDefault={false}
            isMyMessage={isMyMessage}
            name={file.name}
            text={downloadProgresses[index] ? downloadProgresses[index] + '%' : progress[index]?.status === 'loading' ? `${progress[index]?.progress}%` : file.size}
          />
        )}
        {message}
      </div>
    </MessagePrototype>
  )
}

export default FileMessage
