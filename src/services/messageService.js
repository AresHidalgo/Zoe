// services/messageService.js
import api from '../utils/axiosInstance';

const getUserChats = async (userId) => {
  const res = await api.get(`/chat/user/${userId}`);
  return res.data;
};

const getOrCreateChat = async (participantIds) => {
  const res = await api.post('/chat', { participants: participantIds });
  return res.data;
};

const getChatMessages = async (chatId) => {
  const res = await api.get(`/chat/${chatId}/messages`);
  return res.data;
};

const sendMessage = async (chatId, messageData) => {
  const res = await api.post(`/chat/${chatId}/message`, messageData);
  return res.data;
};

const markMessagesAsRead = async (chatId, userId) => {
  const res = await api.put(`/chat/${chatId}/read`, { userId });
  return res.data;
};

const getChatSuggestions = async (chatId) => {
  const res = await api.post(`/suggestions/chat/${chatId}/suggestions`);
  return res.data.suggestions;
};

const getChatById = async (chatId) => {
  const res = await api.get(`/chat/${chatId}`);
  return res.data;
};

export default {
  getUserChats,
  getOrCreateChat,
  getChatById,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getChatSuggestions
};
