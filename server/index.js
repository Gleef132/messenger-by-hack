require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const SOCKET_PORT = process.env.SOCKET_PORT || 8000
const app = express()
const router = require('./routers/router')
const cors = require('cors')
const ws = require('ws')
const socketController = require('./controllers/socket-controller.js')
const userController = require('./controllers/user-controller')
const getId = require('./utils/get-id')
const path = require('path')
// const fileUpload = require('express-fileupload')

app.options('*', (req, res) => {
  // Установите здесь необходимые заголовки CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});


app.use(cors({
  origin: true, // reflect (enable) the requested origin in the CORS response
  credentials: true, // allow cookies to be sent with the request
}));


// app.use(cors(corsOptions));
app.use(express.json())
// app.use(express.static('static'))
app.use('/api', router)
// app.use(fileUpload({}))
app.use('/static', express.static(path.join(__dirname, 'static')))

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    app.listen(PORT, () => console.log(`server working! ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()

const wss = new ws.Server({
  port: SOCKET_PORT,
}, () => console.log(`websocket server starting on ${SOCKET_PORT}!`))

wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    const parseMessage = JSON.parse(message)
    console.log(parseMessage.event)
    switch (parseMessage.event) {
      case 'message':
        socketController.message(parseMessage)
        if (parseMessage.clientIsOnline && parseMessage.from) {
          wss.clients.forEach(client => {
            if (client._id === parseMessage.clientId) {
              client.send(JSON.stringify(parseMessage))
            }
          })
        }
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
      // Add WebRTC events
      case 'offer':
        // Forward the offer to the other peer
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
        // Forward the answer to the other peer
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
        // Forward the ICE Candidate to the other peer
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
        // Notify the other user so they can close their connection
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