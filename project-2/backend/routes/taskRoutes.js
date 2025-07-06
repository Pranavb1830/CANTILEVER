const express = require('express');
const { getTasks, createTask, updateTask, deleteTask} = require('../controllers/taskController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;