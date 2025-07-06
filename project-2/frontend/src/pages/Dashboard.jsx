import { useEffect, useState } from 'react';
import API from '../api/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    }
  };

  const handleAddOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await API.put(`/tasks/${editingTask._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        setEditingTask(null);
      } else {
        const res = await API.post('/tasks', taskData);
        setTasks((prev) => [...prev, res.data]);
      }

      setShowForm(false);
    } catch (err) {
      console.error('Save task error:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Tasks</h2>

      {!showForm && (
        <button className="create-task-btn" onClick={() => setShowForm(true)}>
          + Create Task
        </button>
      )}

      {showForm && (
        <>
          <TaskForm
            onSubmit={handleAddOrUpdateTask}
            initialData={editingTask}
            submitLabel={editingTask ? 'Update Task' : 'Add Task'}
          />
          <button
            className="cancel-edit-btn"
            onClick={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          >
            Cancel
          </button>
        </>
      )}

      <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
    </div>
  );
};

export default Dashboard;