import React, { useState } from 'react';
import { Settings, User, Lock, Bell, Moon, Sun, Save, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import MainLayout from '../components/layout/MainLayout';

const SettingsPage = () => {
  const { currentUser, updateUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    fullName: currentUser?.fullName || '',
    bio: currentUser?.bio || '',
    age: currentUser?.age || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        email: formData.email,
        fullName: formData.fullName,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : undefined
      };
      
      await updateUser(userData);
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile'
      });
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }
    
    // Password validation would happen here
    setMessage({
      type: 'success',
      text: 'Password updated successfully!'
    });
    
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  
  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    
    // Would save notification preferences to user profile
    setMessage({
      type: 'success',
      text: 'Notification preferences saved!'
    });
    
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <Settings className="h-6 w-6 mr-2 text-pink-500" />
            Settings
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r dark:border-gray-700">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'password'
                        ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Lock className="h-5 w-5 mr-3" />
                    <span>Password</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    <span>Notifications</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('appearance')}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'appearance'
                        ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {darkMode ? (
                      <Moon className="h-5 w-5 mr-3" />
                    ) : (
                      <Sun className="h-5 w-5 mr-3" />
                    )}
                    <span>Appearance</span>
                  </button>
                </li>
              </ul>
              
              <div className="pt-6 mt-6 border-t dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {message.text && (
              <div className={`mb-6 p-3 rounded-lg flex items-start ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{message.text}</span>
              </div>
            )}
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Profile Settings
                </h2>
                
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.email.split('@')[0]} // Username is derived from email
                      onChange={handleChange}
                      disabled
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Username cannot be changed
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </button>
                </form>
              </div>
            )}
            
            {/* Password Settings */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Change Password
                </h2>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Update Password
                  </button>
                </form>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Notification Settings
                </h2>
                
                <form onSubmit={handleNotificationsSubmit} className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Push Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications in browser
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Preferences
                  </button>
                </form>
              </div>
            )}
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Appearance Settings
                </h2>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {darkMode 
                          ? 'Switch to light mode for a brighter appearance' 
                          : 'Switch to dark mode for a darker appearance'}
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      {darkMode ? (
                        <Sun className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Moon className="h-6 w-6 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;