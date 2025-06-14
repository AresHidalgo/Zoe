import React, { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import postService from '../../services/postService'
import CommentWithLike from './CommentWithLike';

const CommentList = ({ postId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postComments = await postService.getCommentsForPost(postId);
        setComments(postComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const added = await postService.addComment(postId, {
        content: newComment
      });

      setComments([...comments, added]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-b-lg border-t dark:border-gray-600'>
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
           {comments.length > 0 ? (
            comments.map(comment => (
              <CommentWithLike
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mt-4 flex items-center space-x-2">
        <img
          src={
            currentUser?.profilePicture ||
            'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'
          }
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentList;
