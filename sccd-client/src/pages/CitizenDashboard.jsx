import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMapMarkedAlt, FaInfoCircle, FaCalendarAlt, FaChartBar, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';

function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // This is mock data
    const mockIssues = [
      { id: 1, title: 'Broken Street Light', date: '2023-10-15', category: 'infrastructure', priority: 'medium', status: 'pending', description: 'Street light at the corner of Main St and 5th Ave has been out for over a week, creating a safety hazard at night.' },
      { id: 2, title: 'Water Leakage', date: '2023-10-10', category: 'water', priority: 'high', status: 'in-progress', description: 'Major water leak from a broken pipe near City Mall. Water is flowing onto the street and causing traffic issues.' },
      { id: 3, title: 'Garbage Collection', date: '2023-09-28', category: 'sanitation', priority: 'low', status: 'resolved', description: 'Garbage has not been collected in Residential Area B for two weeks, causing sanitation concerns.' },
    ];
    
    setTimeout(() => {
      setIssues(mockIssues);
      setStats({
        total: mockIssues.length,
        pending: mockIssues.filter(i => i.status === 'pending').length,
        inProgress: mockIssues.filter(i => i.status === 'in-progress').length,
        resolved: mockIssues.filter(i => i.status === 'resolved').length
      });
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleCardClick = (cardType) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(selectedIssue && selectedIssue.id === issue.id ? null : issue);
  };

  // Card content based on type
  const getCardDetails = (cardType) => {
    switch(cardType) {
      case 'total':
        return (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Issue Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Infrastructure</span>
                  <span className="text-sm font-medium text-emerald-600">40%</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Water</span>
                  <span className="text-sm font-medium text-emerald-600">25%</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Sanitation</span>
                  <span className="text-sm font-medium text-emerald-600">35%</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'pending':
        return (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pending Issues</h3>
                <p className="text-gray-600">Your pending issues are being reviewed by our team.</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Average Response: 24h
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">Issue #{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'inProgress':
        return (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">In Progress Issues</h3>
                <p className="text-gray-600">Our team is actively working on these issues.</p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Active Updates
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2].map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">Issue #{index + 1}</span>
                    </div>
                    <span className="text-sm text-emerald-600">In Progress</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-emerald-100 rounded-full h-1.5">
                      <motion.div 
                        className="bg-emerald-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'resolved':
        return (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Resolved Issues</h3>
                <p className="text-gray-600">Successfully resolved issues in your area.</p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                All Complete
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Issue #{index + 1}</div>
                      <div className="text-sm text-gray-500">Resolved 3 days ago</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

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
              Citizen Dashboard
            </motion.h1>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/report" 
                className="bg-white text-emerald-600 py-3 px-8 rounded-full hover:bg-emerald-50 transition duration-300 flex items-center shadow-lg"
              >
                <FaPlus className="mr-2" />
                Report New Issue
              </Link>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-emerald-50 mb-4 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome back! Track your reported issues, view their status, and stay updated on community developments.
          </motion.p>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'total' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('total')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ 
            y: -5,
            rotateX: 10,
            scale: 1.02
          }}
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
          <div className="mt-4">
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'pending' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('pending')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ 
            y: -5,
            rotateX: 10,
            scale: 1.02
          }}
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
          <div className="mt-4">
            <div className="w-full h-2 bg-yellow-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.pending / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'inProgress' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('inProgress')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ 
            y: -5,
            rotateX: 10,
            scale: 1.02
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
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
          <div className="mt-4">
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'resolved' ? 'ring-2 ring-emerald-500' : 'hover:shadow-xl'}`}
          onClick={() => handleCardClick('resolved')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ 
            y: -5,
            rotateX: 10,
            scale: 1.02
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
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
          <div className="mt-4">
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Recent Issues */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Your Recent Reports</h2>
            <p className="text-gray-500 mt-1">Track and manage your reported issues</p>
          </div>
          <motion.button
            className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
            whileHover={{ x: 5 }}
          >
            View All Reports
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
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
            <p className="ml-3 text-gray-600">Loading your reports...</p>
          </div>
        ) : issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {issues.map((issue, index) => (
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
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{issue.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                        {issue.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium capitalize">{issue.category}</span>
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
                    <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <motion.button 
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                      </motion.button>
                      {issue.status !== 'resolved' && (
                        <motion.button 
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Update
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            <AnimatePresence>
              {selectedIssue && (
                <motion.div 
                  className="p-6 bg-emerald-50 border-t border-emerald-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{selectedIssue.title}</h3>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-600">Priority:</span>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedIssue.priority)} mr-1`}></div>
                      <span className="capitalize text-gray-700">{selectedIssue.priority}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div 
                      className="bg-white rounded-xl p-4 shadow-sm"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-emerald-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Reported On</p>
                          <p className="font-medium text-gray-800">{selectedIssue.date}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-xl p-4 shadow-sm"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center">
                        <FaMapMarkedAlt className="text-emerald-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium text-gray-800 capitalize">{selectedIssue.category}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white rounded-xl p-4 shadow-sm"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center">
                        <FaInfoCircle className="text-emerald-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <div>{getStatusBadge(selectedIssue.status)}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedIssue.description}</p>
                  </div>
                  
                  <div className="flex justify-end mt-6 space-x-3">
                    <motion.button 
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedIssue(null)}
                    >
                      Close
                    </motion.button>
                    {selectedIssue.status !== 'resolved' && (
                      <motion.button 
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Update Status
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600 mb-4">You haven't reported any issues yet</p>
            <Link 
              to="/report" 
              className="bg-emerald-600 text-white py-2 px-6 rounded-lg hover:bg-emerald-700 transition duration-300"
            >
              Report Your First Issue
            </Link>
          </div>
        )}
      </motion.div>
      
      {/* Quick Links */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/report" 
              className="block bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Report an Issue
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/map"
              className="block bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              View Map
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/profile"
              className="block bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Profile
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 
export default CitizenDashboard;
