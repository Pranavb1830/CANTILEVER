const multer = require('multer');
const path = require('path');

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadProfilePhoto = multer({ storage: profileStorage });

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadPostImage = multer({ storage: postStorage });

module.exports = {
  uploadProfilePhoto,
  uploadPostImage,
};