import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { getReferrals } from '../api';

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
      const link = `https://t.me/YourBot?start=${user.id}`;
      setReferralLink(link);
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (user) {
      try {
        const response = await getReferrals(user.id);
        setFriends(response.referrals);
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