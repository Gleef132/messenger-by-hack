const fs = require('fs')
const multer = require('multer')
const Uuid = require('uuid')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync('static')) {
      fs.mkdirSync('static')
    }
    cb(null, 'static/')
  },
  filename(req, file, cb) {
    const id = Uuid.v4()
    cb(null, id + '.' + file.originalname.split('.').pop())
  }
})


module.exports = multer({ storage })