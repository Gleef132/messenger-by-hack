'use client'

import { FC, useEffect, useState } from 'react'
import cl from './timer.module.scss'

const Timer: FC = () => {
  const [time, setTime] = useState(0);


  useEffect(() => {
    let intervalId = setInterval(() => setTime(time + 1), 10);
    return () => clearInterval(intervalId);
  }, [time]);

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className={cl.timer}>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds},{milliseconds < 10 ? `0${milliseconds}` : milliseconds}
    </div>
  )
}

export default Timer