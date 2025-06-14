import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { format } from 'date-fns';
import postService from '../../services/postService';

const CommentWithLike = ({ comment, currentUser }) => {
    const [hasLiked, setHasLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

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
                    postService.hasReacted(comment._id, currentUser.id),
                    postService.getReactionsForTarget(comment._id)
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
    }, [comment._id, currentUser]);

    const handleLikeComment = async () => {
        if (!currentUser) return;
        try {
            if (hasLiked) {
                await postService.removeReaction(comment._id, currentUser.id);
            } else {
                await postService.addReaction(comment._id, {
                    targetType: 'comment',
                    type: 'like'
                });
            }
            // Sincroniza ambos estados tras la acción
            const [reactionRes, likesRes] = await Promise.all([
                postService.hasReacted(comment._id, currentUser.id),
                postService.getReactionsForTarget(comment._id)
            ]);
            setHasLiked(reactionRes.reacted);
            const likes = Array.isArray(likesRes) ? likesRes.filter(r => r.type === 'like') : [];
            setLikesCount(likes.length);
        } catch (err) {
            console.error('Error toggling like:', err);
            alert(err?.response?.data?.message || 'No se pudo actualizar la reacción. Intenta de nuevo.');
        }
    };

    return (
        <div className="flex space-x-3">
            <img
                src={
                    comment.user?.profilePicture ||
                    'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'
                }
                alt={comment.user?.name}
                className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                            {comment.user?.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                        {comment.content}
                    </p>
                </div>
                <div className="flex items-center mt-1 ml-2 space-x-4">
                    <button
                        onClick={handleLikeComment}
                        className={`text-xs flex items-center space-x-1 ${hasLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'}`}
                    >
                        <Heart className={`h-3 w-3 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{likesCount}</span>
                    </button>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentWithLike;
