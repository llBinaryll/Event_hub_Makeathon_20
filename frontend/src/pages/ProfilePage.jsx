import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Shield, Bell, Save, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ErrorAlert, SuccessAlert } from '../components/AlertComponents';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const userData = user?.user || user;
  
  // Form state for preferences
  const [preferences, setPreferences] = useState({
    eventTypes: userData?.preferences?.eventTypes || [],
    notificationFrequency: userData?.preferences?.notificationFrequency || 'DAILY',
  });

  const eventTypeOptions = ['Tech', 'Fun', 'Business', 'Educational', 'Sports', 'Other'];
  const notificationOptions = ['DAILY', 'WEEKLY', 'NEVER'];

  const handleEventTypeToggle = (type) => {
    setPreferences((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter((t) => t !== type)
        : [...prev.eventTypes, type],
    }));
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      setError('');
      
      await authService.updatePreferences({
        eventTypes: preferences.eventTypes,
        notificationFrequency: preferences.notificationFrequency,
      });
      
      setSuccess('Preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ORGANIZER':
        return 'bg-purple-100 text-purple-800';
      case 'SPEAKER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-primary hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {error && (
            <ErrorAlert message={error} onClose={() => setError('')} />
          )}
          {success && (
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                    <span className="text-3xl font-bold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {userData?.name}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                      userData?.role
                    )}`}
                  >
                    {userData?.role || 'USER'}
                  </span>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {userData?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">DC Location</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.dcLocation || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Account Status</p>
                      <p className="text-sm font-medium text-green-600">
                        {userData?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary" />
                  Preferences
                </h3>

                <div className="space-y-8">
                  {/* Event Types */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Preferred Event Types
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Select the types of events you're interested in. These help personalize your recommendations.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {eventTypeOptions.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleEventTypeToggle(type)}
                          className={`p-3 rounded-lg border-2 transition-all font-medium ${
                            preferences.eventTypes.includes(type)
                              ? 'border-primary bg-primary bg-opacity-10 text-primary'
                              : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Frequency */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Notification Frequency
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      How often would you like to receive notifications about events and recommendations?
                    </p>
                    <div className="space-y-2">
                      {notificationOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50"
                          style={{
                            borderColor:
                              preferences.notificationFrequency === option
                                ? '#3b82f6'
                                : '#e5e7eb',
                            backgroundColor:
                              preferences.notificationFrequency === option
                                ? '#eff6ff'
                                : 'transparent',
                          }}
                        >
                          <input
                            type="radio"
                            name="notificationFrequency"
                            value={option}
                            checked={
                              preferences.notificationFrequency === option
                            }
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                notificationFrequency: e.target.value,
                              }))
                            }
                            className="w-4 h-4 text-primary"
                          />
                          <span className="ml-3 font-medium text-gray-900">
                            {option === 'DAILY' && 'Daily'}
                            {option === 'WEEKLY' && 'Weekly'}
                            {option === 'NEVER' && 'Never'}
                          </span>
                          <span className="ml-auto text-sm text-gray-600">
                            {option === 'DAILY' && 'Get updates every day'}
                            {option === 'WEEKLY' && 'Get updates once a week'}
                            {option === 'NEVER' && 'No notifications'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={handleSavePreferences}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-semibold"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="font-medium text-gray-900">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span>Last Updated:</span>
                    <span className="font-medium text-gray-900">
                      {userData?.updatedAt
                        ? new Date(userData.updatedAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
