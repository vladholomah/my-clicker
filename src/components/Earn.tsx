import React, { useState } from 'react';
import './Earn.css';

interface Task {
  id: number;
  type: 'sketch' | 'ui/ux' | 'product' | 'packaging' | 'mascot';
  title: string;
  icon: string;
  reward: number;
  completed: boolean;
}

const Earn: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      type: 'sketch',
      title: 'YouTube',
      icon: '/images/sketch-icon.png',
      reward: 100,
      completed: false
    },
    {
      id: 2,
      type: 'ui/ux',
      title: 'Telegram',
      icon: '/images/ui-ux-icon.png',
      reward: 200,
      completed: false
    },
    {
      id: 3,
      type: 'product',
      title: 'Subscribe to our X',
      icon: '/images/product-icon.png',
      reward: 3000,
      completed: false
    },
    {
      id: 4,
      type: 'packaging',
      title: 'Subscribe to our Telegram',
      icon: '/images/packaging-icon.png',
      reward: 2500,
      completed: false
    },
    {
      id: 5,
      type: 'mascot',
      title: 'Subscribe to our Instagram',
      icon: '/images/mascot-icon.png',
      reward: 1500,
      completed: false
    },
  ]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskComplete = (task: Task) => {
    setSelectedTask(task);
    setShowConfirmation(true);
  };

  const confirmTaskCompletion = () => {
    if (selectedTask) {
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? { ...task, completed: true } : task
      ));
      setShowConfirmation(false);
    }
  };

  return (
    <div className="earn-container">
      <h1>My Task</h1>

      <div className="task-buttons">
        {tasks.slice(0, 2).map(task => (
          <button
            key={task.id}
            className={`task-button ${task.type}`}
            onClick={() => handleTaskComplete(task)}
          >
            <img src={task.icon} alt={task.title} className="task-icon"/>
            <div className="task-button-content">
              <div className="task-title-reward">
                <span className="task-title">{task.title}</span>
                <div className="task-reward-button">
                  <img src="/images/coin-icon.png" alt="Coin" className="coin-icon-button"/>
                  <span className="coin-amount-button">+{task.reward}</span>
                </div>
              </div>
              <img src="/images/arrow-right1.png" alt="Arrow" className="arrow-icon12"/>
            </div>
          </button>
        ))}
      </div>

      <div className="task-section">
        <h2>Pending</h2>
        <div className="tasks-list1">
          {tasks.slice(2).map(task => (
            <div key={task.id} className="task-item1" onClick={() => handleTaskComplete(task)}>
              <img src={task.icon} alt={task.title} className="task-icon1"/>
              <div className="task-info1">
                <h3>{task.title}</h3>
                <div className="task-reward1">
                  <img src="/images/coin-icon.png" alt="Coin" className="coin-icon1"/>
                  <span className="coin-amount1">+{task.reward}</span>
                </div>
              </div>
              <img src="/images/arrow-right.png" alt="Arrow" className="arrow-icon1"/>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && selectedTask && (
        <div className="confirmations-overlay1">
          <div className="confirmations-modal1">
            <button className="close-button1" onClick={() => setShowConfirmation(false)}>×</button>
            <img src="/images/tap1.png" alt="Tap" className="multitap-image1"/>
            <div className="multitap-info1">
              Підтвердити виконання
            </div>
            <div className="task-info">
              <h3>{selectedTask.title}</h3>
              <div className="task-reward">
                <img src="/images/coin-icon.png" alt="Coin" className="coin-icon11"/>
                <span>+{selectedTask.reward}</span>
              </div>
            </div>
            <button
              className="confirms-button1"
              onClick={confirmTaskCompletion}
            >
              Підтвердити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earn;