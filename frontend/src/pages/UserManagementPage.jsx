import React, { useState, useEffect } from 'react';
import { Shield, Users, ChevronDown } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/AlertComponents';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const UserManagementPage = () => {
  const { user } = useAuth();
  const userData = user?.user || user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const users = await authService.getAllUsers();
      setUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setError('');
      const updatedUser = await authService.updateUserRole(userId, newRole);
      setSuccess('User role updated successfully!');
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? updatedUser : u
      ));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is admin
  if (!userData || userData.role !== 'ADMIN') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              Only admins can access this page.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
            </div>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>

          {/* Alerts */}
          {error && <ErrorAlert message={error} onClose={() => setError('')} />}
          {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">DC Location</th>
                    <th className="px-6 py-4 text-left font-semibold">Current Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Change Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{user.dcLocation}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={updatingUserId === user._id || user._id === userData._id}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="USER">User</option>
                            <option value="ORGANIZER">Organizer</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SPEAKER">Speaker</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          {updatingUserId === user._id ? (
                            <span className="text-primary font-semibold">Updating...</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Active</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Total Users: <span className="font-semibold">{filteredUsers.length}</span>
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-semibold">{filteredUsers.filter(u => u.role === 'ADMIN').length}</span> Admins • 
                <span className="font-semibold ml-1">{filteredUsers.filter(u => u.role === 'ORGANIZER').length}</span> Organizers
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm">
              <strong>Note:</strong> You cannot change your own role. Only the super admin can change admin roles after the initial setup.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get role badge color
function getRoleBadgeColor(role) {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800';
    case 'ORGANIZER':
      return 'bg-purple-100 text-purple-800';
    case 'SPEAKER':
      return 'bg-blue-100 text-blue-800';
    case 'USER':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
