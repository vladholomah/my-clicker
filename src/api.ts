// src/api.ts

const API_URL = 'http://localhost:3001/api';

export const processReferral = async (referrerId: string, newUserId: string) => {
  const response = await fetch(`${API_URL}/referral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referrerId, newUserId }),
  });
  return response.json();
};

export const getReferrals = async (userId: string) => {
  const response = await fetch(`${API_URL}/referrals/${userId}`);
  return response.json();
};