import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, UserPlus, Heart, MessageCircle, Clock } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser) {
        try {
          // Get pending friend requests
          const requests = await userService.getPendingFriendRequests(currentUser.id);
          setFriendRequests(requests);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchNotifications();
  }, [currentUser]);
  
  const handleAcceptFriendRequest = async (requestId) => {
    try {
      await userService.respondToFriendRequest(requestId, 'accepted');
      
      // Remove from pending requests
      setFriendRequests(friendRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  const handleRejectFriendRequest = async (requestId) => {
    try {
      await userService.respondToFriendRequest(requestId, 'rejected');
      
      // Remove from pending requests
      setFriendRequests(friendRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };
  
  // Mock notifications for display
  const mockNotifications = [
    {
      id: '1',
      type: 'match',
      content: 'You and Sarah Johnson are a match!',
      timestamp: new Date('2024-06-15T10:30:00'),
      userId: '2',
      read: false
    },
    {
      id: '2',
      type: 'message',
      content: 'Mike Chen sent you a message',
      timestamp: new Date('2024-06-14T15:45:00'),
      userId: '3',
      read: true
    },
    {
      id: '3',
      type: 'like',
      content: 'Sarah Johnson liked your post',
      timestamp: new Date('2024-06-13T09:20:00'),
      postId: '1',
      userId: '2',
      read: true
    }
  ];
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'match':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <Bell className="h-6 w-6 mr-2 text-pink-500" />
            Notifications
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20">
                <h2 className="font-medium text-gray-800 dark:text-white mb-3">
                  Friend Requests
                </h2>
                
                <div className="space-y-4">
                  {friendRequests.map(request => (
                    <div key={request.id} className="flex items-center">
                      <img
                        src={request.sender.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                        alt={request.sender.username}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {request.sender.fullName || request.sender.username} wants to connect
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptFriendRequest(request.id)}
                          className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectFriendRequest(request.id)}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Other Notifications */}
            {mockNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-white">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
            
            {friendRequests.length === 0 && mockNotifications.length === 0 && (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;