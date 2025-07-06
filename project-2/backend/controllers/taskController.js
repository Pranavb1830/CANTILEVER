const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.create({ user: req.user.userId, title, description, status, dueDate });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updated = await Task.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.findOneAndDelete({ _id: id, user: req.user.userId });
  res.json({ message: 'Task deleted' });
};