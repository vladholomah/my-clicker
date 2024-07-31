import React, { useState } from 'react';
import './Earn.css';

interface Task {
  id: number;
  type: 'youtube' | 'daily' | 'telegram' | 'twitter' | 'instagram';
  title: string;
  reward: number;
  icon: string;
  completed: boolean;
}

const Earn: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      type: 'youtube',
      title: 'Watch our latest video',
      reward: 100000,
      icon: '/images/youtube-icon.png',
      completed: false
    },
    {
      id: 2,
      type: 'daily',
      title: 'Daily login reward',
      reward: 6649000,
      icon: '/images/calendar-icon.png',
      completed: false
    },
    {
      id: 3,
      type: 'telegram',
      title: 'Join our Telegram',
      reward: 50000,
      icon: '/images/telegram-icon.png',
      completed: false
    },
    {
      id: 4,
      type: 'twitter',
      title: 'Follow us on Twitter',
      reward: 75000,
      icon: '/images/twitter-icon.png',
      completed: false
    },
    {
      id: 5,
      type: 'instagram',
      title: 'Like our Instagram post',
      reward: 60000,
      icon: '/images/instagram-icon.png',
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

  const getTaskTitle = (type: string) => {
    switch (type) {
      case 'youtube':
        return 'Task YouTube';
      case 'telegram':
        return 'Task Telegram';
      case 'twitter':
        return 'Task Twitter';
      case 'instagram':
        return 'Task Instagram';
      default:
        return 'Daily Tasks';
    }
  };

  return (
    <div className="earn-container">
      <img src="/images/earn-coin.png" alt="Earn Coin" className="earn-coin-image"/>
      <h1>Earn more coins</h1>

      {['youtube', 'daily', 'telegram', 'twitter', 'instagram'].map((type) => (
        <div key={type} className="task-section">
          <h2>{getTaskTitle(type)}</h2>
          <div className="tasks-list1">
            {tasks.filter(task => task.type === type).map(task => (
              <div key={task.id} className="task-item1" onClick={() => handleTaskComplete(task)}>
                <img src={task.icon} alt={task.title} className="task-icon1" />
                <div className="task-info1">
                  <h3>{task.title}</h3>
                  <div className="reward-info1">
                    <img src="/images/coin-icon.png" alt="Coin" className="reward-icon1"/>
                    <span>+{task.reward.toLocaleString()}</span>
                  </div>
                </div>
                <img src="/images/arrow-right.png" alt="Complete" className="complete-icon1"/>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showConfirmation && selectedTask && (
        <div className="confirmations-overlay1">
          <div className="confirmations-modal1">
            <button className="close-button1" onClick={() => setShowConfirmation(false)}>×</button>
            <img src="/images/tap1.png" alt="Tap" className="multitap-image1"/>
            <div className="multitap-info1">
              Підтвердити виконання
            </div>
            <div className="reward-info1">
              <img src="/images/coin-icon.png" alt="Coin" className="reward-icon1"/>
              <span>+{selectedTask.reward.toLocaleString()} coins</span>
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