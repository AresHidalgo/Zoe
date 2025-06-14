// services/postService.js
import api from '../utils/axiosInstance';

const createPost = async (postData) => {
  const res = await api.post('/posts', postData);
  return res.data;
};

const getFeedPosts = async () => {
  const res = await api.get('/posts/feed');
  return res.data;
};

const getPostsByUserId = async (userId) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};

const addComment = async (postId, commentData) => {
  const res = await api.post(`/posts/${postId}/comments`, commentData);
  return res.data;
};

const getCommentsForPost = async (postId) => {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data;
};

const addReaction = async (targetId, reactionData) => {
  const res = await api.post(`/reactions/${targetId}`, reactionData);
  return res.data;
};

const removeReaction = async (targetId, userId) => {
  const res = await api.delete(`/reactions/${targetId}/user/${userId}`);
  return res.data;
};

const hasReacted = async (targetId, userId) => {
  const res = await api.get(`/reactions/${targetId}/user/${userId}`);
  return res.data;
};

const getPendingMatches = async (userId) => {
  const res = await api.get(`/match/pending/${userId}`);
  return res.data;
};

const getPendingFriends = async (userId,pendingUser) => {
  const res = await api.get(`/friends/${pendingUser}/pending/${userId}`);
  return res.data;
};


const getReactionsForTarget = async (targetId) => {
  const res = await api.get(`/reactions/${targetId}`);
  return res.data;
};

export default {
  createPost,
  getFeedPosts,
  getPostsByUserId,
  getCommentsForPost,
  addComment,
  addReaction,
  removeReaction,
  hasReacted,
  getReactionsForTarget,
  getPendingMatches,
  getPendingFriends
};
