import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import { userService, issueService } from '../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userData = await userService.getUserProfile();
        setProfile(userData);
        
        // Fetch user's reported issues
        const issuesData = await issueService.getIssues();
        setUserIssues(issuesData);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Function to display status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in-progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'resolved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

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
        
        {/* Add Reported Issues Section */}
        {profile?.userType === 'citizen' && (
          <motion.div
            className="bg-white shadow-xl rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaExclamationTriangle className="mr-2" /> My Reported Issues
              </h2>
            </div>
            
            <div className="p-6">
              {userIssues.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You haven't reported any issues yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userIssues.map(issue => (
                        <tr key={issue._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{issue.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(issue.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Profile;