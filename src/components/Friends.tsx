import React, { useState, useEffect, useCallback } from 'react';
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
  totalCoins: number;
  avatar?: string;
}

interface UserData {
  user: {
    telegramId: string;
    firstName: string;
    lastName: string;
    username: string;
    coins: number;
    totalCoins: number;
    level: string;
    avatar: string | null;
  };
  friends: Friend[];
  referralCode: string;
  referralLink: string;
}

const Friends: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const { user, tg } = useTelegram();

  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) {
      setDebugMessage('User not found or user.id is undefined');
      setLoading(false);
      return;
    }

    try {
      setDebugMessage(`Initial user state: ${JSON.stringify(user)}`);
      const userId = user.id.toString();
      const API_URL = process.env.REACT_APP_API_URL;
      setDebugMessage(`Trying to fetch data from: ${API_URL}/api/getUserData?userId=${userId}`);
      const response = await axios.get<UserData>(`${API_URL}/api/getUserData?userId=${userId}`);
      setDebugMessage(`API Response: ${JSON.stringify(response.data)}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error loading user data');
      if (axios.isAxiosError(error)) {
        setDebugMessage(`Axios Error: ${error.message}. Status: ${error.response?.status}. Data: ${JSON.stringify(error.response?.data)}`);
      } else {
        setDebugMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('Friends component mounted');
    console.log('User:', user);
    if (user) {
      fetchUserData().catch(error => {
        console.error('Unhandled error in fetchUserData:', error);
        setError('An unexpected error occurred');
        setLoading(false);
      });
    } else {
      console.log('No user data available');
      setLoading(false);
    }
  }, [fetchUserData, user]);

  const handleInviteFriend = () => {
    if (!userData?.referralLink) {
      setDebugMessage('Referral link is not available');
      return;
    }
    const shareText = `Join me in Holmah Coin and get a bonus! Use my referral link: ${userData.referralLink}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(userData.referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Referral link copied to clipboard! Share it with your friends.');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy referral link. Please copy it manually: ' + userData.referralLink);
      });
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  if (!user) return <div className="friends-container">Please open this app in Telegram.</div>;

  return (
    <div className="friends-container" style={{height: '100vh', overflowY: 'auto', padding: '20px'}}>
      <h1>Invite friends!</h1>
      <button onClick={handleInviteFriend}>Invite a friend</button>
      {userData?.referralLink && <p>Your referral link: {userData.referralLink}</p>}

      <h2>Your friends ({userData?.friends.length || 0})</h2>
      {error && <p className="friends-error">{error}</p>}
      {userData?.friends.length ? (
        <ul className="friends-list">
          {userData.friends.map((friend) => (
            <li key={friend.telegramId} className="friends-list-item">
              <img src={friend.avatar || '/images/default-avatar.png'} alt={friend.firstName} className="friend-avatar" />
              <div className="friend-info">
                <span className="friend-name">{friend.firstName} {friend.lastName}</span>
                <span className="friend-level">{friend.level} • <img src="/images/coin.png" alt="Coin" className="coin-icon-small" /> {friend.totalCoins}</span>
              </div>
              <span className="friend-coins">
                <img src="/images/coin.png" alt="Coin" className="coin-icon" />
                +{friend.coins.toLocaleString()}
              </span>
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
        Debug Message: {debugMessage}<br/>
        Loading: {loading ? 'true' : 'false'}<br/>
        Error: {error || 'No error'}<br/>
        UserData: {JSON.stringify(userData)}
      </div>
    </div>
  );
};

export default Friends;