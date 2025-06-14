// userService.js
import api from '../utils/axiosInstance';

const getUserSuggestions = async (userId) => {
  const res = await api.get(`/users/${userId}/suggestions`);
  return res.data;
};

const getUserMatches = async (userId) => {
  const res = await api.get(`/match/${userId}`);
  return res.data;
};

const sendFriendRequest = async (senderId, receiverId) => {
  const res = await api.post(`/friends/request`, { senderId, receiverId });
  return res.data;
};

const respondToFriendRequest = async (requestId, response) => {
  const res = await api.put(`/friends/request/${requestId}`, { response }); // e.g. accepted/rejected
  return res.data;
};

const getPendingFriendRequests = async (userId) => {
  const res = await api.get(`/friends/requests/pending/${userId}`);
  return res.data;
};

const getUserFriends = async (userId) => {
  const res = await api.get(`/users/${userId}/friends`);
  return res.data;
};

const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};
const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};
const updateUser = async (userId, userData) => {
  const res = await api.put(`/users/${userId}`, userData);
  return res.data;
};
const getUserById = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};
export default {
  getUserSuggestions,
  getUserMatches,
  sendFriendRequest,
  respondToFriendRequest,
  getPendingFriendRequests,
  getUserFriends,
  register,
  login,
  updateUser,
  getUserById
};
