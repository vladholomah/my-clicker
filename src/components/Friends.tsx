import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';
import { WebAppInstance } from '../types/telegram';
import './Friends.css';

interface Friend {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: number;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, tg } = useTelegram();

  useEffect(() => {
    const fetchFriendsAndReferralCode = async () => {
      try {
        if (!user) {
          console.log('User not found in Telegram WebApp, skipping data fetch');
          setLoading(false);
          return;
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

    fetchFriendsAndReferralCode();
  }, [user]);

  const handleInviteFriend = () => {
    if (!tg) {
      console.error('Telegram Web App is not available');
      return;
    }

    const botUsername = process.env.REACT_APP_BOT_USERNAME || 'holmah_coin_bot';
    const referralLink = `https://t.me/${botUsername}?start=${referralCode}`;
    const shareText = `Join me in Holmah Coin! Use my referral link: ${referralLink}`;

    if ('openTelegramLink' in tg) {
      (tg as any).openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      // Fallback если openTelegramLink недоступен
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Referral link copied to clipboard. You can now share it with your friends.');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy referral link. Please manually copy this link: ' + referralLink);
      });
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container">
      <h2 className="friends-heading">Your Friends</h2>
      <button className="friends-button" onClick={handleInviteFriend}>Invite a friend</button>
      {error && <p className="friends-error">{error}</p>}
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.telegramId} className="friends-list-item">
              <div className="friend-info">
                <span className="friend-name">{friend.firstName} {friend.lastName}</span>
                {friend.username && <span className="friend-username">@{friend.username}</span>}
              </div>
              <div className="friend-coins">{friend.coins} coins</div>
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