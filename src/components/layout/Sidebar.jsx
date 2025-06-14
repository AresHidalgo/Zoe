import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, User, MessageCircle, Heart, Bell, Settings, Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center space-x-3 mb-6">
        <img
          src={currentUser.profilePicture || 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysplit&w=150'}
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white">
            {currentUser.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{currentUser.email.split('@')[0]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <NavItem to="/" icon={Home} label="Home" active={isActive('/')} />
        <NavItem to="/profile" icon={User} label="Profile" active={isActive('/profile')} />
        <NavItem to="/messages" icon={MessageCircle} label="Messages" active={isActive('/messages')} />
        <NavItem to="/matches" icon={Heart} label="Matches" active={isActive('/matches')} />
        <NavItem
          to="/notifications"
          icon={Bell}
          label="Notifications"
          active={isActive('/notifications')}
          badge={2} // ← en futuro, cambiar por conteo real de notificaciones
        />
        <NavItem to="/friends" icon={Users} label="Friends" active={isActive('/friends')} />
        <NavItem to="/settings" icon={Settings} label="Settings" active={isActive('/settings')} />
      </div>
    </div>
  );
};

// Reusable link item
const NavItem = ({ to, icon: Icon, label, active, badge }) => {
  return (
    <Link
      to={to}
      className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className={`h-5 w-5 mr-3 ${active ? 'text-pink-600 dark:text-pink-400' : ''}`} />
      <span className="font-medium">{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;
