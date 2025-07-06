import React from 'react';
import '../styles/TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}
      
      <p className="due-date">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(task._id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;