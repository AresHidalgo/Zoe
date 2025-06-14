import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, UserPlus, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import MainLayout from '../components/layout/MainLayout';

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {

      if (currentUser) {
        try {
          // Get user's friends
          const userFriends = await userService.getUserFriends(currentUser.id);
          setFriends(userFriends);

          // Get user suggestions
          const userSuggestions = await userService.getUserSuggestions(currentUser.id);
          setSuggestions(userSuggestions);
        } catch (error) {
          console.error('Error fetching friends data:', error);
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

      // Remove user from suggestions
      setSuggestions(suggestions.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const filteredFriends = friends.filter(friend => {
    if (!searchQuery) return true;

    return (
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (friend.name && friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <Users className="h-6 w-6 mr-2 text-pink-500" />
              Friends
            </h1>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-48 bg-gray-100 dark:bg-gray-700 border-none rounded-full text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {filteredFriends.map(friend => (
                <div key={friend._id} className="bg-gray-900 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-3">
                  <img
                    src={friend.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                    alt={friend.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${friend._id}`}>
                      <h3 className="font-medium text-gray-800 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                        {friend.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{friend.email.split('@')[0]}
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <Link
                        to={`/messages/new?userId=${friend._id}`}
                        className="p-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                        title="Send Message"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="View Profile"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center px-4">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No friends found
              </h3>
              {searchQuery ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No friends match your search for "{searchQuery}"
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Connect with people to add them as friends
                </p>
              )}
            </div>
          )}
        </div>

        {/* Friend Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
              People You May Know
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.slice(0, 6).map(user => (
                <div key={user._id} className="bg-gray-500 dark:bg-gray-700 rounded-lg p-4 flex items-center space-x-3">
                  <img
                    src={user.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {user.name}
                    </h3>
                    {user.commonInterests && user.commonInterests.length > 0 && (
                      <p className="text-xl text-gray-500 dark:text-gray-400">
                        {user.commonInterests.length} common interests
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSendFriendRequest(user._id)}
                    className="p-1.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    title="Add Friend"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FriendsPage;