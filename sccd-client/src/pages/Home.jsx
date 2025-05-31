import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

function Home() {
  const [activeTab, setActiveTab] = useState('login');
  
  const stats = [
    { icon: <FaMapMarkerAlt />, count: '150+', label: 'Communities Served' },
    { icon: <FaUsers />, count: '10,000+', label: 'Active Citizens' },
    { icon: <FaClipboardCheck />, count: '5,000+', label: 'Issues Resolved' },
    { icon: <FaChartLine />, count: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart City & Civic Disaster Management</h1>
              <p className="text-xl mb-8">Empowering citizens to report issues and track disaster management efforts in real-time.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/citizen" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300">
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex mb-6">
                  <button 
                    className={`flex-1 py-2 text-center font-medium ${activeTab === 'login' ? 'bg-white text-blue-600 rounded-lg' : 'text-white'}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                  <button 
                    className={`flex-1 py-2 text-center font-medium ${activeTab === 'register' ? 'bg-white text-blue-600 rounded-lg' : 'text-white'}`}
                    onClick={() => setActiveTab('register')}
                  >
                    Register
                  </button>
                </div>
                
                {activeTab === 'login' ? (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-white mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
                        placeholder="Enter your password"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Login As</label>
                      <select className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <option value="citizen">Citizen</option>
                        <option value="official">Government Official</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300"
                    >
                      Login
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-white mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
                        placeholder="Create a password"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Register As</label>
                      <select className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <option value="citizen">Citizen</option>
                        <option value="official">Government Official</option>
                      </select>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300"
                    >
                      Register
                    </motion.button>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Making a Difference in Our Communities
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-500 text-4xl mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.count}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Features of Our Platform
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-blue-600 mb-3">Issue Reporting</h3>
              <p className="text-gray-700">Easily report civic issues with detailed descriptions, location data, and photo uploads.</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-blue-600 mb-3">Real-time Tracking</h3>
              <p className="text-gray-700">Monitor the status of reported issues and disaster management efforts in real-time.</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-blue-600 mb-3">Map Visualization</h3>
              <p className="text-gray-700">View all reported issues on an interactive map to identify problem areas.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;