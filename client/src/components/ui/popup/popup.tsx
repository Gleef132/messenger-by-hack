'use client'
import { FC, PropsWithChildren } from 'react'
import cl from './popup.module.scss'
import { popupSlice } from '@/store/reducers/PopupSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'

const Popup: FC<PropsWithChildren> = () => {

  const { hiddenPopup } = popupSlice.actions
  const { isActive, children, isCloseShow } = useAppSelector(state => state.popupSlice)
  const dispatch = useAppDispatch()

  return (
    <div className={isActive ? `${cl.popup} ${cl.active}` : cl.popup} onClick={() => dispatch(hiddenPopup())}>
      <div style={{ display: isCloseShow ? 'flex' : 'none' }} className={cl.popup__close} onClick={() => dispatch(hiddenPopup())}></div>
      {children}
    </div>
  )
}

export default Popup