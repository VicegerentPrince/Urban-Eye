import { motion } from 'framer-motion';
import { FaCity, FaUsers, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About Urban-Eye
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Empowering citizens and officials to create smarter, safer, and more efficient cities through collaborative issue reporting and management.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FaCity className="text-2xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart City Integration</h3>
            <p className="text-gray-600">
              Leveraging technology to transform urban management and enhance the quality of life for citizens through efficient issue reporting and resolution.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
            <p className="text-gray-600">
              Fostering active citizen participation in urban development and maintenance through an intuitive reporting system.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FaClipboardCheck className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Efficient Management</h3>
            <p className="text-gray-600">
              Streamlining the process of issue identification, assignment, and resolution through our comprehensive management system.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FaChartLine className="text-2xl text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">
              Utilizing advanced analytics to provide valuable insights for better urban planning and resource allocation.
            </p>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl text-white p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto">
            To create a seamless bridge between citizens and city administrators, enabling efficient communication and swift resolution of urban issues while promoting transparency and accountability in civic management.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default About; 