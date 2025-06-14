import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Image, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import messageService from '../services/messageService';
import MainLayout from '../components/layout/MainLayout';
import { format } from 'date-fns';


const ChatPage = () => {

  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Check if this is a new chat
  const isNewChat = chatId === 'new';

  // Get userId from query params for new chats
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('userId');

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUser) return;

      try {
        let chatData, messagesData;

        // Evitar llamadas si los datos no están listos o si ya hay chat
        if (isNewChat && targetUserId) {
          // Solo crear chat si no existe aún
          if (!chat || !chat.id) {
            chatData = await messageService.getOrCreateChat([currentUser.id, targetUserId]);
            if (chatData && (chatData.id || chatData._id)) {
              navigate(`/messages/${chatData.id || chatData._id}`, { replace: true });
              return; // Detener aquí para evitar doble llamada
            }
          } else {
            // Ya existe chat, redirigir
            navigate(`/messages/${chat.id}`, { replace: true });
            return;
          }
        } else if (chatId && chatId !== 'undefined') {
          // Obtener el chat existente solo si el chatId es válido
          chatData = await messageService.getChatById(chatId);
          // Obtener mensajes
          messagesData = await messageService.getChatMessages(chatId);
          setMessages(messagesData);
          // Marcar como leídos
          await messageService.markMessagesAsRead(chatId, currentUser.id);
        }

        if (chatData) {
          // Normalizar el id
          if (!chatData.id && chatData._id) {
            chatData.id = chatData._id;
          }
          setChat(chatData);

          // Find the other user in the chat
          const otherParticipant = chatData.participants.find(
            participant => (participant.id || participant._id) !== currentUser.id
          );

          if (otherParticipant) {
            setOtherUser(otherParticipant);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);

      }
    };

    initializeChat();
  }, [currentUser, chatId, isNewChat, targetUserId, navigate]);


  // Actualización en tiempo real (polling)
  useEffect(() => {
    if (!chat || !chat.id) return;
    const interval = setInterval(async () => {
      try {
        const messagesData = await messageService.getChatMessages(chat.id);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error polling messages:', error);
        // Opcional: manejar error de polling
      }
    }, 2000); // cada 2 segundos
    return () => clearInterval(interval);
  }, [chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || !chat || !chat.id) return;

    try {
      const messageData = {
        sender: currentUser.id,
        content: messageText
      };

      const newMessage = await messageService.sendMessage(chat.id, messageData);
      setMessages([...messages, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!chat || !otherUser) {
    return (
      <MainLayout>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Chat Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This conversation doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/messages"
            className="inline-block px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600"
          >
            Back to Messages
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
        {/* Chat Header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-3">
          <button
            onClick={() => navigate('/messages')}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <Link to={`/profile/${otherUser.id}`} className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <img
                src={otherUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                alt={otherUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </div>
            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                {otherUser.fullName || otherUser.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Online now
              </p>
            </div>
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-600 dark:bg-gray-750">
          {messages.length > 0 ? (
            messages.map(message => {
              const isCurrentUser = (message.senderId || message.sender?._id || message.sender) === currentUser.id;

              return (
                <div
                  key={message.id || message._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end space-x-2 max-w-[75%]">
                    {!isCurrentUser && (
                      <img
                        src={otherUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                        alt={otherUser.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}

                    <div
                      className={`rounded-lg p-3 ${isCurrentUser
                        ? 'bg-pink-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow'
                        }`}
                    >
                      <p>{message.content}</p>
                      <span
                        className={`text-xs ${isCurrentUser ? 'text-pink-200' : 'text-gray-500 dark:text-gray-400'
                          } block mt-1`}
                      >
                        {(message.timestamp || message.createdAt) && !isNaN(new Date(message.timestamp || message.createdAt))
                          ? format(new Date(message.timestamp || message.createdAt), 'h:mm a')
                          : '--'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>



        {/* Message Input */}
        <div className="p-4 border-t dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Image className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;