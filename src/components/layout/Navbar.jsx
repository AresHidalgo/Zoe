import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Bell, Search, Sun, Moon, Menu, X, User, LogOut, Settings, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import userService from '../../services/userService';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser) {
        try {
          const friendsData = await userService.getUserFriends(currentUser.id);
          setFriends(friendsData);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      }
    };

    fetchFriends();
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Filter friends whose name or username contains the search query (case insensitive)
    // and exclude the current user
    const results = friends.filter(friend => {
      const fullName = (friend.fullName || '').toLowerCase();
      const username = (friend.username || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      
      return (fullName.includes(query) || username.includes(query)) && 
             friend.id !== currentUser?.id;
    });

    setSearchResults(results);
    setShowSearchResults(true);
    setIsSearching(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (username) => {
    navigate(`/profile/${username}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">Zoe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="relative">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </form>
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      {searchResults.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleResultClick(user.username)}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                        >
                          <img
                            src={user.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                            alt={user.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showSearchResults && searchResults.length === 0 && searchQuery && !isSearching && (
                    <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-500 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>

                <Link to="/messages" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <MessageCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  {/* Notification dot - show when there are unread messages */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full"></span>
                </Link>

                <Link to="/notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  {/* Notification dot - show when there are unread notifications */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full"></span>
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={currentUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{currentUser.fullName || currentUser.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">@{currentUser.username}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>

                    <Link
                      to="/matches"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Matches
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <img
                    src={currentUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{currentUser.fullName || currentUser.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{currentUser.username}</p>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </form>
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      {searchResults.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleResultClick(user.username)}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                        >
                          <img
                            src={user.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
                            alt={user.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showSearchResults && searchResults.length === 0 && searchQuery && !isSearching && (
                    <div className="mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-500 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/messages"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>

                <Link
                  to="/matches"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Matches
                </Link>

                <Link
                  to="/settings"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>

                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>

                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
