const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const {uploadProfilePhoto} = require('../middleware/upload');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/upload-photo', authMiddleware, uploadProfilePhoto.single('photo'), authController.uploadProfilePhoto);

router.get('/user/:id', authMiddleware,authController.getUserById);

router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;