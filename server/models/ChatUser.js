const { Schema, model } = require('mongoose')

const Messages = new Schema({
  // message: { type: String, require: true },
  // date: { type: String, require: true },
  // isRead: { type: Boolean, require: false, default: false },
  // isSend: { type: Boolean, require: false, default: true },
  // from: { type: String, require: true }
  message: { type: String, require: true },
  date: { type: String, require: true },
  isRead: { type: Boolean, require: false, default: false },
  isSend: { type: Boolean, require: false, default: true },
  from: { type: String, require: true },
  type: { type: String, require: true, default: 'text' },
  files: [
    {
      _id: { type: String, require: true },
      name: { type: String, require: true },
      size: { type: String, require: true },
    }
  ]
})

const User = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: false, default: 'https://www.shutterstock.com/image-vector/anime-style-game-avatar-mascot-600nw-2322112663.jpg' },
  isOnline: { type: Boolean, require: false, default: false },
  isTyping: { type: Boolean, require: false, default: false },
  isSecured: { type: Boolean, require: false, default: false },
  messages: { type: [Messages], require: false, default: [] },
  roles: [{ type: String, ref: 'Role' }]
})

module.exports = model('ChatUser', User)