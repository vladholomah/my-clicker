import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const processReferral = async (referrerId: string, newUserId: string) => {
  try {
    console.log(`Processing referral: referrerId=${referrerId}, newUserId=${newUserId}`);
    const response = await axios.post(`${API_URL}/api/referral`, { referrerId, newUserId });
    console.log('Referral processed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing referral:', error);
    throw error;
  }
};

export const getReferrals = async (userId: string) => {
  try {
    console.log(`Getting referrals for userId: ${userId}`);
    const response = await axios.get(`${API_URL}/api/referrals/${userId}`);
    console.log('Referrals received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting referrals:', error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    console.log(`Getting user data for userId: ${userId}`);
    const response = await axios.get(`${API_URL}/api/getUserData?userId=${userId}`);
    console.log('User data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUserCoins = async (userId: string, coinsToAdd: number) => {
  try {
    console.log(`Updating coins for userId: ${userId}, coinsToAdd: ${coinsToAdd}`);
    const response = await axios.post(`${API_URL}/api/updateUserCoins`, { userId, coinsToAdd });
    console.log('User coins updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user coins:', error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    console.log('Getting leaderboard');
    const response = await axios.get(`${API_URL}/api/leaderboard`);
    console.log('Leaderboard received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};