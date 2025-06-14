import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Edit2, Calendar, Camera, Save
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import postService from '../services/postService';
import PostItem from '../components/posts/PostItem';
import CommentList from '../components/posts/CommentList';
import { format } from 'date-fns';
import userService from '../services/userService';

// Para mostrar edad

// Para mostrar foto de perfil


const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [friendCount, setFriendCount] = useState(0);

  

  useEffect(() => {

    if (currentUser) {
      setUserData({
        _id: currentUser._id,
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        age: currentUser.age || '',
        interests: currentUser.interests || [],
        profilePicture: currentUser.profilePicture || ''
      });

      const fetchFriendCount = async () => {
        try {
          const count = await userService.getUserFriendsCount(currentUser.id);
          setFriendCount(count);
        } catch (error) {
          console.error('Error fetching friend count:', error);
        }
      };
      fetchFriendCount();

      const fetchPosts = async () => {
        try {
          const userPosts = await postService.getPostsByUserId(currentUser.id);
          setPosts(userPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const interestsArray = e.target.value
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);
    setUserData(prev => ({
      ...prev,
      interests: interestsArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleExpandPost = (postId) => {
    setExpandedPost(prev => (prev === postId ? null : postId));
  };

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-500 relative">
          <button className="absolute bottom-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700">
            <Camera className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 left-6 h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
            <img
              src={currentUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg'}
              alt={currentUser.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex justify-end pt-4">
            {isEditing ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="mt-8">
            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    name="profilePicture"
                    value={userData.profilePicture}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={userData.interests.join(', ')}
                    onChange={handleInterestChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  @{currentUser.email.split('@')[0]}
                </p>

                {currentUser.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300">{currentUser.bio}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {currentUser.age && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {currentUser.age} years old
                    </div>
                  )}

                  {currentUser.createdAt && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {format(new Date(currentUser.createdAt), 'MMMM yyyy')}
                    </div>
                  )}
                </div>

                {currentUser.interests?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 text-sm bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="w-1/3 text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {posts.length}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
                  </div>
                  <div className="w-1/3 text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {/* placeholder, puedes conectar con getUserFriends() */}

                      {friendCount.count || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Friends</p>
                  </div>
                  <div className="w-1/3 text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {/* placeholder, puedes conectar con getUserMatches() */}
                      0
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white px-1">
          Posts
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id}>
              <PostItem post={post} onToggleComments={toggleExpandPost} />
              {expandedPost === post._id && <CommentList postId={post._id} />}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't created any posts yet.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
