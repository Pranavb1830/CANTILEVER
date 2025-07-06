import { useState, useEffect } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ onSubmit, initialData = {}, submitLabel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setStatus(initialData?.status || 'todo');
    setDueDate(initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, dueDate });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">{submitLabel || 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;