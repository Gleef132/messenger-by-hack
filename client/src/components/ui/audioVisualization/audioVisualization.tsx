'use client'
import { FC, useEffect, useRef, useState } from 'react'
import cl from './audioVisualization.module.scss'

const AudioVisualization: FC = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null)
  // const audioRef = useRef<HTMLAudioElement>(null)
  // const [audioData, setAudioData] = useState<Float32Array>()

  // useEffect(() => {
  //   fetch('http://localhost:5000/static/4ba40352-101d-413e-9e47-ff0b0b3a67da-audio.mp3')
  //     .then(response => response.arrayBuffer())
  //     .then(arrayBuffer => new AudioContext().decodeAudioData(arrayBuffer))
  //     .then(audioBuffer => {
  //       const audioData = audioBuffer.getChannelData(0)
  //       setAudioData(audioData)
  //       if (!canvasRef.current) return;
  //       if (!audioRef.current) return;
  //       drawAudio(canvasRef.current, audioData)
  //       audioRef.current.src = 'http://localhost:5000/static/4ba40352-101d-413e-9e47-ff0b0b3a67da-audio.mp3'
  //     })
  // }, [])

  // const drawAudio = (canvas: HTMLCanvasElement, audioData: Float32Array) => {
  //   const context = canvas.getContext('2d')
  //   if (!context) return;
  //   const width = canvas.width
  //   const height = canvas.height
  //   context.clearRect(0, 0, width, height)

  //   const sliceWidth = (width / audioData.length) - 5 // subtract 5px for spacing
  //   audioData.forEach((sample, index) => {
  //     if (!audioRef.current) return;
  //     const x = (sliceWidth + 5) * index // add 5px for spacing
  //     const y = (sample + 1) / 2 * height / 2 // divide by 2 to center vertically
  //     context.fillStyle = index < audioRef.current.currentTime / audioRef.current.duration * audioData.length ? '#800080' : '#000000'
  //     context.beginPath()
  //     context.moveTo(x, height / 2 - y) // move to center vertically
  //     context.lineTo(x + sliceWidth, height / 2 - y)
  //     context.lineTo(x + sliceWidth, height / 2 + y)
  //     context.lineTo(x, height / 2 + y)
  //     context.closePath()
  //     context.fill()
  //   })
  // }

  // const timeUpdate = () => {
  //   if (!canvasRef.current) return;
  //   if (!audioData) return;
  //   drawAudio(canvasRef.current, audioData)
  // }

  return (
    <>
      {/* <canvas ref={canvasRef} />
      <audio ref={audioRef} controls onTimeUpdate={timeUpdate} /> */}
    </>
  )
}

export default AudioVisualization