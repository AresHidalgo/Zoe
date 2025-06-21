import React from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import RightSidebar from './RightSidebar';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = ({ children }) => {
  useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6">
            {/* Left Sidebar - only shown if user is logged in */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-6 space-y-6">
              {children}
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-20">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
