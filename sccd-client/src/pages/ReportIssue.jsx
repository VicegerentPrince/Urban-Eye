import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaExclamationTriangle, FaCamera, FaFileUpload, FaTimes, FaCrosshairs, FaSpinner, FaVideo, FaStop, FaCheckCircle } from 'react-icons/fa';
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

// New Camera component for taking photos/videos
const CameraCapture = ({ mode, onCapture, onClose }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState(null);
  
  useEffect(() => {
    // Initialize camera
    async function setupCamera() {
      try {
        const constraints = {
          video: true,
          audio: mode === 'video'
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setError('');
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please ensure you have granted permission.');
      }
    }
    
    setupCamera();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);
  
  const capturePhoto = () => {
    if (videoRef.current) {
      // Start countdown
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Take the photo after countdown
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(dataUrl, 'photo');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const startRecording = () => {
    if (videoRef.current && stream) {
      setRecordedChunks([]);
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        });
        onCapture(blob, 'video');
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
      
      // Start recording timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          clearInterval(timerInterval);
          stopRecording();
        }
      }, 30000);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingTime(0);
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-lg">
      <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {mode === 'photo' ? 'Take a Photo' : 'Record Video'}
        </h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="relative">
        {error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
            
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-white bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
                  {countdown}
                </div>
              </div>
            )}
            
            {recording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse mr-2"></div>
                {recordingTime}s
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="p-4 flex justify-center">
        {mode === 'photo' ? (
          <button
            onClick={capturePhoto}
            disabled={!!countdown}
            className={`px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors ${countdown ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Capture
          </button>
        ) : (
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-6 py-2 ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-md transition-colors flex items-center`}
          >
            {recording ? (
              <>
                <FaStop className="mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <FaVideo className="mr-2" /> Start Recording
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

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
  // New state for camera functionality
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState('photo'); // 'photo' or 'video'
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
      setPreviewImages([...previewImages, ...imageUrls]);
      
      // Append to existing files if any
      const existingFiles = formData.images ? Array.from(formData.images) : [];
      const updatedFiles = new DataTransfer();
      
      // Add existing files
      existingFiles.forEach(file => {
        updatedFiles.items.add(file);
      });
      
      // Add new files
      Array.from(files).forEach(file => {
        updatedFiles.items.add(file);
      });
      
      setFormData({
        ...formData,
        images: updatedFiles.files
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle camera capture
  // Add FaVideo to the imports
  
  const handleCameraCapture = (mediaData, mediaType) => {
    setShowCamera(false);
    
    if (mediaType === 'photo') {
      // Handle photo capture
      const newImages = [...formData.images];
      newImages.push(mediaData);
      setFormData({
        ...formData,
        images: newImages
      });
    } else if (mediaType === 'video') {
      // Handle video capture
      const newVideos = [...formData.videos || []];
      newVideos.push(mediaData);
      setFormData({
        ...formData,
        videos: newVideos
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
      
      // Add coordinates and location properly
      if (formData.location) {
        // Add latitude and longitude as separate fields
        issueData.append('latitude', formData.location[0]);
        issueData.append('longitude', formData.location[1]);
        
        // Add a formatted location string
        issueData.append('locationDescription', `${formData.location[0].toFixed(6)}, ${formData.location[1].toFixed(6)}`);
      }
      
      // Add images
      if (formData.images) {
        Array.from(formData.images).forEach((image) => {
          issueData.append('images', image);
        });
      }
      
      // Submit to backend
      const response = await issueService.createIssue(issueData);
      
      if (response && response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/citizen');
        }, 2000);
      } else {
        throw new Error(response?.message || 'Failed to submit issue');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Images & Videos</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCameraMode('photo');
                          setShowCamera(true);
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center"
                      >
                        <FaCamera className="mr-2" />
                        Take Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCameraMode('video');
                          setShowCamera(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                      >
                        <FaVideo className="mr-2" />
                        Record Video
                      </button>
                    </div>
                    
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB</p>
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
        
        {/* Render the camera component when showCamera is true */}
        <AnimatePresence>
          {showCamera && (
            <CameraCapture 
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
              mode={cameraMode}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ReportIssue;

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const formDataToSend = new FormData();
    
    // Add text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('priority', formData.priority);
    
    // Add location data
    if (selectedLocation) {
      formDataToSend.append('latitude', selectedLocation.lat);
      formDataToSend.append('longitude', selectedLocation.lng);
      formDataToSend.append('locationDescription', formData.locationDescription || '');
    }
    
    // Add images
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        const image = formData.images[i];
        // If it's a File object, add it directly
        if (image instanceof File) {
          formDataToSend.append('images', image);
        } 
        // If it's a data URL from camera capture
        else if (typeof image === 'string' && image.startsWith('data:image')) {
          // Convert data URL to Blob
          const blob = await fetch(image).then(r => r.blob());
          const file = new File([blob], `camera-image-${i}.jpg`, { type: 'image/jpeg' });
          formDataToSend.append('images', file);
        }
      }
    }
    
    // Add videos
    if (formData.videos && formData.videos.length > 0) {
      for (let i = 0; i < formData.videos.length; i++) {
        const video = formData.videos[i];
        // If it's a File object, add it directly
        if (video instanceof File) {
          formDataToSend.append('videos', video);
        } 
        // If it's a Blob from camera capture
        else if (video instanceof Blob) {
          const file = new File([video], `camera-video-${i}.webm`, { type: 'video/webm' });
          formDataToSend.append('videos', file);
        }
        // If it's a data URL
        else if (typeof video === 'string' && video.startsWith('data:video')) {
          const blob = await fetch(video).then(r => r.blob());
          const file = new File([blob], `camera-video-${i}.webm`, { type: 'video/webm' });
          formDataToSend.append('videos', file);
        }
      }
    }
    
    const response = await issueService.createIssue(formDataToSend);
    
    if (response.success) {
      setShowSuccessModal(true);
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        category: 'infrastructure',
        priority: 'medium',
        locationDescription: '',
        images: [],
        videos: []
      });
      setSelectedLocation(null);
    }
  } catch (error) {
    console.error('Error submitting issue:', error);
    setSubmitError('Failed to submit issue. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};