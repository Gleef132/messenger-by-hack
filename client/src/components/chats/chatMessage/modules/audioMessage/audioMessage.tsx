'use client'

import { CheckReadSvg, CheckSendSvg, MessageVectorSvg, PauseSvg, PlaySvg } from '@/components/svgs';
import { useRef, useEffect, useState, FC } from 'react';
import WaveSurfer from 'wavesurfer.js';
import cl from './audioMessage.module.scss'
import { IChatMessageProps } from '@/models/IMessage';
import { useAppSelector } from '@/hooks/redux';

const AudioMessage: FC<IChatMessageProps> = ({ vectorCondition, isMyMessage, time, isRead, message }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();
  const { theme } = useAppSelector(state => state.themeSlice)

  useEffect(() => {
    if (waveformRef.current) {
      const currentWavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: theme === 'dark' ? 'silver' : 'black',
        progressColor: theme === 'dark' ? 'purple' : 'blue',
        cursorWidth: 0,
        url: message,
        barWidth: 3,
        width: '100%',
        height: 'auto',
        barRadius: 4,
        hideScrollbar: true,
        barAlign: 'bottom'
      });

      currentWavesurfer.on('ready', () => {
        setDuration(currentWavesurfer.getDuration());
      });

      currentWavesurfer.on('finish', () => {
        setIsPlaying(false);
      });

      setWavesurfer(currentWavesurfer);
      return () => {
        currentWavesurfer.destroy();
        setIsPlaying(false);
      };
    }
  }, [theme]);

  const handlePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.playPause();
        setIsPlaying(false);
      } else {
        wavesurfer.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className={isMyMessage ? `${cl.message} ${cl.right}` : `${cl.message} ${cl.left}`}>
      <button onClick={handlePlayPause} className={cl.message__btn}>
        {isPlaying ?
          <div className={cl.message__btn__svg}>
            <PauseSvg />
          </div> :
          <div className={`${cl.message__btn__svg} ${cl.right}`}>
            <PlaySvg />
          </div>}
      </button>
      <div className={cl.message__content}>
        <div className={cl.message__bar} id="waveform" ref={waveformRef} />
        <div className={cl.message__info}>
          <div className={cl.message__duration}>{duration}</div>
          <div className={cl.message__time}>
            {time}
            {isMyMessage ? isRead ? <CheckReadSvg /> : <CheckSendSvg /> : null}
          </div>
        </div>
      </div>
      {vectorCondition && (
        <div className={`${cl.message__vector} ${isMyMessage ? cl.right : cl.left}`}>
          <MessageVectorSvg />
        </div>
      )}
    </div>
  );
};

export default AudioMessage;
