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

interface WebAppInstance {
  openTelegramLink?: (url: string) => void;
  showPopup?: (params: PopupParams, callback?: (buttonId: string) => void) => void;
  showAlert?: (message: string) => void;
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
  const [referralLink, setReferralLink] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, tg } = useTelegram() as { user: any, tg: WebAppInstance | null };

  useEffect(() => {
    const fetchFriendsAndReferralCode = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const userId = user.id.toString();
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
        setFriends(response.data.friends);
        setReferralCode(response.data.referralCode);
        setReferralLink(response.data.referralLink);
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
    const shareText = 'Join me in Holmah Coin!';

    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const userId = user.id.toString();
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
      setFriends(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Error refreshing data');
      setLoading(false);
    }
  };

  const handleShowQRCode = () => {
    if (tg && tg.showPopup) {
      tg.showPopup({
        title: 'QR Code',
        message: 'Scan this QR code to join:',
        buttons: [{ type: 'close', text: 'Close' }]
      });
    } else {
      alert('QR Code functionality is not available');
    }
  };

  if (loading) return <div className="friends-container">Loading...</div>;

  return (
    <div className="friends-container">
      <h1 className="friends-heading">Invite friends!</h1>
      <p className="friends-subheading">You and your friend will receive bonuses</p>

      <div className="invite-options">
        <div className="invite-option">
          <img src="/images/gift-box.png" alt="Gift box" className="gift-icon" />
          <div className="invite-option-text">
            <span className="invite-option-title">Invite a friend</span>
            <span className="invite-option-bonus">
              <img src="/images/coin.png" alt="Coin" className="coin-icon" />
              +5,000 for you and your friend
            </span>
          </div>
        </div>
        <div className="invite-option premium">
          <img src="/images/premium-gift-box.png" alt="Premium gift box" className="gift-icon" />
          <div className="invite-option-text">
            <span className="invite-option-title">Invite a friend with Telegram Premium</span>
            <span className="invite-option-bonus">
              <img src="/images/coin.png" alt="Coin" className="coin-icon" />
              +25,000 for you and your friend
            </span>
          </div>
        </div>
      </div>

      <button className="more-bonuses-button">More bonuses</button>

      <div className="friends-list-header">
        <h2>List of your friends ({friends.length})</h2>
        <button className="refresh-button" onClick={handleRefresh}>
          <img src="/images/refresh-icon.png" alt="Refresh" />
        </button>
      </div>

      {error && <p className="friends-error">{error}</p>}
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
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
        <p className="no-friends-message">You have no invited friends yet.</p>
      )}

      <div className="bottom-buttons">
        <button className="invite-friend-button" onClick={handleInviteFriend}>
          Invite a friend
          <img src="/images/refresh-icon.png" alt="Refresh" className="refresh-icon" />
        </button>
        <button className="qr-code-button" onClick={handleShowQRCode}>
          <img src="/images/qr-code-icon.png" alt="QR Code" />
        </button>
      </div>
    </div>
  );
};

export default Friends;