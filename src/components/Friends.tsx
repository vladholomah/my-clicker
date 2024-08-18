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

interface WebAppInstance {
  showPopup?: (params: PopupParams, callback?: (buttonId: string) => void) => void;
  showAlert?: (message: string) => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
}

interface PopupParams {
  title?: string;
  message: string;
  buttons: Array<{
    type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text: string;
  }>;
}

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, tg } = useTelegram();
  const webApp = tg as WebAppInstance;

  useEffect(() => {
    const fetchFriendsAndReferralCode = async () => {
      try {
        console.log('User object:', user);
        if (!user) {
          console.log('User not found in Telegram WebApp, skipping data fetch');
          setLoading(false);
          return;
        }
        const userId = user.id.toString();
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        console.log('API URL:', API_URL);
        console.log('Fetching user data from:', `${API_URL}/api/getUserData?userId=${userId}`);
        const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
        console.log('User data response:', response.data);
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
    const botUsername = process.env.REACT_APP_BOT_USERNAME || 'holmah_coin_bot';
    const referralLink = `https://t.me/${botUsername}?start=${referralCode}`;
    const shareText = 'Join me in Holmah Coin!';

    console.log('Invite friend button clicked');
    console.log('Referral link:', referralLink);

    if (webApp.openTelegramLink) {
      console.log('Using openTelegramLink');
      webApp.openTelegramLink(`tg://msg_url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else if (webApp.openLink) {
      console.log('Using openLink');
      webApp.openLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else if (webApp.showPopup) {
      console.log('Using showPopup');
      webApp.showPopup({
        title: 'Invite Friends',
        message: 'Share this link with your friends:',
        buttons: [
          { type: 'default', text: 'Copy Link' },
          { type: 'default', text: 'Share' }
        ]
      }, (buttonId) => {
        if (buttonId === 'Copy Link') {
          navigator.clipboard.writeText(referralLink).then(() => {
            webApp.showAlert?.('Link copied to clipboard!');
          });
        } else if (buttonId === 'Share') {
          window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
        }
      });
    } else {
      console.log('Fallback: opening in new window');
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container">
      <h2 className="friends-heading">Your Friends</h2>
      {referralCode && <p className="friends-text">Your Referral Code: {referralCode}</p>}
      <button className="friends-button" onClick={handleInviteFriend}>Invite a friend</button>
      {error && <p className="friends-error">{error}</p>}
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.telegramId} className="friends-list-item">
              {friend.firstName} {friend.lastName}
              {friend.username && `(@${friend.username})`} - Coins: {friend.coins}
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