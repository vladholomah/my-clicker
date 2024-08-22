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
  level: string;
  totalCoins: string;
  avatar?: string;
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
        setDebugMessage(`Initial user state: ${JSON.stringify(user)}`);
        if (!user || !user.id) {
          setLoading(false);
          setDebugMessage('User not found or user.id is undefined');
          return;
        }
        const userId = user.id.toString();
        const API_URL = process.env.REACT_APP_API_URL;
        setDebugMessage(`Trying to fetch data from: ${API_URL}/api/getUserData?userId=${userId}`);
        const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
        setDebugMessage(`API Response: ${JSON.stringify(response.data)}`);
        setFriends(response.data.friends || []);
        setReferralLink(response.data.referralLink || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data');
        if (axios.isAxiosError(error)) {
          setDebugMessage(`Axios Error: ${error.message}. Status: ${error.response?.status}. Data: ${JSON.stringify(error.response?.data)}`);
        } else {
          setDebugMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        setLoading(false);
      }
    };

    fetchFriendsAndReferralCode();
  }, [user]);

  const handleInviteFriend = () => {
    if (!referralLink) {
      setDebugMessage('Referral link is not available');
      return;
    }
    const shareText = `Join me in Holmah Coin and get a bonus! Use my referral link: ${referralLink}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Referral link copied to clipboard! Share it with your friends.');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy referral link. Please copy it manually: ' + referralLink);
      });
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container" style={{height: '100vh', overflowY: 'auto', padding: '20px'}}>
      <h1>Invite friends!</h1>
      <button onClick={handleInviteFriend}>Invite a friend</button>
      {referralLink && <p>Your referral link: {referralLink}</p>}

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

      <div style={{padding: '10px', backgroundColor: '#f0f0f0', marginTop: '10px', wordBreak: 'break-all'}}>
        <strong>Debug Info:</strong><br/>
        User: {user ? JSON.stringify(user) : 'No user data'}<br/>
        API URL: {process.env.REACT_APP_API_URL}<br/>
        Debug Message: {debugMessage}
      </div>
    </div>
  );
};

export default Friends;