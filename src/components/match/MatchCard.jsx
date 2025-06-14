// components/match/MatchCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Star } from 'lucide-react';

const MatchCard = ({ match, currentUserId }) => {
  const matchedUser = match.users.find(u => u._id !== currentUserId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="relative">
        <img
          src={matchedUser?.photos?.[0] || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg'}
          alt={matchedUser?.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {match.matchScore && (
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center shadow-sm">
            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {match.matchScore}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">{matchedUser?.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{matchedUser?.email?.split('@')[0]}</p>

        {match.commonInterests?.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Intereses en común:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {match.commonInterests.map((interest, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-4">
          <Link
            to={`/messages/new?userId=${matchedUser?._id}`}
            className="flex-1 py-2 bg-pink-500 text-white text-sm rounded-lg flex justify-center items-center hover:bg-pink-600 transition"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chatear
          </Link>
          <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
