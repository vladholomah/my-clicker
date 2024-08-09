import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TelegramUser } from '../types/telegram';
import { useTelegram } from '../hooks/useTelegram';

interface Friend {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!user) {
          throw new Error('User not found in Telegram WebApp');
        }
        const userId = user.id.toString();
        const response = await axios.get(`http://localhost:5000/api/getFriends?userId=${userId}`);
        setFriends(response.data.friends);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Помилка завантаження друзів');
        setLoading(false);
      }
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

  const handleInviteFriend = () => {
    if (!user) {
      console.error('User not found in Telegram WebApp');
      return;
    }
    const userId = user.id.toString();
    const referralLink = `https://t.me/your_bot_username?start=${userId}`;
    window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Ваші друзі</h2>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.telegramId}>
              {friend.firstName} {friend.lastName} (@{friend.username})
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас поки немає запрошених друзів.</p>
      )}
      <button onClick={handleInviteFriend}>Запросити друга</button>
    </div>
  );
};

export default Friends;