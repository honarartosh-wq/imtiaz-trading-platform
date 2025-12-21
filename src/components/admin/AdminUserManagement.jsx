import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminUserManagement = ({ branchName }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@imtiaz.com',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      branch: branchName || 'Main Branch',
      createdDate: '2024-01-15',
      lastLogin: '2025-12-21 10:30'
    },
    {
      id: 2,
      name: 'Support Admin',
      email: 'support@imtiaz.com',
      phone: '+1234567891',
      role: 'admin',
      status: 'active',
      branch: branchName || 'Main Branch',
      createdDate: '2024-02-20',
      lastLogin: '2025-12-20 15:45'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      status: 'active'
    });
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      confirmPassword: '',
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    setSuccess('User deleted successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!editingUser && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      } : u));
      setSuccess('User updated successfully');
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        branch: branchName || 'Main Branch',
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
      setSuccess('User created successfully');
    }

    setTimeout(() => setSuccess(null), 3000);
    setShowModal(false);
    resetForm();
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-500" />
            Admin User Management
          </h2>
          <p className="text-gray-400 mt-1">
            Manage admin users for {branchName || 'your branch'}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Admin User
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-900 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-100 font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-100">Error</h3>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Login</th>
                <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No admin users found. Click "Add Admin User" to create one.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs font-medium">
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === 'active' ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {user.lastLogin}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Admin Users</h3>
            <UserCog className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{users.length}</p>
          <p className="text-gray-400 text-sm mt-2">In {branchName || 'this branch'}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Active Users</h3>
            <CheckCircle className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {users.filter(u => u.status === 'active').length}
          </p>
          <p className="text-green-400 text-sm mt-2">Currently active</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Inactive Users</h3>
            <XCircle className="text-red-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {users.filter(u => u.status === 'inactive').length}
          </p>
          <p className="text-gray-400 text-sm mt-2">Currently inactive</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="border-b border-gray-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Edit Admin User' : 'Add New Admin User'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {!editingUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setError(null);
                }}
                className="px-4 py-2 text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
