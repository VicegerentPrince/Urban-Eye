import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMapMarkedAlt, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

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
  const getCardContent = (type) => {
    switch(type) {
      case 'total':
        return (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold mb-2">Issue Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Infrastructure</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between">
                <span>Water</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between">
                <span>Sanitation</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-bold mb-2">Pending Issues</h4>
            <p>Your pending issues are being reviewed by our team. Average response time is 24 hours.</p>
            <button className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium">View All Pending</button>
          </div>
        );
      case 'inProgress':
        return (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold mb-2">In Progress Issues</h4>
            <p>Our team is actively working on these issues. You'll receive updates as progress is made.</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">View All In Progress</button>
          </div>
        );
      case 'resolved':
        return (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold mb-2">Resolved Issues</h4>
            <p>These issues have been successfully resolved. Please reopen if you're still experiencing problems.</p>
            <button className="mt-2 text-green-600 hover:text-green-800 font-medium">View All Resolved</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, 15, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
          style={{ filter: 'blur(40px)' }}
        />
        <motion.div 
          className="absolute bottom-0 left-20 w-40 h-40 bg-white opacity-10 rounded-full"
          animate={{ 
            x: [0, -10, 0], 
            y: [0, 10, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ filter: 'blur(30px)' }}
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
                className="bg-white text-blue-600 py-2 px-6 rounded-lg hover:bg-blue-50 transition duration-300 flex items-center shadow-lg"
              >
                <FaPlus className="mr-2" />
                Report New Issue
              </Link>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-blue-100 mb-4 max-w-2xl"
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
          className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'total' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
          onClick={() => handleCardClick('total')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Reports</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          <AnimatePresence>
            {selectedCard === 'total' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                {getCardContent('total')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'pending' ? 'ring-2 ring-yellow-500' : 'hover:shadow-lg'}`}
          onClick={() => handleCardClick('pending')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
          <AnimatePresence>
            {selectedCard === 'pending' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                {getCardContent('pending')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'inProgress' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
          onClick={() => handleCardClick('inProgress')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
          <AnimatePresence>
            {selectedCard === 'inProgress' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                {getCardContent('inProgress')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ${selectedCard === 'resolved' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
          onClick={() => handleCardClick('resolved')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
          </div>
          <AnimatePresence>
            {selectedCard === 'resolved' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                {getCardContent('resolved')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Recent Issues */}
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your Recent Reports</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="ml-3 text-gray-600">Loading your reports...</p>
          </div>
        ) : issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {issues.map(issue => (
                  <motion.tr 
                    key={issue.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedIssue?.id === issue.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleIssueClick(issue)}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{issue.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{issue.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue.priority)} mr-2`}></div>
                        <div className="text-sm text-gray-500 capitalize">{issue.priority}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(issue.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                      {issue.status !== 'resolved' && (
                        <a href="#" className="text-gray-600 hover:text-gray-900">Update</a>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            <AnimatePresence>
              {selectedIssue && (
                <motion.div 
                  className="p-6 bg-blue-50 border-t border-blue-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{selectedIssue.title}</h3>
                    <div className="flex items-center">
                      <span className="mr-2">Priority:</span>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedIssue.priority)} mr-1`}></div>
                      <span className="capitalize">{selectedIssue.priority}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Reported On</p>
                        <p className="font-medium">{selectedIssue.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaMapMarkedAlt className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium capitalize">{selectedIssue.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaInfoCircle className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div>{getStatusBadge(selectedIssue.status)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700">{selectedIssue.description}</p>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-3">
                    <motion.button 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedIssue(null)}
                    >
                      Close
                    </motion.button>
                    {selectedIssue.status !== 'resolved' && (
                      <motion.button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Report Your First Issue
            </Link>
          </div>
        )}
      </motion.div>
      
      {/* Quick Links */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/report" 
            className="bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Report an Issue
          </Link>
          <Link
            to="/map"
            className="bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            View Map
          </Link>
          <Link
            to="/profile"
            className="bg-yellow-600 text-white py-4 px-6 rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            Profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 
export default CitizenDashboard;
