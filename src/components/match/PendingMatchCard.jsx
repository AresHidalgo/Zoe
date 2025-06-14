import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PendingMatchCard = ({ match, currentUserId }) => {

    const pendigMatches = match.users.find(user => user._id !== currentUserId);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-fade-in">
            <img
                src={pendigMatches?.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg'}
                alt={pendigMatches?.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {pendigMatches?.name || pendigMatches?.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{pendigMatches?.username || pendigMatches?.email?.split('@')[0]}
                </p>

                {match.commonInterests?.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Intereses en común:</p>
                        <div className="flex flex-wrap gap-2">
                            {match.commonInterests.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Pendiente de respuesta</span>
                    </div>
                    <Link
                        to={`/profile/${pendigMatches._id}`}
                        className="text-pink-500 hover:underline"
                    >
                        Ver perfil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PendingMatchCard;
