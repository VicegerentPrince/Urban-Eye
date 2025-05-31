import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCity, FaMapMarkedAlt, FaMobileAlt, FaUsers, FaChartLine, FaShieldAlt } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-400">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full"
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
            className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full"
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
        </motion.div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Smart City Complaint Dashboard
              </h1>
              <p className="text-xl text-emerald-50 mb-12">
                Empowering citizens to report and track civic issues in real-time
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link 
                to="/register" 
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition duration-300 transform hover:scale-105 hover:rotate-1"
              >
                Get Started
              </Link>
              <Link 
                to="/about" 
                className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-800 transition duration-300 transform hover:scale-105 hover:-rotate-1"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                y: -10,
                rotateX: 10,
                rotateY: -10,
                scale: 1.02
              }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaMobileAlt className="w-8 h-8 text-emerald-600" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Real-time Reporting</h3>
              <p className="text-gray-600">Report civic issues instantly with detailed descriptions and photo uploads.</p>
            </motion.div>

            <motion.div 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                y: -10,
                rotateX: 10,
                rotateY: -10,
                scale: 1.02
              }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaMapMarkedAlt className="w-8 h-8 text-emerald-600" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Interactive Map</h3>
              <p className="text-gray-600">View and track reported issues on an interactive city map.</p>
            </motion.div>

            <motion.div 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ 
                y: -10,
                rotateX: 10,
                rotateY: -10,
                scale: 1.02
              }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaChartLine className="w-8 h-8 text-emerald-600" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Tracking</h3>
              <p className="text-gray-600">Monitor the status and progress of your reported issues.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Impact in Numbers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FaCity, number: '50+', label: 'Cities' },
              { icon: FaUsers, number: '10K+', label: 'Active Users' },
              { icon: FaShieldAlt, number: '95%', label: 'Resolution Rate' },
              { icon: FaMapMarkedAlt, number: '25K+', label: 'Issues Resolved' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 10,
                  rotateY: 10
                }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <motion.h3 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-emerald-600 to-teal-400 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
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
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{ filter: 'blur(45px)' }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              className="text-xl text-emerald-50 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join our community and help make your city better for everyone
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                to="/register" 
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition duration-300 transform hover:scale-105 inline-block"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;