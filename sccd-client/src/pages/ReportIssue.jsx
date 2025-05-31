import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaExclamationTriangle, FaCamera, FaFileUpload, FaTimes, FaCrosshairs, FaSpinner } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const locationIcon = new L.Icon({
  iconUrl: '/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'pulse-marker'
});

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    });
  }, [map, onLocationSelect]);

  const handleMapClick = (e) => {
    setPosition(e.latlng);
    onLocationSelect([e.latlng.lat, e.latlng.lng]);
  };

  useEffect(() => {
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">Selected Location</h3>
          <p className="text-sm text-gray-600 mt-1">Lat: {position.lat.toFixed(6)}</p>
          <p className="text-sm text-gray-600">Lng: {position.lng.toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

import { authService, issueService } from '../services/api';

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: null,
    category: 'infrastructure',
    priority: 'medium',
    images: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' && files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewImages(imageUrls);
      setFormData({
        ...formData,
        [name]: files
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleLocationSelect = (coords) => {
    setFormData({
      ...formData,
      location: coords
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.priority || !formData.location) {
      alert('Please fill in all required fields and select a location');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create issue data object with proper format for backend
      const issueData = new FormData();
      
      // Add text fields
      issueData.append('title', formData.title);
      issueData.append('description', formData.description);
      issueData.append('category', formData.category);
      issueData.append('priority', formData.priority);
      
      // Add coordinates as separate lat/lng fields
      if (formData.location) {
        issueData.append('latitude', formData.location[0]);
        issueData.append('longitude', formData.location[1]);
        // Add a formatted location string
        issueData.append('locationDescription', `${formData.location[0].toFixed(6)}, ${formData.location[1].toFixed(6)}`);
      }
      
      // Add images
      if (formData.images) {
        Array.from(formData.images).forEach((image, index) => {
          issueData.append(`images`, image);
        });
      }
      
      // Submit to backend
      const response = await issueService.createIssue(issueData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/citizen');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit issue');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert(error.message || 'Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviewImages);
    
    const dt = new DataTransfer();
    const input = document.querySelector('input[type="file"]');
    const { files } = input;
    
    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        dt.items.add(files[i]);
      }
    }
    
    input.files = dt.files;
    setFormData({
      ...formData,
      images: dt.files
    });
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          location: [latitude, longitude]
        });
        setShowMap(true);
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-400 py-16 px-4">
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="px-8 pt-8 pb-6">
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Report an Issue</h1>
              <p className="text-gray-600">Help us improve our community by reporting issues</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Brief title of the issue"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="water">Water</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="roads">Roads</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  >
                    <FaCrosshairs className="mr-2 text-emerald-600" />
                    <span>Use My Current Location</span>
                  </button>
                  
                  <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200">
                    <MapContainer 
                      center={[51.505, -0.09]} 
                      zoom={13} 
                      style={{ height: '100%', width: '100%' }}
                      className="z-0"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                  </div>
                  
                  {formData.location && (
                    <div className="text-sm text-gray-600">
                      Selected coordinates: {formData.location[0].toFixed(6)}, {formData.location[1].toFixed(6)}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Detailed description of the issue"
                  required
                ></textarea>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="flex justify-end space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition duration-200 flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                <p className="text-gray-600">Your issue has been reported successfully.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ReportIssue;