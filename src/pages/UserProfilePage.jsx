import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MoreHorizontal, MapPin, Users, Calendar, Clock } from 'lucide-react';
import userService from '../services/userService';

// Función para formatear fechas
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await userService.getUserById(userId);
                console.log(userData);
                setUser(userData);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('No se pudo cargar el perfil del usuario');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p>Usuario no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.posts?.length || 0} publicaciones
                        </p>
                    </div>
                </div>
            </header>

            {/* Perfil */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
                    {/* Foto de perfil */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        <img
                            src={user.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Información del usuario */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                                {user.name}
                            </h2>
                            <div className="flex space-x-3">
                                <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    Seguir
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-8 mb-6">
                            <div className="text-center">
                                <span className="block font-bold text-gray-900 dark:text-white">
                                    {user.photos?.length || 0}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fotos</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-gray-900 dark:text-white">
                                    {user.friendCount || 0}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Amigos</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-gray-900 dark:text-white">
                                    {user.videos?.length || 0}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Videos</span>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            {user.location?.coordinates && (
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                                    <span>Ubicación: {user.location.coordinates.join(', ')}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                                <span>Miembro desde: {formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-pink-500" />
                                <span>Última conexión: {formatDate(user.lastActive)}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sobre mí</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Intereses</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.interests?.length > 0 ? (
                                            user.interests.map((interest, index) => (
                                                <span key={index} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                                                    {interest}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">No ha añadido intereses</p>
                                        )}
                                    </div>
                                </div>

                                {user.preferences?.gender && user.preferences.gender.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Preferencias</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {user.preferences.gender.map((pref, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pestañas */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <button className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white border-t-2 border-pink-500 -mt-px">
                        Publicaciones
                    </button>
                </div>
            </div>

            {/* Grid de fotos */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fotos</h3>
              {user.photos?.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {user.photos.map((photo, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1} de ${user.name}`}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No hay fotos disponibles</p>
                </div>
              )}
            </div>

            {/* Grid de videos */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Videos</h3>
              {user.videos?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.videos.map((video, index) => (
                    <div key={index} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No hay videos disponibles</p>
                </div>
              )}
            </div>
        </div>
    );
};

export default UserProfilePage;
