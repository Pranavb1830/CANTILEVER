const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const comment = new Comment({
      post: id,
      author: userId,
      content
    });

    await comment.save();

    await comment.populate('author', 'username');

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};


exports.getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ post: id }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

exports.toggleCommentLike = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    await comment.populate('author', 'username');

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error toggling like" });
  }
};

exports.toggleCommentDislike = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const index = comment.dislikes.indexOf(userId);
    if (index === -1) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.dislikes.splice(index, 1);
    }

    await comment.save();
    await comment.populate('author', 'username');

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error toggling dislike" });
  }
};

exports.addReply = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user.userId;
  const { content } = req.body;

  const parentComment = await Comment.findById(id);
  if (!parentComment) return res.status(404).json({ error: 'Parent comment not found' });

  const reply = new Comment({
    post: parentComment.post,
    author: userId,
    content,
    parent: parentComment._id
  });

  await reply.save();
  await reply.populate('author', 'username');

  res.status(201).json(reply);
};