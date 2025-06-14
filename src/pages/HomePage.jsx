import React, { useState, useEffect } from 'react';
import { Image, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/postService';
import MainLayout from '../components/layout/MainLayout';
import PostItem from '../components/posts/PostItem';
import CommentList from '../components/posts/CommentList';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        try {
          const feedPosts = await postService.getFeedPosts(currentUser.id);
          setPosts(feedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim()) return;

    try {
      const postData = {
        authorId: currentUser.id,
        content: newPostContent,
        postType: mediaUrl ? 'image' : 'text',
        privacy,
        mediaUrls: mediaUrl ? [mediaUrl] : []
      };

      const newPost = await postService.createPost(postData);

      // Add author data to new post
      newPost.author = currentUser;

      // Add new post to feed
      setPosts([newPost, ...posts]);

      // Reset form
      setNewPostContent('');
      setMediaUrl('');
      setShowMediaInput(false);
      setPrivacy('public');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleExpandPost = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
    }
  };

  return (
    <MainLayout>
      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-fade-in">
        <form onSubmit={handleCreatePost}>
          <div className="flex space-x-4">
            <img
              src={currentUser?.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 space-y-3">
              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-200 resize-none"
                rows={2}
              />

              {showMediaInput && (
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-200"
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaInput(!showMediaInput)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1 border-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="matches">Matches</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-4 py-1.5 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post, idx) => (
            <React.Fragment key={post._id || post.id || idx}>
              <PostItem
                post={post}
                onToggleComments={() => toggleExpandPost(post._id || post.id)}
              />
              {expandedPost === (post._id || post.id) && (
                <CommentList postId={post._id || post.id} />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Posts Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to Zoe! This is where you'll see posts from friends and matches.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Get started by connecting with people or creating your first post.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;