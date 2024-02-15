const { Schema, model } = require('mongoose')

const Message = new Schema({
  message: { type: String, require: true },
  date: {
    fullDate: { type: String, require: true },
    time: { type: String, require: true },
  },
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

module.exports = model('Message', Message)