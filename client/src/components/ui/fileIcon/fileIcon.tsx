'use client'

import { FC } from 'react'
import { CloseSvg, DownloadSvg } from '@/components/svgs'
import cl from './fileIcon.module.scss'

interface IFileIconProps {
  name: string;
  text: string;
  isMyMessage: boolean;
  isDefault: boolean;
  isDownloading?: boolean;
  downloadHandle?: () => void;
  abortHandle?: () => void;
}

const FileIcon: FC<IFileIconProps> = ({ isMyMessage, name, text, isDefault, isDownloading, downloadHandle, abortHandle }) => {

  const type = name.split('.').pop() as string
  const hoverStyle = !downloadHandle && cl.no__hover
  const defaultStyle = isDefault && cl.default

  const types = {
    pdf: cl.red,
    zip: cl.orange,
    xlsx: cl.green,
    exe: defaultStyle,
    docx: defaultStyle,
  }[type] || ''

  return (
    <div className={isMyMessage ? `${cl.file} ${cl.my}` : cl.file}>
      <div className={`${cl.file__icon} ${cl.my} ${types} ${hoverStyle} ${defaultStyle}`} onClick={isDownloading ? abortHandle : downloadHandle}>
        <div className={cl.file__icon__text}>{type}</div>
        <div className={cl.file__icon__svg}>
          {isDownloading ? <CloseSvg /> : <DownloadSvg />}
        </div>
      </div>
      <div className={isDefault ? `${cl.file__info} ${cl.large}` : cl.file__info}>
        <p className={cl.file__name}>{name}</p>
        <p className={`${cl.file__text} text`}>{text}</p>
      </div>
    </div>
  )
}

export default FileIcon