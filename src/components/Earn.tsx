import React from 'react';
import './Earn.css';

interface Task {
  id: number;
  platform: string;
  reward: number;
  completed: boolean;
}

const Earn: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, platform: 'Telegram', reward: 100, completed: false },
    { id: 2, platform: 'YouTube', reward: 150, completed: false },
    { id: 3, platform: 'Instagram', reward: 200, completed: false },
  ]);

  const handleTaskComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));
    // Тут можна додати логіку для нарахування винагороди
  };

  return (
    <div className="earn-container">
      <h1>Заробляй монети</h1>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <img src={`/images/${task.platform.toLowerCase()}-icon.png`} alt={task.platform} />
            <div className="task-info">
              <h2>Підпишись на {task.platform}</h2>
              <p>Винагорода: {task.reward} монет</p>
            </div>
            <button
              onClick={() => handleTaskComplete(task.id)}
              disabled={task.completed}
            >
              {task.completed ? 'Виконано' : 'Виконати'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;