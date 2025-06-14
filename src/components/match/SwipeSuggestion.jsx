import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';
import userService from '../../services/userService';

const SwipeSuggestion = ({ users = [], userAuth }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [skipped, setSkipped] = useState([]);
    const [liked, setLiked] = useState([]);
    const [disabledUsers, setDisabledUsers] = useState(new Set());


    const UserKnow = users[currentIndex];

    const handleSkip = () => {
        setSkipped([...skipped, UserKnow]);
        setCurrentIndex(prev => prev + 1);
    };

    const handleLike = async () => {
        if (disabledUsers.has(UserKnow._id)) return;

        try {
            await userService.sendFriendRequest(userAuth.id, UserKnow._id);
            setDisabledUsers(new Set([...disabledUsers, UserKnow._id]));
            setLiked([...liked, UserKnow]);
            setCurrentIndex(prev => prev + 1);
        } catch (err) {
            if (err.response?.status === 409) {
                console.warn('Solicitud ya fue enviada anteriormente');
            } else {
                console.error('Error al enviar solicitud:', err);
            }
            setDisabledUsers(new Set([...disabledUsers, UserKnow._id]));
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (!UserKnow) {
        return (
            <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No hay más sugerencias por ahora
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Vuelve más tarde para descubrir nuevas personas compatibles contigo.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-fade-in">
            <img
                src={UserKnow.photos?.[0] || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg'}
                alt={UserKnow.name}
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {UserKnow.name}, {UserKnow.age || 'Edad desconocida'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    @{UserKnow.username || UserKnow.email?.split('@')[0]}
                </p>

                {UserKnow.interests?.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Intereses:</p>
                        <div className="flex flex-wrap gap-2">
                            {UserKnow.interests.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="inline-block px-3 py-1 text-sm bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-around mt-6">
                    <button
                        onClick={handleSkip}
                        className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={handleLike}
                        className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600"
                    >
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwipeSuggestion;
