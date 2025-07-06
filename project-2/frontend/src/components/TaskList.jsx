import TaskCard from './TaskCard';
import '../styles/TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks.length) return <p>No tasks yet.</p>;

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;