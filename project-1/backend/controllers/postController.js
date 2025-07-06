const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  console.log('REQ BODY:', req.body);
  console.log('REQ FILE:', req.file);

  try {
    // ✅ Parse the genres JSON string if present, fallback to ["General"]
    const parsedGenres = req.body.genres
      ? JSON.parse(req.body.genres)
      : ["General"];

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      genres: parsedGenres, // ✅ store genres in DB!
      author: req.user.userId,
      image: req.file ? `/uploads/posts/${req.file.filename}` : null,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('dislikes', 'username');

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentsCount
        };
      })
    );

    res.json(postsWithCommentsCount);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comments = await Comment.find({ post: post._id }).populate('author', 'username');

    res.json({ post, comments });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post' });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username')
      .populate('likes', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comments = await Comment.find({ post: post._id }).populate('author', 'username');

    res.json({ post, comments });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post by slug' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: post._id });

    res.json({ message: 'Post and related comments deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.userId;

    const dislikeIndex = post.dislikes.indexOf(userId);
    if (dislikeIndex !== -1) {
      post.dislikes.splice(dislikeIndex, 1);
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('likes', 'username');

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username');

    res.json({ post: populatedPost, comments });
  } catch (err) {
    res.status(500).json({ error: 'Error toggling like' });
  }
};

exports.toggleDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.userId;

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
    }

    const dislikeIndex = post.dislikes.indexOf(userId);
    if (dislikeIndex === -1) {
      post.dislikes.push(userId);
    } else {
      post.dislikes.splice(dislikeIndex, 1);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('likes', 'username');

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username');

    res.json({ post: populatedPost, comments });
  } catch (err) {
    res.status(500).json({ error: 'Error toggling dislike' });
  }
}

exports.getPostsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({ author: userId })
      .populate('author', 'username')
      .populate('likes', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user posts' });
  }
};

exports.getPostsByGenre = async (req, res) => {
  const genre = req.params.genre;

  try {
    const posts = await Post.find({ genres: genre })
      .populate('author', 'username')
      .populate('likes', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts by genre' });
  }
};