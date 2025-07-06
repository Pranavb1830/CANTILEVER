const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const { uploadPostImage } = require('../middleware/upload');

router.post('/', authMiddleware, uploadPostImage.single('image'), postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.get('/slug/:slug', postController.getPostBySlug);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.get('/user/:userId', postController.getPostsByUser);

router.post('/:id/like', authMiddleware, postController.toggleLike);
router.post('/:id/dislike', authMiddleware, postController.toggleDislike);

router.post('/:id/comments', authMiddleware, commentController.addComment);
router.get('/:id/comments', commentController.getComments);

router.post('/comments/:id/like', authMiddleware, commentController.toggleCommentLike);
router.post('/comments/:id/dislike', authMiddleware, commentController.toggleCommentDislike);
router.post('/comments/:id/replies', authMiddleware, commentController.addReply);

router.get('/genre/:genre', postController.getPostsByGenre);

module.exports = router;