import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import postService from '../services/postService';
import MainLayout from '../components/layout/MainLayout';
import MatchCard from '../components/match/MatchCard';
import SwipeSuggestion from '../components/match/SwipeSuggestion';
import PendingMatchCard from '../components/match/PendingMatchCard';

const TABS = ['Sugerencias', 'Matches', 'Me gustas', 'Pendientes'];

const MatchesPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Sugerencias');
  const [matches, setMatches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [likesSent, setLikesSent] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'Matches': {
            const matchData = await userService.getUserMatches(currentUser.id);
            setMatches(matchData);
            break;
          }
          case 'Sugerencias': {
            const suggestionsData = await userService.getUserSuggestions(currentUser.id);
            setSuggestions(suggestionsData);
            break;
          }
          case 'Me gustas': {
            const likes = await postService.getLikesSent(currentUser.id);
            setLikesSent(likes);
            break;
          }
          case 'Pendientes': {
            const pendingFriends = await userService.getUserSuggestions(currentUser.id);

            const pending = pendingFriends.array.forEach(async element => {
              return await postService.getPendingFriends(currentUser.id, element.id);
            });
            setPendingMatches(pending);
            break;
          }
          default:
            break;
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchPendingMatches = async () => {
        try {
          const pending = await postService.getPendingMatches(currentUser.id);
          setPendingMatches(pending);
        } catch (error) {
          console.error('Error fetching pending matches:', error);
        }
      };
      fetchPendingMatches();
    }
  }, [currentUser]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Sugerencias':
        return <SwipeSuggestion users={suggestions} userAuth={currentUser} />;
      case 'Matches':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => (
              <MatchCard key={match._id} match={match} currentUserId={currentUser.id} />
            ))}
          </div>
        );
      case 'Me gustas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {likesSent.map(user => (
              <MatchCard
                key={user._id}
                match={{ users: [currentUser, user], commonInterests: [], matchScore: 0 }}
                currentUserId={currentUser.id}
              />
            ))}
          </div>
        );
      case 'Pendientes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMatches.map(match => (
              <PendingMatchCard key={match._id} match={match} currentUserId={currentUser.id} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-4 border-b dark:border-gray-700">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium ${activeTab === tab
                ? 'border-b-2 border-pink-500 text-pink-500'
                : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default MatchesPage;
