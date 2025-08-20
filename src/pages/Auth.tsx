import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Users, Gavel } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'participant' | 'organizer' | 'judge'>('participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const validateForm = () => {
    // Basic field validation
    if (!formData.email || !formData.password || (isSignUp && !formData.name)) {
      setError('Please fill in all fields');
      return false;
    }

    // Name validation for signup
    if (isSignUp && formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      let success = false;
      if (isSignUp) {
        success = await signup(formData.name, formData.email, formData.password, selectedRole);
        if (!success) {
          setError('User already exists with this email or validation failed');
          return;
        }
      } else {
        success = await login(formData.email, formData.password, selectedRole);
        if (!success) {
          setError('Invalid email, password, or role. Please check your credentials.');
          return;
        }
      }

      if (success) {
        // Navigate based on role
        switch (selectedRole) {
          case 'participant':
            navigate('/dashboard/participant');
            break;
          case 'organizer':
            navigate('/dashboard/organizer');
            break;
          case 'judge':
            navigate('/dashboard/judge');
            break;
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const roleOptions = [
    {
      value: 'participant' as const,
      label: 'Participant',
      icon: <User className="h-5 w-5" />,
      description: 'Join events and compete'
    },
    {
      value: 'organizer' as const,
      label: 'Organizer',
      icon: <Users className="h-5 w-5" />,
      description: 'Create and manage events'
    },
    {
      value: 'judge' as const,
      label: 'Judge',
      icon: <Gavel className="h-5 w-5" />,
      description: 'Evaluate submissions'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignUp ? 'Join HackHub' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {isSignUp ? 'Create your account to get started' : 'Sign in to continue'}
          </p>
        </div>

        <div className="card p-8">
          {/* Demo Credentials Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>Participant: participant@example.com</div>
              <div>Organizer: organizer@example.com</div>
              <div>Judge: judge@example.com</div>
              <div className="mt-1 font-medium">Password: password123 (min 6 chars)</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role.value
                        ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={(e) => setSelectedRole(e.target.value as typeof selectedRole)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`mr-3 ${selectedRole === role.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                        {role.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${selectedRole === role.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                          {role.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;