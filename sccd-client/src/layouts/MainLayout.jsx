import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaChartBar, FaExclamationTriangle, FaMap, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes, FaCity } from 'react-icons/fa';
import { authService } from '../services/api';

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

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

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user) {
      // Navigate based on user type
      switch(user.userType) {
        case 'admin':
          navigate('/admin');
          break;
        case 'official':
          navigate('/official');
          break;
        default:
          navigate('/citizen');
      }
    } else {
      // If no user is logged in, go to home
      navigate('/');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
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
            <a href="#" onClick={handleLogoClick} className="flex items-center space-x-2">
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
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 ml-10">
              {!user && (
                <>
                  <Link 
                    to="/" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaHome />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/about') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <span>About</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/contact') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <span>Contact</span>
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link 
                    to={`/${user.userType === 'admin' ? 'admin' : user.userType === 'official' ? 'official' : 'citizen'}`} 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/citizen') || isActive('/admin') || isActive('/official') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaChartBar />
                    <span>Dashboard</span>
                  </Link>
                  {user.userType === 'citizen' && (
                    <Link 
                      to="/report" 
                      className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/report') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                    >
                      <FaExclamationTriangle />
                      <span>Report Issue</span>
                    </Link>
                  )}
                  <Link 
                    to="/map" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/map') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaMap />
                    <span>Map View</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/profile') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  {user.userType === 'admin' && (
                    <Link 
                      to="/settings" 
                      className={`flex items-center space-x-1 hover:text-emerald-200 transition-colors duration-200 ${isActive('/settings') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
                    >
                      <FaCog />
                      <span>Settings</span>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </motion.div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors duration-200"
                >
                  <FaUser />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors duration-200"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-emerald-800 rounded-full px-4 py-2 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Rest of the component remains the same */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-emerald-600 md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <div className="flex flex-col h-full pt-20 px-4">
              {!user ? (
                <>
                  <Link 
                    to="/" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/login" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to={`/${user.userType === 'admin' ? 'admin' : user.userType === 'official' ? 'official' : 'citizen'}`}
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.userType === 'citizen' && (
                    <Link 
                      to="/report" 
                      className="text-white py-3 text-lg border-b border-emerald-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Report Issue
                    </Link>
                  )}
                  <Link 
                    to="/map" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Map View
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-white py-3 text-lg border-b border-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.userType === 'admin' && (
                    <Link 
                      to="/settings" 
                      className="text-white py-3 text-lg border-b border-emerald-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-white py-3 text-lg border-b border-emerald-500 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainLayout;
