import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  console.log("USER IN NAVBAR:", user.user.name);

  return (
    <nav className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold cursor-pointer hover:text-blue-100 transition-colors duration-300"
              onClick={() => navigate('/dashboard')}
            >
              Event Hub
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate('/events')}
              className="hover:text-blue-100 transition-colors duration-300 font-medium"
            >
              Events
            </button>
            <button
              onClick={() => navigate('/create-event')}
              className="hover:text-blue-100 transition-colors duration-300 font-medium"
            >
              Create Event
            </button>
            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="relative hover:text-blue-100 transition-colors duration-300"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:text-blue-100 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-blue-600 font-medium"
              >
                <User className="w-5 h-5" />
                {user?.name}
              </button>
              <div 
                ref={profileMenuRef}
                className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-2xl z-50 transition-all duration-200 ${
                  isProfileMenuOpen ? 'block opacity-100 scale-100' : 'hidden opacity-0 scale-95'
                }`}
              >
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-200 font-medium"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 font-medium text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <button
              onClick={() => {
                navigate('/events');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-600"
            >
              Events
            </button>
            <button
              onClick={() => {
                navigate('/create-event');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-600"
            >
              Create Event
            </button>
            <button
              onClick={() => {
                navigate('/notifications');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-600"
            >
              Notifications
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-blue-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
