import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import postService from '../../services/postService';

const PostItem = ({ post, onToggleComments }) => {
  const { currentUser } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  useEffect(() => {
    let mounted = true;
    const fetchStates = async () => {
      if (!currentUser) {
        setHasLiked(false);
        setLikesCount(0);
        return;
      }
      try {
        const [reactionRes, likesRes] = await Promise.all([
          postService.hasReacted(post._id, currentUser.id),
          postService.getReactionsForTarget(post._id)
        ]);
        if (mounted) {
          setHasLiked(reactionRes.reacted);
          const likes = Array.isArray(likesRes) ? likesRes.filter(r => r.type === 'like') : [];
          setLikesCount(likes.length);
        }
      } catch {
        if (mounted) {
          setHasLiked(false);
          setLikesCount(0);
        }
      }
    };
    fetchStates();
    return () => { mounted = false; };
  }, [post._id, currentUser]);

  const handleLikePost = async () => {
    if (!currentUser) return;

    try {
      if (hasLiked) {
        await postService.removeReaction(post._id, currentUser.id);
      } else {
        await postService.addReaction(post._id, {
          targetType: 'post',
          type: 'like'
        });
      }
      const [reactionRes, likesRes] = await Promise.all([
        postService.hasReacted(post._id, currentUser.id),
        postService.getReactionsForTarget(post._id)
      ]);
      setHasLiked(reactionRes.reacted);
      const likes = Array.isArray(likesRes) ? likesRes.filter(r => r.type === 'like') : [];
      setLikesCount(likes.length);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('No se pudo actualizar la reacción. Intenta de nuevo.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={post.author?.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
            alt={post.author?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {post.author?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4 object-cover max-h-96"
          />
        )}

        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <button
            onClick={handleLikePost}
            className={`flex items-center space-x-2 ${hasLiked
              ? 'text-pink-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'
              }`}
          >
            <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => onToggleComments(post._id)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments?.length || 0}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
