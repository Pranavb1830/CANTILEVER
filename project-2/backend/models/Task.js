const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo'
    },
    dueDate: {
        type: Date
    }
}, { timeStamps: true });

module.exports = mongoose.model('Task', TaskSchema);