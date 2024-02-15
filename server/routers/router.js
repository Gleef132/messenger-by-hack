const Router = require('express')
const router = new Router()
const authController = require('../controllers/auth-controller')
const userController = require('../controllers/user-controller')
const fileController = require('../controllers/file-controller')
const fileMiddleware = require('../middleware/file');

router.post('/registration', authController.registration)
router.post('/login', authController.login)
router.post('/upload', fileMiddleware.single('file'), fileController.uploadFile)
router.get('/user', userController.getUser)
router.get('/download', fileController.downloadFile)
router.post('/change-user')
router.post('/delete-message')
router.get('/chat-users', userController.getChatUsers)
router.get('/search', userController.getSearchUser)

module.exports = router