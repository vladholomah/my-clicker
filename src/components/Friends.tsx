import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';
import './Friends.css';

interface Friend {
  telegram_id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  coins: number;
  level: string;
  total_coins: number;
  avatar?: string;
}

interface UserData {
  user: {
    telegram_id: string;
    first_name: string;
    last_name: string;
    username: string;
    coins: number;
    total_coins: number;
    level: string;
    avatar: string | null;
  };
  friends: Friend[];
  referral_code: string;
  referral_link: string;
}

const Friends: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const { user, tg } = useTelegram();

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('fetchUserData called, user:', user);
      setDebugMessage(prev => prev + '\nFetchUserData called');

      let userId: string | null = null;
      if (user && user.id) {
        userId = user.id.toString();
        setDebugMessage(prev => prev + `\nUserId from user: ${userId}`);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        userId = urlParams.get('userId');
        setDebugMessage(prev => prev + `\nUserId from URL: ${userId}`);
      }

      if (!userId) {
        setDebugMessage(prev => prev + '\nUser ID is not available');
        setLoading(false);
        return;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        setDebugMessage(prev => prev + `\nAPI URL: ${API_URL}`);
        setDebugMessage(prev => prev + `\nTrying to fetch data from: ${API_URL}/api/getUserData?userId=${userId}`);

        const response = await axios.get<UserData>(`${API_URL}/api/getUserData?userId=${userId}`);
        console.log('User data received:', response.data);
        setDebugMessage(prev => prev + `\nAPI Response: ${JSON.stringify(response.data)}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data');
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Friends component mounted, user:', user);
    setDebugMessage('Friends component mounted');
    fetchUserData();
  }, [user]);

const handleError = (error: unknown) => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as any;
    setDebugMessage(prev => prev + `\nAxios Error: ${axiosError.message}. Status: ${axiosError.response?.status}. Data: ${JSON.stringify(axiosError.response?.data)}`);
  } else if (error instanceof Error) {
    setDebugMessage(prev => prev + `\nError: ${error.message}`);
  } else {
    setDebugMessage(prev => prev + `\nUnknown error: ${String(error)}`);
  }
};

  const handleInviteFriend = () => {
    if (!userData?.referral_link) {
      setDebugMessage(prev => prev + '\nReferral link is not available');
      return;
    }
    const shareText = `Join me in Holmah Coin and get a bonus! Use my referral link: ${userData.referral_link}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(userData.referral_link)}&text=${encodeURIComponent(shareText)}`);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Referral link copied to clipboard! Share it with your friends.');
      }).catch((err: unknown) => {
        console.error('Failed to copy text: ', err);
        handleError(err);
        alert(`Failed to copy referral link. Please copy it manually: ${userData.referral_link}`);
      });
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container" style={{height: '100vh', overflowY: 'auto', padding: '20px'}}>
      <h1>Invite friends!</h1>
      <button onClick={handleInviteFriend}>Invite a friend</button>
      {userData?.referral_link && <p>Your referral link: {userData.referral_link}</p>}

      <h2>Your friends ({userData?.friends.length || 0})</h2>
      {error && <p className="friends-error">{error}</p>}
      {userData?.friends.length ? (
        <ul className="friends-list">
          {userData.friends.map((friend) => (
            <li key={friend.telegram_id} className="friends-list-item">
              <img src={friend.avatar || '/images/default-avatar.png'} alt={friend.first_name} className="friend-avatar" />
              <div className="friend-info">
                <span className="friend-name">{friend.first_name} {friend.last_name}</span>
                <span className="friend-level">{friend.level} • <img src="/images/coin.png" alt="Coin" className="coin-icon-small" /> {friend.total_coins}</span>
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
        Loading: {loading ? 'True' : 'False'}<br/>
        Error: {error || 'None'}<br/>
        UserData: {userData ? 'Available' : 'Not Available'}<br/>
        Debug Message: <pre>{debugMessage}</pre>
      </div>
    </div>
  );
};

export default Friends;