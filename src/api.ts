import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const processReferral = async (referrerId: string, newUserId: string) => {
  try {
    const response = await axios.post(`${API_URL}/referral`, { referrerId, newUserId });
    return response.data;
  } catch (error) {
    console.error('Error processing referral:', error);
    throw error;
  }
};

export const getReferrals = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/referrals/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting referrals:', error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/getUserData?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};