import { v4 as uuidv4 } from 'uuid';

// Mock users for initial data
export const mockUsers = [
  {
    id: '1',
    username: 'alexmorgan',
    email: 'alex@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150',
    fullName: 'Alex Morgan',
    age: 28,
    bio: 'Love hiking, photography, and good coffee ☕',
    interests: ['Photography', 'Hiking', 'Coffee', 'Travel'],
    friends: ['2', '3'],
    matches: ['2'],
    themePreference: 'light',
    createdAt: new Date('2023-01-15').toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: '2',
    username: 'sarahjohnson',
    email: 'sarah@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysplit&w=150',
    fullName: 'Sarah Johnson',
    age: 26,
    bio: 'Bookworm, space enthusiast, and amateur astronomer 🔭',
    interests: ['Reading', 'Astronomy', 'Science', 'Travel'],
    friends: ['1'],
    matches: ['1'],
    themePreference: 'light',
    createdAt: new Date('2023-02-10').toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: '3',
    username: 'mikech',
    email: 'mike@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysplit&w=150',
    fullName: 'Mike Chen',
    age: 30,
    bio: 'Outdoor enthusiast and adventure seeker 🏔️',
    interests: ['Hiking', 'Photography', 'Travel', 'Rock Climbing'],
    friends: ['1'],
    matches: [],
    themePreference: 'dark',
    createdAt: new Date('2023-01-05').toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: '4',
    username: 'emmawilson',
    email: 'emma@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysplit&w=150',
    fullName: 'Emma Wilson',
    age: 25,
    bio: 'Art lover, photography enthusiast, and traveler ✈️',
    interests: ['Art', 'Photography', 'Travel', 'Design'],
    friends: [],
    matches: [],
    themePreference: 'light',
    createdAt: new Date('2023-03-20').toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: '5',
    username: 'davidpark',
    email: 'david@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysplit&w=150',
    fullName: 'David Park',
    age: 29,
    bio: 'Music producer, tech enthusiast, and gaming aficionado 🎮',
    interests: ['Music', 'Technology', 'Gaming', 'DJ'],
    friends: [],
    matches: [],
    themePreference: 'dark',
    createdAt: new Date('2023-02-15').toISOString(),
    lastActive: new Date().toISOString()
  }
];

// Mock posts
export const mockPosts = [
  {
    id: '1',
    authorId: '2',
    content: 'Just finished reading an amazing book about space exploration! 🚀 Anyone interested in astronomy here?',
    postType: 'text',
    privacy: 'public',
    createdAt: new Date('2024-06-15T10:24:00').toISOString(),
    likesCount: 24,
    commentsCount: 5
  },
  {
    id: '2',
    authorId: '3',
    content: 'Found this incredible hiking trail today! The views were absolutely breathtaking. #NatureLover',
    mediaUrls: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysplit&w=600'],
    postType: 'image',
    privacy: 'public',
    createdAt: new Date('2024-06-15T08:15:00').toISOString(),
    likesCount: 42,
    commentsCount: 8
  },
  {
    id: '3',
    authorId: '1',
    content: 'Coffee date with myself this morning. Sometimes you need that alone time to recharge. ☕',
    mediaUrls: ['https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysplit&w=600'],
    postType: 'image',
    privacy: 'friends',
    createdAt: new Date('2024-06-14T09:30:00').toISOString(),
    likesCount: 18,
    commentsCount: 3
  }
];

// Mock comments
export const mockComments = [
  {
    id: '1',
    postId: '1',
    authorId: '1',
    content: 'I love astronomy! Have you read "The Universe in a Nutshell"?',
    createdAt: new Date('2024-06-15T11:05:00').toISOString(),
    likesCount: 3
  },
  {
    id: '2',
    postId: '1',
    authorId: '4',
    content: 'Space exploration is so fascinating! What book was it?',
    createdAt: new Date('2024-06-15T11:30:00').toISOString(),
    likesCount: 2
  },
  {
    id: '3',
    postId: '2',
    authorId: '1',
    content: 'Wow, that view is incredible! Where is this trail located?',
    createdAt: new Date('2024-06-15T09:20:00').toISOString(),
    likesCount: 4
  }
];

// Mock reactions
export const mockReactions = [
  {
    id: '1',
    userId: '1',
    targetId: '1',
    targetType: 'post',
    reactionType: 'like',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '2',
    targetId: '3',
    targetType: 'post',
    reactionType: 'love',
    createdAt: new Date().toISOString()
  }
];

// Mock chats
export const mockChats = [
  {
    id: '1',
    participantIds: ['1', '2'],
    lastMessageId: '3',
    lastMessageAt: new Date('2024-06-15T14:30:00').toISOString(),
    createdAt: new Date('2024-06-10T09:00:00').toISOString()
  }
];

// Mock messages
export const mockMessages = [
  {
    id: '1',
    chatId: '1',
    senderId: '1',
    content: 'Hey Sarah, how are you?',
    readBy: ['1', '2'],
    createdAt: new Date('2024-06-10T09:00:00').toISOString()
  },
  {
    id: '2',
    chatId: '1',
    senderId: '2',
    content: 'Hi Alex! I\'m doing great, thanks for asking. How about you?',
    readBy: ['1', '2'],
    createdAt: new Date('2024-06-10T09:05:00').toISOString()
  },
  {
    id: '3',
    chatId: '1',
    senderId: '1',
    content: 'I\'m good! Just wondering if you\'d like to grab coffee sometime this week?',
    readBy: ['1'],
    createdAt: new Date('2024-06-15T14:30:00').toISOString()
  }
];

// Mock friend requests
export const mockFriendRequests = [
  {
    id: '1',
    senderId: '4',
    receiverId: '1',
    status: 'pending',
    createdAt: new Date('2024-06-14T15:20:00').toISOString()
  },
  {
    id: '2',
    senderId: '5',
    receiverId: '1',
    status: 'pending',
    createdAt: new Date('2024-06-15T10:45:00').toISOString()
  }
];

// Mock matches
export const mockMatches = [
  {
    id: '1',
    userIds: ['1', '2'],
    matchScore: 85,
    commonInterests: ['Photography', 'Travel'],
    createdAt: new Date('2024-06-10T08:30:00').toISOString()
  }
];

// Initialize localStorage with mock data
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('zoe_users')) {
    localStorage.setItem('zoe_users', JSON.stringify(mockUsers));
  }
  
  if (!localStorage.getItem('zoe_posts')) {
    localStorage.setItem('zoe_posts', JSON.stringify(mockPosts));
  }
  
  if (!localStorage.getItem('zoe_comments')) {
    localStorage.setItem('zoe_comments', JSON.stringify(mockComments));
  }
  
  if (!localStorage.getItem('zoe_reactions')) {
    localStorage.setItem('zoe_reactions', JSON.stringify(mockReactions));
  }
  
  if (!localStorage.getItem('zoe_chats')) {
    localStorage.setItem('zoe_chats', JSON.stringify(mockChats));
  }
  
  if (!localStorage.getItem('zoe_messages')) {
    localStorage.setItem('zoe_messages', JSON.stringify(mockMessages));
  }
  
  if (!localStorage.getItem('zoe_friend_requests')) {
    localStorage.setItem('zoe_friend_requests', JSON.stringify(mockFriendRequests));
  }
  
  if (!localStorage.getItem('zoe_matches')) {
    localStorage.setItem('zoe_matches', JSON.stringify(mockMatches));
  }
};

// Helper function to generate a new ID
export const generateId = () => uuidv4();