import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaExclamationTriangle, FaChartBar, FaClock, FaSpinner, FaCheckCircle, FaSearch, FaFilter, FaMapMarkedAlt, FaCog } from 'react-icons/fa';

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockIssues = [
      { id: 1, title: 'Broken Street Light', date: '2023-10-15', category: 'infrastructure', priority: 'medium', status: 'pending', description: 'Street light at the corner of Main St and 5th Ave has been out for over a week.', reporter: 'John Doe', location: 'Main St & 5th Ave' },
      { id: 2, title: 'Water Leakage', date: '2023-10-10', category: 'water', priority: 'high', status: 'in-progress', description: 'Major water leak from a broken pipe near City Mall.', reporter: 'Jane Smith', location: 'City Mall' },
      { id: 3, title: 'Garbage Collection', date: '2023-09-28', category: 'sanitation', priority: 'low', status: 'resolved', description: 'Garbage has not been collected in Residential Area B.', reporter: 'Mike Johnson', location: 'Residential Area B' },
    ];
    
    setTimeout(() => {
      setIssues(mockIssues);
      setStats({
        total: mockIssues.length,
        pending: mockIssues.filter(i => i.status === 'pending').length,
        inProgress: mockIssues.filter(i => i.status === 'in-progress').length,
        resolved: mockIssues.filter(i => i.status === 'resolved').length,
        users: 150 // Mock user count
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleCardClick = (cardType) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(selectedIssue && selectedIssue.id === issue.id ? null : issue);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in-progress': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'resolved': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Resolved</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-br from-emerald-600 to-teal-400 text-white py-20 px-8 relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ filter: 'blur(60px)' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ filter: 'blur(45px)' }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              className="text-3xl font-bold"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Admin Dashboard
            </motion.h1>
            <motion.div
              className="flex space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="bg-white text-emerald-600 py-2 px-6 rounded-full hover:bg-emerald-50 transition duration-300 flex items-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCog className="mr-2" />
                Settings
              </motion.button>
              <motion.button
                className="bg-emerald-700 text-white py-2 px-6 rounded-full hover:bg-emerald-800 transition duration-300 flex items-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUsers className="mr-2" />
                Manage Users
              </motion.button>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-emerald-50 mb-4 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Monitor and manage reported issues, user activity, and system performance.
          </motion.p>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 my-8">
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'total' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('total')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, rotateX: 10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <FaChartBar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Reports</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {stats.total}
              </motion.h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'pending' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('pending')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, rotateX: 10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {stats.pending}
              </motion.h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'inProgress' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('inProgress')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, rotateX: 10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaSpinner className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">In Progress</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {stats.inProgress}
              </motion.h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'resolved' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('resolved')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5, rotateX: 10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Resolved</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {stats.resolved}
              </motion.h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'users' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('users')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -5, rotateX: 10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Users</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {stats.users}
              </motion.h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-2xl">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues by title, description, or reporter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Issues</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <motion.button
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition duration-200 flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMapMarkedAlt className="mr-2" />
              View Map
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Issues Table */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">All Reports</h2>
          <p className="text-gray-500 mt-1">Manage and track all reported issues</p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              }}
              className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full"
            />
            <p className="ml-3 text-gray-600">Loading reports...</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((issue, index) => (
                  <motion.tr 
                    key={issue.id} 
                    className={`group hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedIssue?.id === issue.id ? 'bg-emerald-50' : ''}`}
                    onClick={() => handleIssueClick(issue)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)} mr-3`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors duration-150">{issue.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{issue.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{issue.reporter}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{issue.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(issue.priority)} mr-2`}></div>
                        <div className="text-sm text-gray-500 capitalize">{issue.priority}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(issue.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <motion.button 
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Update
                      </motion.button>
                      <motion.button 
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Assign
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600 mb-4">No issues found matching your criteria</p>
            <button 
              onClick={() => { setFilter('all'); setSearchQuery(''); }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            className="bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUsers className="mr-2" />
            Manage Users
          </motion.button>
          <motion.button
            className="bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaMapMarkedAlt className="mr-2" />
            View Analytics
          </motion.button>
          <motion.button
            className="bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCog className="mr-2" />
            System Settings
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;