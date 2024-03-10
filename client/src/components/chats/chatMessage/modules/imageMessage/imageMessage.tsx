'use client'

import { FC, ReactNode, useState } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { IChatMessageProps, } from '@/models/IMessage'
import { popupSlice } from '@/store/reducers/PopupSlice'
import Image from 'next/image'
import MessagePrototype from '../messagePrototype/messagePrototype'
import cl from './imageMessage.module.scss'

const ImageMessage: FC<IChatMessageProps> = ({ ...props }) => {

  const { message, files } = { ...props }
  const [isLoadingImages, setIsLoadingImages] = useState<boolean[]>(files?.map(file => true) || [])
  const { showPopup } = popupSlice.actions
  const dispatch = useAppDispatch()

  const imageShow = (src: string) => {
    const reactNode: ReactNode = <img src={src} className='modal__image' alt="image" onClick={(e) => e.stopPropagation()} />
    dispatch(showPopup({
      children: reactNode,
      isCloseShow: true,
    }))
  }

  const imageBackgroundStyles = (name: string): string => {
    const type = name.split('.').pop()
    switch (type) {
      case 'gif':
        return cl.gif__bg
      case 'png':
        return cl.png__bg
      default:
        return ''
    }
  }

  return (
    <MessagePrototype {...props}>
      <div className={cl.image__content}>
        <div className={message ? `${cl.image} ${cl.border__none}` : cl.image}>
          {files?.map((image, index) => {
            const imageBgStyle = imageBackgroundStyles(image.name)
            return <div className={`${cl.image__img} ${imageBgStyle}`} key={image._id} style={{ gridColumn: files?.length === 2 ? 'span 2' : '' }} onClick={() => imageShow(image._id)}>
              {isLoadingImages[index] && <div className={cl.image__loader} />}
              <Image src={image._id} alt='image' fill unoptimized onLoad={() => setIsLoadingImages(prev => prev.map((state, i) => i === index ? false : state))} />
            </div>
          })}
        </div>
      </div>
    </MessagePrototype>
  )
}

export default ImageMessage