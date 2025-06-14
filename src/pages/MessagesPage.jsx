import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import messageService from '../services/messageService';
import userService from '../services/userService';
import MainLayout from '../components/layout/MainLayout';
import { format, isToday, isYesterday } from 'date-fns';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          // Get user's chats
          const userChats = await messageService.getUserChats(currentUser.id);
          // Get user's friends
          const userFriends = await userService.getUserFriends(currentUser.id);
          // Get user's matches
          const userMatches = await userService.getUserMatches(currentUser.id);

          setFriends(userFriends);
          setMatches(userMatches);

          // IDs de amigos y matches
          const allowedIds = [
            ...userFriends.map(u => u.id || u._id),
            ...userMatches.map(u => u.id || u._id)
          ];

          // Filtrar chats solo con amigos o matches
          const filtered = userChats.filter(chat =>
            chat.participants.some(p => allowedIds.includes(p.id || p._id))
          );
          setChats(filtered);
        } catch (error) {
          console.error('Error fetching messages data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;



    return chat.participants.some(participant =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.name && participant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Unir amigos y matches, sin duplicados
  const allPossibleContacts = [...friends, ...matches.filter(m => !friends.some(f => (f.id || f._id) === (m.id || m._id)))];

  const filteredContacts = allPossibleContacts.filter(contact => {
    if (!searchQuery) return true;
    return (
      (contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.username && contact.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Mostrar solo los que NO tienen chat iniciado
  const friendsWithoutChats = filteredContacts.filter(contact =>
    !chats.some(chat =>
      chat.participants.some(participant => {
        const pid = participant.id || participant._id;
        const cid = contact.id || contact._id;
        return pid === cid;
      })
    )
  );



  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h1>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {/* Recent Chats */}
            {filteredChats.length > 0 ? (
              filteredChats.map((chat, idx) => {
                // Mostrar el otro participante (no el usuario actual)
                const otherParticipant = chat.participants.find(p => (p.id || p._id) !== currentUser.id && (p.id || p._id) !== currentUser._id) || chat.participants[0];
                // Obtener el último mensaje real del array de mensajes
                const lastMsg = Array.isArray(chat.messages) && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                // Contar mensajes no leídos para el usuario actual
                const unreadCount = Array.isArray(chat.messages)
                  ? chat.messages.filter(m => !m.read && (m.sender !== currentUser.id && m.sender !== currentUser._id)).length
                  : 0;
                return (
                  <Link
                    key={`chat-${chat.id || chat._id || idx}-${idx}`}
                    to={`/messages/${chat.id || chat._id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="p-4 flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={otherParticipant.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                          alt={otherParticipant.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {otherParticipant.name || otherParticipant.username || 'User'}
                          </h3>
                          {chat.updatedAt && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatMessageDate(chat.updatedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {lastMsg ? (
                            <>
                              {(lastMsg.sender === currentUser.id || lastMsg.sender === currentUser._id) ? 'You: ' : ''}
                              {lastMsg.content}
                            </>
                          ) : (
                            'No messages yet'
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No conversations yet.</p>
              </div>
            )}

            {/* Friends you can start a chat with */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-3">
                <Users className="h-5 w-5 mr-2" />
                Start a new conversation
              </h3>
              {friendsWithoutChats.length > 0 ? (
                <div className="space-y-2">
                  {Array.from(new Map(friendsWithoutChats.map(f => [(f.id || f._id), f])).values()).map((friend, idx) => (
                    <Link
                      key={`friend-${friend.id || friend._id || idx}`}
                      to={`/messages/new?userId=${friend.id || friend._id}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={friend.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                        alt={friend.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-pink-500">
                          {friend.name || friend.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Start a conversation
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No more friends to start a chat with.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MessagesPage;