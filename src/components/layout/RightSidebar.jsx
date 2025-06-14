import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const RightSidebar = () => {
  const { currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const userSuggestions = await userService.getUserSuggestionsMin(currentUser.id);
          setSuggestions(userSuggestions);

          const requests = await userService.getPendingFriendRequests(currentUser.id);
          setPendingRequests(requests);
        } catch (error) {
          console.error('Error fetching sidebar data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSendFriendRequest = async (userId) => {
    if (!currentUser) return;

    try {
      await userService.sendFriendRequest(currentUser.id, userId);
      setSuggestions(suggestions.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      await userService.respondToFriendRequest(requestId, 'accepted');
      await userService.updateUser(currentUser.id, { friendCout: currentUser.friendCount + 1 });
      setPendingRequests(pendingRequests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    try {
      await userService.respondToFriendRequest(requestId, 'rejected');
      setPendingRequests(pendingRequests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
            Friend Requests
          </h2>

          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div key={request._id} className="flex items-center space-x-3">
                <img
                  src={request.sender.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                  alt={request.sender.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {request.sender.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{request.sender.email.split('@')[0]}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleAcceptFriendRequest(request._id)}
                    className="p-1.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    title="Accept Request"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectFriendRequest(request._id)}
                    className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Reject Request"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-pink-500" />
          Suggested People
        </h2>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map(user => (
              <div key={user._id} className="flex items-center space-x-3">
                <img
                  src={user.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.email.split('@')[0]}
                  </p>
                </div>
                <button
                  onClick={() => handleSendFriendRequest(user._id)}
                  className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
            No suggestions available at the moment.
          </p>
        )}
      </div>

      {/* Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-2">
          About Zoe
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Zoe is a social networking and dating platform designed to help you connect with like-minded people.
        </p>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          <p>© 2025 Zoe Dating App</p>
          <div className="mt-1 space-x-2">
            <a href="#" className="hover:text-pink-500 transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-pink-500 transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-pink-500 transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
