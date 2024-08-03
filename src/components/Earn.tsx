import React, { useState, useEffect } from 'react';
import './Earn.css';

interface Task {
  id: number;
  type: 'calendar' | 'ui/ux' | 'product' | 'packaging' | 'mascot' | 'youtube' | 'telegram';
  title: string;
  icon: string;
  reward: number;
  completed: boolean;
}

interface DailyReward {
  day: number;
  reward: number;
  claimed: boolean;
}

const Earn: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      type: 'calendar',
      title: 'Daily Reward',
      icon: '/images/calendar-icon.png',
      reward: 200,
      completed: false
    },
    {
      id: 2,
      type: 'ui/ux',
      title: 'Friends',
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
    {
      id: 6,
      type: 'youtube',
      title: 'Subscribe to our YouTube',
      icon: '/images/youtube-icon.png',
      reward: 1500,
      completed: false
    },
    {
      id: 7,
      type: 'telegram',
      title: 'Subscribe to our second Telegram',
      icon: '/images/telegram-icon.png',
      reward: 1500,
      completed: false
    },
  ]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);

  useEffect(() => {
    const storedRewards = localStorage.getItem('dailyRewards');
    const storedLastClaimTime = localStorage.getItem('lastClaimTime');
    const storedCurrentDay = localStorage.getItem('currentDay');

    if (storedRewards) {
      setDailyRewards(JSON.parse(storedRewards));
    } else {
      const initialRewards = Array.from({ length: 10 }, (_, index) => ({
        day: index + 1,
        reward: (index + 1) * 100,
        claimed: false
      }));
      setDailyRewards(initialRewards);
      localStorage.setItem('dailyRewards', JSON.stringify(initialRewards));
    }

    if (storedLastClaimTime) {
      const lastClaim = parseInt(storedLastClaimTime, 10);
      setLastClaimTime(lastClaim);
    }

    if (storedCurrentDay) {
      setCurrentDay(parseInt(storedCurrentDay, 10));
    }
  }, []);

  const handleTaskComplete = (task: Task) => {
    if (task.type === 'calendar') {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
    setShowConfirmation(true);
  };

  const confirmTaskCompletion = () => {
    if (selectedTask) {
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? { ...task, completed: true } : task
      ));
      closeConfirmation();
    }
  };

  const claimDailyReward = () => {
    const now = Date.now();
    if (lastClaimTime === null || now - lastClaimTime > 24 * 60 * 60 * 1000) {
      const updatedRewards = dailyRewards.map(reward =>
        reward.day === currentDay ? { ...reward, claimed: true } : reward
      );
      setDailyRewards(updatedRewards);
      localStorage.setItem('dailyRewards', JSON.stringify(updatedRewards));
      setLastClaimTime(now);
      localStorage.setItem('lastClaimTime', now.toString());

      if (currentDay < 10) {
        const newDay = currentDay + 1;
        setCurrentDay(newDay);
        localStorage.setItem('currentDay', newDay.toString());
      } else {
        setCurrentDay(1);
        localStorage.setItem('currentDay', '1');
        const resetRewards = dailyRewards.map(reward => ({ ...reward, claimed: false }));
        setDailyRewards(resetRewards);
        localStorage.setItem('dailyRewards', JSON.stringify(resetRewards));
      }
    }
    closeConfirmation();
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedTask(null);
  };

  const isRewardAvailable = lastClaimTime === null || Date.now() - lastClaimTime > 24 * 60 * 60 * 1000;

  return (
    <div className="earn-container">
      <div className="earn-content">
        <h1>My Tasks</h1>

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
      </div>

      {showConfirmation && (
        <div className="confirmations-overlay1">
          <div className="confirmations-modal1">
            <button className="close-button1" onClick={closeConfirmation}>×</button>
            {selectedTask && selectedTask.type !== 'calendar' ? (
              <>
                <img src="/images/tap1.png" alt="Tap" className="multitap-image1"/>
                <div className="multitap-info1">
                  Confirm completion
                </div>
                <div className="task-info">
                  <h3>{selectedTask.title}</h3>
                  <div className="task-reward">
                    <img src="/images/coin-icon.png" alt="Coin" className="coin-icon1"/>
                    <span>+{selectedTask.reward}</span>
                  </div>
                </div>
                <button
                  className="confirms-button1"
                  onClick={confirmTaskCompletion}
                >
                  Confirm
                </button>
              </>
            ) : (
              <>
                <img src="/images/calendar-icon.png" alt="Calendar" className="multitap-image1"/>
                <div className="multitap-info1">
                  Daily Reward
                </div>
                <div className="daily-rewards-grid">
                  {dailyRewards.slice(0, 10).map(reward => (
                    <div
                      key={reward.day}
                      className={`daily-reward ${reward.claimed ? 'claimed' : ''} ${currentDay === reward.day ? 'current' : ''}`}
                    >
                      <span className="day">Day {reward.day}</span>
                      <span className="reward">+{reward.reward}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`confirms-button1 ${!isRewardAvailable ? 'claimed' : ''}`}
                  onClick={claimDailyReward}
                  disabled={!isRewardAvailable}
                >
                  {isRewardAvailable ? 'Claim Reward' : 'Reward Claimed'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Earn;