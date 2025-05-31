import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaCog, FaBell, FaUserCircle, FaLock, FaMapMarkedAlt } from 'react-icons/fa';
import { userService } from '../services/api';

function CitizenSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfilePublicly: true,
      shareLocation: true,
    },
    display: {
      darkMode: false,
      language: 'english',
    }
  });
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUserProfile();
        setUser(userData);
        // In a real app, you would fetch actual settings from the backend
        // For now, we'll use the default settings defined in state
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1000);
    
    // In a real app, you would save the settings to the backend
    // await userService.updateSettings(settings);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your preferences and account settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <FaBell className="text-emerald-500 mr-3 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Email Notifications</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Push Notifications</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700">SMS Notifications</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <FaLock className="text-emerald-500 mr-3 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Privacy Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Show Profile Publicly</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.privacy.showProfilePublicly}
                    onChange={(e) => handleSettingChange('privacy', 'showProfilePublicly', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Share Location</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.privacy.shareLocation}
                    onChange={(e) => handleSettingChange('privacy', 'shareLocation', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <FaCog className="text-emerald-500 mr-3 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Display Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Dark Mode</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.display.darkMode}
                    onChange={(e) => handleSettingChange('display', 'darkMode', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Language</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={settings.display.language}
                  onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Map Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <FaMapMarkedAlt className="text-emerald-500 mr-3 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Map Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Default Map Radius (km)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                  value="5"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1km</span>
                  <span>5km</span>
                  <span>10km</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <FaUserCircle className="text-emerald-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Citizen
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-800 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Issues Reported</span>
                <span className="text-gray-800 font-medium">12</span>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <FaCheckCircle className="mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CitizenSettings;