export const waitForConnection = (socket: WebSocket, callback: () => any, interval: number) => {
  if (socket.readyState === 1) {
    return callback()
  } else {
    setTimeout(() => {
      waitForConnection(socket, callback, interval)
    }, interval);
  }
}