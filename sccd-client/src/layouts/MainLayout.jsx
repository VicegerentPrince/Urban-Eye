import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaChartBar, FaExclamationTriangle, FaMap, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'citizen',
    avatar: 'https://i.pravatar.cc/150?img=68'
  });

  // Handle scroll event for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      // Update the header section with enhanced animations
      <motion.header 
        className={`${scrolled ? 'bg-blue-600/95 backdrop-blur-sm shadow-lg' : 'bg-blue-600'} text-white transition-all duration-300 fixed w-full z-50`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FaExclamationTriangle className="text-2xl text-yellow-300" />
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold font-montserrat"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                SCCD Application
              </motion.h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 ml-10">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              {!isHomePage && (
                <>
                  <Link 
                    to="/citizen" 
                    className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/citizen') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaChartBar />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/report" 
                    className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/report') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaExclamationTriangle />
                    <span>Report Issue</span>
                  </Link>
                  <Link 
                    to="/map" 
                    className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/map') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaMap />
                    <span>Map View</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
          
          {/* User Menu (Desktop) - Update with enhanced animations */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!isHomePage ? (
              <div className="relative group">
                <motion.button 
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span>{user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <FaUser className="text-gray-500" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <FaCog className="text-gray-500" />
                    <span>Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="text-gray-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition duration-300"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg transition duration-300"
                >
                  Register
                </motion.button>
              </div>
            )}
          </motion.div>
          
          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </motion.button>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              className="md:hidden bg-blue-700 py-3 px-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                to="/" 
                className={`flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded ${isActive('/') ? 'bg-blue-800 font-semibold' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              {!isHomePage && (
                <>
                  <Link 
                    to="/citizen" 
                    className={`flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded ${isActive('/citizen') ? 'bg-blue-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaChartBar />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/report" 
                    className={`flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded ${isActive('/report') ? 'bg-blue-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaExclamationTriangle />
                    <span>Report Issue</span>
                  </Link>
                  <Link 
                    to="/map" 
                    className={`flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded ${isActive('/map') ? 'bg-blue-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaMap />
                    <span>Map View</span>
                  </Link>
                </>
              )}
              
              {!isHomePage ? (
                <div className="pt-2 border-t border-blue-600">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img 
                      src={user.avatar} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <span>{user.name}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center space-x-2 hover:bg-blue-800 px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCog />
                    <span>Settings</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left hover:bg-blue-800 px-3 py-2 rounded"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-blue-600 flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center bg-white text-blue-600 font-bold px-3 py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SCCD Application</h3>
              <p className="text-gray-400">A platform for citizens to report civic issues and track disaster management efforts.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/report" className="text-gray-400 hover:text-white">Report Issue</Link></li>
                <li><Link to="/map" className="text-gray-400 hover:text-white">Map View</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Emergency Contacts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: support@sccd.gov</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-400">Emergency: 911</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© 2023 SCCD Application. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;