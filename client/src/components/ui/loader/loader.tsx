import { FC } from 'react'
import cl from './loader.module.scss'

const Loader: FC = () => {
  return (
    <div className={cl.loader}><div></div><div></div></div>
  )
}

export default Loader