const User = require('../models/User')
const Chat = require('../models/Chat')
const getId = require('../utils/get-id')

const sortUsers = async (users, usersId, myId) => {
  const result = []
  for (let i = 0; i < usersId.length; i++) {
    const id = usersId[i]
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
      if (JSON.stringify(id) === JSON.stringify(user._id)) {
        let chatId;
        let isSecured;
        for (let k = 0; k < user.chats.length; k++) {
          const chat = user.chats[k];
          if (JSON.stringify(chat._id) === JSON.stringify(myId)) {
            chatId = chat.chatId
            isSecured = chat.isSecured
          }
        }
        const chat = await Chat.findById(chatId)
        user.messages = chat.messages
        user.chatId = chatId
        user.isSecured = isSecured || user.isSecured
        result.push(user)
        break
      }
    }
  }
  return result
}

class UserController {

  async getChatUsers(req, res) {
    try {
      let id;
      await getId(req.headers.authorization).then(res => id = res)
      const user = await User.findById(id)
      const usersId = user.chats.map(user => user._id)
      const users = await User.find({ _id: { $in: usersId } })
      if (!users) {
        return res.json([])
      }
      const sortedUsers = await sortUsers(users, usersId, id);
      return res.json(sortedUsers)
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Get Error' })
    }
  }

  async getUser(req, res) {
    try {
      let id;
      await getId(req.headers.authorization).then(res => id = res)
      const user = await User.findById(id)
      return res.json(user)
    } catch (e) {
      res.status(400).json({ message: 'Get Error' })
    }
  }

  async getSearchUser(req, res) {
    try {
      const searchData = decodeURI(req.headers.search) || '';
      const id = await getId(req.headers.authorization)
      let limit = 6;
      const users = await User.find({
        _id: { $ne: id },
        "$or": [
          { username: { $regex: searchData, $options: 'i' } },
          { name: { $regex: searchData, $options: 'i' } },
        ],
      }).limit(limit)
      return res.json(users)
    } catch (error) {
      res.status(400).json({ message: 'Search Error' })
    }
  }

  async userOnline(id, state) {
    try {
      await User.findByIdAndUpdate(id, {
        $set: {
          isOnline: state,
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

module.exports = new UserController()