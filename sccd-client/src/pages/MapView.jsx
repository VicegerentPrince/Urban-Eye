import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { issueService } from '../services/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to fly to a location when selected issue changes
function FlyToMarker({ selectedIssue, issueLocations }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedIssue && issueLocations[selectedIssue.id]) {
      map.flyTo(issueLocations[selectedIssue.id], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedIssue, map, issueLocations]);
  
  return null;
}

function MapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueLocations, setIssueLocations] = useState({});
  const mapRef = useRef();
  
  // Default center coordinates (can be set to a central location in your city)
  const defaultCenter = [24.8607, 67.0011]; // Example: Karachi coordinates

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await issueService.getIssues();
        
        // Create a mapping of issue IDs to their coordinates for the FlyToMarker component
        const locations = {};
        data.forEach(issue => {
          // Make sure we're using _id (from MongoDB) instead of id
          locations[issue._id] = issue.coordinates;
        });
        
        setIssues(data);
        setIssueLocations(locations);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, []);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

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
      case 'active': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Active</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Custom marker icon based on priority
  const getMarkerIcon = (priority) => {
    const priorityColors = {
      'low': '#10B981', // green
      'medium': '#F59E0B', // yellow
      'high': '#F97316', // orange
      'emergency': '#EF4444', // red
      'default': '#6B7280' // gray
    };
    
    const color = priorityColors[priority] || priorityColors.default;
    
    return new L.Icon({
      iconUrl: priority === 'emergency' ? '/marker-icon-red.png' : '/marker-icon-blue.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-8">Issue Map</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Map with Leaflet */}
        <div className="flex-1 rounded-lg h-[500px] overflow-hidden shadow-md">
          {loading ? (
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">Loading map data...</p>
            </div>
          ) : (
            <MapContainer 
              center={defaultCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {issues.map(issue => (
                <Marker 
                  key={issue._id} 
                  position={issue.coordinates}
                  eventHandlers={{
                    click: () => handleIssueClick(issue),
                  }}
                  icon={getMarkerIcon(issue.priority)}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold text-base">{issue.title}</h3>
                      <p className="mt-1">{issue.location}</p>
                      <div className="mt-2 flex items-center">
                        <span className="mr-2">Priority:</span>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue.priority)} mr-1`}></div>
                        <span className="capitalize">{issue.priority}</span>
                      </div>
                      <div className="mt-2">
                        <span className="mr-2">Status:</span>
                        {getStatusBadge(issue.status)}
                      </div>
                      <button 
                        className="mt-3 px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition duration-300"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <FlyToMarker selectedIssue={selectedIssue} issueLocations={issueLocations} />
            </MapContainer>
          )}
        </div>
        
        {/* Issue List */}
        <div className="md:w-96 bg-white rounded-lg shadow-md p-4 h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Reported Issues</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">Loading issues...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map(issue => (
                <div 
                  key={issue._id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-300 ${selectedIssue?._id === issue._id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}`}
                  onClick={() => handleIssueClick(issue)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{issue.title}</h3>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue.priority)}`} title={`Priority: ${issue.priority}`} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{issue.category}</span>
                    {getStatusBadge(issue.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Selected Issue Details */}
      {selectedIssue && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{selectedIssue.title}</h2>
            <div className="flex items-center">
              <span className="mr-2">Priority:</span>
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(selectedIssue.priority)}`} />
              <span className="ml-1 capitalize">{selectedIssue.priority}</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2"><strong>Location:</strong> {selectedIssue.location}</p>
          <div className="flex gap-4 mt-4">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full">{selectedIssue.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2">{getStatusBadge(selectedIssue.status)}</span>
            </div>
            <div>
              <span className="text-gray-600">Coordinates:</span>
              <span className="ml-2">{selectedIssue.coordinates[0]}, {selectedIssue.coordinates[1]}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Update Status
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
              onClick={() => setSelectedIssue(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;