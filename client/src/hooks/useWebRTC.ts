// import { useEffect, useState, useRef, useCallback, ReactNode } from 'react'
// import useStateWithCallback from './useStateWithCallback'
// import { useAppSelector } from './redux';
// import { useSocket } from '@/api/use-socket';

// interface ClientList {
//   [id: string]: ReactNode | null;
// }

// export function useWebRTC(id: string){
//   const [clients, setClients] = useStateWithCallback<string[]>([]);
//   const socket = useSocket()

//   const addNewClient = useCallback((newClient: string, callback: () => void) => {
//     if(!clients.includes(newClient)){
//       setClients(list => [...list, newClient], callback)
//     }
//   }, [clients, setClients])

//   const peerConnection = useRef<RTCPeerConnection | null>(null)
//   const localMediaStream = useRef<MediaStream | null>(null)
//   const peerMediaElements = useRef<ClientList>({
//     'LOCAL_VIDEO': null
//   })

//   useEffect(() => {
//     const startCapture = async () => {
//       localMediaStream.current = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         // video: true
//       })

//       addNewClient('LOCAL_VIDEO', () => {
//         const localVideoElement = peerMediaElements.current['LOCAL_VIDEO'] as HTMLVideoElement | undefined;
      
//         if(localVideoElement && 'srcObject' in localVideoElement){
//           localVideoElement.volume = 0;
//           localVideoElement.srcObject = localMediaStream.current;
//         }
//       });    
      
      
//     }

//     startCapture().then(() => socket.sendMessage(id))
//   }, [id])

//   const provideMediaRef = useCallback((id: string, node: ReactNode) => {
//     peerMediaElements.current[id] = node
//   }, [])

//   return {
//     clients,
//     provideMediaRef
//   }
// }
