const User = require('../models/User')
const Message = require('../models/Message')
const Chat = require('../models/Chat')
const jwt = require('jsonwebtoken')

const isChatExist = (chats, id) => {
  return chats.find(user => JSON.stringify(user._id) === JSON.stringify(id))
}

const readingMessages = (messages) => {
  const result = []
  messages.forEach(message => {
    if (message) {
      message.isRead = true;
      result.push(message)
    }
  })
  return result
}

class socketController {

  async message(message) {
    try {
      const { clientId, date, from, token, type, files } = message
      const decodeIdData = jwt.verify(token.split(' ')[1], process.env.SECRET_JWT)
      const id = decodeIdData.id
      const user = await User.findById(id)
      const client = await User.findById(clientId)

      const newMessage = new Message({ date, from, message: message.message, type, files: files ? files : [] })
      const newChat = new Chat({ messages: [newMessage] })
      let userChats = user.chats
      let clientChats = client.chats
      const chat = isChatExist(user.chats, clientId)
      if (chat) {
        userChats.sort(user => JSON.stringify(user._id) === JSON.stringify(clientId) ? -1 : 1);
        clientChats.sort(user => JSON.stringify(user._id) === JSON.stringify(id) ? -1 : 1);
        const messages = await Chat.findById(chat.chatId)
        messages.messages.push(newMessage)
        await messages.save()
      } else {
        userChats = [{ _id: clientId, isSecured: false, chatId: newChat.id }, ...userChats]
        clientChats = [{ _id: id, isSecured: false, chatId: newChat.id }, ...clientChats]
        newChat.save()
      }
      await User.findByIdAndUpdate(clientId, {
        $set: {
          chats: clientChats
        }
      }, {
        new: true,
        useFindAndModify: false
      })
      await User.findByIdAndUpdate(id, {
        $set: {
          chats: userChats
        }
      }, {
        new: true,
        useFindAndModify: false
      })
    } catch (error) {
      return error
    }
  }
  async read(chatId) {
    try {
      const chat = await Chat.findById(chatId)
      const readedMessages = readingMessages(chat.messages)
      await Chat.findByIdAndUpdate(chatId, {
        $set: {
          messages: readedMessages
        }
      }, {
        new: true,
        useFindAndModify: false
      })
    } catch (error) {
      return error
    }
  }

}

module.exports = new socketController()