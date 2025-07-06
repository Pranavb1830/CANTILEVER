const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id,
      username: user.username,
      profilePhoto: user.profilePhoto || null
    });

  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
        token,
        userId: user._id,
        username: user.username,
        profilePhoto: user.profilePhoto || null
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.uploadProfilePhoto = async (req, res) => {
  console.log('uploadProfilePhoto → req.user:', req.user);
  console.log('uploadProfilePhoto → req.file:', req.file);

  try {
    const user = await User.findById(req.user.userId);
    console.log('uploadProfilePhoto → Found user:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      console.log('uploadProfilePhoto → No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    console.log('uploadProfilePhoto → Updated user:', user);

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: user.profilePhoto
    });
  } catch (error) {
    console.error('uploadProfilePhoto → Error:', error);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ author: user._id });

    const isOwner = req.user && req.user.userId === user._id.toString();

    res.json({
      username: user.username,
      email: isOwner ? user.email : null, 
      profilePhoto: user.profilePhoto,
      posts: posts
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};