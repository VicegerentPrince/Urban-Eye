import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaExclamationTriangle, FaChartBar, FaMapMarkedAlt, FaUserShield, FaFilter, FaSearch, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// ... existing code ...

// Add these imports at the top of the file
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    totalUsers: 0,
    activeUsers: 0,
    officials: 0
  });
  
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // This is mock data
    const mockIssues = [
      { id: 1, title: 'Broken Street Light', date: '2023-10-15', location: 'Main St & 5th Ave', category: 'infrastructure', priority: 'medium', status: 'pending', reportedBy: 'john.doe@example.com', assignedTo: 'maintenance@city.gov', description: 'Street light at the corner of Main St and 5th Ave has been out for over a week, creating a safety hazard at night.' },
      { id: 2, title: 'Water Leakage', date: '2023-10-10', location: 'City Mall, Downtown', category: 'water', priority: 'high', status: 'in-progress', reportedBy: 'jane.smith@example.com', assignedTo: 'water@city.gov', description: 'Major water leak from a broken pipe near City Mall. Water is flowing onto the street and causing traffic issues.' },
      { id: 3, title: 'Garbage Collection', date: '2023-09-28', location: 'Residential Area B', category: 'sanitation', priority: 'low', status: 'resolved', reportedBy: 'robert.johnson@example.com', assignedTo: 'sanitation@city.gov', description: 'Garbage has not been collected in Residential Area B for two weeks, causing sanitation concerns.' },
      { id: 4, title: 'Pothole on Highway', date: '2023-10-18', location: 'Highway 101, Mile 24', category: 'roads', priority: 'high', status: 'pending', reportedBy: 'susan.miller@example.com', assignedTo: null, description: 'Large pothole on Highway 101 at mile marker 24, causing traffic slowdowns and potential vehicle damage.' },
      { id: 5, title: 'Fallen Tree', date: '2023-10-20', location: 'Central Park', category: 'environment', priority: 'medium', status: 'in-progress', reportedBy: 'david.wilson@example.com', assignedTo: 'parks@city.gov', description: 'A large tree has fallen across the main walking path in Central Park after last night\'s storm.' },
    ];
    
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'citizen', status: 'active', joinDate: '2023-01-15', reportCount: 8 },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'citizen', status: 'active', joinDate: '2023-02-20', reportCount: 5 },
      { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'citizen', status: 'inactive', joinDate: '2023-03-10', reportCount: 2 },
      { id: 4, name: 'Sarah Williams', email: 'sarah.williams@city.gov', role: 'official', status: 'active', joinDate: '2023-01-05', department: 'Water Management' },
      { id: 5, name: 'Michael Brown', email: 'michael.brown@city.gov', role: 'official', status: 'active', joinDate: '2023-02-15', department: 'Road Maintenance' },
      { id: 6, name: 'Emily Davis', email: 'emily.davis@city.gov', role: 'admin', status: 'active', joinDate: '2023-01-01', department: 'System Administration' },
    ];
    
    setTimeout(() => {
      setIssues(mockIssues);
      setUsers(mockUsers);
      setStats({
        totalIssues: mockIssues.length,
        pendingIssues: mockIssues.filter(i => i.status === 'pending').length,
        resolvedIssues: mockIssues.filter(i => i.status === 'resolved').length,
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        officials: mockUsers.filter(u => u.role === 'official').length
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

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Admin</span>;
      case 'official': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Official</span>;
      case 'citizen': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Citizen</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(selectedIssue && selectedIssue.id === issue.id ? null : issue);
  };

  const handleUserClick = (user) => {
    setSelectedUser(selectedUser && selectedUser.id === user.id ? null : user);
  };

  const filteredIssues = issues.filter(issue => {
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (searchTerm && !issue.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredUsers = users.filter(user => {
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await issueService.deleteIssue(issueId);
        // Refresh issues list
        const updatedIssues = issues.filter(issue => issue._id !== issueId);
        setIssues(updatedIssues);
        setSelectedIssue(null);
      } catch (error) {
        console.error('Error deleting issue:', error);
        alert('Failed to delete issue. Please try again.');
      }
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      await issueService.updateIssue(issueId, { status: newStatus });
      // Update issue in the list
      const updatedIssues = issues.map(issue => 
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      );
      setIssues(updatedIssues);
      if (selectedIssue && selectedIssue._id === issueId) {
        setSelectedIssue({ ...selectedIssue, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      alert('Failed to update issue status. Please try again.');
    }
  };

  const handleAssignIssue = async (issueId, officialId) => {
    try {
      await issueService.updateIssue(issueId, { 
        assignee: officialId,
        status: 'in-progress'
      });
      // Refresh issues list
      const updatedIssue = await issueService.getIssueById(issueId);
      const updatedIssues = issues.map(issue => 
        issue._id === issueId ? updatedIssue : issue
      );
      setIssues(updatedIssues);
      if (selectedIssue && selectedIssue._id === issueId) {
        setSelectedIssue(updatedIssue);
      }
    } catch (error) {
      console.error('Error assigning issue:', error);
      alert('Failed to assign issue. Please try again.');
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateUser(userId, { status: newStatus });
      // Update user in the list
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        // Refresh users list
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await userService.updateUser(userId, userData);
      // Refresh user data
      const updatedUser = await userService.getUserById(userId);
      const updatedUsers = users.map(user => 
        user._id === userId ? updatedUser : user
      );
      setUsers(updatedUsers);
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8"
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
          <motion.h1 
            className="text-3xl font-bold mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Admin Dashboard
          </motion.h1>
          
          <motion.p 
            className="text-indigo-100 mb-6 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Manage users, monitor reported issues, and oversee the entire system from this central dashboard.
          </motion.p>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              className={`px-4 py-2 rounded-lg transition duration-300 ${activeTab === 'overview' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'}`}
              onClick={() => setActiveTab('overview')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FaChartBar className="inline mr-2" />
              Overview
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg transition duration-300 ${activeTab === 'issues' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'}`}
              onClick={() => setActiveTab('issues')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FaExclamationTriangle className="inline mr-2" />
              Issues Management
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg transition duration-300 ${activeTab === 'users' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'}`}
              onClick={() => setActiveTab('users')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <FaUsers className="inline mr-2" />
              User Management
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg transition duration-300 ${activeTab === 'map' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'}`}
              onClick={() => setActiveTab('map')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <FaMapMarkedAlt className="inline mr-2" />
              Map Overview
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
          <p className="ml-3 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                      <FaExclamationTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Issues</p>
                      <p className="text-2xl font-bold">{stats.totalIssues}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Pending: {stats.pendingIssues}</span>
                      <span>Resolved: {stats.resolvedIssues}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(stats.resolvedIssues / stats.totalIssues) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <FaUsers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Active: {stats.activeUsers}</span>
                      <span>Inactive: {stats.totalUsers - stats.activeUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <FaUserShield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Officials</p>
                      <p className="text-2xl font-bold">{stats.officials}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Officials: {stats.officials}</span>
                      <span>Citizens: {stats.totalUsers - stats.officials}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(stats.officials / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Recent Issues */}
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Issues</h2>
                  <button 
                    onClick={() => setActiveTab('issues')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {issues.slice(0, 3).map(issue => (
                        <motion.tr 
                          key={issue.id} 
                          className="hover:bg-gray-50 cursor-pointer"
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
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              {/* Recent Users */}
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Users</h2>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.slice(0, 3).map(user => (
                        <motion.tr 
                          key={user.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getStatusColor(user.status)} capitalize`}>{user.status}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.joinDate}</div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Issues Management Tab */}
          {activeTab === 'issues' && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">Issues Management</h2>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="text-gray-400" />
                    <select 
                      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search issues..."
                      className="border rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIssues.map(issue => (
                      <tr key={issue._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{issue.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                            issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={issue.status}
                            onChange={(e) => handleUpdateIssueStatus(issue._id, e.target.value)}
                            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{issue.reportedBy || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteIssue(issue._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <AnimatePresence>
                {selectedIssue && (
                  <motion.div 
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold">{selectedIssue.title}</h3>
                        <button
                          onClick={() => setSelectedIssue(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">Category</p>
                          <p className="font-medium">{selectedIssue.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Priority</p>
                          <p className="font-medium">{selectedIssue.priority}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <select
                            value={selectedIssue.status}
                            onChange={(e) => handleUpdateIssueStatus(selectedIssue._id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-gray-600">Reporter</p>
                          <p className="font-medium">{selectedIssue.reportedBy || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-gray-600">Description</p>
                        <p className="mt-1">{selectedIssue.description}</p>
                      </div>
                      
                      {selectedIssue.images && selectedIssue.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-gray-600 mb-2">Images</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedIssue.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Issue image ${index + 1}`}
                                className="rounded-lg object-cover h-48 w-full"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => handleDeleteIssue(selectedIssue._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Delete Issue
                        </button>
                        {selectedIssue.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateIssueStatus(selectedIssue._id, 'resolved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Mark as Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <motion.button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add New User
                  </motion.button>
                  
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..."
                      className="border rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.status}
                            onChange={(e) => handleUpdateUserStatus(user._id, e.target.value)}
                            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          
          {/* Map Overview Tab */}
          {activeTab === 'map' && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Map Overview</h2>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkedAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                    <p className="text-gray-600">Interactive map will be displayed here</p>
                    <p className="text-gray-500 text-sm mt-2">Showing all reported issues by location</p>
                    <Link 
                      to="/map" 
                      className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                      Open Full Map View
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <select
                      value={selectedUser.status}
                      onChange={(e) => handleUpdateUserStatus(selectedUser._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-gray-600">Join Date</p>
                    <p className="font-medium">
                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedUser.role === 'official' && (
                  <div className="mt-4">
                    <p className="text-gray-600">Department</p>
                    <input
                      type="text"
                      value={selectedUser.department || ''}
                      onChange={(e) => handleUpdateUser(selectedUser._id, { department: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleDeleteUser(selectedUser._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete User
                  </button>
                  {selectedUser.status === 'active' ? (
                    <button
                      onClick={() => handleUpdateUserStatus(selectedUser._id, 'inactive')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Deactivate User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateUserStatus(selectedUser._id, 'active')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Activate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;