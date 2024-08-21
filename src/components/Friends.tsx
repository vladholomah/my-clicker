import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';
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
  const [referralLink, setReferralLink] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const { user, tg } = useTelegram();

  useEffect(() => {
    const fetchFriendsAndReferralCode = async () => {
      try {
        if (!user) {
          setLoading(false);
          setDebugMessage('User not found');
          return;
        }
        const userId = user.id.toString();
        const API_URL = process.env.REACT_APP_API_URL;
        setDebugMessage(`Trying to fetch data from: ${API_URL}`);
        const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
        setFriends(response.data.friends);
        setReferralLink(response.data.referralLink);
        setDebugMessage(`Data fetched successfully. Friends count: ${response.data.friends.length}`);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data');
        if (axios.isAxiosError(error)) {
          setDebugMessage(`Error: ${error.message}. Status: ${error.response?.status}`);
        } else {
          setDebugMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        setLoading(false);
      }
    };

    fetchFriendsAndReferralCode();
  }, [user]);

  const handleInviteFriend = () => {
    const shareText = `Join me in Holmah Coin and get a bonus! Use my referral link: ${referralLink}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      alert('Unable to open Telegram link. Your referral link is: ' + referralLink);
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container" style={{height: '100vh', overflowY: 'auto'}}>
      <h1>Invite friends!</h1>
      <button onClick={handleInviteFriend}>Invite a friend</button>

      <h2>Your friends ({friends.length})</h2>
      {error && <p className="friends-error">{error}</p>}
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.telegramId}>
              {friend.firstName} {friend.lastName} - Coins: {friend.coins}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no invited friends yet.</p>
      )}

      <div style={{padding: '10px', backgroundColor: '#f0f0f0', marginTop: '10px'}}>
        Debug: {debugMessage}
      </div>
    </div>
  );
};

export default Friends;