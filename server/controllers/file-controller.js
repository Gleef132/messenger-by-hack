const fs = require('fs')

class fileController {

  async uploadFile(req, res) {
    try {
      return res.status(200).json({ id: process.env.SERVER_URL + '/' + req.file.path })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Upload file error' })
    }
  }

  async downloadFile(req, res) {
    try {
      const file = req.query.id.replace(process.env.SERVER_URL + '/','')
      const name = req.query.name
      if(fs.existsSync(file)){
        return res.download(file,name)
      }
      return res.status(400).json({ message: 'Download error' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Download error' })
    }
  }
}
module.exports = new fileController()