import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';

interface Friend {
  telegramId: string;
  coins: number;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const userId = WebApp.initDataUnsafe.user?.id;
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await axios.get(`/api/getFriends?userId=${userId}`);
        setFriends(response.data.friends);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        setError('Не вдалося завантажити список друзів. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div className="friends-container">Завантаження...</div>;
  }

  if (error) {
    return <div className="friends-container">{error}</div>;
  }

  return (
    <div className="friends-container">
      <h2>Ваші друзі</h2>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.telegramId}>
              Користувач {friend.telegramId}: {friend.coins} монет
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас поки немає запрошених друзів.</p>
      )}
    </div>
  );
};

export default Friends;