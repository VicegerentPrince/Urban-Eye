import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaChartBar, FaExclamationTriangle, FaMap, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes, FaCity } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.header 
        className={`${scrolled ? 'bg-emerald-600/95 backdrop-blur-sm shadow-lg' : 'bg-emerald-600'} text-white transition-all duration-300 fixed w-full z-50`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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
                <FaCity className="text-2xl text-yellow-300" />
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold font-montserrat"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Urban-Eye
              </motion.h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 ml-10">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              {!isHomePage && (
                <>
                  <Link 
                    to="/citizen" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/citizen') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaChartBar />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/report" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/report') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaExclamationTriangle />
                    <span>Report Issue</span>
                  </Link>
                  <Link 
                    to="/map" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/map') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaMap />
                    <span>Map View</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
          
          {/* User Menu (Desktop) */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!isHomePage ? (
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="font-medium">{user.name}</span>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="text-white hover:text-emerald-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt />
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-emerald-600 font-bold px-4 py-2 rounded-full transition duration-200"
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
              className="md:hidden bg-emerald-700 py-3 px-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                to="/" 
                className={`flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200 ${isActive('/') ? 'bg-emerald-800 font-semibold' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              {!isHomePage && (
                <>
                  <Link 
                    to="/citizen" 
                    className={`flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200 ${isActive('/citizen') ? 'bg-emerald-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaChartBar />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/report" 
                    className={`flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200 ${isActive('/report') ? 'bg-emerald-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaExclamationTriangle />
                    <span>Report Issue</span>
                  </Link>
                  <Link 
                    to="/map" 
                    className={`flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200 ${isActive('/map') ? 'bg-emerald-800 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaMap />
                    <span>Map View</span>
                  </Link>
                </>
              )}
              
              {!isHomePage ? (
                <div className="pt-2 border-t border-emerald-600">
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
                    className="flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center space-x-2 hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200"
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
                    className="flex items-center space-x-2 w-full text-left hover:bg-emerald-800 px-3 py-2 rounded-lg transition duration-200"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-emerald-600 flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center bg-emerald-800 hover:bg-emerald-900 px-3 py-2 rounded-lg transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center bg-white text-emerald-600 font-bold px-3 py-2 rounded-lg transition duration-200"
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
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Urban-Eye</h3>
              <p className="text-gray-400 leading-relaxed">A platform for citizens to report civic issues and track disaster management efforts in real-time.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/report" className="text-gray-400 hover:text-white transition duration-200">Report Issue</Link>
                </li>
                <li>
                  <Link to="/map" className="text-gray-400 hover:text-white transition duration-200">Map View</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-200">Emergency Contacts</a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Email: support@sccd.gov</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Emergency: 911</li>
              </ul>
              <div className="mt-6">
                <motion.button
                  className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p>© 2023 Urban-Eye. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;