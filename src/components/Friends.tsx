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

const isTelegramWebAppAvailable = !!(window as any).Telegram?.WebApp;
console.log('Is Telegram WebApp available:', isTelegramWebAppAvailable);

const WebApp: WebApp = isTelegramWebAppAvailable ? (window as any).Telegram.WebApp : MockWebApp;

console.log('WebApp initDataUnsafe:', WebApp.initDataUnsafe);

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Friends component mounted');
const fetchFriends = async () => {
  console.log('Starting fetchFriends function');
  try {
    setLoading(true);
    let userId: string | undefined;

    if (WebApp.initDataUnsafe.user?.id) {
      userId = WebApp.initDataUnsafe.user.id.toString();
    } else if (MockWebApp.initDataUnsafe.user?.id) {
      console.log('Using MockWebApp user ID');
      userId = MockWebApp.initDataUnsafe.user.id.toString();
    }

    console.log('User ID:', userId);

    if (!userId) {
      throw new Error('User ID not found');
    }

const response = await axios.get(`https://my-clicker-tau.vercel.app//api/getFriends`, {
  params: { userId },
  headers: {
    'Content-Type': 'application/json',
  },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    console.log('Received response:', response.data);
    setFriends(response.data.friends);
  } catch (error: unknown) {
        console.error('Error in fetchFriends:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', error.response?.data);
          setError(`Помилка завантаження: ${error.response?.status} ${error.response?.statusText}`);
        } else if (error instanceof Error) {
          setError(`Не вдалося завантажити список друзів: ${error.message}`);
        } else {
          setError('Не вдалося завантажити список друзів: Невідома помилка');
        }
      } finally {
        setLoading(false);
        console.log('fetchFriends function completed');
      }
    };

    fetchFriends();
    return () => {
      console.log('Friends component will unmount');
    };
  }, []);

const handleInviteFriend = () => {
  console.log('handleInviteFriend called');
  const userId = WebApp.initDataUnsafe.user?.id.toString() || MockWebApp.initDataUnsafe.user?.id.toString();
  const referralLink = `https://t.me/holmah_coin_bot?start=${userId}`;
  console.log('Referral link:', referralLink);
  if (isTelegramWebAppAvailable) {
    console.log('Opening Telegram link');
    WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
  } else {
    console.log('Showing browser alert');
    alert(`Скопіюйте це посилання для запрошення друга: ${referralLink}`);
  }
};

  console.log('Rendering Friends component. State:', { loading, error, friendsCount: friends.length });

  if (loading) {
    return <div className="friends-container">Завантаження...</div>;
  }

  if (error) {
    return <div className="friends-container">Помилка: {error}</div>;
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