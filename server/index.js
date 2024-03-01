require('dotenv').config()
const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const router = require('./routers/router')
const cors = require('cors')
const ws = require('ws')
const socketController = require('./controllers/socket-controller.js')
const userController = require('./controllers/user-controller')
const getId = require('./utils/get-id')
const path = require('path')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors());
app.use('/api', router)
app.use('/static', express.static(path.join(__dirname, 'static')))

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    server.listen(PORT, () => console.log(`server working! ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()

const wss = new ws.Server({
  server: server,
}, () => console.log(`websocket server starting on ${PORT}!`))


wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    const parseMessage = JSON.parse(message)
    console.log(parseMessage.event)
    switch (parseMessage.event) {
      case 'message':
        getId(parseMessage.token)
          .then(res => {
            socketController.message(parseMessage)
            if (parseMessage.clientIsOnline && parseMessage.from) {
              wss.clients.forEach(client => {
                if (client._id === parseMessage.clientId) {
                  client.send(JSON.stringify({ ...parseMessage, clientId: res }))
                }
              })
            }
          })
        break
      case 'connection':
        getId(parseMessage.token)
          .then(res => ws._id = res)
          .then(res => userController.userOnline(res, true))
        break
      case 'online':
        getId(parseMessage.token)
          .then(res => {
            wss.clients.forEach(client => {
              parseMessage.chatUsersIds.forEach(id => {
                if (client._id === id) {
                  client.send(JSON.stringify({
                    event: parseMessage.event,
                    isOnline: parseMessage.isOnline,
                    clientId: res
                  }))
                }
              })
            })
          })
        break
      case 'read':
        getId(parseMessage.token)
          .then(res => {
            wss.clients.forEach(client => {
              if (client._id === parseMessage.clientId) {
                client.send(JSON.stringify({ ...parseMessage, clientId: res }))
              }
            })
            return res
          })
        socketController.read(parseMessage.chatId)
        break
      case 'typing':
        getId(parseMessage.token)
          .then(res => {
            wss.clients.forEach(client => {
              if (client._id === parseMessage.clientId) {
                client.send(JSON.stringify({ ...parseMessage, clientId: res }))
              }
            })
          })
        break
      case 'offer':
        getId(parseMessage.token)
          .then(res => {
            wss.clients.forEach(client => {
              if (client._id === parseMessage.clientId) {
                client.send(JSON.stringify({
                  event: "offer",
                  offer: parseMessage.offer,
                  user: parseMessage.user,
                  clientId: res,
                }));
              }
            });
          })
        break;
      case 'answer':
        wss.clients.forEach(client => {
          if (client._id === parseMessage.clientId) {
            client.send(JSON.stringify({
              event: "answer",
              answer: parseMessage.answer,
            }));
          }
        });
        break;
      case 'candidate':
        wss.clients.forEach(client => {
          if (client._id === parseMessage.clientId) {
            client.send(JSON.stringify({
              event: "candidate",
              candidate: parseMessage.candidate,
            }));
          }
        });
        break;
      case 'leave':
        wss.clients.forEach(client => {
          if (client._id === parseMessage.clientId) {
            client.send(JSON.stringify({
              event: "leave",
            }));
          }
        });
        break;
    }
  })
  ws.on('close', () => {
    if (ws._id) {
      userController.userOnline(ws._id, false)
    }
  })
})