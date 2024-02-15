'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { ISocketAnswer, ISocketCandidate, ISocketLeave, ISocketOffer, ISocketResponse } from '@/models/ISocket';
import { useSocket } from '@/api/use-socket';
import cl from './videoCall.module.scss';
import { CallSvg, MicroOffSvg, MicroOnSvg, VideoOffSvg, VideoOnSvg } from '../svgs';
import { getInitials } from '@/utils/getInitials';

interface IVideoCallProps {
  offer?: RTCSessionDescription;
  clientId?: string;
  path: string;
  name: string;
  _id: string;
}

const VideoCall: FC<IVideoCallProps> = ({ offer, name, path, _id, clientId }) => {

  const [isCalling, setIsCalling] = useState<boolean>(true);
  const [microActive, setMicroActive] = useState<boolean>(true)
  const [videoActive, setVideoActive] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const socket = useSocket({
    offerEvent: (message) => handleOffer(message.offer as RTCSessionDescriptionInit, message.clientId),
    answerEvent: (message) => handleAnswer(message.answer as RTCSessionDescriptionInit),
    candidateEvent: (message) => handleCandidate(message.candidate as RTCIceCandidateInit),
    leaveEvent: () => endCall()
  });

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [iceCandidates, setIceCandidates] = useState<RTCIceCandidate[]>([]);
  const peerConnection = useRef<RTCPeerConnection>(new RTCPeerConnection());
  // let candidatesQueue: RTCIceCandidateInit[] = [];

  const token = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`;
  const { username, path: myPath } = useAppSelector(state => state.userSlice)
  const isImage = path.includes('http')
  const gradient = path.split(' ').join(',')

  useEffect(() => {
    const setupMediaAndCall = (videoEnabled: boolean) => {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled,
      })
        .then(stream => {
          setLocalStream(stream);
          setVideoActive(videoEnabled)
          if (videoRef.current && videoEnabled) videoRef.current.srcObject = stream;
          // if (audioRef.current) audioRef.current.srcObject = stream;

          // peerConnection.current = new RTCPeerConnection();

          if (stream.getVideoTracks().length > 0) {
            // Если видео доступно, добавляем его в соединение
            stream.getVideoTracks().forEach(track => {
              console.log('add video track in useEffect')
              peerConnection.current?.addTrack(track, stream);
            });
          }
          stream.getAudioTracks().forEach(track => {
            console.log('add audio track in useEffect')
            peerConnection.current?.addTrack(track, stream);
          });
          console.log('whaf')
          peerConnection.current.onicecandidate = handleIceCandidate
          peerConnection.current.ontrack = handleTrackEvent;
          peerConnection.current.onconnectionstatechange = () => {
            if (peerConnection.current.connectionState === 'connected') {
              setIsCalling(false);
            }
          };
          // if (offer) {
          //   peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          //   return console.log('set remote');
          // }
          if (offer) return;
          peerConnection.current.createOffer()
            .then(offer => {
              peerConnection.current?.setLocalDescription(offer);
              const message: ISocketOffer = {
                token,
                clientId: _id,
                event: 'offer',
                offer: offer,
                user: {
                  path: myPath,
                  name: username,
                  _id,
                }
              };
              socket.sendMessage(message);
            });
        })
        .catch(() => {
          if (videoEnabled) {
            // Если пользователь не разрешил видео, пробуем только аудио
            setupMediaAndCall(false);
          }
        });
    };
    setupMediaAndCall(true);
  }, []);

  // const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
  //   console.log('trying pushIceCandidate')
  //   if (event.candidate) {
  //     console.log('pushIceCandidate')
  //     candidatesQueue.push(event.candidate);
  //   }
  // };

  useEffect(() => {
    if (peerConnection.current.signalingState === "stable" && iceCandidates.length > 0) {
      // Отправляем кандидатов ICE
      iceCandidates.forEach(candidate => {
        // Отправляем каждого кандидата через сигнализационный канал
        const message: ISocketCandidate = {
          token,
          candidate,
          clientId: clientId ? clientId : _id,
          event: 'candidate'
        };
        socket.sendMessage(message);
      });
      // Очищаем список кандидатов
      setIceCandidates([]);
    }
  }, [peerConnection.current.signalingState, iceCandidates]);


  const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      setIceCandidates(prev => [...prev, event.candidate as RTCIceCandidate]);
    }
  }

  // const handleTrackEvent = (event: RTCTrackEvent) => {
  //   if (!event.streams[0]) return;

  //   if (event.track.kind === 'video' && videoRef.current) {
  //     videoRef.current.srcObject = event.streams[0];
  //   }
  //   if (event.track.kind === 'audio' && audioRef.current) {
  //     audioRef.current.srcObject = event.streams[0];
  //     if (localStream && !localStream.getAudioTracks().includes(event.track)) {
  //       // Отключить локальную аудиодорожку
  //       event.streams[0].getAudioTracks()[0].enabled = false;
  //     }
  //   }
  // };
  const handleTrackEvent = (event: RTCTrackEvent) => {
    console.log('handleTrackEvent Not Working')
    if (!event.streams[0]) return;
    console.log('handleTrackEvent Working')

    if (event.track.kind === 'video' && videoRef.current) {
      videoRef.current.srcObject = event.streams[0];
    }
    console.log(event.track.kind, audioRef.current)
    if (event.track.kind === 'audio' && audioRef.current) {
      // Если дорожка является частью localStream, отключаем ее
      if (localStream && !localStream.getAudioTracks().includes(event.track)) {
        event.track.enabled = false;
      }
      console.log('Add audio in handleTrack')
      audioRef.current.srcObject = event.streams[0];
    }
  };

  const handleOffer = (offer: RTCSessionDescriptionInit, clientId: string) => {
    peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.current.createAnswer()
      .then(answer => {
        peerConnection.current.setLocalDescription(answer);
        const message: ISocketAnswer = {
          token,
          answer,
          clientId,
          event: 'answer'
        };
        socket.sendMessage(message);
      })
    // .then(() => {
    //   // Отправить все собранные ICE-кандидаты после отправки ответа
    //   candidatesQueue.forEach(candidate => {
    //     console.log('send ice candidate answer send')
    //     const message: ISocketCandidate = {
    //       token,
    //       candidate,
    //       clientId: _id,
    //       event: 'candidate'
    //     };
    //     socket.sendMessage(message);
    //   });
    //   candidatesQueue = [];
    // });
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => {
        // Отправить все собранные ICE-кандидаты после установки удаленного описания
        // candidatesQueue.forEach(candidate => {
        // console.log('send ice candidate answer handle')
        // candidatesQueue.forEach(candidate => {
        //   console.log('send candidate', candidate)
        //   const message: ISocketCandidate = {
        //     token,
        //     candidate,
        //     clientId: _id,
        //     event: 'candidate'
        //   };
        //   socket.sendMessage(message);
        // })
        // });
        // candidatesQueue = [];
      });
  };

  // const handleCandidate = (candidate: RTCIceCandidateInit) => {
  //   console.log('add ice candidate', candidate)
  //   peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  // }

  const handleCandidate = (candidate: RTCIceCandidateInit) => {
    console.log('add ice candidate', candidate)
    peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // const handleCandidate = (candidate: RTCIceCandidateInit) => {
  //   if (peerConnection.current.remoteDescription) {
  //     console.log('addIceCandidate', candidate)
  //     peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
  //     if (offer && clientId) {
  //       console.log('send ice candidate candidate handle')
  //       candidatesQueue.forEach(candidate => {
  //         console.log('send candidate', candidate)
  //         const message: ISocketCandidate = {
  //           token,
  //           candidate,
  //           clientId,
  //           event: 'candidate'
  //         };
  //         socket.sendMessage(message);
  //       })
  //       candidatesQueue = [];
  //     }
  //   } else {
  //     console.log('pushIceCandidate')
  //     candidatesQueue.push(candidate);
  //   }
  // };

  const answerCall = () => {
    if (offer && clientId) {
      handleOffer(offer, clientId)
      // setIsCalling(false)
    }
  }

  const endCall = () => {
    // Завершить звонок
    const message: ISocketLeave = {
      clientId: _id,
      event: 'leave',
      token
    };
    socket.sendMessage(message);
  };

  const toggleMicrophone = () => {
    // Включаем/выключаем микрофон
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setMicroActive(prev => !prev)
    }
  };

  const toggleVideo = () => {
    // Включаем/выключаем видео
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setVideoActive(prev => !prev)
    }
  };

  return (
    <div className={isCalling ? cl.video : `${cl.video} ${cl.fill}`} onClick={(e) => e.stopPropagation()}>
      <div className={cl.video__item}>
        {localStream && localStream.getVideoTracks().length ? (
          <video ref={videoRef} autoPlay />
        ) : (
          <div className={cl.video__avatar}>
            {isImage ?
              <img src={path} alt="Avatar" /> :
              <div className={cl.video__avatar__gradient} style={{ background: `linear-gradient(${gradient})` }}>{getInitials(name)}</div>
            }
            <div className={cl.video__text}>{name}</div>
          </div>
        )}
        <div className={cl.video__btns}>
          <button className={cl.video__btn} onClick={toggleMicrophone}>{microActive ? <MicroOnSvg /> : <MicroOffSvg />}</button>
          <button className={offer ? `${cl.video__btn} ${cl.green}` : `${cl.video__btn} ${cl.red}`} onClick={() => offer ? answerCall() : endCall()}><CallSvg /></button>
          <button className={cl.video__btn} disabled={!localStream?.getVideoTracks().length} onClick={toggleVideo}>{videoActive ? <VideoOnSvg /> : <VideoOffSvg />}</button>
        </div>
      </div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default VideoCall;


// const handleTrackEvent = (event: RTCTrackEvent) => {
//   if (videoRef.current && event.streams[0] && event.track.kind === 'video') {
//     videoRef.current.srcObject = event.streams[0];
//   }
//   if (audioRef.current && event.streams[0] && event.track.kind === 'audio') {
//     audioRef.current.srcObject = event.streams[0];
//   }
//   if (event.track.kind === 'audio' && audioRef.current) {
//     audioRef.current.srcObject = event.streams[0]
//   }
//   if (event.track.kind === 'audio') {
//     if (audioRef.current && localStream) {
//       if (event.streams[0] && !localStream.getAudioTracks().includes(event.track)) {
//         // Отключить локальную аудиодорожку
//         event.streams[0].getAudioTracks()[0].enabled = false;
//       }
//       audioRef.current.srcObject = event.streams[0];
//     }
//   }
// };

// const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
//   if (event.candidate) {
//     console.log('candidate event')
//     const message: ISocketCandidate = {
//       token,
//       candidate: event.candidate,
//       clientId: _id,
//       event: 'candidate'
//     };
//     socket.sendMessage(message);
//   }
// };

// const handleOffer = (offer: RTCSessionDescriptionInit, clientId: string) => {
//   peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
//   peerConnection.current.createAnswer()
//     .then(answer => {
//       const message: ISocketAnswer = {
//         token,
//         answer,
//         clientId,
//         event: 'answer'
//       };
//       socket.sendMessage(message);
//       console.log('send answer')
//       peerConnection.current.setLocalDescription(answer);
//     });
// };

// const handleOffer = (offer: RTCSessionDescriptionInit, clientId: string) => {
//   console.log('offer', offer)
//   peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
//     .then(() => {
//       return peerConnection.current.createAnswer();
//     })
//     .then((answer) => {
//       if (answer) {
//         const message: ISocketAnswer = {
//           token,
//           answer,
//           clientId,
//           event: 'answer'
//         };
//         return peerConnection.current.setLocalDescription(answer)
//           .then(() => {
//             socket.sendMessage(message);
//             console.log('send message')
//           });
//       }
//     })
//     .catch((error) => {
//       console.error('Ошибка при обработке предложения:', error);
//     });
// };

// const handleAnswer = (answer: RTCSessionDescriptionInit) => {
//   peerConnection.current.setRemoteDescription(answer);
//   setIsCalling(false);
// };

// const handleAnswer = (answer: RTCSessionDescriptionInit) => {
//   console.log('answer handle')
//   peerConnection.current.setRemoteDescription(answer);
//   setIsCalling(false);
//   candidatesQueue.forEach(candidate => {
//     peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
//   });
//   candidatesQueue = [];
// };
// const handleAnswer = (answer: RTCSessionDescriptionInit) => {
//   peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
//   candidatesQueue.forEach(candidate => {
//     peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
//   });
//   candidatesQueue = [];
// };

// const handleCandidate = (candidate: RTCIceCandidateInit) => {
//   peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
// };