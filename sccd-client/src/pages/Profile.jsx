import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaBuilding } from 'react-icons/fa';
import { userService } from '../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getUserProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-12">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                <FaUser className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-emerald-100 mt-2 capitalize">{profile.userType}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="flex items-center p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <FaEnvelope className="h-6 w-6 text-emerald-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <FaPhone className="h-6 w-6 text-emerald-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone || 'Not provided'}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <FaCalendar className="h-6 w-6 text-emerald-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              {profile.userType === 'official' && (
                <motion.div
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaBuilding className="h-6 w-6 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{profile.department}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Account Status</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile; 