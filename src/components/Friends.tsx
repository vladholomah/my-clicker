import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import axios from 'axios';

interface Friend {
  id: string;
  name: string;
}

const Friends: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useTelegram();

  useEffect(() => {
    if (user) {
      setReferralLink(`https://t.me/holmah_coin_bot?start=${user.id}`);
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (user) {
      try {
        const response = await axios.get(`/api/referral?userId=${user.id}`);
        setFriends(response.data.referrals.map((id: string) => ({ id, name: `User ${id}` })));
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      }
    }
  };

  const shareFriendsLink = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'share_referral',
        link: referralLink
      }));
    }
  };

  return (
    <div className="friends-container">
      <h2>Друзі</h2>
      <button onClick={shareFriendsLink}>Запросити друзів</button>
      <p>Ваше реферальне посилання: {referralLink}</p>
      <h3>Список друзів:</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;