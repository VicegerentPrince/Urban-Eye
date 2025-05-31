import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCrosshairs, FaFilter } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: import('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: import('leaflet/dist/images/marker-icon.png'),
  shadowUrl: import('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons
const issueIcon = new L.Icon({
  iconUrl: '/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const locationIcon = new L.Icon({
  iconUrl: '/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'pulse-marker'
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">Your Location</h3>
          <p className="text-sm text-gray-600 mt-1">Lat: {position.lat.toFixed(6)}</p>
          <p className="text-sm text-gray-600">Lng: {position.lng.toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function MapView() {
  const [center, setCenter] = useState([51.505, -0.09]); // Default to London
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockIssues = [
      { 
        id: 1, 
        title: 'Broken Street Light', 
        location: [51.505, -0.09], 
        category: 'infrastructure', 
        status: 'pending',
        description: 'Street light not working, causing safety concerns.',
        reportedBy: 'John Doe',
        date: '2023-10-15'
      },
      { 
        id: 2, 
        title: 'Water Leakage', 
        location: [51.51, -0.1], 
        category: 'water', 
        status: 'in-progress',
        description: 'Major water leak from broken pipe.',
        reportedBy: 'Jane Smith',
        date: '2023-10-10'
      },
      { 
        id: 3, 
        title: 'Garbage Collection', 
        location: [51.49, -0.08], 
        category: 'sanitation', 
        status: 'resolved',
        description: 'Garbage not collected for two weeks.',
        reportedBy: 'Mike Johnson',
        date: '2023-09-28'
      },
    ];

    setTimeout(() => {
      setIssues(mockIssues);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-br from-emerald-600 to-teal-400 text-white py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Issue Map</h1>
              <p className="text-emerald-50">View and track reported issues across the city</p>
            </div>
            <motion.button
              className="bg-white text-emerald-600 px-6 py-2 rounded-full hover:bg-emerald-50 transition duration-300 flex items-center shadow-lg"
              onClick={handleLocateMe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCrosshairs className="mr-2" />
              Locate Me
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Issues</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="container mx-auto px-4 pb-8">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-[600px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                    scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  }}
                  className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full"
                />
                <p className="ml-3 text-gray-600">Loading map...</p>
              </div>
            ) : (
              <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                {issues
                  .filter(issue => filter === 'all' || issue.status === filter)
                  .map(issue => (
                    <Marker 
                      key={issue.id} 
                      position={issue.location}
                      icon={issueIcon}
                    >
                      <Popup>
                        <div className="p-3">
                          <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(issue.status)} mr-2`}></div>
                              {getStatusBadge(issue.status)}
                            </div>
                            <span className="text-gray-500">{issue.date}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Reported by: {issue.reportedBy}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                }
              </MapContainer>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MapView;