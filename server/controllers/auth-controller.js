const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcrypt')

const generateAccessToken = (id, roles) => {
  const payload = { id, roles }
  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '8544h' })
}

class authController {

  async registration(req, res) {
    try {
      const { username, password, path } = req.body
      const candidate = await User.findOne({ username })
      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует!' })
      }
      const hashPassword = bcrypt.hashSync(password, 6)
      const userRole = await Role.findOne({ value: 'User' })
      const user = new User({ username, password: hashPassword, roles: [userRole.value], chats: [], isOnline: false, name: username,path })
      await user.save()
      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token, user: user })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Ошибка при регестрации' })
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: 'Такого пользователя не существует!' })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: 'Неверно введён пароль' })
      }
      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token, user: user })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Login error' })
    }
  }
}
module.exports = new authController()