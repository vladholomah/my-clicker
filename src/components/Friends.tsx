import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import axios from 'axios';

interface Friend {
  telegramId: string;
  coins: number;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useTelegram();

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/getFriends?userId=${user.id}`);
          setFriends(response.data.friends);
        } catch (error) {
          console.error('Failed to fetch friends:', error);
        }
      }
    };

    fetchFriends();
  }, [user]);

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