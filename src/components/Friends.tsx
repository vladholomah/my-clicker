import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import axios from 'axios';

interface Friend {
  telegramId: string;
  coins: number;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/getFriends?userId=${user.id}`);
          setFriends(response.data.friends);
          setError(null);
        } catch (error) {
          console.error('Failed to fetch friends:', error);
          setError('Не вдалося завантажити список друзів. Спробуйте пізніше.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriends();
  }, [user]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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