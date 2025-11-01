import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Edit, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(data);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setLoading(true);
      await authAPI.updatePassword(data);
      toast.success('Password updated successfully!');
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'password', name: 'Change Password', icon: Edit },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-outline btn-sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editing ? (
                  <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="input mt-1"
                        {...register('fullName', { required: 'Full name is required' })}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="input mt-1"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-md"
                      >
                        {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          reset();
                        }}
                        className="btn btn-outline btn-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{user.fullName}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="badge badge-default mt-1">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="input mt-1"
                      {...register('currentPassword', { required: 'Current password is required' })}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="input mt-1"
                      {...register('newPassword', { 
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="input mt-1"
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => {
                          const newPassword = document.getElementById('newPassword').value;
                          return value === newPassword || 'Passwords do not match';
                        }
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-md"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;





