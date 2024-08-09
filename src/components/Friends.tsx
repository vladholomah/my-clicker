import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Friends.css';

interface Friend {
  telegramId: string;
  coins: number;
}

interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface WebApp {
  initDataUnsafe: {
    user?: WebAppUser;
    query_id?: string;
  };
  openTelegramLink: (url: string) => void;
}

// Заглушка для WebApp
const MockWebApp: WebApp = {
  initDataUnsafe: {
    user: {
      id: 12345,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser'
    },
    query_id: 'mock_query_id'
  },
  openTelegramLink: (url: string) => {
    console.log('Opening Telegram link:', url);
    window.open(url, '_blank');
  }
};

// Використовуємо реальний WebApp в Telegram, або заглушку в браузері
const WebApp: WebApp = (window as any).Telegram?.WebApp || MockWebApp;

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const userId = WebApp.initDataUnsafe.user?.id.toString();
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await axios.get(`/api/getFriends?userId=${userId}`);
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        setError('Не вдалося завантажити список друзів. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleInviteFriend = () => {
    const userId = WebApp.initDataUnsafe.user?.id.toString();
    const referralLink = `https://t.me/holmah_coin_bot?start=${userId}`;
    if (WebApp.initDataUnsafe.query_id) {
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
    } else {
      // Заглушка для браузера
      alert(`Скопіюйте це посилання для запрошення друга: ${referralLink}`);
    }
  };

  if (loading) {
    return <div className="friends-container">Завантаження...</div>;
  }

  if (error) {
    return <div className="friends-container">{error}</div>;
  }

  return (
    <div className="friends-container">
      <h2 className="friends-heading">Ваші друзі</h2>
      <button onClick={handleInviteFriend} className="friends-button">
        Запросити друга
      </button>
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.telegramId} className="friends-list-item">
              Користувач {friend.telegramId}: {friend.coins} монет
            </li>
          ))}
        </ul>
      ) : (
        <p className="friends-text">У вас поки немає запрошених друзів.</p>
      )}
    </div>
  );
};

export default Friends;