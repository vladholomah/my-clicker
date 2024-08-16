import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';
import './Friends.css';

interface Friend {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useTelegram();

  useEffect(() => {
    const fetchFriendsAndReferralCode = async () => {
      try {
        if (!user) {
          throw new Error('User not found in Telegram WebApp');
        }
        const userId = user.id.toString();
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
        setFriends(response.data.friends);
        setReferralCode(response.data.referralCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data');
        setLoading(false);
      }
    };

    if (user) {
      fetchFriendsAndReferralCode();
    }
  }, [user]);

  const handleInviteFriend = () => {
    if (!user) {
      console.error('User not found in Telegram WebApp');
      return;
    }
    const referralLink = `https://t.me/your_bot_username?start=${referralCode}`;
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
    } else {
      console.error('Telegram WebApp is not available');
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;
  if (error) return <div className="friends-container">{error}</div>;

  return (
    <div className="friends-container">
      <h2 className="friends-heading">Your Friends</h2>
      <p className="friends-text">Your Referral Code: {referralCode}</p>
      <button className="friends-button" onClick={handleInviteFriend}>Invite a friend</button>
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.telegramId} className="friends-list-item">
              {friend.firstName} {friend.lastName} (@{friend.username})
            </li>
          ))}
        </ul>
      ) : (
        <p className="friends-text">You have no invited friends yet.</p>
      )}
    </div>
  );
};

export default Friends;