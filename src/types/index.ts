export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  fullName?: string;
  age?: number;
  bio?: string;
  interests?: string[];
  friends?: string[];
  matches?: string[];
  themePreference?: 'light' | 'dark';
  createdAt: Date;
  lastActive?: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  postType: 'text' | 'image' | 'link' | 'status';
  privacy: 'public' | 'friends' | 'matches';
  createdAt: Date;
  updatedAt?: Date;
  likesCount: number;
  commentsCount: number;
  author?: User;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  author?: User;
}

export interface Reaction {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  createdAt: Date;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
  sender?: User;
  receiver?: User;
}

export interface Match {
  id: string;
  userIds: string[];
  matchScore: number;
  commonInterests: string[];
  createdAt: Date;
  matchedUser?: User;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessageId?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  participants?: User[];
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isAiSuggestion?: boolean;
  readBy: string[];
  createdAt: Date;
  sender?: User;
}

export interface AiSuggestion {
  id: string;
  userId: string;
  chatId: string;
  recipientId: string;
  suggestions: string[];
  commonInterests: string[];
  context: string;
  createdAt: Date;
  expiresAt: Date;
}